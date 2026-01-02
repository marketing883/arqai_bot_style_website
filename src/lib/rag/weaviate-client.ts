/**
 * Weaviate Client Configuration
 * Part of ArqAI's Observability-Driven Adaptive RAG™ implementation
 */

import weaviate, { WeaviateClient, ApiKey } from 'weaviate-ts-client'
import { WEAVIATE_CLASS_NAME, WEAVIATE_SCHEMA } from './types'

let client: WeaviateClient | null = null

/**
 * Get or create Weaviate client instance
 */
export function getWeaviateClient(): WeaviateClient {
  if (client) return client

  const weaviateUrl = process.env.WEAVIATE_URL
  const weaviateApiKey = process.env.WEAVIATE_API_KEY

  if (!weaviateUrl) {
    throw new Error('WEAVIATE_URL environment variable is not set')
  }

  // Parse URL to get scheme and host
  const url = new URL(weaviateUrl)
  const scheme = url.protocol.replace(':', '') as 'http' | 'https'
  const host = url.host

  const clientConfig: Parameters<typeof weaviate.client>[0] = {
    scheme,
    host,
  }

  // Add API key if provided (for Weaviate Cloud)
  if (weaviateApiKey) {
    clientConfig.apiKey = new ApiKey(weaviateApiKey)
  }

  client = weaviate.client(clientConfig)
  return client
}

/**
 * Initialize the Weaviate schema
 * Creates the ArqAIKnowledgeChunk class if it doesn't exist
 */
export async function initializeSchema(): Promise<void> {
  const client = getWeaviateClient()

  try {
    // Check if class already exists
    const schemaRes = await client.schema.getter().do()
    const classExists = schemaRes.classes?.some(
      (c) => c.class === WEAVIATE_CLASS_NAME
    )

    if (classExists) {
      console.log(`Schema class ${WEAVIATE_CLASS_NAME} already exists`)
      return
    }

    // Create the class
    await client.schema.classCreator().withClass(WEAVIATE_SCHEMA).do()
    console.log(`Created schema class ${WEAVIATE_CLASS_NAME}`)
  } catch (error) {
    console.error('Error initializing Weaviate schema:', error)
    throw error
  }
}

/**
 * Delete and recreate schema (for reindexing)
 */
export async function resetSchema(): Promise<void> {
  const client = getWeaviateClient()

  try {
    // Delete existing class
    await client.schema.classDeleter().withClassName(WEAVIATE_CLASS_NAME).do()
    console.log(`Deleted schema class ${WEAVIATE_CLASS_NAME}`)
  } catch {
    // Class might not exist, that's ok
    console.log(`Class ${WEAVIATE_CLASS_NAME} did not exist, creating fresh`)
  }

  // Create new class
  await client.schema.classCreator().withClass(WEAVIATE_SCHEMA).do()
  console.log(`Created fresh schema class ${WEAVIATE_CLASS_NAME}`)
}

/**
 * Check Weaviate connection health
 */
