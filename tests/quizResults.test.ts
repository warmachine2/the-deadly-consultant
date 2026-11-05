import { describe, test, expect } from "bun:test";
import { readinessTier, resultPath, marketPackagingInsight } from "../src/lib/quizResults";
import { summarizeQuizAnswers, QUESTIONS } from "../src/lib/quizDiagnostic";

describe("quiz results rules", () => {
  test("75 and above is enterprise fit", () => {
    expect(readinessTier(75)).toBe("enterprise");
    expect(readinessTier(100)).toBe("enterprise");
  });
  test("50 through 74 is emerging", () => {
    expect(readinessTier(50)).toBe("emerging");
    expect(readinessTier(74)).toBe("emerging");
  });
  test("below 50 is foundational", () => {
    expect(readinessTier(49)).toBe("foundation");
    expect(readinessTier(0)).toBe("foundation");
  });
  test("booking eligibility depends only on Q1, never a high score", () => {
    const answers = Object.fromEntries(QUESTIONS.map(q => [q.id, q.options[0]?.value ?? ""]));
    const inexperienced = { ...answers, 1: "Under 1 year / Current student" };
    const summary = summarizeQuizAnswers(inexperienced);
    expect(summary.score).toBe(82);
    expect(resultPath(summary.mqlQualified)).toBe("foundation");
  });
  test("qualified candidates retain booking eligibility even with a low score", () => {
    const summary = summarizeQuizAnswers({ 1: "3 to 5 years (without degree)" });
    expect(summary.score).toBe(11);
    expect(resultPath(summary.mqlQualified)).toBe("qualified");
  });
  test("all seven role ponds produce distinct market packaging diagnoses", () => {
    const ponds = ["Data_Analyst", "BA_Scrum", "Coordinator_Ops", "Dev_Eng", "Finance_Corp", "Other_WhiteCollar", "Other_General"];
    expect(new Set(ponds.map(marketPackagingInsight)).size).toBe(7);
    expect(marketPackagingInsight("unknown")).toBe(marketPackagingInsight("Other_WhiteCollar"));
  });
});