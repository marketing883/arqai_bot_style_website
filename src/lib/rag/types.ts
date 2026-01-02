/**
 * ArqAI RAG System Types
 * Implements Observability-Driven Adaptive RAG™ architecture
 */

// Knowledge chunk with metadata for vector storage
export interface KnowledgeChunk {
  id: string
  text: string
  embedding?: number[]
  metadata: ChunkMetadata
}

// Metadata schema matching Section 26.1 of the build checklist
export interface ChunkMetadata {
  category: KnowledgeCategory
  tags: string[]
  confidence: ConfidenceLevel
  source: string
  section_id: string
  update_frequency: UpdateFrequency
  last_updated: string
  escalation_trigger: boolean
  version: string
}

// Knowledge categories from the KB structure
export type KnowledgeCategory =
  | 'Product Core'
  | 'Patent Tech'
  | 'Vertical'
  | 'Compliance'
  | 'Security'
  | 'Company'
  | 'Competitive'
  | 'Use Cases'
  | 'Integration'
  | 'Pricing'
  | 'Roadmap'

// Confidence levels for retrieval decisions
export type ConfidenceLevel = 'Critical' | 'High' | 'Medium' | 'Low'

// Update frequency for drift detection
export type UpdateFrequency = 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Stable'

// Query analysis result
export interface QueryAnalysis {
  original_query: string
  keywords: string[]
  intent: QueryIntent
  function_context: FunctionContext | null
  urgency_signals: string[]
  detected_role: string | null
  expanded_query: string
}

export type QueryIntent =
  | 'product_question'
  | 'pricing_inquiry'
  | 'technical_deep_dive'
  | 'comparison'
  | 'use_case'
  | 'compliance'
  | 'security'
  | 'timeline'
  | 'contact'
  | 'general'

export type FunctionContext =
  | 'it-infrastructure'
  | 'revenue-operations'
  | 'customer-success'
  | 'demand-generation'

// Retrieval result with scoring
export interface RetrievalResult {
  chunks: ScoredChunk[]
  confidence: number
  query_analysis: QueryAnalysis
  retrieval_method: 'semantic' | 'keyword' | 'hybrid'
  total_candidates: number
  processing_time_ms: number
}

export interface ScoredChunk {
  chunk: KnowledgeChunk
  semantic_score: number
  keyword_score: number
  combined_score: number
  rerank_score?: number
}

// Confidence scoring thresholds
export const CONFIDENCE_THRESHOLDS = {
  HIGH: 0.80,      // Answer directly
  MEDIUM: 0.50,    // Answer with hedging
  LOW: 0.30,       // Consider escalation
  ESCALATE: 0.30,  // Escalate to human
} as const

// Retrieval configuration
export interface RetrievalConfig {
  semantic_top_k: number
  keyword_top_k: number
  final_top_k: number
  semantic_weight: number
  keyword_weight: number
  metadata_weight: number
  recency_weight: number
  min_confidence: number
  enable_reranking: boolean
}

export const DEFAULT_RETRIEVAL_CONFIG: RetrievalConfig = {
  semantic_top_k: 10,
  keyword_top_k: 5,
  final_top_k: 5,
  semantic_weight: 0.40,
  keyword_weight: 0.20,
  metadata_weight: 0.30,
  recency_weight: 0.10,
  min_confidence: 0.30,
  enable_reranking: true,
}

// Adaptive RAG monitoring signals
export interface RAGMetrics {
  hit_rate: number           // % queries with >0.7 similarity match
  avg_confidence: number     // Average confidence score
  failed_queries: number     // Queries with no good matches
  query_latency_ms: number   // Average query time
  escalation_rate: number    // % conversations → human
}

// Evidence packet for audit trail
export interface RetrievalEvidence {
  evidence_id: string
  timestamp: string
  query: string
  query_analysis: QueryAnalysis
  retrieved_chunks: {
    chunk_id: string
    score: number
    source: string
  }[]
  confidence_score: number
  retrieval_method: string
  adaptation_events: AdaptationEvent[]
}

export interface AdaptationEvent {
  type: 'reweight' | 'reindex' | 'query_expansion'
  trigger: string
  details: Record<string, unknown>
  timestamp: string
}

// Weaviate schema configuration
export const WEAVIATE_CLASS_NAME = 'ArqAIKnowledgeChunk'

export const WEAVIATE_SCHEMA = {
  class: WEAVIATE_CLASS_NAME,
  description: 'ArqAI knowledge base chunks for RAG retrieval',
  vectorizer: 'none', // We'll use OpenAI embeddings externally
  properties: [
    {
      name: 'text',
      dataType: ['text'],
      description: 'The chunk text content',
    },
    {
      name: 'category',
      dataType: ['text'],
      description: 'Knowledge category (Product Core, Patent Tech, etc.)',
    },
    {
      name: 'tags',
      dataType: ['text[]'],
      description: 'Tags for filtering and matching',
    },
    {
      name: 'confidence',
      dataType: ['text'],
      description: 'Confidence level (Critical, High, Medium, Low)',
    },
    {
      name: 'source',
      dataType: ['text'],
      description: 'Source document or section',
    },
    {
      name: 'section_id',
      dataType: ['text'],
      description: 'Section identifier (e.g., 1.1, 2.3)',
    },
    {
      name: 'update_frequency',
      dataType: ['text'],
      description: 'How often this content is updated',
    },
    {
      name: 'last_updated',
      dataType: ['date'],
      description: 'Last update timestamp',
    },
    {
      name: 'escalation_trigger',
      dataType: ['boolean'],
      description: 'Whether this content suggests human handoff',
    },
    {
      name: 'version',
      dataType: ['text'],
      description: 'KB version number',
    },
  ],
}
