# Structured Output for Agent Systems（结构化输出与校验恢复策略）

## 目的

Structured Output 指的是：模型输出不是“自由文本”，而是**满足预期 schema 的结构化对象**（通常是 JSON shape），并在运行时通过校验（validation）保证下游步骤可以可靠使用。

**结构化输出的价值在于：把“解析失败”变成“可处理的校验失败”。**

**TypeScript 类型只能表达设计期契约；模型输出来自运行时，因此必须经过 parse + validation 后才能进入系统逻辑。**

## 为什么它对 Agent Core 是必需的

Agent 系统需要把输出用于多种用途：

- 作为下一步 router 的状态输入（workflow/router）
- 作为 tool request 的参数输入（tool calling）
- 作为 final answer 的可展示结构（用户交付）

如果输出不可预测，系统只能靠脆弱的字符串解析与大量 if/else。

**Structured Output 把“可预测性”前置，让 workflow 与 guardrails 能在确定的契约上工作。**

## 输出契约（Output Contracts）

建议你将 structured output 拆成两层：

### 1) 形状（Shape）

- 需要哪些字段
- 字段类型（string/number/boolean/object/array）
- 枚举与取值范围
- 必填/可选字段策略

### 2) 语义约束（Invariants）

除了类型，还要定义不变量，例如：

- `action.type` 与其他字段的组合关系
- 时间字段必须满足格式/范围
- 工具调用相关字段在 `action.type = "tool_call"` 时必须存在

**schema 负责形式约束，invariants 负责业务语义约束。**

## Minimal Example（最小结构化例子）

下面给一个“你一眼就能看懂”的最小 Agent action 结构：它同时覆盖 `type` 判别字段、`tool_call` 结构、`error` 的恢复策略入口。

```ts
type AgentAction =
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

关键说明（按这个理解你就不会跑偏）：

- **`type` 是判别字段**：决定你应该把对象当作哪一种分支来处理
- **`tool_call` 必须携带 `toolName` 和 `args`**：否则 tool calling layer 无从执行
- **`final` 只需要交付结果**：用于用户交付/结束 workflow
- **`error` 用于进入 retry / fallback / stop 分支**：把失败变成策略输入，而不是“日志”

## 典型设计：用 discriminated union 做行动选择

在多步系统里，一个常见 structured decision 形状是：

- `action.type` 用于区分下一步（例如：`tool_call` / `final` / `error`）
- 不同 `type` 对应不同字段集合

这样你可以：

- 在解析阶段完成类型收敛（类型守卫 / exhaustiveness）
- 在 workflow/router 阶段做明确转移

## 校验策略（Validation & Repair）

模型输出可能失败，所以你需要一个可复用的恢复流程。

### 失败定义

校验失败通常包含：

- JSON 结构不合法（无法解析）
- schema mismatch（字段缺失/类型不匹配/枚举不一致）
- invariants 失败（虽然类型正确但违反业务约束）

### 恢复策略（Policies）

建议你至少支持两类 policy：

- retry：把“校验错误 + 期望 schema”反馈给模型，要求重试生成
- fallback/stop：如果失败不可恢复（例如模型持续输出无效结构），选择 stop 或 fallback（给出安全降级结果）

**不要把“失败”默默吞掉；failure 必须被记录并驱动策略分支。**

### 推荐的恢复判断逻辑（工程化）

把“parse / schema / invariant fail”映射到不同的策略：

- **JSON parse fail（无法解析 JSON）**：优先 **retry**
- **schema mismatch（字段缺失/类型不匹配/枚举不一致）**
  - 优先 **retry**（并带上期望 schema 与失败原因）
  - 超过阈值后：fallback/stop，避免反复“猜对也猜错”
- **invariant fail（语义约束不成立）**
  - 视业务决定 retry 或直接 **stop**
  - **高风险动作宁可 stop，不要盲目 retry 到通过**

## 与 Tracing / Evals 的关系

Structured Output 为 eval 提供了稳定对比对象。

建议你在 tracing 里保留：

- raw model output（原始输出）
- validation result（通过/失败，失败原因）
- repair steps（重试次数与每次失败原因）
- final validated output（最终可用结构）

最小 eval 思路：

- schema compliance：输出是否能被验证通过
- routing correctness：action.type 是否与期望一致
- tool request correctness（与 tool calling 联动）

## 与 Tool Calling / Workflow 的联动

- Tool Calling 依赖 structured output 来形成 `tool name + tool arguments` 的稳定输入。
- Workflow/router 依赖 structured output 来决定状态转移。

因此 **Structured Output 是 Agent Core 的“契约底座”。**

## 本文档与路线图的对应关系

- 对应 roadmap：Stage 1 — Agent Core
- 对应 exercises：
  - `exercises/03-structured-output`
  - `exercises/07-guardrails`（校验失败与策略）
  - `exercises/06-logging-tracing`（evidence 记录）

## Common Failure Modes（常见失败模式）

这部分是贴近真实工程的问题集合：模型可能“看起来像对的”，但对 agent loop/route 来说就是错的。

- **模型输出了自然语言解释，而不是对象**
  - 表现：无法 parse 或 schema validation 失败
  - 处理：优先 retry，并在失败反馈里明确“必须输出指定结构”
- **JSON 可解析，但字段名不符合契约**
  - 表现：schema mismatch（字段缺失/拼写错误/类型不匹配）
  - 处理：优先 retry；超过阈值 fallback/stop
- **`action.type` 正确，但缺失对应字段**
  - 表现：invariant fail（例如 `type="tool_call"` 却没有 `toolName/args`）
  - 处理：视业务选择 retry 或 stop（高风险动作宁可 stop）
- **字段类型正确，但业务语义不成立**
  - 表现：invariant fail（例如当前业务状态不允许该动作）
  - 处理：**通常应该 stop 或走明确 fallback**，而不是无限 retry
- **模型生成了多余字段，影响后续路由判断**
  - 表现：部分解析策略对 unknown 字段不稳，导致 router 行为偏离预期
  - 处理：在 schema 层控制 unknown policy，并记录 evidence

## 检查清单（可用于自检）

- [ ] 我定义了输出 schema，并且区分了 required/optional
- [ ] 我用 structured decision（例如 action.type）驱动 workflow/router
- [ ] 我能解释“schema fail”与“invariant fail”的差别
- [ ] 我有明确的 retry / fallback / stop policy
- [ ] 我在 tracing 里记录了 raw output 与 validation errors

