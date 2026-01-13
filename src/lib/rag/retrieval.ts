/**
 * RAG Retrieval Pipeline
 * Implements ArqAI's Observability-Driven Adaptive RAG™ architecture
 *
 * Pipeline: User Query → Query Analysis → Hybrid Retrieval → Metadata Filtering → Re-ranking → Confidence Scoring
 */

import { v4 as uuidv4 } from 'uuid'
import { generateEmbedding, cosineSimilarity } from './embeddings'
import { vectorSearch, keywordSearch, hybridSearch } from './weaviate-client'
import type {
  QueryAnalysis,
  QueryIntent,
  FunctionContext,
  RetrievalResult,
  ScoredChunk,
  RetrievalConfig,
  RetrievalEvidence,
  KnowledgeChunk,
  ConfidenceLevel,
} from './types'
import { DEFAULT_RETRIEVAL_CONFIG, CONFIDENCE_THRESHOLDS } from './types'

/**
 * Main retrieval function - implements the full RAG pipeline
 */
export async function retrieve(
  query: string,
  config: Partial<RetrievalConfig> = {},
  context?: {
    functionType?: FunctionContext
    userRole?: string
    previousQueries?: string[]
  }
): Promise<RetrievalResult> {
  const startTime = Date.now()
  const finalConfig = { ...DEFAULT_RETRIEVAL_CONFIG, ...config }

  // Step 1: Query Analysis
  const queryAnalysis = analyzeQuery(query, context)
  console.log('[RAG] Query analysis:', queryAnalysis.intent, queryAnalysis.keywords)

  // Step 2: Generate query embedding
  const queryEmbedding = await generateEmbedding(queryAnalysis.expanded_query)

  // Step 3: Hybrid Retrieval
  const rawResults = await performHybridRetrieval(
    queryAnalysis,
    queryEmbedding,
    finalConfig
  )
  console.log(`[RAG] Retrieved ${rawResults.length} candidates`)

  // Step 4: Metadata Filtering
  const filteredResults = applyMetadataFiltering(rawResults, queryAnalysis, finalConfig)
  console.log(`[RAG] After filtering: ${filteredResults.length} chunks`)

  // Step 5: Re-ranking
  const rerankedResults = await rerank(filteredResults, queryAnalysis, queryEmbedding)

  // Step 6: Calculate confidence score
  const confidence = calculateConfidence(rerankedResults, queryAnalysis)

  // Step 7: Select top-K
  const finalChunks = rerankedResults.slice(0, finalConfig.final_top_k)

  const processingTime = Date.now() - startTime
  console.log(`[RAG] Retrieval complete in ${processingTime}ms, confidence: ${confidence.toFixed(2)}`)

  return {
    chunks: finalChunks,
    confidence,
    query_analysis: queryAnalysis,
    retrieval_method: 'hybrid',
    total_candidates: rawResults.length,
    processing_time_ms: processingTime,
  }
}

/**
 * Step 1: Query Analysis
 * Extracts intent, keywords, and context from the user query
 */
export function analyzeQuery(
  query: string,
  context?: {
    functionType?: FunctionContext
    userRole?: string
    previousQueries?: string[]
  }
): QueryAnalysis {
  const lowerQuery = query.toLowerCase()

  // Extract keywords (removing stop words)
  const stopWords = new Set([
    'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'can', 'to', 'of', 'in', 'for', 'on', 'with',
    'at', 'by', 'from', 'as', 'into', 'about', 'what', 'how', 'why', 'when',
    'where', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'i',
    'me', 'my', 'we', 'our', 'you', 'your', 'it', 'its', 'they', 'them',
  ])

  const words = lowerQuery
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w))

  // Detect intent
  const intent = detectIntent(lowerQuery)

  // Detect urgency signals
  const urgencySignals = detectUrgencySignals(lowerQuery)

  // Detect role mentions
  const detectedRole = detectRoleMention(lowerQuery) || context?.userRole || null

  // Expand query with synonyms and context
  const expandedQuery = expandQuery(query, intent, context?.functionType)

  return {
    original_query: query,
    keywords: words,
    intent,
    function_context: context?.functionType || detectFunctionContext(lowerQuery),
    urgency_signals: urgencySignals,
    detected_role: detectedRole,
    expanded_query: expandedQuery,
  }
}

