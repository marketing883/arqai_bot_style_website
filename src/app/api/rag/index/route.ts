/**
 * Knowledge Base Indexing API
 * Handles indexing of the ArqAI knowledge base into Weaviate
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  initializeSchema,
  resetSchema,
  batchAddObjects,
  getObjectCount,
  parseKnowledgeBase,
  getChunkingStats,
  generateEmbeddings,
} from '@/lib/rag'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 300 // 5 minutes for large KB

interface IndexRequest {
  content: string // Markdown content of the knowledge base
  reset?: boolean // Whether to reset the index first
  version?: string // KB version
}

export async function POST(request: NextRequest) {
  try {
    const body: IndexRequest = await request.json()

    // Validate
    if (!body.content || typeof body.content !== 'string') {
      return NextResponse.json(
        { error: 'Content is required and must be a string' },
        { status: 400 }
      )
    }

    // Check configuration
    if (!process.env.WEAVIATE_URL || !process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error: 'RAG system not configured',
          details: 'Missing WEAVIATE_URL or OPENAI_API_KEY',
        },
        { status: 503 }
      )
    }

    console.log('[Indexer] Starting KB indexing...')
    const startTime = Date.now()

    // Reset schema if requested
    if (body.reset) {
      console.log('[Indexer] Resetting schema...')
      await resetSchema()
    } else {
      await initializeSchema()
    }

    // Parse the knowledge base into chunks
    console.log('[Indexer] Parsing knowledge base...')
    const chunks = parseKnowledgeBase(body.content)
    const stats = getChunkingStats(chunks)
    console.log(`[Indexer] Created ${stats.totalChunks} chunks`)
    console.log('[Indexer] Category distribution:', stats.categoryDistribution)

    // Generate embeddings for all chunks
    console.log('[Indexer] Generating embeddings...')
    const texts = chunks.map((c) => c.text)
    const embeddings = await generateEmbeddings(texts)
    console.log(`[Indexer] Generated ${embeddings.length} embeddings`)

    // Prepare objects for batch insert
    const objects = chunks.map((chunk, i) => ({
      id: chunk.id,
      text: chunk.text,
      vector: embeddings[i],
      metadata: {
        category: chunk.metadata.category,
        tags: chunk.metadata.tags,
        confidence: chunk.metadata.confidence,
        source: chunk.metadata.source,
        section_id: chunk.metadata.section_id,
        update_frequency: chunk.metadata.update_frequency,
        last_updated: chunk.metadata.last_updated,
        escalation_trigger: chunk.metadata.escalation_trigger,
        version: body.version || chunk.metadata.version,
      },
    }))

    // Batch insert into Weaviate
    console.log('[Indexer] Inserting into Weaviate...')
    const batchSize = 50
    let totalSuccess = 0
    let totalFailed = 0

    for (let i = 0; i < objects.length; i += batchSize) {
      const batch = objects.slice(i, i + batchSize)
      const result = await batchAddObjects(batch)
      totalSuccess += result.success
      totalFailed += result.failed
      console.log(`[Indexer] Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(objects.length / batchSize)}`)
    }

    const duration = Date.now() - startTime
    const finalCount = await getObjectCount()

    console.log(`[Indexer] Indexing complete in ${duration}ms`)

    return NextResponse.json({
      success: true,
      message: `Indexed ${totalSuccess} chunks successfully`,
      stats: {
        total_chunks: stats.totalChunks,
        indexed: totalSuccess,
        failed: totalFailed,
        final_count: finalCount,
        avg_chunk_size: stats.avgChunkSize,
        duration_ms: duration,
      },
      category_distribution: stats.categoryDistribution,
      confidence_distribution: stats.confidenceDistribution,
    })
  } catch (error) {
    console.error('[Indexer] Error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Indexing failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * Get current index status
 */
export async function GET() {
  try {
    if (!process.env.WEAVIATE_URL) {
      return NextResponse.json(
        { error: 'WEAVIATE_URL not configured' },
        { status: 503 }
      )
    }

    const count = await getObjectCount()

    return NextResponse.json({
      indexed_chunks: count,
      status: count > 0 ? 'indexed' : 'empty',
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to get index status',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
