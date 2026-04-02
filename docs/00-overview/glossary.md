# Glossary (Key Terms)

This glossary is intentionally small and operational: definitions should help you make design decisions while building.
这个词汇表是故意小而实用的：定义应该帮助你在构建时做出设计决策。

## Agent
An application that can decide what to do next (plan/choose actions), call tools when needed, and produce an outcome with an explicit structure. In practice, an “agent” is usually a loop: `model -> decide -> tools -> observe -> model`.
一个可以决定下一步做什么（计划/选择行动）、需要时调用工具并产生具有明确结构的结果的应用程序。实际上，一个“agent”通常是一个循环：`model -> decide -> tools -> observe -> model`。

## Tool Calling
A pattern where the model can request an external function/tool, and the system executes that tool with validated inputs, then feeds the tool results back to the model. Good tool calling designs separate “tool schemas” from “agent reasoning.”
一个模式，其中模型可以请求外部函数/工具，系统执行该工具并使用验证后的输入，然后将工具结果反馈给模型。良好的工具调用设计将“工具模式”与“agent推理”分开。

## Structured Output
Producing outputs in a predictable format (commonly JSON) that match a schema. The system validates the output so downstream steps can rely on invariants instead of parsing free-form text.
产生在可预测格式（通常是JSON）中输出的模式，该格式与模式匹配。系统验证输出，以便下游步骤可以依赖不变量而不是解析自由格式文本。

## Workflow
An orchestration mechanism that controls agent steps as a state machine or router. Workflows reduce chaos by making transitions explicit and tying each step to a verifiable contract.
一个编排机制，控制agent步骤作为状态机或路由器。工作流通过显式过渡和将每个步骤绑定到可验证的合同来减少混乱。

## Guardrails
System rules that prevent unsafe or invalid behavior, often implemented as input/output validation, invariant checks, allow/deny policies, and fallback strategies. Guardrails make failure modes explicit.
系统规则，防止不安全或无效的行为，通常作为输入/输出验证、不变量检查、允许/拒绝策略和回退策略实现。Guardrails使失败模式明确。

## Tracing
Capturing intermediate records of decisions, tool calls, and outcomes for later debugging and evaluation. Tracing should be structured enough to support replay-like analysis.
记录决策、工具调用和结果的中间记录，以便稍后进行调试和评估。追踪应该足够结构化以支持回放式分析。

## Evals
Regression checks for agent behavior: correctness checks, schema compliance checks, and quality checks (often with curated test cases). Evals help you know whether changes improve or degrade behavior.
回归检查agent行为：正确性检查、模式合规检查和质量检查（通常带有精选的测试用例）。评估帮助您了解更改是否改善或恶化行为。

## RAG (Retrieval-Augmented Generation)
A pipeline that retrieves relevant documents (chunks) and provides them as context to the model, so answers are grounded in sources. Minimal RAG still needs chunking, retrieval, and “grounding” in the answer.
一个管道，检索相关文档（片段）并将其作为上下文提供给模型，因此答案建立在来源之上。最小RAG仍然需要分块、检索和“ grounding” 在答案中。

## Memory
State persistence beyond a single request, such as conversation history, user preferences, tool state, or long-term facts. Good memory design makes storage, update strategy, and retrieval strategy explicit.
状态持久化超过单个请求，例如对话历史、用户偏好、工具状态或长期事实。良好的内存设计使存储、更新策略和检索策略明确。