---
name: karpathy-method
description: "Universal product-building methodology inspired by Andrej Karpathy's vibe coding philosophy. Use this skill when starting any new product, feature, or content project. Provides a step-by-step playbook from ideation through launch, leveraging AI-first 'director mode' development with quality gates, knowledge building, and rapid iteration."
---

# Karpathy Method — Vibe Product Builder

A universal product-building methodology inspired by Andrej Karpathy's philosophy on vibe coding, agentic development, and the evolving role of the human programmer as a **director** rather than a typist.

## Core Philosophy

> "I can't remember the last time I corrected it... I just trusted the system more and more and then I was vibe coding."
> — Andrej Karpathy

### The Five Pillars

1. **Trust the System** — Default to full AI execution. Only intervene when the output is clearly wrong.
2. **Director Mode** — You are the creative director. Define the vision, constraints, and quality bar. AI handles execution.
3. **Rapid Iteration** — Ship fast, iterate faster. Don't polish prematurely. Let the feedback loop guide refinement.
4. **Knowledge Compounding** — Every project builds your knowledge base. Capture insights, patterns, and reusable components.
5. **Quality Gates** — Trust AI for speed, but maintain human checkpoints at critical junctures before publishing.

## Usage

```
When starting any new product or project, invoke this skill:
1. Read this SKILL.md
2. Follow the playbook phases below
3. Auto-generate the scaffold using the templates
```

## The Playbook — 6 Phases

### Phase 1: IDEATE (Vibe Brainstorm)

**Goal**: Generate product concept with zero friction.

**Steps**:
1. **Brain dump** — Describe what you want in plain language. Don't worry about structure.
2. **Market scan** — AI searches for existing products, trends, and gaps.
3. **Angle discovery** — Generate 5-10 unique angles/positioning ideas.
4. **Pick your vibe** — Choose the angle that excites you most. Trust your gut.

**Director checkpoint**: Review angles, pick ONE direction. Everything else gets parked.

**Output artifact**: `{project_dir}/00-ideation.md`

```markdown
# Ideation: {Product Name}

## Brain Dump
{Raw ideas, unfiltered}

## Market Scan
{Existing products, trends, gaps discovered}

## Angles Explored
1. {Angle 1 — description, why it could work}
2. {Angle 2 — description, why it could work}
...

## Chosen Direction
**Angle**: {Selected angle}
**Why**: {Gut feeling + data backing}

## Parked Ideas
- {Ideas to revisit later}
```

---

### Phase 2: ARCHITECT (Define the Blueprint)

**Goal**: Create a clear product specification without writing any code/content yet.

**Steps**:
1. **Define deliverables** — What exactly ships? (files, pages, assets)
2. **Define audience** — Who is this for? What's their pain point?
3. **Define value prop** — One sentence: "This helps {who} do {what} by {how}."
4. **Define scope** — What's in v1? What's NOT in v1? (Ruthlessly cut.)
5. **Define stack** — What tools/technologies will be used?

**Director checkpoint**: Review scope. If it takes more than 1-2 sessions to build, scope is too big. Cut.

**Output artifact**: `{project_dir}/01-architecture.md`

```markdown
# Architecture: {Product Name}

## Deliverables
- [ ] {Deliverable 1 — file/asset description}
- [ ] {Deliverable 2}
...

## Target Audience
**Who**: {Specific person/segment}
**Pain**: {Their core frustration}
**Current alternatives**: {What they do now}

## Value Proposition
> {One sentence value prop}

## Scope
### In v1
- {Feature/content 1}
- {Feature/content 2}

### NOT in v1 (parked)
- {Future feature 1}
- {Future feature 2}

## Stack / Tools
- {Tool/technology 1 — why}
- {Tool/technology 2 — why}
```

---

### Phase 3: BUILD (Full AI Trust Execution)

**Goal**: Let AI generate the product. Minimal manual intervention.

**Steps**:
1. **Prompt the build** — Give AI the architecture doc and say "build this."
2. **Trust the output** — Don't micromanage. Let it generate.
3. **Batch review** — Review output in batches, not line-by-line.
4. **Course correct only when necessary** — Fix direction, not details.
5. **Iterate rapidly** — If something's off, describe the fix in plain language. Don't manually edit.

**Director rules during BUILD**:
- ❌ Don't read every line of generated code/content
- ❌ Don't manually edit AI output (describe the fix instead)
- ✅ Do review the overall structure and flow
- ✅ Do test/preview the output
- ✅ Do provide feedback as natural language corrections

**Output**: The actual product files, generated in `{project_dir}/`

---

