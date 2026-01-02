/**
 * ArqAI RAG System
 * Observability-Driven Adaptive RAG™ Implementation
 *
 * This module implements the first of ArqAI's three patented technologies:
 * - Knowledge retrieval with hybrid search (vector + keyword)
 * - Confidence scoring for response quality assessment
 * - Evidence generation for audit trails
 */

// Types
export * from './types'

// Weaviate client operations
export {
  getWeaviateClient,
  initializeSchema,
  resetSchema,
  checkHealth,
  getObjectCount,
  addObject,
  batchAddObjects,
  vectorSearch,
  keywordSearch,
  hybridSearch,
} from './weaviate-client'

// Embedding operations
export {
  generateEmbedding,
  generateEmbeddings,
  cosineSimilarity,
  getEmbeddingModelInfo,
} from './embeddings'

// Chunking operations
export {
  parseKnowledgeBase,
  getChunkingStats,
} from './chunking'

// Retrieval pipeline
export {
  retrieve,
  analyzeQuery,
  generateRetrievalEvidence,
  getRetrievalDecision,
} from './retrieval'
