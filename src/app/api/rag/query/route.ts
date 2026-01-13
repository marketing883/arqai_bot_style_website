/**
 * RAG Query API Endpoint
 * Handles knowledge retrieval queries for the ArqAI agent
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  retrieve,
  generateRetrievalEvidence,
  getRetrievalDecision,
} from '@/lib/rag'
import type { FunctionContext } from '@/lib/rag'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface QueryRequest {
  query: string
  functionType?: FunctionContext
  userRole?: string
  previousQueries?: string[]
  config?: {
    semantic_top_k?: number
    keyword_top_k?: number
    final_top_k?: number
    min_confidence?: number
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: QueryRequest = await request.json()

    // Validate required fields
    if (!body.query || typeof body.query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required and must be a string' },
        { status: 400 }
      )
    }

    // Check if RAG is configured
    if (!process.env.WEAVIATE_URL || !process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error: 'RAG system not configured',
          details: 'Missing WEAVIATE_URL or OPENAI_API_KEY environment variables',
        },
        { status: 503 }
      )
    }

    // Perform retrieval
    const result = await retrieve(
      body.query,
      body.config || {},
      {
        functionType: body.functionType,
        userRole: body.userRole,
        previousQueries: body.previousQueries,
      }
    )

    // Generate evidence for audit
    const evidence = generateRetrievalEvidence(result)

    // Get retrieval decision
    const decision = getRetrievalDecision(result.confidence)

    // Format response
    const response = {
      success: true,
      query: body.query,
      confidence: result.confidence,
      decision: decision.action,
      decision_message: decision.message,
      chunks: result.chunks.map((c) => ({
        text: c.chunk.text,
        score: c.combined_score,
        category: c.chunk.metadata.category,
        source: c.chunk.metadata.source,
        section_id: c.chunk.metadata.section_id,
        confidence_level: c.chunk.metadata.confidence,
      })),
      context: result.chunks.map((c) => c.chunk.text).join('\n\n---\n\n'),
      query_analysis: {
        intent: result.query_analysis.intent,
        keywords: result.query_analysis.keywords,
        function_context: result.query_analysis.function_context,
        detected_role: result.query_analysis.detected_role,
        urgency_signals: result.query_analysis.urgency_signals,
      },
      metrics: {
        total_candidates: result.total_candidates,
        processing_time_ms: result.processing_time_ms,
        retrieval_method: result.retrieval_method,
      },
      evidence_id: evidence.evidence_id,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('RAG query error:', error)

    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process RAG query',
        details: errorMessage,
      },
      { status: 500 }
    )
  }
}

/**
 * Health check for RAG system
 */
export async function GET() {
  const status = {
    configured: false,
    weaviate_url: !!process.env.WEAVIATE_URL,
    openai_key: !!process.env.OPENAI_API_KEY,
    message: '',
  }

  if (!process.env.WEAVIATE_URL) {
    status.message = 'WEAVIATE_URL not configured'
    return NextResponse.json(status, { status: 503 })
  }

  if (!process.env.OPENAI_API_KEY) {
    status.message = 'OPENAI_API_KEY not configured'
    return NextResponse.json(status, { status: 503 })
  }

  try {
    const { checkHealth, getObjectCount } = await import('@/lib/rag')
    const health = await checkHealth()
    const count = await getObjectCount()

    return NextResponse.json({
      ...status,
      configured: true,
      weaviate_healthy: health.healthy,
      weaviate_message: health.message,
      knowledge_chunks: count,
      message: health.healthy
        ? `RAG system ready with ${count} knowledge chunks`
        : health.message,
    })
  } catch (error) {
    return NextResponse.json(
      {
        ...status,
        message: error instanceof Error ? error.message : 'Connection failed',
      },
      { status: 503 }
    )
  }
}
