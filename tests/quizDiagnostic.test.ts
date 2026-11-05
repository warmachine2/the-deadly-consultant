import { describe, expect, test } from "bun:test";
import { QUESTIONS, MAX_RAW_SCORE, summarizeQuizAnswers, type QuizAnswers } from "../src/lib/quizDiagnostic";

const answerAt = (id: number, index: number) => {
  const option = QUESTIONS.find(question => question.id === id)?.options[index];
  if (!option) throw new Error("Missing test option");
  return option.value;
};

describe("ten-question diagnostic rules", () => {
  const weights = [
    [20, 20, 12, 5, 0], [10, 10, 10, 10, 10, 10, 4], [10, 10, 10, 10],
    [10, 10, 10, 4], [10, 10, 4], [10, 10, 10, 10], [10, 10, 10, 4],
    [10, 10, 6, 4], [10, 10, 10, 4], [10, 10, 0],
  ];
  weights.forEach((points, index) => {
    test(`Q${index + 1} uses every supplied point value`, () => {
      points.forEach((point, optionIndex) => {
        expect(summarizeQuizAnswers({ [index + 1]: answerAt(index + 1, optionIndex) }).rawScore).toBe(point);
      });
    });
  });
  test("normalizes the supplied 110-point maximum to 100", () => {
    const answers: QuizAnswers = Object.fromEntries(QUESTIONS.map(question => [question.id, question.options[0]?.value ?? ""]));
    expect(MAX_RAW_SCORE).toBe(110);
    expect(summarizeQuizAnswers(answers).score).toBe(100);
    expect(summarizeQuizAnswers({}).score).toBe(0);
    expect(summarizeQuizAnswers({ 1: answerAt(1, 0) }).score).toBe(18);
  });
  test("Q1 alone determines MQL eligibility for all five brackets", () => {
    [true, true, true, false, false].forEach((qualified, index) => {
      expect(summarizeQuizAnswers({ 1: answerAt(1, index) }).mqlQualified).toBe(qualified);
    });
    expect(summarizeQuizAnswers({ 7: answerAt(7, 0) }).mqlQualified).toBe(false);
  });
  test("Q2 derives all seven role ponds", () => {
    ["Data_Analyst", "BA_Scrum", "Coordinator_Ops", "Dev_Eng", "Finance_Corp", "Other_WhiteCollar", "Other_General"].forEach((pond, index) => {
      expect(summarizeQuizAnswers({ 2: answerAt(2, index) }).rolePond).toBe(pond);
    });
  });
  test("tracks Q1 experience, Q3 income, and Q5 contractor openness", () => {
    const state = summarizeQuizAnswers({ 1: answerAt(1, 0), 3: answerAt(3, 0), 5: answerAt(5, 2) });
    expect(state.experienceBracket).toBe("5+ years");
    expect(state.currentIncome).toBe("Under $3,500/mo");
    expect(state.contractorOpen).toBe("Strictly looking for salaried T4/W2 employment");
  });
  test("changing answers replaces points and qualification instead of double counting", () => {
    const original = { 1: answerAt(1, 0), 2: answerAt(2, 0) };
    expect(summarizeQuizAnswers(original).rawScore).toBe(30);
    const updated = summarizeQuizAnswers({ ...original, 1: answerAt(1, 4), 2: answerAt(2, 6) });
    expect(updated.rawScore).toBe(4);
    expect(updated.mqlQualified).toBe(false);
    expect(updated.rolePond).toBe("Other_General");
  });
  test("unknown or retired answers cannot affect score or qualification", () => {
    expect(summarizeQuizAnswers({ 1: "Yes", 11: "Yes", 12: "Yes" }).rawScore).toBe(0);
    expect(summarizeQuizAnswers({ 1: "Yes" }).mqlQualified).toBe(false);
  });
});
