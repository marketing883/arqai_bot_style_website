/**
 * Knowledge Base Chunking Pipeline
 * Implements semantic chunking with metadata extraction for ArqAI RAG
 */

import { v4 as uuidv4 } from 'uuid'
import type {
  KnowledgeChunk,
  ChunkMetadata,
  KnowledgeCategory,
  ConfidenceLevel,
  UpdateFrequency,
} from './types'

// Chunking configuration per build checklist
const CHUNK_CONFIG = {
  targetSize: 750, // tokens (middle of 500-1000 range)
  minSize: 400,
  maxSize: 1000,
  overlap: 150, // tokens (middle of 100-200 range)
}

// Approximate tokens per character (English text)
const CHARS_PER_TOKEN = 4

/**
 * Parse the knowledge base markdown into chunks with metadata
 */
export function parseKnowledgeBase(markdown: string): KnowledgeChunk[] {
  const chunks: KnowledgeChunk[] = []
  const sections = extractSections(markdown)

  for (const section of sections) {
    const sectionChunks = chunkSection(section)
    chunks.push(...sectionChunks)
  }

  return chunks
}

/**
 * Extract sections from markdown with metadata
 */
interface ParsedSection {
  title: string
  content: string
  sectionId: string
  category: KnowledgeCategory
  tags: string[]
  confidence: ConfidenceLevel
  source: string
  updateFrequency: UpdateFrequency
  escalationTrigger: boolean
}

