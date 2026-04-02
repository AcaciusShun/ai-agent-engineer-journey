import { mockTaskInputs, mockEmptyInput } from "./mock-task-inputs";
import { parseTaskFromNaturalLanguage } from "./task-parser";

function prettyPrint(v: unknown): string {
  return JSON.stringify(v, null, 2);
}

const inputs = [...mockTaskInputs, mockEmptyInput];

for (const input of inputs) {
  const result = parseTaskFromNaturalLanguage(input);
  // eslint-disable-next-line no-console
  console.log("=".repeat(60));
  // eslint-disable-next-line no-console
  console.log("Input:", prettyPrint(input));
  // eslint-disable-next-line no-console
  console.log("Result:", prettyPrint(result));
}

