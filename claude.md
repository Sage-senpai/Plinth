# Plinth — Claude Code Instructions

> **FIRST**: Read `~/.claude/CLAUDE.md` before doing anything. Global rules apply unconditionally.

---

## What This Project Is

**Plinth** is an AI due diligence platform for Nigerian real estate. It verifies property documents, generates AI valuations based on comparable sales, and produces a structured due diligence report that a buyer or their lawyer can rely on before committing.

- **Type**: Consumable SaaS -- web platform for property buyers, estate agents, and law firms
- **Stack**: Next.js 14 (App Router), Vercel. All backend in `/app/api/` routes.
- **Founded**: July 2024, Lagos State, Nigeria
- **Repo root**: Single Next.js monorepo.

---

## Skills to Read Before Writing Code

| Task | Skill path |
|------|-----------|
| Any UI page, component, or layout | `/mnt/skills/public/frontend-design/SKILL.md` |
| Any `.pdf` due diligence report | `/mnt/skills/public/pdf/SKILL.md` |
| Any `.docx` offer letter or title report | `/mnt/skills/public/docx/SKILL.md` |
| Any `.xlsx` comparables export | `/mnt/skills/public/xlsx/SKILL.md` |
| Reading uploaded property documents | `/mnt/skills/public/pdf-reading/SKILL.md` |
| User-facing copy and marketing prose | `/mnt/skills/examples/doc-coauthoring/SKILL.md` |

---

## Commit Rules

1. **No `Co-authored-by: Claude`** or any AI attribution.
2. **Never `git push` automatically.**
3. **One feature per commit.** Format: `type(scope): description` + bullet body.
4. **Never commit broken code.**
5. **Commit after each module. Stop. Wait for instruction.**

---

## Architecture

```
plinth/
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx
│   │   ├── about/page.tsx
│   │   └── pricing/page.tsx
│   ├── search/                   # Property and report search (public)
│   ├── workspace/                # Authenticated
│   │   ├── page.tsx              # Property searches and reports
│   │   ├── verify/
│   │   │   ├── new/page.tsx      # Start new verification
│   │   │   └── [id]/page.tsx     # Verification result
│   │   └── comparables/page.tsx  # AVM comparables
│   └── api/
│       ├── verify/route.ts       # POST - document verification
│       ├── valuation/route.ts    # POST - AVM valuation
│       ├── report/route.ts       # POST - generate due diligence report
│       ├── status/[jobId]/route.ts
│       └── queue/process/route.ts
├── lib/
│   ├── aws/
│   ├── db/
│   ├── queue/
│   ├── property/                 # Lagos/Abuja area codes, common document types (static)
│   ├── prompts/
│   └── types.ts
└── components/
```

### AWS Services

| Service | Purpose |
|---------|---------|
| Amazon Textract | Extract data from property documents (C of O, survey plans, deeds) |
| Amazon Bedrock (Claude 3.5 Sonnet) | Document fraud detection, valuation reasoning, report generation |
| Amazon S3 | Property document storage |
| Amazon Comprehend | Entity extraction from property documents |

---

## Design System

Read `/mnt/skills/public/frontend-design/SKILL.md` before any UI.

### Landing Page Layout Rules

**Typographic hero** -- no background image in the hero section. Large editorial type on a dark warm background, full-width. Sections below use a bento-style grid for features and a clean card grid for property demos. No left-text/right-screenshot split panels. The founder section uses a horizontal compact grid. All layouts tested at 390px, 768px, and 1280px.

### Palette

The colour of authority, materials, and honest transaction. Brick copper and structural steel on a very dark warm ground.

```css
:root {
  --pl-bg:        #080705;
  --pl-surface:   #100F0C;
  --pl-surface-2: #18160F;
  --pl-border:    #28241C;
  --pl-border-h:  #3D3828;

  /* Primary: Copper / brick */
  --pl-copper:    #B45309;
  --pl-copper-lgt: #D97706;
  --pl-copper-dim: rgba(180, 83, 9, 0.12);

  /* Accent: Structural blue */
  --pl-blue:      #1E40AF;
  --pl-blue-lgt:  #2563EB;
  --pl-blue-dim:  rgba(30, 64, 175, 0.12);

  /* Verification states */
  --pl-verified:  #22C55E;
  --pl-flagged:   #F59E0B;
  --pl-invalid:   #DC2626;
  --pl-pending:   #94A3B8;

  /* Typography */
  --pl-text:      #EDE8E3;
  --pl-muted:     #78716C;
  --pl-faint:     #28241C;

  --pl-glow-copper: 0 0 22px rgba(180, 83, 9, 0.22);
  --pl-glow-blue:   0 0 18px rgba(30, 64, 175, 0.18);
}
```

### Typography

```
Display / Hero:  DM Serif Display (400)    architectural gravity; reads like a property title deed
Body / UI:       Jost (400-500)            geometric, modern, precise
Mono / IDs:      Martian Mono (400)        property IDs, coordinates, document reference numbers
```

Google Fonts:
```css
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Jost:wght@400;500;600&family=Martian+Mono:wght@400&display=swap');
```

**Never use**: Inter, Roboto, Space Grotesk, Playfair Display, or system fonts as primary.

### Visual Direction

- **Tone**: An architecture firm that learned to code. Precise, weighty, respectful of the scale of property transactions. No startup whimsy.
- **Layout**: Typographic hero with no image. Property detail cards in a bento grid (unequal column widths). Report view is document-forward, clean, printable.
- **Textures**: Subtle grid lines on feature sections (1px lines at 4% opacity, like a technical drawing). No grain.
- **Motion**: Verification result stamps drop in (similar to a notary stamp -- scale from 1.2 to 1, 180ms). Confidence bars fill horizontally on scroll-enter. No excessive animation.
- **No purple.** Copper-on-dark is the signature. Structural blue only for interactive elements and verified states.

---

## Environment Variables

```env
AWS_REGION=eu-west-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=plinth-docs-dev
DATABASE_URL=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
DEMO_MODE=true
```

---

## Build Order

1. `chore(init)` — Scaffold, deps, Tailwind, fonts, CSS variables
2. `feat(db)` — Neon schema + Drizzle
3. `feat(aws)` — Textract, Bedrock, S3, Comprehend SDK clients
4. `feat(queue)` — QStash worker
5. `feat(api/verify)` — Document verification route
6. `feat(api/valuation)` — AVM route
7. `feat(api/report)` — Due diligence report generation route
8. `feat(ui/design-system)` — CSS variables, primitives
9. `feat(ui/landing)` — Landing page (typographic hero, bento grid, founder section)
10. `feat(ui/about)` — Founding team + story
11. `feat(ui/pricing)` — Pricing
12. `feat(ui/workspace)` — Verification list
13. `feat(ui/verify-new)` — New verification wizard
14. `feat(ui/verify-detail)` — Verification result + report
15. `feat(ui/comparables)` — AVM comparables view
16. `feat(auth)` — NextAuth.js
17. `test(api)` — Integration tests
18. `chore(deploy)` — vercel.json, env docs