### Phase 4: REFINE (Quality Gate)

**Goal**: Human-in-the-loop review before publishing.

**Steps**:
1. **Full preview** — See/test the complete product as an end user would.
2. **Accuracy check** — Verify facts, numbers, claims (AI can hallucinate).
3. **Brand check** — Does it match your voice, style, and quality bar?
4. **Edge cases** — Test unusual inputs, edge scenarios.
5. **Polish pass** — AI handles grammar, formatting, visual polish.

**Quality gate checklist**:
```markdown
## Quality Gate: {Product Name}

- [ ] Full preview completed
- [ ] All facts/numbers verified
- [ ] Brand voice consistent
- [ ] No placeholder content remaining
- [ ] Edge cases tested
- [ ] Visual/formatting polish done
- [ ] Ready for publish? → PROCEED / BLOCK ({reason})
```

**Output artifact**: `{project_dir}/02-quality-gate.md`

---

### Phase 5: LAUNCH (Ship It)

**Goal**: Package and publish the product.

**Steps**:
1. **Package** — Organize files, create README, add metadata.
2. **Distribution** — Push to platform (Gumroad, landing page, Twitter, etc.)
3. **Marketing blast** — Create launch content (threads, posts, emails).
4. **Announce** — Publish across all channels simultaneously.

**Director checkpoint**: Final "go/no-go" decision before publish.

**Output artifacts**:
- `{project_dir}/README.md` — Product description and usage
- `{project_dir}/03-launch-plan.md` — Distribution and marketing plan

```markdown
# Launch Plan: {Product Name}

## Distribution Channels
- [ ] {Channel 1 — platform, link}
- [ ] {Channel 2}

## Marketing Content
### Twitter Thread
{Draft thread}

### Other Channels
{Draft content for other platforms}

## Launch Checklist
- [ ] Product files finalized
- [ ] Landing page live
- [ ] Payment/download link tested
- [ ] Marketing content scheduled
- [ ] Announced on all channels
```

---

### Phase 6: COMPOUND (Knowledge Capture)

**Goal**: Extract learnings and reusable components for future products.

**Steps**:
1. **Retrospective** — What worked? What didn't? What surprised you?
2. **Extract patterns** — Identify reusable templates, prompts, or workflows.
3. **Update knowledge base** — Add to your wiki/knowledge graph.
4. **Archive** — Commit everything, update project status in tracking tools.

**Output artifact**: `{project_dir}/04-retrospective.md`

```markdown
# Retrospective: {Product Name}

## Timeline
- Started: {date}
- Shipped: {date}
- Total effort: {estimate}

## What Worked
- {Thing 1}

## What Didn't Work
- {Thing 1}

## Surprises
- {Thing 1}

## Reusable Patterns
- {Template/prompt/workflow to extract for reuse}

## Knowledge Base Updates
- [ ] {Added to wiki: topic X}
- [ ] {Updated: template Y}

## Metrics (if applicable)
- Downloads: {N}
- Revenue: {N}
- Engagement: {N}
```

---

## Quick Start — New Product

When the user says "start a new product" or similar, run this sequence:

1. **Create project directory**: `projects/{product-slug}/`
2. **Generate Phase 1 ideation doc**: Run brainstorm, populate `00-ideation.md`
3. **Wait for director review** (request user feedback)
4. **Generate Phase 2 architecture**: Populate `01-architecture.md`
5. **Wait for director review** (request user feedback)
6. **Execute Phase 3 build**: Generate all product files
7. **Run Phase 4 quality gate**: Generate `02-quality-gate.md`, present checklist
8. **Execute Phase 5 launch**: Generate `03-launch-plan.md` and marketing content
9. **Run Phase 6 compound**: Generate `04-retrospective.md`, update knowledge base

## Integration Points

- **Notion**: Update worklog and project tracking after each phase
- **Git**: Commit after each phase with conventional commit messages
- **Graphify**: Update knowledge graph after Phase 6
- **Twitter**: Use launch content for social distribution

## Principles to Remember

| Karpathy Principle | Application |
|---|---|
| "Trust the system" | Don't micromanage AI output. Review in batches. |
| "Director, not typist" | Define vision and constraints. AI executes. |
| "Look again" | The AI capability shift is real. Don't underestimate current models. |
| "Knowledge compounding" | Every project feeds your wiki. Build understanding. |
| "Understanding is yours" | AI doesn't understand—you do. That's your unique value. |
| "Vibe coding" | Start with vibes. Let intuition guide, then validate. |

---

*Inspired by Andrej Karpathy's insights on the evolution of programming and AI-assisted development.*
