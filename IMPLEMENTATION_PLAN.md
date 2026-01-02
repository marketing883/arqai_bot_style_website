# ArqAI CDI Website - Implementation Plan

**Project:** ArqAI Conversation-Driven Interface Website
**Target:** C-Suite Executives (CIO, CTO, CDO, CISO, CEO, CMO)
**Estimated Build Phases:** 6 Phases

---

## Executive Summary

This plan outlines the implementation of a Next.js 14 enterprise website featuring:
- **CDI Canvas System**: AI-powered conversation interface with dynamic content blocks
- **10 Interactive Content Blocks**: ROI Calculator, Demo Video, Security Review, etc.
- **Lead Capture & Qualification**: Progressive disclosure with intelligent scoring
- **Sales Dashboard**: Real-time lead management with filtering and export
- **Static Pages**: Platform, Security, About, Investors

---

## Technology Stack

| Category | Technology | Rationale |
|----------|------------|-----------|
| Framework | Next.js 14 (App Router) | Modern React, SSR/SSG, API routes |
| Styling | Tailwind CSS + Shadcn/ui | Rapid development, consistent design |
| Animations | Framer Motion | Smooth transitions, page morphs |
| AI Integration | Claude API (Sonnet 4) | Conversation intelligence |
| State Management | Zustand | Lightweight, performant |
| Database | PostgreSQL (via Supabase) | Relational, real-time capabilities |
| Analytics | PostHog | Privacy-focused, event tracking |
| Hosting | Vercel | Optimal for Next.js |

---

## Phase 1: Foundation (Core Setup)

### 1.1 Project Initialization
- [ ] Initialize Next.js 14 with App Router
- [ ] Configure Tailwind CSS
- [ ] Install and configure Shadcn/ui components
- [ ] Set up project structure
- [ ] Configure TypeScript
- [ ] Set up ESLint/Prettier
- [ ] Configure environment variables

### 1.2 Design System Setup
- [ ] Brand colors configuration
  - Deep Blue: #0A2463
  - Electric Lime: #A7FF83
  - Coral Red: #FF5964
  - Slate Gray: #1E1E24
  - Off-White: #F8F9FA
- [ ] Typography (Funnel Display, JetBrains Mono)
- [ ] Shadcn/ui theme customization
- [ ] Core UI components (buttons, cards, forms)
- [ ] Loading states and skeletons

### 1.3 Layout Components
- [ ] Root layout with metadata
- [ ] Navigation header (desktop + mobile)
- [ ] Footer component
- [ ] Responsive breakpoints

**Deliverables:** Working Next.js app with design system, navigation, and footer

---

## Phase 2: Static Pages

### 2.1 Homepage
- [ ] Hero section with headline/subheadline
- [ ] Video placeholder (15-sec loop structure)
- [ ] 4 Function selector buttons (IT, Revenue, Customer Success, Demand Gen)
- [ ] Trust indicators section
- [ ] Scroll animations

### 2.2 Platform Page
- [ ] Hero section
- [ ] Problem statement section
- [ ] Three Core Capabilities (patent highlights)
- [ ] Architecture overview (placeholder diagram)
- [ ] Integration story
- [ ] Why ArqAI wins section
- [ ] CTA section

### 2.3 Security & Compliance Page
- [ ] Hero section
- [ ] Certifications & frameworks grid
- [ ] Compliance enablement section
- [ ] Security features
- [ ] Auditor resources
- [ ] CTA section

### 2.4 About Page
- [ ] Hero section
- [ ] Origin story (ACI InfoTech)
- [ ] Leadership team grid (placeholder photos)
- [ ] Advisors section
- [ ] Global presence (interactive map)
- [ ] Company principles
- [ ] CTA section

### 2.5 Investors Page
- [ ] Scrolling reveal effects
- [ ] Problem/Solution hero
- [ ] Market/TAM visualization
- [ ] Three patents section
- [ ] Traction metrics (animated counters)
- [ ] Team section
- [ ] Deck download with email capture

**Deliverables:** 5 fully styled static pages with responsive design

---

## Phase 3: CDI Canvas System

### 3.1 Canvas Architecture
- [ ] Full-page morph transition from homepage
- [ ] Canvas layout component (70/30 split desktop)
- [ ] Mobile drawer layout
- [ ] Function-specific hero sections
- [ ] Scroll container for content blocks

### 3.2 Chat Interface
- [ ] Chat sidebar component
- [ ] Message bubbles (user/agent)
- [ ] Typing indicator
- [ ] Input controls (back, forward, text, send)
- [ ] Auto-resize textarea
- [ ] Error handling UI

