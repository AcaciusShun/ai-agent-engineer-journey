/**
 * Mock data for Exercise 01
 *
 * 说明：
 * - 用来验证 parseTaskFromNaturalLanguage(...) 的行为稳定性
 * - 同时覆盖：build/research/debug/summarize/other + 空输入
 */

import type { TaskInput } from "./task-parser";

export const mockTaskInputs: TaskInput[] = [
  {
    naturalLanguageTask: "实现一个结构化输出的函数，把自然语言转换成 JSON 对象",
    desiredOutput: "plan",
  },
  {
    naturalLanguageTask: "调研工具调用（tool calling）在 Agent 工程中的最佳实践，并输出一份 checklist",
    desiredOutput: "checklist",
  },
  {
    naturalLanguageTask: "修复我 workflow/router 在某些状态下会卡死的问题（debug）",
    desiredOutput: "spec",
  },
  {
    naturalLanguageTask: "总结结构化输出（Structured Output）与恢复策略（Validation & Repair）的要点",
    desiredOutput: "plan",
  },
  {
    naturalLanguageTask: "写一个小练习：把任务转成结构化对象并给出错误模型",
  },
];

export const mockEmptyInput: TaskInput = {
  naturalLanguageTask: "",
};