export async function checkHealth(): Promise<{
  healthy: boolean
  message: string
}> {
  try {
    const client = getWeaviateClient()
    const meta = await client.misc.metaGetter().do()
    return {
      healthy: true,
      message: `Connected to Weaviate ${meta.version}`,
    }
  } catch (error) {
    return {
      healthy: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Get object count in the knowledge base
 */
export async function getObjectCount(): Promise<number> {
  const client = getWeaviateClient()

  try {
    const result = await client.graphql
      .aggregate()
      .withClassName(WEAVIATE_CLASS_NAME)
      .withFields('meta { count }')
      .do()

    return result.data.Aggregate[WEAVIATE_CLASS_NAME]?.[0]?.meta?.count ?? 0
  } catch {
    return 0
  }
}

/**
 * Add a single object to the vector store
 */
export async function addObject(
  id: string,
  text: string,
  vector: number[],
  metadata: Record<string, unknown>
): Promise<void> {
  const client = getWeaviateClient()

  await client.data
    .creator()
    .withClassName(WEAVIATE_CLASS_NAME)
    .withId(id)
    .withProperties({
      text,
      ...metadata,
    })
    .withVector(vector)
    .do()
}

/**
 * Batch add objects to the vector store
 */
export async function batchAddObjects(
  objects: Array<{
    id: string
    text: string
    vector: number[]
    metadata: Record<string, unknown>
  }>
): Promise<{ success: number; failed: number }> {
  const client = getWeaviateClient()
  let batcher = client.batch.objectsBatcher()
  let success = 0
  let failed = 0

  for (const obj of objects) {
    batcher = batcher.withObject({
      class: WEAVIATE_CLASS_NAME,
      id: obj.id,
      properties: {
        text: obj.text,
        ...obj.metadata,
      },
      vector: obj.vector,
    })
  }

  try {
    const result = await batcher.do()
    for (const item of result) {
      if (item.result?.errors?.error) {
        failed++
        console.error('Batch insert error:', item.result.errors.error)
      } else {
        success++
      }
    }
  } catch (error) {
    console.error('Batch operation failed:', error)
    failed = objects.length
  }

  return { success, failed }
}

/**
 * Vector similarity search
 */
export async function vectorSearch(
  vector: number[],
  limit: number = 10,
  filters?: Record<string, unknown>
): Promise<Array<{
  id: string
  text: string
  score: number
  metadata: Record<string, unknown>
}>> {
  const client = getWeaviateClient()

  let query = client.graphql
    .get()
    .withClassName(WEAVIATE_CLASS_NAME)
    .withFields(
      'text category tags confidence source section_id update_frequency escalation_trigger version _additional { id distance }'
    )
    .withNearVector({ vector })
    .withLimit(limit)

  // Add filters if provided
  if (filters) {
    query = query.withWhere(filters)
  }

  const result = await query.do()
  const items = result.data.Get[WEAVIATE_CLASS_NAME] || []

  return items.map((item: Record<string, unknown>) => ({
    id: (item._additional as Record<string, unknown>)?.id as string,
    text: item.text as string,
    score: 1 - ((item._additional as Record<string, unknown>)?.distance as number || 0), // Convert distance to similarity
    metadata: {
      category: item.category,
      tags: item.tags,
      confidence: item.confidence,
      source: item.source,
      section_id: item.section_id,
      update_frequency: item.update_frequency,
      escalation_trigger: item.escalation_trigger,
      version: item.version,
    },
  }))
}

/**
 * Keyword/BM25 search
 */
export async function keywordSearch(
  query: string,
  limit: number = 5,
  filters?: Record<string, unknown>
): Promise<Array<{
  id: string
  text: string
  score: number
  metadata: Record<string, unknown>
}>> {
  const client = getWeaviateClient()

  let searchQuery = client.graphql
    .get()
    .withClassName(WEAVIATE_CLASS_NAME)
    .withFields(
      'text category tags confidence source section_id update_frequency escalation_trigger version _additional { id score }'
    )
    .withBm25({ query })
    .withLimit(limit)

  // Add filters if provided
  if (filters) {
    searchQuery = searchQuery.withWhere(filters)
  }

  const result = await searchQuery.do()
  const items = result.data.Get[WEAVIATE_CLASS_NAME] || []

  return items.map((item: Record<string, unknown>) => ({
    id: (item._additional as Record<string, unknown>)?.id as string,
    text: item.text as string,
    score: (item._additional as Record<string, unknown>)?.score as number || 0,
    metadata: {
      category: item.category,
      tags: item.tags,
      confidence: item.confidence,
      source: item.source,
      section_id: item.section_id,
      update_frequency: item.update_frequency,
      escalation_trigger: item.escalation_trigger,
      version: item.version,
    },
  }))
}

/**
 * Hybrid search combining vector and keyword
 */
export async function hybridSearch(
  query: string,
  vector: number[],
  limit: number = 10,
  alpha: number = 0.5, // 0 = pure BM25, 1 = pure vector
  filters?: Record<string, unknown>
): Promise<Array<{
  id: string
  text: string
  score: number
  metadata: Record<string, unknown>
}>> {
  const client = getWeaviateClient()

  let searchQuery = client.graphql
    .get()
    .withClassName(WEAVIATE_CLASS_NAME)
    .withFields(
      'text category tags confidence source section_id update_frequency escalation_trigger version _additional { id score }'
    )
    .withHybrid({
      query,
      vector,
      alpha,
    })
    .withLimit(limit)

  // Add filters if provided
  if (filters) {
    searchQuery = searchQuery.withWhere(filters)
  }

  const result = await searchQuery.do()
  const items = result.data.Get[WEAVIATE_CLASS_NAME] || []

  return items.map((item: Record<string, unknown>) => ({
    id: (item._additional as Record<string, unknown>)?.id as string,
    text: item.text as string,
    score: (item._additional as Record<string, unknown>)?.score as number || 0,
    metadata: {
      category: item.category,
      tags: item.tags,
      confidence: item.confidence,
      source: item.source,
      section_id: item.section_id,
      update_frequency: item.update_frequency,
      escalation_trigger: item.escalation_trigger,
      version: item.version,
    },
  }))
}