### 3.3 State Management (Zustand)
- [ ] Conversation store
- [ ] Current function tracking
- [ ] Displayed blocks array
- [ ] Navigation history (back/forward)
- [ ] Lead capture state

### 3.4 Page Morph Animation
- [ ] Function button click triggers morph
- [ ] Smooth transition to canvas
- [ ] Function-specific theming
- [ ] Return to homepage mechanism

**Deliverables:** Working canvas system with chat UI and state management

---

## Phase 4: AI Agent Integration

### 4.1 Claude API Setup
- [ ] API route for chat completions
- [ ] System prompt engineering
- [ ] Agent personality configuration
- [ ] Context window management
- [ ] Streaming response handling

### 4.2 Agent Logic
- [ ] Function-specific context injection
- [ ] Role detection (CEO, CTO, CISO, etc.)
- [ ] Pain point identification
- [ ] Conversation depth tracking
- [ ] Content block trigger logic

### 4.3 Content Block Selection
- [ ] Trigger keyword mapping
- [ ] Context-aware selection algorithm
- [ ] Block display command parsing
- [ ] Multi-block support

### 4.4 Agent Personality
- [ ] Executive Consultant + Technical Expert + Trusted Advisor blend
- [ ] No marketing speak
- [ ] Adaptive technical level
- [ ] Strategic questioning
- [ ] Outcome-focused language

**Deliverables:** Fully functional AI agent with intelligent responses and block triggering

---

## Phase 5: Content Blocks (10 Blocks)

### 5.1 ROI Calculator
- [ ] Interactive form component
- [ ] Calculation engine (function-specific)
- [ ] Visual results display
- [ ] Charts/graphs (Chart.js or Recharts)
- [ ] Email export option
- [ ] PDF download

### 5.2 Demo Video
- [ ] Video player component
- [ ] Placeholder video structure
- [ ] Per-function video mapping
- [ ] Controls and fullscreen

### 5.3 Security Review Package
- [ ] Interactive checklist generator
- [ ] PDF template
- [ ] Sections: SOC 2, audit evidence, compliance
- [ ] Custom branding
- [ ] Download/email delivery

### 5.4 Architecture Diagram
- [ ] Interactive SVG component
- [ ] Clickable components with tooltips
- [ ] Patent visualization
- [ ] Data flow representation
- [ ] Zoom/pan controls

### 5.5 Integration Checklist
- [ ] Tech stack detection from conversation
- [ ] Custom checklist generation
- [ ] Compatibility matrix
- [ ] Implementation steps

### 5.6 30-Day Deployment Timeline
- [ ] Gantt-style visualization
- [ ] Custom milestones based on requirements
- [ ] Company name personalization
- [ ] Downloadable format

### 5.7 Case Study Snippet
- [ ] Case study data library (by vertical)
- [ ] Quote + metrics + industry logo format
- [ ] Selection algorithm
- [ ] Link to full case study

### 5.8 Live Stats/Metrics
- [ ] Animated counter components
- [ ] Use case-specific metrics
- [ ] Visual indicators
- [ ] Source citations

### 5.9 Code Snippet
- [ ] Syntax-highlighted code display
- [ ] Tech stack-based generation
- [ ] Copy-to-clipboard
- [ ] Language selector
- [ ] Inline comments

### 5.10 Comparison Table
- [ ] Competitor data by function
- [ ] Feature matrix component
- [ ] ArqAI advantages highlighting
- [ ] Fair, factual positioning

**Deliverables:** All 10 content blocks with animations and interactions

---

## Phase 6: Lead System & Dashboard

### 6.1 Database Setup (Supabase/PostgreSQL)
- [ ] Schema creation (leads table with all fields)
- [ ] Indexes for search/filtering
- [ ] API endpoints (CRUD)
- [ ] Real-time subscriptions

### 6.2 Lead Capture Flow
- [ ] Progressive disclosure UI
- [ ] Capture trigger logic
- [ ] Form validation
- [ ] Email confirmation

### 6.3 Lead Qualification Engine
- [ ] Multi-dimensional scoring (0-100)
- [ ] Segment label generation
- [ ] Company intelligence parsing
- [ ] Person intelligence parsing
- [ ] Conversation intelligence extraction

### 6.4 Sales Dashboard
- [ ] Protected route (URL-based for V1)
- [ ] Table view with all columns
- [ ] Sortable columns
- [ ] Filter panel (score, segment, date, industry, etc.)
- [ ] Search functionality
- [ ] Bulk actions (select, export, mark contacted)
- [ ] CSV export
- [ ] Lead detail modal/page
- [ ] Real-time updates (WebSocket/polling)

