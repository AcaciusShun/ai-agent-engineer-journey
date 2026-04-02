# Exercise 01 — TS Basics: Natural Language Task -> Structured Object

## Goal

练习的目标是：用 TypeScript 定义稳定的数据契约（`TaskInput` / `TaskResult` / 结构化任务对象），并实现一个函数把**自然语言任务**转换为结构化对象。

本练习刻意保持“可落地、可验证、可复盘”，为后续的 `Structured Output / Tool Calling` 铺路。

## What you will define

1. `TaskInput`：函数输入契约（自然语言 + 可选元信息）
2. `TaskResult`：函数输出契约（成功/失败分支 + 结构化结果或错误模型）
3. `parseTaskFromNaturalLanguage(...)`：实现自然语言到结构化对象的转换函数

## Design constraints (important)

- **TypeScript 类型只保证“设计期契约”**；你仍然需要在运行时进行校验（例如用 `zod` 或自定义校验器），否则模型/输入依然可能是不可预期的内容。
- 结构化对象应当适合后续 workflow/router：字段要稳定、语义要可判断失败模式（retry/fallback/stop）。

## Minimal data contracts

下面的代码片段是一套“练习版”的契约定义：它包含 `TaskInput`、`TaskResult`，以及一个用于承载解析结果的 `TaskPlan`。

为了避免把依赖污染到仓库其他目录，这个练习使用“文件夹独立系统”的方式：在 `exercises/01-ts-basics/` 里单独初始化了 `package.json` 并安装了 `zod/tsx/typescript`。

相应的可运行实现文件在这里：

- `exercises/01-ts-basics/task-parser.ts`
- `exercises/01-ts-basics/mock-task-inputs.ts`

你可以直接用下面方式查看输出结构（`TaskResult`）：

```ts
import { mockTaskInputs, mockEmptyInput } from "./mock-task-inputs";
import { parseTaskFromNaturalLanguage } from "./task-parser";

const allInputs = [...mockTaskInputs, mockEmptyInput];
for (const input of allInputs) {
  const result = parseTaskFromNaturalLanguage(input);
  console.log(input.naturalLanguageTask, result);
}
```

## Required comments & explanations (what to include in your write-up)

建议你在自己的笔记里明确回答这些点（对应你在文档里写过的工程化视角）：

- 为什么 `TaskResult` 需要区分成功/失败分支（`ok: true/false`）？
- 为什么还要 `zod`（runtime validation），而不仅是 TypeScript 类型？
- `taskType` 作为 discriminated field 的价值：后续 workflow/router 如何按它分支？
- 失败时 `recoverable` 如何影响后续策略（retry / fallback / stop）？

## Quick Run（只在该练习目录内运行）

```bash
cd exercises/01-ts-basics
npm run run:mock
npm run typecheck
```

## Quick test cases (copy-paste)

你可以用下面输入来验证行为是否稳定：

```ts
import { parseTaskFromNaturalLanguage } from "./task-parser";

const r1 = parseTaskFromNaturalLanguage({
  naturalLanguageTask: "实现一个结构化输出的函数，把自然语言转换成 JSON 对象",
});
// 期望: ok=true, taskType≈build, plan.goal 有内容

const r2 = parseTaskFromNaturalLanguage({
  naturalLanguageTask: "",
});
// 期望: ok=false, error.code=EMPTY_INPUT
```

## Checklist (done means…)

- [ ] 我完成了 `TaskInput`
- [ ] 我完成了 `TaskResult`（成功/失败分支 + 错误模型）
- [ ] 我实现了 `parseTaskFromNaturalLanguage(...)`
- [ ] 我在函数末尾做了 runtime validation（例如 `zod.safeParse / parse`）
- [ ] 我能解释：TS 类型不等于运行时安全（必须 parse + validation）

