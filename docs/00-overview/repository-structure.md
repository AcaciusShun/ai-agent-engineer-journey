# Repository Structure

This repo is designed to support three use cases:

1. Learning route & progress tracking
2. Knowledge accumulation (concepts + explanations + retrospectives)
3. Experimentation with small runnable artifacts that scale into stage projects

## Top-Level Directories

### `docs/`
Topic documentation and stage-oriented roadmaps.

Recommended pattern:
- `docs/00-overview/` : global navigation docs (roadmap, goals, glossary, structure)
- `docs/01-foundations/` : TypeScript/engineering fundamentals
- `docs/02-agent-core/` : agent loop, tool calling, structured outputs, workflow/router, guardrails, tracing, evals
- `docs/03-rag-memory/` : RAG, retrieval, memory/persistence, grounding
- `docs/99-retrospectives/` : post-mortems and “what I would do differently”

### `journal/`
Daily learning logs. Each `day-XX.md` should capture:
- baseline knowledge (what you already know)
- objective (what you attempted)
- outcomes (what worked / what didn’t)
- problems & next actions

### `exercises/`
Single-point practice tasks with focused deliverables.

Rules of thumb:
- Keep scope small and verifiable.
- Every exercise should produce something you can show (a write-up, a checklist, a runnable example later).
- Link the learning back to `docs/` concepts and stage goals.

### `projects/`
Stage projects as portfolio milestones.

Rules of thumb:
- Projects integrate multiple core capabilities (tracing, guardrails, structured outputs, workflow).
- Projects should include an explicit evaluation plan (even minimal).
- Projects should have a short README explaining architecture and decisions.

### `templates/`
Reusable markdown templates:
- daily logs
- concept notes
- project READMEs

### `assets/`
Diagrams and screenshots used by docs and stage projects.
- `assets/diagrams/` : architecture diagrams, flow diagrams
- `assets/screenshots/` : browser/code screenshots

## Naming Conventions (Practical)

- Filenames: English for stable navigation; use `kebab-case` (`learning-goals.md`).
- Document style: concise, checklist-like, and decision-focused.
- Cross-linking: prefer relative links between `docs/`, `journal/`, `exercises/`, `projects/`.

