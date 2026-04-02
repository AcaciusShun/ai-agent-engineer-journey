# Daily Log — 2026-04-02

## Current baseline

- 仓库结构与导航文档已建立（`docs/00-overview/*`、`journal/*`、`templates/*`）。
- 已把关键概念固化到文档骨架中：`Structured Output`、`Tool Calling`、`Tracing/Evals`、`Guardrails` 的工程视角。
- `exercises/01-ts-basics` 已有 `TaskInput / TaskResult` 的契约与 `parseTaskFromNaturalLanguage(...)` 示例实现，并完成了该目录的独立依赖安装与 mock 运行。

## Objective

1. 让 `docs/02-agent-core/structured-output.md` 和 `docs/02-agent-core/tool-calling.md` 在结构与工程定调上与其它 doc 保持一致（定位更工程化、TS≠runtime safety、最小例子、恢复策略具体化、常见失败模式）。
2. 让 `exercises/01-ts-basics` 具备“真实 ts 文件 + mock 数据 + 可在该目录内运行”的闭环，便于后续把它迁移到 agent loop / workflow/router 中。

## Today I did

- 更新 `docs/02-agent-core/structured-output.md`
  - 加入 `TS≠运行时安全` 的明确定调
  - 增加 `Minimal Example（AgentAction discriminated union）`
  - 把恢复策略细化到 `JSON parse fail / schema mismatch / invariant fail` 的推荐路径
  - 新增 `Common Failure Modes` 以覆盖真实工程中常见输出偏差
- 更新 `docs/02-agent-core/tool-calling.md`
  - 同步 `TS≠运行时安全`、`Minimal Example`
  - 增加 `推荐的恢复判断逻辑（工程化）`，并补充 invariant/runtime/timeout 的策略原则
  - 升级/扩展失败模式为更可执行的 `Common Failure Modes`
- 更新 `docs/01-foundations/typescript-for-agent-engineering.md.md`（保持与仓库“工程视角 + 最小例子 + 不过度钻研”的一致性）
- 在 `exercises/01-ts-basics/` 完成“独立系统”运行闭环
  - 新增 `task-parser.ts`（使用 `zod` 的 runtime validation：safeParse/parse）
  - 新增 `mock-task-inputs.ts`（覆盖 build/research/debug/summarize/other + empty input）
  - 新增 `run-mock.ts`（一键打印每个 mock 输入对应的 `TaskResult`）
  - 补齐该目录 `tsconfig.json`（修复 typecheck 兼容问题）
  - 更新 `exercises/01-ts-basics/README.md` 的“如何运行”说明
  - 在该目录运行 `npm run run:mock` 与 `npm run typecheck`，确认行为与类型检查均可通过

## Outcomes

- 文档层面：`structured-output` 与 `tool-calling` 已形成一致的工程结构（定位、契约、恢复策略、失败模式、检查清单）。
- 练习层面：`exercises/01-ts-basics` 已具备“可运行 + 可验证 + 可复用”的最小闭环，为后续 `Structured Output` / `Tool Calling` 的 exercises 做铺垫。

## Problems encountered

- `tsconfig.json` 初期配置导致 `typecheck` 报 `moduleResolution/node10 deprecated`（TS5107）
  - 处理：调整为当前可用的 `moduleResolution: "Bundler"` 并通过 `npm run typecheck`

## Tomorrow plan

- 开始 `exercises/02-schema-validation/`：
  - 复用你在 doc 中的 `schema vs invariants` 思路
  - 提供一个最小示例：`parse -> validation -> failure recovery`
- 同步更新 `docs/01-foundations/*` 中与 schema validation 相关的概念笔记（保持同样的结构与最小例子策略）

## Links

- `docs/02-agent-core/structured-output.md`
- `docs/02-agent-core/tool-calling.md`
- `docs/01-foundations/typescript-for-agent-engineering.md.md`
- `exercises/01-ts-basics/README.md`
- `exercises/01-ts-basics/task-parser.ts`
- `exercises/01-ts-basics/run-mock.ts`

