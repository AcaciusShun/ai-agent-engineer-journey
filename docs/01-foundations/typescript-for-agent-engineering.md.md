# TypeScript for Agent Engineering

下面这份笔记是“工程视角”的 TypeScript 用法说明：**把类型当作契约，把 schema 当作安全网。**

## 1. Why TypeScript matters in Agent Engineering

前端/Node 工程师在普通 CRUD 场景里，JS 可能也能跑；但在 Agent 场景里，系统会不断处理不可信边界：
- **模型输出（model output）往往是字符串/自由文本，但系统需要结构化状态（structured state）**
- **工具参数（tool arguments）来自模型意图，必须可验证**
- **workflow 状态流转（workflow state transitions）需要可追踪且可收敛**

因此你不能只靠 JS 的“运行时碰运气”。**TypeScript 的作用是让“边界契约”先在设计期收敛，减少隐藏失败和不可复现。**

最小例子（用 discriminated union 表达“下一步是什么”）：

```ts
type StepResult =
  | { type: "tool_call"; toolName: string; args: Record<string, unknown> }
  | { type: "final"; output: string }
  | { type: "error"; reason: string };
```

## 2. Real problems TypeScript helps solve

这里直接列“Agent 工程里你会遇到的坑”，以及 TypeScript 如何提前拦住它们：
- **模型输出是 free-form text，但系统需要结构化数据（structured data）**，否则 workflow 会在不可预测的分支崩掉
- **tool 参数来自模型意图**，没有类型约束就容易出现“看起来能跑但语义错了”的情况
- **workflow 状态流转需要可追踪和可收敛**，否则每一步都在猜“下一步应该长什么样”
- **错误模型（error model）需要结构化**，不能只靠日志；否则 retry / fallback / stop 的策略无法确定

最小例子（定义工具入参/出参契约）：

```ts
type ToolCall = {
  toolName: "search";
  args: { query: string; topK: number };
};
```

## 3. Compile-time vs Runtime

这部分必须保留。

- **TS 只在编译期（compile-time）生效**
- **运行时要靠 schema validation（例如 zod）**
- **“类型系统不是安全系统（type system is not a safety system）”**

最小例子（先 `parse`，再 `schema validation`，最后进入业务流程）：

```ts
import { z } from "zod";

const StepSchema = z.union([
  z.object({ type: z.literal("tool_call"), toolName: z.string(), args: z.record(z.unknown()) }),
  z.object({ type: z.literal("final"), output: z.string() }),
  z.object({ type: z.literal("error"), reason: z.string() }),
]);

// 模型返回的是 JSON 字符串：先 parse，再用 schema 校验，最后再进入业务流程
const rawJson: string = modelJsonString;
const raw = JSON.parse(rawJson);
const step = StepSchema.parse(raw); // runtime verified
```

## 4. Type patterns for Agent systems

下面这些类型模式（Type patterns）是 Agent 系统里最常复用、也最能提高可维护性的部分：

### 4.1 discriminated union（判别联合）

用 `type` 字段把“下一步动作”分支显式化，配合 **exhaustive check** 避免分支遗漏。

### 4.2 generic result model（Result<T}）

用 `Result<T>`/`Validated<T>` 这类模型，把“成功/失败”和“失败原因”结构化。

### 4.3 type guards（类型守卫）

当分支需要根据字段判断具体形状时，用 type guard 让 TS 推断落到正确类型上。

### 4.4 async result / error model

Agent 工程里几乎都是异步边界（模型调用、工具执行、网络 IO）。你需要结构化错误，才能在 workflow/router 里做确定策略分支。

### 4.5 state shape design（状态形状设计）

把 workflow 的状态（state）设计成稳定结构：每一步只读取/写入自己负责的字段范围。

最小例子（你指定要放的 Result<T> + discriminator）：

```ts
type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

type StepResult =
  | { type: "tool_call"; toolName: string; args: Record<string, unknown> }
  | { type: "final"; output: string }
  | { type: "error"; reason: string };
```

## 5. What I need to master now

只列当前阶段必须掌握的内容，避免为了 TypeScript 而 TypeScript：
- `type / interface`
- `union`
- `Promise / async`
- function return types（尤其是明确 Promise 的返回形状）
- basic generic reading（能看懂并能正确用）
- **zod 配合使用（运行时验证）**

最小例子（一个 zod + Promise 返回类型的最小边界）：

```ts
import { z } from "zod";

const InputSchema = z.object({ query: z.string() });
type Input = z.infer<typeof InputSchema>;

async function handle(inputJson: string): Promise<{ answer: string }> {
  const input = InputSchema.parse(JSON.parse(inputJson)); // runtime verified
  return { answer: `Echo: ${input.query}` };
}
```

## 6. What I do not need to over-learn yet

这些方向容易让你跑偏：**把时间花在“类型体操”上，而不是构建可验证的 agent 契约。**
- advanced type gymnastics（高级类型体操）
- complex conditional types（复杂条件类型深挖）
- decorator / metadata 深水区
- 为了 TS 而 TS

最小反例（反例只是提醒：现在别沉迷这种推导炫技）：

```ts
// 仅作为“不要沉迷”的反例：复杂条件类型会显著降低可维护性
type OverEngineering<T> = T extends infer U ? U : never;
```

## 7. How this repo will use TypeScript

这一节要把“学习 -> 文档 -> 仓库落地”连起来：

- `exercises/` 里会把 TypeScript 当作 **契约表达工具**：
  - 先用类型把边界形状写清楚
  - 再用 zod 在运行时校验（runtime validation）
- `projects/` 里会把 TypeScript 当作 **系统组织工具**：
  - 用结构化 state 管 workflow/router
  - 用结构化 error model 驱动 retry / fallback / stop
  - 用 tracing/evals 形成可回归的证据链

后续深入方向：
- `docs/01-foundations/`：把常用模式固化成可复用的笔记
- `docs/02-agent-core/`：structured output / tool calling 的契约细化
- `docs/03-rag-memory/`：把检索证据与记忆状态也纳入 schema

最小例子（把“目录职责”写成可执行的索引点）：

```ts
// 你可以把下面当作学习路标（不是代码依赖）
const repoIndex = {
  exercises: ["01-ts-basics", "02-schema-validation", "03-structured-output", "04-tool-calling"],
  projects: ["stage-01-task-assistant", "stage-02-research-agent"],
};
```

