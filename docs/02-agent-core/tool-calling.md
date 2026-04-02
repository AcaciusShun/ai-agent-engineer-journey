# Tool Calling for Agent Systems（工具调用契约与策略）

## 目的

Tool Calling 的目标是：让模型能够请求外部工具（tool），并让系统以“**可验证的输入 + 可观测的执行结果**”完成调用，再把结果反馈给模型继续推理。

**Tool Calling 必须把“模型的意图（request）”与“系统的副作用（execution）”解耦。**

**TypeScript 类型只能表达设计期契约；模型/工具参数来自运行时，因此必须 parse + validation（例如 zod）后才能进入 tool execution。**

## 核心工作流（mental model）

一个完整的 tool 调用通常按这个顺序发生：

1. LLM 生成 tool request（包含 tool 名称 + 参数）
2. 系统解析并进行输入校验（schema validation / invariants）
3. 系统执行对应工具函数（side effects）
4. 系统把 tool result（成功/失败、结构化结果）作为证据反馈给模型
5. LLM 生成后续输出（可能继续调用其他工具，或给出 final answer）

**每个步骤都应产生结构化记录，以便 tracing 与 evals。**

## Tool 的数据契约（Data Contracts）

建议你把“工具契约”当作一等公民来设计。

### Tool Definition

最低应包含：

- tool 名称（稳定、唯一）
- 输入 schema（tool input schema）
- 输出 schema（tool output schema，可选但强烈建议）
- 失败行为约定（errors / retryable / fallback）

### Tool Invocation Record

最低应记录：

- request：原始模型参数与解析后的参数（解析失败也要记录）
- validation：通过/失败原因（validation errors）
- execution：执行耗时、返回值或异常（raw + structured）
- policy：本次使用了什么策略（retry / fallback / stop）

**tracing 的意义在于：你能回答“为什么这一步走了这条路径”。**

## Minimal Example（最小工具调用结构）

下面用一个 discriminated union 把“下一步动作是什么”说清楚：`tool_call` 负责描述请求，`error` 负责把失败变成可进入的策略分支。

```ts
type ToolRequestAction =
  | {
      type: "tool_call";
      toolName: string;
      args: Record<string, unknown>;
    }
  | {
      type: "final";
      message: string;
    }
  | {
      type: "error";
      reason: string;
      recoverable: boolean;
    };
```

关键说明：

- **`type` 是判别字段**：路由决定走哪条分支（并影响后续 workflow/router）
- **`tool_call` 必须携带 `toolName` 和 `args`**：否则工具层无从执行
- **`error` 用于进入 retry / fallback / stop**：让失败有策略入口，而不是只留日志

## 输入校验：把不确定性压到边界层

模型输出不可靠的事实不会消失，所以你需要：

- 先做 JSON parse（如果模型输出是字符串）
- 再做 schema validation（例如 zod），把非法参数拦截在 tool layer 之前
- 对于校验失败，优先尝试恢复（retry with error feedback），或直接 stop/fallback

**不要让“错误参数”进入真实副作用执行层。**

## Common Failure Modes（常见失败模式与策略）

建议你把失败按“可以修复的契约错误”和“高风险/不可修复的执行错误”分开处理，这样 retry/fallback/stop 才有工程依据。

### 推荐的恢复判断逻辑（工程化）

- JSON parse fail：优先 **retry**（要求模型输出正确结构）
- schema mismatch（字段缺失/类型不匹配/枚举不一致）：优先 **retry**；超过阈值后 **fallback/stop**
- invariant fail（业务语义不成立：例如权限不足、read-only 约束、当前状态不允许该动作）：**通常 stop 或明确 fallback**
- runtime fail（工具网络/权限/业务错误）：看错误是否 retryable；可恢复则 retry，不可恢复则 fallback/stop
- timeout / 资源耗尽：倾向 **stop 或 fallback**，并记录 evidence

按严重程度分层，你可以用同一套 policy 统一处理：

- 模型给了不存在的 tool
  - Detection：tool name 不在 registry
  - Policy：stop 或 fallback（例如要求模型改用可用工具；高风险动作宁可 stop）
- 模型参数不符合 schema
  - Detection：输入校验失败（类型/必填字段缺失/枚举不匹配）
  - Policy：retry（把校验错误反馈给模型）；超过阈值后 fallback/stop
- 模型输出了语义上不成立的动作（invariant fail）
  - Detection：字段齐全但与业务状态/权限规则冲突（例如当前状态不允许该工具）
  - Policy：通常 stop 或明确 fallback（避免无限 retry）
- 工具执行失败（网络/权限/业务错误）
  - Detection：工具抛出异常或返回错误对象
  - Policy：retry（若可重试）或 fallback（使用替代策略）或 stop
- 超时 / 资源耗尽
  - Detection：timeout 触发
  - Policy：stop 或 fallback（并记录 evidence）

**策略不是“写死重试次数”，而是把失败原因映射到可解释的处置路径。**

## 副作用（side effects）与可重复性

Tool Calling 往往会触发真实世界副作用（写数据库、发邮件、下单）。

建议你：

- 对副作用工具建立幂等（idempotency）或至少建立去重策略（后续在 Guardrails 里再细化）
- 把可读操作（read-only）与可写操作（write）分开处理
- 确保每次执行都有 trace evidence（例如 request id / transaction id）

## 与其他核心能力的关系

- 与 `Structured Output`：tool request 与 final answer 都需要结构化形状，才能被系统稳定解析。
- 与 `Workflow / Router`：tool 调用通常发生在多步状态机中，路由控制需要明确的状态与转移条件。
- 与 `Tracing`：tool 调用的中间证据必须被记录，才能做 debug / eval。
- 与 `Guardrails`：失败模式与策略由 guardrails 统一管理。

## 本文档与路线图的对应关系

- 对应 roadmap：Stage 1 — Agent Core
- 对应 exercises：
  - `exercises/04-tool-calling`
  - `exercises/06-logging-tracing`（证据记录）
  - `exercises/07-guardrails`（策略与失败模式）
  - `exercises/05-workflow-router`（多步状态流转）

## 检查清单（可用于自检）

- [ ] tool request 能被稳定解析（结构化字段存在且可校验）
- [ ] tool input schema 在运行时校验并能解释失败原因（区分 schema fail vs invariant fail）
- [ ] 每次工具执行都有 tracing 记录（含失败与 policy）
- [ ] 至少覆盖一种失败模式（schema fail 或 runtime fail）
- [ ] 我能解释“为什么继续调用/停止/回退”的策略依据

