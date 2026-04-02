# Roadmap (AI Agent Engineer)

This roadmap is stage-based: each stage ends with a concrete deliverable and a set of verification checkpoints.

## Stage 0 — Baseline Engineering

Goal: get reliable fundamentals so later agent work is reproducible.

Key capabilities:
- TypeScript fundamentals for agent systems
- async/await and concurrency-safe patterns
- schema validation at boundaries (inputs/outputs)
- API fundamentals and HTTP ergonomics

Primary exercises (later):
- `exercises/01-ts-basics`
- `exercises/02-schema-validation`

Definition of done:
- You can define inputs/outputs with schemas and validate them.
- You can run a small deterministic agent loop without hidden failures.

## Stage 1 — Agent Core (Build the “agent loop”)

Goal: implement core building blocks you can reuse across projects.

Key capabilities:
- Tool Calling (select tools, call tools, handle tool results)
- Structured Output (predictable JSON shape, schema-aligned outputs)
- Workflow orchestration (state machine / router style control)
- Guardrails (input/output safety checks, fallbacks, invariants)
- Tracing (visibility into decisions, tool calls, and failures)
- Evals (basic correctness checks, regression prevention)

Primary exercises (later):
- `exercises/03-structured-output`
- `exercises/04-tool-calling`
- `exercises/05-workflow-router`
- `exercises/06-logging-tracing`
- `exercises/07-guardrails`

Definition of done:
- Every agent run produces trace logs (and can be replayed conceptually).
- Tool calls are type-safe and validation is enforced at boundaries.
- Failures are handled with explicit policies (retry/fallback/stop).

## Stage 2 — RAG & Memory (Get “state” and “knowledge”)

Goal: integrate retrieval and memory as first-class system components.

Key capabilities:
- Minimal RAG (chunking, retrieval, grounded answering)
- Memory minimal patterns (conversation state, tool state, persistence strategy)
- Evaluation mindset for retrieval quality (basic metrics / sanity checks)

Primary exercises (later):
- `exercises/08-rag-minimal`
- `exercises/09-memory-minimal`

Definition of done:
- You can explain what the agent knows vs. what it retrieves.
- You can show at least one retrieval failure mode and the mitigation.

## Stage 3 — Stage Projects (Milestones)

These projects are “portfolio-grade” checkpoints. Each stage project should link back to the relevant exercises/docs.

### `projects/stage-01-task-assistant`
Focus:
- end-to-end agent loop with tool calling + structured output
- tracing and guardrails in the happy and failure paths
- basic evals for structured correctness

### `projects/stage-02-research-agent`
Focus:
- retrieval (minimal RAG) + memory basics
- workflow router that adapts across steps
- clear evaluation plan and iteration notes

## How to Use This Roadmap

For each exercise/project:
- start with the smallest runnable loop
- enforce schema validation at model boundaries
- add tracing before adding advanced features
- write down assumptions and expected failure modes