### 6.5 Lead Handoff
- [ ] Auto-email confirmation with artifacts
- [ ] Sales team notification
- [ ] Database storage

**Deliverables:** Complete lead capture, qualification, and dashboard system

---

## File Structure

```
/arqai_bot_style_website
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx                    # Homepage
│   │   ├── platform/page.tsx           # Platform page
│   │   ├── security/page.tsx           # Security page
│   │   ├── about/page.tsx              # About page
│   │   └── investors/page.tsx          # Investors page
│   ├── canvas/
│   │   └── [function]/page.tsx         # CDI Canvas (dynamic route)
│   ├── dashboard/
│   │   └── page.tsx                    # Sales dashboard
│   ├── api/
│   │   ├── chat/route.ts               # Claude API integration
│   │   ├── leads/route.ts              # Lead CRUD
│   │   └── export/route.ts             # CSV export
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                             # Shadcn components
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   └── nav.tsx
│   ├── homepage/
│   │   ├── hero.tsx
│   │   ├── function-selector.tsx
│   │   └── trust-indicators.tsx
│   ├── canvas/
│   │   ├── canvas-layout.tsx
│   │   ├── chat-sidebar.tsx
│   │   ├── message-bubble.tsx
│   │   └── content-area.tsx
│   ├── blocks/
│   │   ├── roi-calculator.tsx
│   │   ├── demo-video.tsx
│   │   ├── security-review.tsx
│   │   ├── architecture-diagram.tsx
│   │   ├── integration-checklist.tsx
│   │   ├── deployment-timeline.tsx
│   │   ├── case-study.tsx
│   │   ├── live-stats.tsx
│   │   ├── code-snippet.tsx
│   │   └── comparison-table.tsx
│   ├── dashboard/
│   │   ├── leads-table.tsx
│   │   ├── filters-panel.tsx
│   │   ├── lead-detail.tsx
│   │   └── export-button.tsx
│   └── shared/
│       ├── animated-counter.tsx
│       ├── section-wrapper.tsx
│       └── cta-button.tsx
├── lib/
│   ├── claude.ts                       # Claude API client
│   ├── agent-prompts.ts                # System prompts
│   ├── block-triggers.ts               # Block selection logic
│   ├── lead-scoring.ts                 # Qualification engine
│   ├── db.ts                           # Database client
│   └── utils.ts
├── stores/
│   ├── conversation-store.ts           # Zustand store
│   └── lead-store.ts
├── data/
│   ├── case-studies.ts                 # Pre-written case studies
│   ├── competitors.ts                  # Comparison data
│   └── metrics.ts                      # Baseline metrics
├── public/
│   ├── assets/
│   │   ├── images/
│   │   ├── videos/
│   │   └── downloads/
│   └── favicon.ico
├── styles/
│   └── fonts/
├── types/
│   └── index.ts
├── .env.local
├── tailwind.config.ts
├── next.config.js
└── package.json
```

---

## Database Schema (PostgreSQL)

```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Basic Info
  name VARCHAR(255),
  email VARCHAR(255),
  job_title VARCHAR(255),
  company_name VARCHAR(255),
  location VARCHAR(255),

  -- Qualification
  lead_score INTEGER DEFAULT 0 CHECK (lead_score >= 0 AND lead_score <= 100),
  segment_label VARCHAR(255),
  readiness_level VARCHAR(50) CHECK (readiness_level IN ('Hot', 'Warm', 'Nurture', 'Research')),
  company_size_tier VARCHAR(50) CHECK (company_size_tier IN ('Enterprise', 'Mid-Market', 'SMB', 'Startup')),
  industry_vertical VARCHAR(255),
  budget_authority_level VARCHAR(50) CHECK (budget_authority_level IN ('C-Suite', 'VP', 'Director', 'Manager', 'IC')),

  -- Company Intelligence
  employee_count INTEGER,
  revenue VARCHAR(100),
  public_private VARCHAR(50) CHECK (public_private IN ('Public', 'Private', 'Unknown')),
  funding_stage VARCHAR(100),
  tech_stack_detected JSONB DEFAULT '[]',
  recent_news TEXT,
  ai_initiatives_detected TEXT,

  -- Person Intelligence
  linkedin_profile_url VARCHAR(500),
  role_tenure VARCHAR(100),
  previous_companies JSONB DEFAULT '[]',
  professional_background TEXT,
  decision_authority_assessment TEXT,

  -- Conversation Intelligence
  conversation_transcript TEXT,
  primary_pain_point VARCHAR(255),
  use_cases_discussed JSONB DEFAULT '[]',
  urgency_level VARCHAR(50) CHECK (urgency_level IN ('Immediate', 'Exploring', 'Learning')),
  objections_raised TEXT,
  competing_tools_mentioned JSONB DEFAULT '[]',
  technical_sophistication_level VARCHAR(50) CHECK (technical_sophistication_level IN ('High', 'Medium', 'Low')),
  artifacts_generated JSONB DEFAULT '[]',
  next_action_suggested TEXT,
  function_explored VARCHAR(50),

  -- Management
  status VARCHAR(50) DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Qualified', 'Unqualified')),
  assigned_to VARCHAR(255),
  notes TEXT
);

CREATE INDEX idx_leads_score ON leads(lead_score DESC);
CREATE INDEX idx_leads_created ON leads(created_at DESC);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_segment ON leads(segment_label);
CREATE INDEX idx_leads_readiness ON leads(readiness_level);
```