/**
 * Detect query intent
 */
function detectIntent(query: string): QueryIntent {
  const intentPatterns: Array<{ pattern: RegExp; intent: QueryIntent }> = [
    { pattern: /price|pricing|cost|how much|budget|roi|investment/i, intent: 'pricing_inquiry' },
    { pattern: /security|secure|soc|hipaa|gdpr|compliance|audit|encrypt/i, intent: 'security' },
    { pattern: /complian|regulat|policy|govern|fedramp|nist/i, intent: 'compliance' },
    { pattern: /architecture|technical|how.*work|diagram|infrastructure|api/i, intent: 'technical_deep_dive' },
    { pattern: /compare|vs|versus|competitor|alternative|differ/i, intent: 'comparison' },
    { pattern: /use case|example|customer|deploy|implement/i, intent: 'use_case' },
    { pattern: /timeline|how long|when|schedule|deadline/i, intent: 'timeline' },
    { pattern: /contact|demo|talk|call|meeting|schedule|speak/i, intent: 'contact' },
    { pattern: /what is|tell me about|explain|overview|introduction/i, intent: 'product_question' },
  ]

  for (const { pattern, intent } of intentPatterns) {
    if (pattern.test(query)) {
      return intent
    }
  }

  return 'general'
}

/**
 * Detect urgency signals
 */
function detectUrgencySignals(query: string): string[] {
  const signals: string[] = []
  const urgencyPatterns = [
    { pattern: /urgent|asap|immediately|today|this week/i, signal: 'time_pressure' },
    { pattern: /evaluation|evaluating|considering|comparing/i, signal: 'active_evaluation' },
    { pattern: /budget approved|ready to|want to start/i, signal: 'ready_to_buy' },
    { pattern: /problem|issue|challenge|struggling/i, signal: 'pain_point' },
  ]

  for (const { pattern, signal } of urgencyPatterns) {
    if (pattern.test(query)) {
      signals.push(signal)
    }
  }

  return signals
}

/**
 * Detect role mention in query
 */
function detectRoleMention(query: string): string | null {
  const rolePatterns: Array<{ pattern: RegExp; role: string }> = [
    { pattern: /\bceo\b|chief executive/i, role: 'CEO' },
    { pattern: /\bcto\b|chief technology/i, role: 'CTO' },
    { pattern: /\bciso\b|chief.*security/i, role: 'CISO' },
    { pattern: /\bcfo\b|chief financial/i, role: 'CFO' },
    { pattern: /\bcio\b|chief information/i, role: 'CIO' },
    { pattern: /\bcmo\b|chief marketing/i, role: 'CMO' },
    { pattern: /vp|vice president/i, role: 'VP' },
    { pattern: /director/i, role: 'Director' },
    { pattern: /engineer|developer/i, role: 'Engineer' },
  ]

  for (const { pattern, role } of rolePatterns) {
    if (pattern.test(query)) {
      return role
    }
  }

  return null
}

/**
 * Detect function context from query
 */
function detectFunctionContext(query: string): FunctionContext | null {
  const functionPatterns: Array<{ pattern: RegExp; context: FunctionContext }> = [
    { pattern: /it\s*(ops|infrastructure|operations)|incident|deployment|servicenow/i, context: 'it-infrastructure' },
    { pattern: /revenue|sales|crm|salesforce|pipeline/i, context: 'revenue-operations' },
    { pattern: /customer\s*(success|support)|ticket|zendesk|onboarding/i, context: 'customer-success' },
    { pattern: /marketing|demand|campaign|lead\s*gen|hubspot/i, context: 'demand-generation' },
  ]

  for (const { pattern, context } of functionPatterns) {
    if (pattern.test(query)) {
      return context
    }
  }

  return null
}

