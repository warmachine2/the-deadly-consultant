import * as z from "zod";
import { createQuizLeadSchemas } from "../../supabase/functions/send-quiz-lead/schema";
import { summarizeQuizAnswers, type QuizAnswers } from "./quizDiagnostic";

export const { contactSchema, payloadSchema } = createQuizLeadSchemas(z);
export type ContactFormData = z.infer<typeof contactSchema>;

export const buildQuizLeadPayload = (contact: ContactFormData, answers: QuizAnswers) => {
  const { rawScore, ...diagnostic } = summarizeQuizAnswers(answers);
  return payloadSchema.parse({ ...contact, ...diagnostic, status: "NEW" });
};