---

## Agent System Prompt (Summary)

```
You are ArqBot, ArqAI's executive sales consultant. You blend three personas:

1. **Executive Consultant**: Strategic, speaks to business outcomes
2. **Technical Expert**: Deep platform knowledge, architecture fluency
3. **Trusted Advisor**: Direct, no fluff, outcome-focused

CORE BEHAVIORS:
- Never use marketing speak
- Be direct and confident, not arrogant
- Adapt to user's technical level
- Ask strategic questions to qualify
- Focus on outcomes, not features

CONTENT BLOCK TRIGGERS:
- "cost/ROI" → Show ROI Calculator
- "security/compliance" → Show Security Review
- "how does it work" → Show Demo Video
- Tech stack mentioned → Show Integration Checklist
- "proof/customers" → Show Case Study
- "timeline" → Show 30-Day Deployment
- "vs [competitor]" → Show Comparison Table
- "show me code" → Show Code Snippet
- Technical deep-dive → Show Architecture Diagram
- Early conversation → Show Live Stats

LEAD CAPTURE TRIGGERS:
- After generating artifact
- After deep technical discussion
- When pricing/timeline asked
- After 5+ engaged exchanges
```

---

## Implementation Order

### Week 1-2: Foundation
1. Project setup and configuration
2. Design system and Shadcn/ui
3. Layout components (header, footer)
4. Homepage basic structure

### Week 3-4: Static Pages
5. Complete Homepage with all sections
6. Platform page
7. Security page
8. About page
9. Investors page

### Week 5-6: Canvas System
10. Canvas architecture and layouts
11. Chat interface components
12. State management (Zustand)
13. Page morph animations

### Week 7-8: AI Integration
14. Claude API integration
15. Agent logic and prompts
16. Block trigger system
17. Conversation flow

### Week 9-10: Content Blocks
18. Implement all 10 content blocks
19. Block animations and interactions
20. PDF generation
21. Export functionality

### Week 11-12: Lead System
22. Database setup
23. Lead capture flow
24. Qualification engine
25. Sales dashboard
26. Testing and polish

---

## Key Decisions Needed

1. **Database Provider**: Supabase recommended for PostgreSQL + real-time + auth ready for Phase 2

2. **Video Placeholders**: Should I create simple animated placeholder videos or leave empty video containers?

3. **Team Photos**: Will use placeholder images initially - when will actual photos be available?

4. **Pitch Deck PDF**: Do you have the PDF file to include, or should I create a placeholder download?

5. **Cal.com**: Confirmed disabled for V1 - using "We'll contact you" approach?

6. **Domain**: Confirming www.thearq.ai for production?

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Claude API costs | Implement response caching, rate limiting |
| Complex state management | Zustand provides simple, debuggable state |
| Content block complexity | Build incrementally, test each block independently |
| Dashboard performance | Pagination, virtual scrolling for large datasets |
| Mobile experience | Test continuously, prioritize responsive design |

---

## Approval Request

Please confirm:

1. **Technology stack** is approved (Next.js 14, Tailwind, Shadcn/ui, Supabase, etc.)
2. **Phase order** makes sense for your priorities
3. **File structure** aligns with your expectations
4. **Database schema** captures all required fields
5. Any **adjustments** to the scope or priorities

Once confirmed, I will begin Phase 1 implementation.

---

*Plan Version: 1.0*
*Created: January 2026*