/**
 * Expand query with synonyms and context
 */
function expandQuery(
  query: string,
  intent: QueryIntent,
  functionContext?: FunctionContext
): string {
  const expansions: string[] = [query]

  // Add intent-specific expansions
  const intentExpansions: Record<QueryIntent, string[]> = {
    pricing_inquiry: ['pricing', 'cost', 'ROI', 'investment', 'value'],
    security: ['security', 'compliance', 'SOC 2', 'encryption', 'audit'],
    compliance: ['compliance', 'regulation', 'governance', 'policy'],
    technical_deep_dive: ['architecture', 'technical', 'implementation', 'API'],
    comparison: ['compare', 'versus', 'alternative', 'competitor'],
    use_case: ['use case', 'example', 'customer', 'deployment'],
    timeline: ['timeline', 'implementation', '30 days', 'deployment'],
    contact: ['demo', 'contact', 'meeting', 'schedule'],
    product_question: ['ArqAI', 'platform', 'product', 'solution'],
    general: [],
  }

  expansions.push(...(intentExpansions[intent] || []))

  // Add function-specific context
  if (functionContext) {
    const functionExpansions: Record<FunctionContext, string[]> = {
      'it-infrastructure': ['IT', 'infrastructure', 'incident', 'deployment'],
      'revenue-operations': ['revenue', 'sales', 'CRM', 'pipeline'],
      'customer-success': ['customer', 'support', 'ticket', 'success'],
      'demand-generation': ['marketing', 'campaign', 'lead', 'demand'],
    }
    expansions.push(...functionExpansions[functionContext])
  }

  return Array.from(new Set(expansions)).join(' ')
}

/**
 * Step 3: Perform hybrid retrieval combining vector and keyword search
 */
async function performHybridRetrieval(
  queryAnalysis: QueryAnalysis,
  queryEmbedding: number[],
  config: RetrievalConfig
): Promise<ScoredChunk[]> {
  // Use Weaviate's native hybrid search
  const results = await hybridSearch(
    queryAnalysis.original_query,
    queryEmbedding,
    config.semantic_top_k + config.keyword_top_k,
    0.6 // Alpha: 60% vector, 40% BM25
  )

  return results.map((r) => ({
    chunk: {
      id: r.id,
      text: r.text,
      metadata: r.metadata as unknown as KnowledgeChunk['metadata'],
    },
    semantic_score: r.score,
    keyword_score: r.score, // Hybrid score combines both
    combined_score: r.score,
  }))
}

/**
 * Step 4: Apply metadata filtering
 */
function applyMetadataFiltering(
  results: ScoredChunk[],
  queryAnalysis: QueryAnalysis,
  config: RetrievalConfig
): ScoredChunk[] {
  return results
    .map((result) => {
      let score = result.combined_score

      // Boost based on confidence level
      const confidenceBoosts: Record<ConfidenceLevel, number> = {
        Critical: 1.3,
        High: 1.1,
        Medium: 1.0,
        Low: 0.8,
      }
      const confidence = result.chunk.metadata.confidence as ConfidenceLevel
      score *= confidenceBoosts[confidence] || 1.0

      // Boost matching tags
      const chunkTags = new Set(result.chunk.metadata.tags || [])
      const matchingTags = queryAnalysis.keywords.filter((k) =>
        chunkTags.has(k.toLowerCase())
      )
      score *= 1 + matchingTags.length * 0.1

      // Boost recent content
      const lastUpdated = new Date(result.chunk.metadata.last_updated)
      const ageInDays = (Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24)
      const recencyBoost = Math.max(0.8, 1 - ageInDays / 365) // Decay over a year
      score *= recencyBoost

      return {
        ...result,
        combined_score: score,
      }
    })
    .filter((r) => r.combined_score >= config.min_confidence)
    .sort((a, b) => b.combined_score - a.combined_score)
}

