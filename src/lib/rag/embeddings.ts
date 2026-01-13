/**
 * OpenAI Embeddings for ArqAI RAG System
 * Uses text-embedding-3-small as specified in the build checklist
 */

import OpenAI from 'openai'

let openaiClient: OpenAI | null = null

const EMBEDDING_MODEL = 'text-embedding-3-small'
const EMBEDDING_DIMENSIONS = 1536

/**
 * Get OpenAI client instance
 */
function getOpenAIClient(): OpenAI {
  if (openaiClient) return openaiClient

  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set')
  }

  openaiClient = new OpenAI({ apiKey })
  return openaiClient
}

/**
 * Generate embedding for a single text
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const client = getOpenAIClient()

  const response = await client.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text,
    dimensions: EMBEDDING_DIMENSIONS,
  })

  return response.data[0].embedding
}

/**
 * Generate embeddings for multiple texts in batch
 * OpenAI supports up to 2048 inputs per request
 */
export async function generateEmbeddings(
  texts: string[]
): Promise<number[][]> {
  const client = getOpenAIClient()
  const batchSize = 100 // Process in smaller batches for reliability
  const embeddings: number[][] = []

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize)

    const response = await client.embeddings.create({
      model: EMBEDDING_MODEL,
      input: batch,
      dimensions: EMBEDDING_DIMENSIONS,
    })

    // Sort by index to maintain order
    const sortedData = response.data.sort((a, b) => a.index - b.index)
    embeddings.push(...sortedData.map((d) => d.embedding))

    // Log progress for large batches
    if (texts.length > batchSize) {
      console.log(`Embedded ${Math.min(i + batchSize, texts.length)}/${texts.length} texts`)
    }
  }

  return embeddings
}

/**
 * Calculate cosine similarity between two vectors
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length')
  }

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

/**
 * Get embedding model info
 */
export function getEmbeddingModelInfo() {
  return {
    model: EMBEDDING_MODEL,
    dimensions: EMBEDDING_DIMENSIONS,
    maxTokens: 8191, // text-embedding-3-small max context
  }
}
