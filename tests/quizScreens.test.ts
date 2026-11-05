import { describe, expect, test } from 'bun:test';
import {
  FIRST_QUESTION_SCREEN,
  QUIZ_LANDING_SCREEN,
  isQuestionScreen,
  isResultScreen,
  nextQuizScreen,
  previousQuizScreen,
  questionIndexForScreen,
  resultScreen,
  startAssessmentScreen,
} from '../src/lib/quizScreens';

const QUESTION_COUNT = 12;

describe('quiz screen machine', () => {
  test('screen 0 is the landing screen and starting needs no contact details', () => {
    expect(QUIZ_LANDING_SCREEN).toBe(0);
    expect(startAssessmentScreen()).toBe(FIRST_QUESTION_SCREEN);
    expect(questionIndexForScreen(startAssessmentScreen())).toBe(0);
    expect(isQuestionScreen(QUIZ_LANDING_SCREEN, QUESTION_COUNT)).toBe(false);
    expect(isResultScreen(QUIZ_LANDING_SCREEN, QUESTION_COUNT)).toBe(false);
  });

  test('screens 1-12 are the questions and screen 13 is the result', () => {
    for (let screen = FIRST_QUESTION_SCREEN; screen <= QUESTION_COUNT; screen += 1) {
      expect(isQuestionScreen(screen, QUESTION_COUNT)).toBe(true);
      expect(questionIndexForScreen(screen)).toBe(screen - 1);
    }
    expect(resultScreen(QUESTION_COUNT)).toBe(13);
    expect(isQuestionScreen(13, QUESTION_COUNT)).toBe(false);
    expect(isResultScreen(13, QUESTION_COUNT)).toBe(true);
  });

  test('the last question advances to results and earlier questions advance by one', () => {
    expect(nextQuizScreen(5, QUESTION_COUNT)).toBe(6);
    expect(nextQuizScreen(12, QUESTION_COUNT)).toBe(13);
    expect(nextQuizScreen(13, QUESTION_COUNT)).toBe(13);
    expect(nextQuizScreen(QUIZ_LANDING_SCREEN, QUESTION_COUNT)).toBe(FIRST_QUESTION_SCREEN);
  });

  test('back stops at the first question instead of returning to the landing screen', () => {
    expect(previousQuizScreen(7)).toBe(6);
    expect(previousQuizScreen(1)).toBe(1);
  });
});
