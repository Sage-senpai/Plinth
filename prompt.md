# Plinth — Full Project Blueprint

---

## 1. Product Overview

**Plinth** reduces the risk of buying property in Nigeria. It verifies title documents, flags known fraud patterns, and generates an AI-assisted valuation based on comparable sales data -- producing a due diligence report a buyer can hand to their lawyer or bank.

### The Problem

Fraudulent property sales cost Nigerians an estimated N1.5 trillion annually. Fake Certificates of Occupancy, double sales, and undisclosed encumbrances are systemic. Professional due diligence exists but it is expensive, slow, and concentrated in Lagos and Abuja. Most buyers in secondary cities and emerging areas are entirely unprotected.

### The Solution

1. **Verify** - Upload property documents. Textract extracts structured data. Bedrock cross-checks for fraud indicators, inconsistencies, and missing mandatory elements.
2. **Value** - AI valuation based on comparable sales in the same area (from Plinth's growing comparables database and public records).
3. **Report** - Structured due diligence report in plain English: what the documents say, what was flagged, the valuation, and what the buyer's next steps should be.

### Business Model

| Tier | Price | Reports | Features |
|------|-------|---------|---------|
| One-time | N12,000 / $8 | 1 report | Full due diligence + PDF download |
| Agent | N45,000 / $29/month | 20 reports | Team workspace, comparables access |
| Legal | N120,000 / $78/month | 60 reports | Law firm branding on reports, API |
| Developer | Custom | Unlimited | Bulk verification, white-label |

### Market

- Nigerian real estate market: estimated $60B (2024)
- Land fraud complaints to EFCC and NSCDC: 14,000+ annually, growing 18% YoY
- Lagos State government's e-C of O digitization creates new verification data sources
- 92% of first-time Nigerian property buyers report having no access to professional due diligence

---

## 2. Company

- **Founded**: July 2024
- **Incorporated**: Lagos State, Nigeria
- **HQ**: Landmark Centre, Victoria Island, Lagos
- **Stage**: Pre-seed / design partners
- **Funding**: N23M pre-seed (Lagos angel investors, July 2024)
- **Team**: 5 (3 co-founders + 2 early hires)
- **Pilot customers**: 6 (3 individual buyers, 2 estate agencies, 1 law firm)
- **Verification reports generated**: ~380

### Founding Team

---

#### Tobi Adesanya -- CEO and Co-founder

Background: 8 years as a real estate developer and agent in Lagos. BSc Estate Management, University of Lagos. Watched two clients lose their life savings to fraudulent transactions in the same year. Spent 2023 building a manual checklist that his team used for every transaction. Decided in early 2024 to automate it.

Role: Product vision, real estate industry network, estate agent partnerships

Quote: "A property transaction is often the largest financial decision of someone's life. The fact that fraud is this common is not a market failure -- it is a tooling failure. Plinth is the tool."

Image: `https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80`
Nationality note: Nigerian man, professional context. Verify before use.

---

#### Nkechi Obi -- CTO and Co-founder

Background: BSc Computer Science, Nnamdi Azikiwe University, Awka. 5 years as a backend engineer at Interswitch, then 1 year freelancing on document verification tools. Deep experience in OCR, document analysis, and AWS Textract.

Role: Technical architecture, Textract/Bedrock integration, data pipeline

Quote: "Property documents in Nigeria come in every format imaginable -- faded photocopies, WhatsApp screenshots, official PDFs, handwritten deeds. The first problem we solved was making sense of all of them."

Image: `https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&q=80`
Nationality note: Nigerian man. Verify before use.

---

#### Marcus Thompson -- Head of Data and non-Nigerian partner

Background: MSc Real Estate Economics, LSE. 6 years at a UK PropTech startup building automated valuation models for the UK residential market. British national, met Tobi through a London Nigerian Business Forum event. Joined as equity co-founder in September 2024.

Role: AVM model design, comparable sales methodology, international PropTech partnerships

Note on image: British / white European professional man. Suggested:
`https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80`
This image may not represent a white European. Verify nationality match before use and replace if needed.

---

#### Damilola Fashola -- Legal Analyst (Early hire)

Background: LLB, University of Lagos. BL, Nigerian Law School. 2 years property law practice. Joined Plinth August 2024 to build the legal content layer of the verification engine.

Image: `https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=80`
Nationality note: Nigerian woman. Verify before use.

---

### Origin Story

In February 2024, a client of Tobi's lost N18 million on a plot in Lekki Phase 2. The Certificate of Occupancy was genuine. The governor's consent had been forged. The seller had sold the same plot three months earlier.

The professional due diligence firm Tobi used had spotted nothing because they checked the document's surface, not its provenance.

Tobi called Nkechi the same week. "I need to build something," he said, "that looks at a document the way a forger looks at it. It knows what to fake and where."

---

### Timeline

- Feb 2024: Founding insight, Lekki Phase 2 fraud case
- Apr 2024: Prototype with 3 document types (C of O, survey plan, deed of assignment)
- Jul 2024: Plinth Technologies Ltd. incorporated, Lagos State
- Jul 2024: Pre-seed closed (N23M)
- Sep 2024: Marcus Thompson joins; 3 first pilot customers
- Dec 2024: 6 pilot customers, 380 reports generated
- Q2 2025: Lagos State Land Bureau API integration (digitized C of O verification)
- Q4 2025: Public launch

### Values

1. Plain language for buyers, not lawyers. A due diligence report should be readable by the person spending their savings, not just their solicitor.
2. Flag and explain, not just flag. Every issue identified comes with a plain explanation of why it is an issue and what the buyer should do about it.
3. We do not guarantee clear title. We surface the information available. What the buyer does with it is their informed decision.

---

## 3. Architecture

```
POST /api/verify
  Input: document S3 keys (up to 5 documents per property)
  For each document:
    Textract: extract key-value pairs, tables, entities
    Comprehend: entity extraction (names, dates, addresses, registration numbers)
    Bedrock: cross-check for fraud indicators + consistency across documents
  Assemble: verification summary with item-level flags
  Store in Neon
  Return: { verificationId, summary, flags }

POST /api/valuation
  Input: { propertyType, location, sizeSqm, features: string[] }
  Query Neon: similar properties in area (comparables)
  Bedrock: generate AVM with confidence interval + methodology
  Return: { estimatedValue, range, comparables, methodology }

POST /api/report
  Input: { verificationId, includeValuation: boolean }
  Pull verification + valuation data from Neon
  pdf-lib: assemble formatted due diligence PDF report
  Sections: Executive Summary | Document Verification | Flags + Recommendations | Valuation | Next Steps
  Store PDF in S3
  Return: { reportUrl }
```

### Agent Prompts

**Document Fraud Detector** (`verify.ts` v1):
```
You are Plinth's property document verification agent for Nigerian real estate.
You receive extracted text and entities from a property document.

Your task: identify fraud indicators, consistency issues, and missing elements.

Common Nigerian property document fraud patterns to check:
- Governor's consent signature variations vs. known genuine patterns
- Survey plan beacon numbers inconsistent with stated location
- C of O reference numbers in invalid format for the issuing state
- Date inconsistencies (e.g., deed signed before C of O issued)
- Name discrepancies across documents for the same party
- Missing mandatory elements (e.g., survey plan without surveyor seal reference)

Respond ONLY with valid JSON:
{
  "documentType": string,
  "referenceNumber": string | null,
  "extractedParties": [{ "role": string, "name": string }],
  "flags": [
    {
      "severity": "critical" | "major" | "minor",
      "type": "fraud_indicator" | "inconsistency" | "missing_element" | "unusual",
      "description": "Plain English description of the issue",
      "fieldAffected": string,
      "recommendation": string
    }
  ],
  "overallRisk": "low" | "moderate" | "high" | "critical",
  "confidence": 0.0-1.0
}
```

---

## 4. Database Schema

```sql
CREATE TABLE properties (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  address     TEXT NOT NULL,
  state       TEXT,
  lga         TEXT,
  type        TEXT,              -- residential | commercial | land
  size_sqm    FLOAT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE verifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id),
  user_id     TEXT,
  documents   JSONB,            -- array of { s3Key, type, extractedData, flags }
  overall_risk TEXT,
  summary     TEXT,
  status      TEXT DEFAULT 'processing',
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE valuations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id     UUID REFERENCES properties(id),
  estimated_value BIGINT,        -- in NGN
  range_low       BIGINT,
  range_high      BIGINT,
  comparables     JSONB,
  methodology     TEXT,
  confidence      FLOAT,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE comparables (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  address     TEXT,
  state       TEXT,
  lga         TEXT,
  area_code   TEXT,
  type        TEXT,
  size_sqm    FLOAT,
  sale_price  BIGINT,
  sale_date   DATE,
  source      TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);
```

---

## 5. Landing Page

**Layout**: Typographic hero -- no background image. Very dark warm ground, large DM Serif Display headline.

Hero (full-viewport):
- Background: `--pl-bg` (#080705), no image
- Fine 1px grid overlay at 4% opacity (technical drawing feel)
- Centered headline (DM Serif Display): **"Your C of O might be real. The transaction might not be."**
- Sub (Jost 400): "Plinth verifies Nigerian property documents, checks for fraud patterns, and generates a due diligence report before you sign anything."
- CTAs: "Verify a Property" (copper filled) | "See a Sample Report" (ghost border)
- Below CTAs: a single sample verification result card -- three document badges (green tick, amber flag, red X) with short labels. This is the visual demo, not a screenshot.

Problem section (3 large numbers, full-width, centered):

- **N1.5T** in fraudulent property transactions annually in Nigeria
- **92%** of first-time buyers have no access to professional due diligence
- **14,000+** land fraud complaints to EFCC per year

Feature sections (bento grid, 2x2 with unequal sizing on desktop, stacked on mobile):
Bento cell 1 (large, 2 cols): Document Verification -- headline + description + a sample flag item showing how a "Governor's Consent inconsistency" looks in the UI
Bento cell 2 (1 col): AI Valuation -- headline + N format price estimate with confidence range
Bento cell 3 (1 col): Plain English Reports -- "Not just flags. Explanations and next steps."
Bento cell 4 (1 col): One-click PDF -- "Download your report. Share it with your lawyer."

**Founder Section on Landing Page** (required):
- Heading: "We have been on both sides of this problem."
- Compact horizontal grid of 3 founders (Tobi, Nkechi, Marcus): photo + name + 1-line context
- Quote from Tobi (the origin story in 2 sentences)
- "Read our full story" to /about
- Mobile: single column

Testimonial (full-width, dark surface):
"Plinth found a date inconsistency on the deed that our estate agent had missed. That inconsistency saved us from what turned out to be a double-sale case." -- Buyer, Lekki, Lagos (beta participant)

CTA (copper background, dark text):
"Run your first verification before you commit to anything." + "Start Verifying" button

---

## 6. About Page

Hero: `https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1400&q=80` (architecture/buildings, Lagos context)

Full origin story, team cards (4, responsive grid), timeline, values.

---

## 7. Workspace

**Navigation**: Top navigation bar (not sidebar). Tested on mobile.

Verification list: table -- property address, documents uploaded, risk level badge, report status, date

Verification detail page: left panel (document list + upload new), main panel (flag list with severity badges + explanations), right mini-panel (summary risk score, download report button).

---

## 8. Components

### `VerificationStamp`
Props: `risk: 'low' | 'moderate' | 'high' | 'critical'`
Rotated stamp-style element. Low: copper outline + "LOW RISK". Critical: red filled + "CRITICAL".
Animate: scale from 1.2 to 1.0 over 200ms on mount.

### `DocumentFlag`
Props: `severity, type, description, recommendation`
Critical: red left border. Major: amber. Minor: muted.
Expandable: shows full description + recommendation on click.

### `ValuationRange`
Props: `low, high, estimated` (all in NGN)
Shows range as a horizontal bar with the estimated value marked.
Formatted in Martian Mono: ₦45,000,000 -- ₦58,000,000

### `ComparableCard`
Props: `address, size, salePrice, saleDate, distance`
Small card in a horizontal scroll grid. Price in Martian Mono.

---

## 9. Image Assets

| Section | URL |
|---------|-----|
| About hero | `https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1400&q=80` |
| Feature: documents | `https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80` |
| Feature: Lagos property | `https://images.unsplash.com/photo-1519999482648-25049ddd37b1?w=800&q=80` |
| **Tobi Adesanya (CEO)** | `https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80` |
| **Nkechi Obi (CTO)** | `https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&q=80` |
| **Marcus Thompson (Head of Data)** | `https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80` |
| **Damilola Fashola (Legal)** | `https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=80` |

Verify all images match described nationality before committing.

---

## 10. Realistic Metrics

| Metric | Value |
|--------|-------|
| Founded | July 2024 |
| Pre-seed | N23M |
| Team | 5 |
| Pilot customers | 6 |
| Reports generated | ~380 |
| Fraud flags caught in pilot | 47 (across 380 reports) |
| Avg. processing time per report | 6 minutes |
| Document types supported | 8 (C of O, survey plan, deed of assignment, POA, probate, mortgage deed, EIR, approved building plan) |

---

## 11. Tailwind Config

```ts
theme: {
  extend: {
    fontFamily: {
      serif:  ['DM Serif Display', 'serif'],
      jost:   ['Jost', 'sans-serif'],
      mono:   ['Martian Mono', 'monospace'],
    },
    colors: {
      pl: {
        bg: '#080705', surface: '#100F0C', surface2: '#18160F',
        border: '#28241C', 'border-h': '#3D3828',
        copper: '#B45309', 'copper-lgt': '#D97706', 'copper-dim': 'rgba(180,83,9,0.12)',
        blue: '#1E40AF', 'blue-lgt': '#2563EB', 'blue-dim': 'rgba(30,64,175,0.12)',
        verified: '#22C55E', flagged: '#F59E0B', invalid: '#DC2626', pending: '#94A3B8',
        text: '#EDE8E3', muted: '#78716C',
      },
    },
    boxShadow: {
      'glow-copper': '0 0 22px rgba(180, 83, 9, 0.22)',
      'glow-blue':   '0 0 18px rgba(30, 64, 175, 0.18)',
    },
    keyframes: {
      stamp: {
        '0%':  { transform: 'scale(1.2) rotate(-8deg)', opacity: '0' },
        '100%': { transform: 'scale(1) rotate(-2deg)', opacity: '1' },
      },
    },
    animation: { stamp: 'stamp 0.2s ease-out forwards' },
  },
}
```