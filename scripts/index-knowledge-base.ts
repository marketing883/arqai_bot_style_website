/**
 * CLI Script to Index ArqAI Knowledge Base into Weaviate
 *
 * Usage:
 *   1. Ensure the dev server is running: npm run dev
 *   2. Run this script: npx tsx scripts/index-knowledge-base.ts [--reset]
 *
 * Environment variables (loaded from .env.local automatically when using dev server):
 * - OPENAI_API_KEY: For generating embeddings
 * - WEAVIATE_URL: Weaviate instance URL (default: http://localhost:8080)
 * - WEAVIATE_API_KEY: Optional API key for Weaviate Cloud
 */

import * as fs from 'fs'
import * as path from 'path'

const KB_FILE_PATH = path.join(process.cwd(), 'ArqAI_Agent_Knowledge_Base_v1.md')
const API_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

async function main() {
  console.log('='.repeat(60))
  console.log('ArqAI Knowledge Base Indexer')
  console.log('='.repeat(60))

  // Check if KB file exists
  if (!fs.existsSync(KB_FILE_PATH)) {
    console.error(`❌ Knowledge Base file not found at: ${KB_FILE_PATH}`)
    process.exit(1)
  }

  // Read KB content
  console.log(`📖 Reading knowledge base from: ${KB_FILE_PATH}`)
  const kbContent = fs.readFileSync(KB_FILE_PATH, 'utf-8')
  console.log(`   Size: ${(kbContent.length / 1024).toFixed(1)} KB`)
  console.log(`   Lines: ${kbContent.split('\n').length}`)

  // Check for reset flag
  const shouldReset = process.argv.includes('--reset')
  if (shouldReset) {
    console.log('⚠️  Reset flag detected - will clear existing index')
  }

  // Call the indexing API
  console.log(`\n🚀 Sending to indexing API at ${API_URL}/api/rag/index`)
  console.log('   This may take a few minutes...\n')

  try {
    const response = await fetch(`${API_URL}/api/rag/index`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: kbContent,
        reset: shouldReset,
        version: '1.0',
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      console.error('❌ Indexing failed:', result.error)
      console.error('   Details:', result.details)
      process.exit(1)
    }

    console.log('✅ Indexing complete!')
    console.log('\n📊 Results:')
    console.log(`   Total chunks: ${result.stats.total_chunks}`)
    console.log(`   Successfully indexed: ${result.stats.indexed}`)
    console.log(`   Failed: ${result.stats.failed}`)
    console.log(`   Final count in DB: ${result.stats.final_count}`)
    console.log(`   Average chunk size: ${result.stats.avg_chunk_size} chars`)
    console.log(`   Processing time: ${result.stats.duration_ms}ms`)

    console.log('\n📁 Category distribution:')
    for (const [category, count] of Object.entries(
      result.category_distribution || {}
    )) {
      console.log(`   ${category}: ${count}`)
    }

    console.log('\n🎯 Confidence distribution:')
    for (const [level, count] of Object.entries(
      result.confidence_distribution || {}
    )) {
      console.log(`   ${level}: ${count}`)
    }

    console.log('\n' + '='.repeat(60))
    console.log('Knowledge base is now indexed and ready for RAG queries!')
    console.log('='.repeat(60))
  } catch (error) {
    console.error('❌ Failed to connect to indexing API:', error)
    console.error('\nMake sure the development server is running:')
    console.error('  npm run dev')
    process.exit(1)
  }
}

main()