function extractSections(markdown: string): ParsedSection[] {
  const sections: ParsedSection[] = []
  const lines = markdown.split('\n')

  let currentSection: Partial<ParsedSection> | null = null
  let contentBuffer: string[] = []
  let inMetadataBlock = false
  let metadataBuffer: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Check for section headers (## or ###)
    const headerMatch = line.match(/^(#{1,3})\s+(.+)$/)
    if (headerMatch) {
      // Save previous section
      if (currentSection && contentBuffer.length > 0) {
        const metadata = parseMetadataBlock(metadataBuffer.join('\n'))
        sections.push({
          title: currentSection.title || '',
          content: contentBuffer.join('\n').trim(),
          sectionId: currentSection.sectionId || generateSectionId(sections.length),
          category: metadata.category || inferCategory(currentSection.title || ''),
          tags: metadata.tags || inferTags(contentBuffer.join('\n')),
          confidence: metadata.confidence || 'High',
          source: metadata.source || 'ArqAI Knowledge Base v1',
          updateFrequency: metadata.update_frequency || 'Monthly',
          escalationTrigger: metadata.escalation_trigger || false,
        })
      }

      // Start new section
      currentSection = {
        title: headerMatch[2],
        sectionId: extractSectionId(headerMatch[2]) || generateSectionId(sections.length + 1),
      }
      contentBuffer = []
      metadataBuffer = []
      inMetadataBlock = false
      continue
    }

    // Check for metadata block markers
    if (line.trim() === '```metadata' || line.trim() === '<!-- metadata') {
      inMetadataBlock = true
      continue
    }
    if (line.trim() === '```' || line.trim() === '-->') {
      if (inMetadataBlock) {
        inMetadataBlock = false
      }
      continue
    }

    // Accumulate content
    if (inMetadataBlock) {
      metadataBuffer.push(line)
    } else if (currentSection) {
      contentBuffer.push(line)
    }
  }

  // Save last section
  if (currentSection && contentBuffer.length > 0) {
    const metadata = parseMetadataBlock(metadataBuffer.join('\n'))
    sections.push({
      title: currentSection.title || '',
      content: contentBuffer.join('\n').trim(),
      sectionId: currentSection.sectionId || generateSectionId(sections.length),
      category: metadata.category || inferCategory(currentSection.title || ''),
      tags: metadata.tags || inferTags(contentBuffer.join('\n')),
      confidence: metadata.confidence || 'High',
      source: metadata.source || 'ArqAI Knowledge Base v1',
      updateFrequency: metadata.update_frequency || 'Monthly',
      escalationTrigger: metadata.escalation_trigger || false,
    })
  }

  return sections
}

/**
 * Parse YAML-like metadata block
 */
function parseMetadataBlock(block: string): Partial<ChunkMetadata> {
  const metadata: Partial<ChunkMetadata> = {}
  const lines = block.split('\n')

  for (const line of lines) {
    const [key, ...valueParts] = line.split(':')
    if (!key || valueParts.length === 0) continue

    const value = valueParts.join(':').trim()
    switch (key.trim().toLowerCase()) {
      case 'category':
        metadata.category = value as KnowledgeCategory
        break
      case 'tags':
        metadata.tags = value.split(',').map((t) => t.trim())
        break
      case 'confidence':
        metadata.confidence = value as ConfidenceLevel
        break
      case 'source':
        metadata.source = value
        break
      case 'update_frequency':
        metadata.update_frequency = value as UpdateFrequency
        break
      case 'escalation_trigger':
        metadata.escalation_trigger = value.toLowerCase() === 'true'
        break
    }
  }

  return metadata
}

/**
 * Chunk a section into appropriately sized pieces with overlap
 */
function chunkSection(section: ParsedSection): KnowledgeChunk[] {
  const chunks: KnowledgeChunk[] = []
  const content = section.content
  const estimatedTokens = Math.ceil(content.length / CHARS_PER_TOKEN)

  // If content is small enough, return as single chunk
  if (estimatedTokens <= CHUNK_CONFIG.maxSize) {
    chunks.push(createChunk(content, section, 0))
    return chunks
  }

  // Split by paragraphs first to maintain semantic boundaries
  const paragraphs = content.split(/\n\n+/)
  let currentChunk: string[] = []
  let currentTokens = 0
  let chunkIndex = 0

  for (const paragraph of paragraphs) {
    const paragraphTokens = Math.ceil(paragraph.length / CHARS_PER_TOKEN)

    // If single paragraph exceeds max, split it further
    if (paragraphTokens > CHUNK_CONFIG.maxSize) {
      // Flush current chunk
      if (currentChunk.length > 0) {
        chunks.push(createChunk(currentChunk.join('\n\n'), section, chunkIndex++))
      }

      // Split large paragraph by sentences
      const sentences = splitIntoSentences(paragraph)
      currentChunk = []
      currentTokens = 0

      for (const sentence of sentences) {
        const sentenceTokens = Math.ceil(sentence.length / CHARS_PER_TOKEN)

        if (currentTokens + sentenceTokens > CHUNK_CONFIG.targetSize && currentChunk.length > 0) {
          chunks.push(createChunk(currentChunk.join(' '), section, chunkIndex++))
          // Apply overlap by keeping last sentence
          currentChunk = [sentence]
          currentTokens = sentenceTokens
        } else {
          currentChunk.push(sentence)
          currentTokens += sentenceTokens
        }
      }

      continue
    }

    // Check if adding paragraph exceeds target
    if (currentTokens + paragraphTokens > CHUNK_CONFIG.targetSize && currentChunk.length > 0) {
      chunks.push(createChunk(currentChunk.join('\n\n'), section, chunkIndex++))

      // Apply overlap by keeping part of previous content
      const overlapContent = getOverlapContent(currentChunk)
      currentChunk = overlapContent ? [overlapContent, paragraph] : [paragraph]
      currentTokens = Math.ceil(currentChunk.join('\n\n').length / CHARS_PER_TOKEN)
    } else {
      currentChunk.push(paragraph)
      currentTokens += paragraphTokens
    }
  }

  // Flush remaining content
  if (currentChunk.length > 0) {
    chunks.push(createChunk(currentChunk.join('\n\n'), section, chunkIndex))
  }

  return chunks
}

/**
 * Create a knowledge chunk with metadata
 */
function createChunk(
  text: string,
  section: ParsedSection,
  index: number
): KnowledgeChunk {
  return {
    id: uuidv4(),
    text: `${section.title}\n\n${text}`.trim(),
    metadata: {
      category: section.category,
      tags: section.tags,
      confidence: section.confidence,
      source: section.source,
      section_id: `${section.sectionId}.${index}`,
      update_frequency: section.updateFrequency,
      last_updated: new Date().toISOString(),
      escalation_trigger: section.escalationTrigger,
      version: '1.0',
    },
  }
}

/**
 * Split text into sentences
 */
function splitIntoSentences(text: string): string[] {
  // Simple sentence splitter (handles common cases)
  return text
    .replace(/([.!?])\s+/g, '$1|SPLIT|')
    .split('|SPLIT|')
    .filter((s) => s.trim().length > 0)
}

/**
 * Get overlap content from previous chunks
 */
function getOverlapContent(chunks: string[]): string | null {
  if (chunks.length === 0) return null

  const lastChunk = chunks[chunks.length - 1]
  const overlapChars = CHUNK_CONFIG.overlap * CHARS_PER_TOKEN

  if (lastChunk.length <= overlapChars) {
    return lastChunk
  }

  // Find a sentence boundary near the overlap point
  const sentences = splitIntoSentences(lastChunk)
  let overlap = ''
  for (let i = sentences.length - 1; i >= 0; i--) {
    const candidate = sentences[i] + (overlap ? ' ' + overlap : '')
    if (candidate.length > overlapChars) break
    overlap = candidate
  }

  return overlap || lastChunk.slice(-overlapChars)
}

/**
 * Extract section ID from header (e.g., "1.1 Overview" -> "1.1")
 */
function extractSectionId(header: string): string | null {
  const match = header.match(/^(\d+(?:\.\d+)*)\s/)
  return match ? match[1] : null
}

/**
 * Generate a section ID
 */
function generateSectionId(index: number): string {
  return `S${index.toString().padStart(2, '0')}`
}

/**
 * Infer category from section title
 */
function inferCategory(title: string): KnowledgeCategory {
  const lowerTitle = title.toLowerCase()

  if (lowerTitle.includes('patent') || lowerTitle.includes('technology') || lowerTitle.includes('orchestration') || lowerTitle.includes('compiler') || lowerTitle.includes('rag')) {
    return 'Patent Tech'
  }
  if (lowerTitle.includes('security') || lowerTitle.includes('compliance') || lowerTitle.includes('soc') || lowerTitle.includes('hipaa')) {
    return 'Security'
  }
  if (lowerTitle.includes('vertical') || lowerTitle.includes('industry') || lowerTitle.includes('healthcare') || lowerTitle.includes('finance')) {
    return 'Vertical'
  }
  if (lowerTitle.includes('company') || lowerTitle.includes('team') || lowerTitle.includes('leadership') || lowerTitle.includes('about')) {
    return 'Company'
  }
  if (lowerTitle.includes('competitor') || lowerTitle.includes('vs') || lowerTitle.includes('compare')) {
    return 'Competitive'
  }
  if (lowerTitle.includes('use case') || lowerTitle.includes('example') || lowerTitle.includes('deployment')) {
    return 'Use Cases'
  }
  if (lowerTitle.includes('integration') || lowerTitle.includes('api') || lowerTitle.includes('connect')) {
    return 'Integration'
  }
  if (lowerTitle.includes('pricing') || lowerTitle.includes('cost') || lowerTitle.includes('roi')) {
    return 'Pricing'
  }
  if (lowerTitle.includes('roadmap') || lowerTitle.includes('future') || lowerTitle.includes('upcoming')) {
    return 'Roadmap'
  }
  if (lowerTitle.includes('compliance') || lowerTitle.includes('regulation') || lowerTitle.includes('gdpr')) {
    return 'Compliance'
  }

  return 'Product Core'
}

/**
 * Infer tags from content
 */
function inferTags(content: string): string[] {
  const lowerContent = content.toLowerCase()
  const tags: Set<string> = new Set()

  // Technology tags
  const techKeywords = [
    'orchestration', 'compiler', 'rag', 'governance', 'audit', 'compliance',
    'security', 'encryption', 'token', 'risk', 'policy', 'evidence',
  ]
  for (const keyword of techKeywords) {
    if (lowerContent.includes(keyword)) {
      tags.add(keyword)
    }
  }

  // Vertical tags
  const verticalKeywords = [
    'healthcare', 'finance', 'retail', 'manufacturing', 'telecom', 'government',
  ]
  for (const keyword of verticalKeywords) {
    if (lowerContent.includes(keyword)) {
      tags.add(keyword)
    }
  }

  // Compliance tags
  const complianceKeywords = [
    'soc 2', 'hipaa', 'gdpr', 'fedramp', 'nist', 'iso 27001', 'ai act',
  ]
  for (const keyword of complianceKeywords) {
    if (lowerContent.includes(keyword)) {
      tags.add(keyword.replace(' ', '-'))
    }
  }

  return Array.from(tags).slice(0, 10) // Limit to 10 tags
}

/**
 * Get chunking statistics
 */
export function getChunkingStats(chunks: KnowledgeChunk[]): {
  totalChunks: number
  avgChunkSize: number
  minChunkSize: number
  maxChunkSize: number
  categoryDistribution: Record<string, number>
  confidenceDistribution: Record<string, number>
} {
  const sizes = chunks.map((c) => c.text.length)
  const categories: Record<string, number> = {}
  const confidences: Record<string, number> = {}

  for (const chunk of chunks) {
    categories[chunk.metadata.category] = (categories[chunk.metadata.category] || 0) + 1
    confidences[chunk.metadata.confidence] = (confidences[chunk.metadata.confidence] || 0) + 1
  }

  return {
    totalChunks: chunks.length,
    avgChunkSize: Math.round(sizes.reduce((a, b) => a + b, 0) / sizes.length),
    minChunkSize: Math.min(...sizes),
    maxChunkSize: Math.max(...sizes),
    categoryDistribution: categories,
    confidenceDistribution: confidences,
  }
}