/**
 * Step 5: Re-rank results
 * Uses a simple cross-encoder simulation based on keyword overlap
 */
async function rerank(
  results: ScoredChunk[],
  queryAnalysis: QueryAnalysis,
  queryEmbedding: number[]
): Promise<ScoredChunk[]> {
  // Calculate rerank scores based on multiple factors
  const reranked = results.map((result) => {
    // Keyword overlap score
    const chunkWords = new Set(
      result.chunk.text
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
    )
    const keywordOverlap = queryAnalysis.keywords.filter((k) =>
      chunkWords.has(k)
    ).length / Math.max(queryAnalysis.keywords.length, 1)

    // Semantic coherence (already have from hybrid search)
    const semanticScore = result.semantic_score

    // Diversity penalty (reduce score for very similar chunks)
    // This is simplified - in production you'd compare against already-selected chunks

    // Combined rerank score
    const rerankScore = semanticScore * 0.6 + keywordOverlap * 0.4

    return {
      ...result,
      rerank_score: rerankScore,
      combined_score: (result.combined_score + rerankScore) / 2,
    }
  })

  return reranked.sort((a, b) => b.combined_score - a.combined_score)
}

/**
 * Step 6: Calculate overall confidence score
 */
function calculateConfidence(
  results: ScoredChunk[],
  queryAnalysis: QueryAnalysis
): number {
  if (results.length === 0) return 0

  // Weighted average of top results
  const weights = [0.4, 0.25, 0.15, 0.1, 0.1] // Top 5 weights
  let weightedSum = 0
  let totalWeight = 0

  for (let i = 0; i < Math.min(results.length, weights.length); i++) {
    weightedSum += results[i].combined_score * weights[i]
    totalWeight += weights[i]
  }

  const baseConfidence = weightedSum / totalWeight

  // Adjust based on result diversity
  const categories = new Set(results.slice(0, 5).map((r) => r.chunk.metadata.category))
  const diversityBonus = Math.min(0.1, categories.size * 0.02)

  // Adjust based on metadata confidence levels
  const criticalCount = results.slice(0, 5).filter(
    (r) => r.chunk.metadata.confidence === 'Critical'
  ).length
  const confidenceBonus = criticalCount * 0.05

  return Math.min(1.0, baseConfidence + diversityBonus + confidenceBonus)
}

/**
 * Generate evidence packet for audit trail
 */
export function generateRetrievalEvidence(
  result: RetrievalResult
): RetrievalEvidence {
  return {
    evidence_id: uuidv4(),
    timestamp: new Date().toISOString(),
    query: result.query_analysis.original_query,
    query_analysis: result.query_analysis,
    retrieved_chunks: result.chunks.map((c) => ({
      chunk_id: c.chunk.id,
      score: c.combined_score,
      source: c.chunk.metadata.source,
    })),
    confidence_score: result.confidence,
    retrieval_method: result.retrieval_method,
    adaptation_events: [], // Would be populated by monitoring system
  }
}

/**
 * Get retrieval decision based on confidence
 */
export function getRetrievalDecision(confidence: number): {
  action: 'answer_directly' | 'answer_with_hedging' | 'escalate'
  message: string
} {
  if (confidence >= CONFIDENCE_THRESHOLDS.HIGH) {
    return {
      action: 'answer_directly',
      message: 'High confidence - answer directly from retrieved context',
    }
  }

  if (confidence >= CONFIDENCE_THRESHOLDS.MEDIUM) {
    return {
      action: 'answer_with_hedging',
      message: 'Medium confidence - answer with appropriate hedging',
    }
  }

  return {
    action: 'escalate',
    message: 'Low confidence - consider escalating to human',
  }
}
