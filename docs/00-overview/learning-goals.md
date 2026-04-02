# Learning Goals & Completion Criteria
# 学习目标和完成标准

This file defines what “done” means for each stage. The intent is to reduce subjective progress tracking and make review straightforward.
这个文件定义了每个阶段的“完成”意味着什么。意图是减少主观进度跟踪并使审查变得简单。

## Stage 0 — Baseline Engineering
## 阶段0 — 基础工程

What you should be able to do:
- Model I/O with explicit schemas and validate at boundaries.
- Handle async flows safely (avoid hidden race conditions).
- Build small request/response pipelines with clear error handling.

Completion criteria:
- For at least one example, inputs and outputs are both schema-validated.
- You can explain where validation happens (pre-model vs post-model).
- You can demonstrate one failure mode and the chosen mitigation strategy.

Expected artifacts:
- Notes in `docs/01-foundations/` (one concept note per core topic).
- Exercises in `exercises/01-ts-basics` and `exercises/02-schema-validation`.

什么是你应该能够做到的：
- 使用显式模式和边界验证模型I/O。
- 安全地处理异步流（避免隐藏的竞争条件）。
- 构建具有清晰错误处理的请求/响应管道。

完成标准：
- 对于至少一个示例，输入和输出都被模式验证。
- 您可以解释验证发生在哪里（预模型 vs 后模型）。
- 您可以演示一种失败模式和所选的缓解策略。

预期产出：
- 文档中的 `docs/01-foundations/`（每个核心主题一个概念笔记）。
- 练习中的 `exercises/01-ts-basics` 和 `exercises/02-schema-validation`。


## Stage 1 — Agent Core
## 阶段1 — Agent Core

What you should be able to do:
- Implement a reusable agent loop (LLM -> decide -> tool call -> observe -> respond).
- Ensure outputs follow a predictable structured schema.
- Add a workflow/router abstraction to manage multi-step behavior.
- Add guardrails and explicit policies for invalid states.
- Add tracing for decisions, tool calls, and failure paths.
- Add basic evals to prevent regressions.

Completion criteria:
- A single “agent run” always yields traceable artifacts (logs/records you can reason about).
- Tool calls are guarded (typed inputs + validated tool outputs).
- Structured outputs are validated and failure recovery is explicit.

Expected artifacts:
- Exercises: `03-structured-output` through `07-guardrails`.
- Stage project: `projects/stage-01-task-assistant` as the integrated checkpoint.

什么是你应该能够做到的：
- 实现一个可重用的agent循环（LLM -> decide -> tool call -> observe -> respond）。
- 确保输出遵循可预测的结构模式。
- 添加工作流/路由抽象以管理多步骤行为。
- 添加guardrails和显式策略以处理无效状态。
- 添加追踪以记录决策、工具调用和失败路径。
- 添加基本评估以防止回归。

完成标准：
- 单个“agent运行”始终产生可追踪的工件（您可以推理的日志/记录）。
- 工具调用受到保护（类型化输入 + 验证的工具输出）。
- 结构化输出被验证且失败恢复是显式的。

预期产出：
- 练习：`03-structured-output` 到 `07-guardrails`。
- 阶段项目：`projects/stage-01-task-assistant` 作为集成的检查点。


## Stage 2 — RAG & Memory
## 阶段2 — RAG & Memory

What you should be able to do:
- Build minimal retrieval and grounding flows.
- Make memory/persistence choices explicit (session memory vs stored memory).
- Evaluate retrieval failure modes and mitigations.

Completion criteria:
- You can describe “source of truth” for answers: model vs retrieved evidence.
- You can show a retrieval failure mode and the fallback behavior.

Expected artifacts:
- Exercises: `08-rag-minimal` and `09-memory-minimal`.
- Stage project: `projects/stage-02-research-agent`.

什么是你应该能够做到的：
- 构建最小检索和接地流。
- 显式选择内存/持久性（会话内存 vs 存储内存）。
- 评估检索失败模式和缓解措施。

完成标准：
- 您可以描述答案的“真相来源”：模型 vs 检索证据。
- 您可以显示一种检索失败模式和回退行为。

预期产出：
- 练习：`08-rag-minimal` 和 `09-memory-minimal`。
- 阶段项目：`projects/stage-02-research-agent`。


## Stage Review Checklist (applies to exercises & projects)
## 策略审查清单（适用于练习和项目）

- Inputs/outputs are defined and validated.
- Error handling is explicit (retry/fallback/stop are documented).
- Tracing exists before advanced orchestration grows.
- Assumptions and known limitations are written down.
- There is at least one targeted eval or regression check (even if minimal).

什么是你应该能够做到的：
- 输入/输出被定义和验证。
- 错误处理是显式的（重试/回退/停止被记录）。
- 追踪在高级编排之前存在。
- 假设和已知限制被写下来。
- 至少有一个目标评估或回归检查（即使是最小的）。

完成标准：
- 输入/输出被定义和验证。

