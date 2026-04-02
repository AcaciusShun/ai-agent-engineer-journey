import { z } from "zod";

/**
 * Exercise 01 实现：自然语言任务 -> 结构化对象（TaskPlan）
 *
 * 设计目标：
 * - 用 TypeScript 表达“设计期契约”（types）
 * - 用 runtime validation 把不确定性拦在边界层（zod.parse / safeParse）
 */

export type TaskInput = {
  naturalLanguageTask: string;
  // 可选：期望输出风格，让后续策略更可控
  desiredOutput?: "plan" | "spec" | "checklist";
};

export type TaskError = {
  // 例如: "EMPTY_INPUT" | "PARSE_FAIL"
  code: string;
  message: string;
  // true => recoverable（可以进入 retry）
  // false => non-recoverable（通常进入 fallback/stop）
  recoverable: boolean;
};

export type TaskResult =
  | { ok: true; plan: TaskPlan }
  | { ok: false; error: TaskError };

export const TaskPlanSchema = z.object({
  // discriminated field：后续 workflow/router 会按它分支
  taskType: z.enum(["build", "research", "debug", "summarize", "other"]),
  goal: z.string().min(1),
  deliverables: z.array(z.string().min(1)).min(1),
  constraints: z.array(z.string().min(1)).optional(),
});

export type TaskPlan = z.infer<typeof TaskPlanSchema>;

function validateTaskPlanCandidate(candidate: unknown): TaskResult {
  const parsed = TaskPlanSchema.safeParse(candidate);
  if (!parsed.success) {
    return {
      ok: false,
      error: {
        code: "PARSE_FAIL",
        message: "Failed to validate task plan shape.",
        recoverable: true,
      },
    };
  }

  // parse OK：返回可信契约
  return { ok: true, plan: parsed.data };
}

/**
 * parseTaskFromNaturalLanguage：
 * 把自然语言任务转换为结构化对象（TaskPlan），并在运行时校验 shape。
 *
 * 练习版实现（可升级）：
 * - 目前用启发式规则提取 taskType/goal/deliverables
 * - 然后用 validateTaskPlanCandidate() 把“候选”变成“可信契约”
 */
export function parseTaskFromNaturalLanguage(input: TaskInput): TaskResult {
  const text = input.naturalLanguageTask.trim();
  if (!text) {
    return {
      ok: false,
      error: { code: "EMPTY_INPUT", message: "Input is empty.", recoverable: false },
    };
  }

  const lower = text.toLowerCase();

  const taskType: TaskPlan["taskType"] =
    lower.includes("debug") || lower.includes("修复") || lower.includes("bug")
      ? "debug"
      : lower.includes("research") || lower.includes("调研") || lower.includes("学习")
        ? "research"
        : lower.includes("build") || lower.includes("实现") || lower.includes("写")
          ? "build"
          : lower.includes("summarize") || lower.includes("总结")
            ? "summarize"
            : "other";

  // goal：取第一句（或前 60 字符）
  const firstSentence = text.split(/[.!?。！？]/)[0].trim();
  const goal = (firstSentence || text).slice(0, 60) || "Untitled task";

  // deliverables：最小化策略
  const deliverables: string[] =
    /deliver|output|交付|要求|checklist|清单|方案/i.test(text) ? ["deliver"] : ["task plan"];

  // constraints：简单提取（练习版可弱化）
  const constraints = /must|should|必须|需要|约束|限制/i.test(text) ? ["has constraints from input"] : undefined;

  const candidate = { taskType, goal, deliverables, constraints };

  // runtime validation：TypeScript 不能保证运行时安全
  return validateTaskPlanCandidate(candidate);
}

