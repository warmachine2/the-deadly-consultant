// Quiz screen machine: screen 0 is the zero-input landing screen,
// screens 1..questionCount are the questions, screen questionCount + 1 is the result.

export const QUIZ_LANDING_SCREEN = 0;
export const FIRST_QUESTION_SCREEN = 1;

export const resultScreen = (questionCount: number) => questionCount + FIRST_QUESTION_SCREEN;

export const questionIndexForScreen = (screen: number) => screen - FIRST_QUESTION_SCREEN;

export const isQuestionScreen = (screen: number, questionCount: number) =>
  screen >= FIRST_QUESTION_SCREEN && screen <= questionCount;

export const isResultScreen = (screen: number, questionCount: number) =>
  screen === resultScreen(questionCount);

// Starting the assessment needs no name, email or prior answer: it only moves
// the machine from the landing screen to the first question.
export const startAssessmentScreen = () => FIRST_QUESTION_SCREEN;

export const nextQuizScreen = (screen: number, questionCount: number) => {
  if (isResultScreen(screen, questionCount)) return screen;
  return isQuestionScreen(screen, questionCount) ? screen + 1 : startAssessmentScreen();
};

export const previousQuizScreen = (screen: number) =>
  screen > FIRST_QUESTION_SCREEN ? screen - 1 : screen;
