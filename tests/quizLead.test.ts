import { describe, test, expect } from "bun:test";
import { contactSchema, payloadSchema, buildQuizLeadPayload } from "../src/lib/quizLead";
import { QUESTIONS } from "../src/lib/quizDiagnostic";

const contact = {
  fullName: "Quiz Test Candidate", email: "quiz-test@example.com", phone: "+1 (416) 555-0199",
  linkedIn: "https://linkedin.com/in/quiz-test-candidate", city: "Toronto, Canada", vipScholarship: false,
};
const answers = Object.fromEntries(QUESTIONS.map(q => [q.id, q.options[0]?.value ?? ""]));

describe("quiz candidate lead rules", () => {
  for (const field of ["fullName", "email", "phone", "linkedIn", "city"] as const) {
    test(`${field} is required`, () => {
      expect(contactSchema.safeParse({ ...contact, [field]: "" }).success).toBe(false);
    });
  }
  test("scholarship is unchecked by default and accepts opt-in", () => {
    const { vipScholarship, ...withoutChoice } = contact;
    expect(contactSchema.parse(withoutChoice).vipScholarship).toBe(false);
    expect(buildQuizLeadPayload({ ...contact, vipScholarship: true }, answers).vipScholarship).toBe(true);
  });
  test("validates phone digits and disallows arbitrary characters", () => {
    for (const phone of ["123", "1234567890123456", "call me", "<script>123456789</script>"]) {
      expect(contactSchema.safeParse({ ...contact, phone }).success).toBe(false);
    }
    expect(contactSchema.safeParse(contact).success).toBe(true);
  });
  test("accepts LinkedIn profiles only, not deceptive domains or unsafe URLs", () => {
    for (const linkedIn of ["https://linkedin.com.evil.test/in/test", "javascript:alert(1)", "https://example.com/in/test", "https://linkedin.com/company/test"]) {
      expect(contactSchema.safeParse({ ...contact, linkedIn }).success).toBe(false);
    }
  });
  test("payload includes exactly the thirteen requested keys and NEW status", () => {
    const payload = buildQuizLeadPayload(contact, answers);
    expect(Object.keys(payload).sort()).toEqual(["fullName", "email", "phone", "linkedIn", "city", "score", "mqlQualified", "experienceBracket", "rolePond", "currentIncome", "vipScholarship", "contractorOpen", "status"].sort());
    expect(payload.status).toBe("NEW");
    expect(payload.score).toBe(100);
    expect(payload.mqlQualified).toBe(true);
    expect(payload.rolePond).toBe("Data_Analyst");
  });
  test("server schema rejects invalid scores and mismatched qualification", () => {
    const payload = buildQuizLeadPayload(contact, answers);
    for (const score of [-1, 101, 1.5, "100"]) {
      expect(payloadSchema.safeParse({ ...payload, score }).success).toBe(false);
    }
    expect(payloadSchema.safeParse({ ...payload, mqlQualified: false }).success).toBe(false);
  });
  test("contact lengths are bounded in both runtimes", () => {
    for (const [field, max] of [["fullName", 100], ["email", 255], ["phone", 40], ["linkedIn", 500], ["city", 200]] as const) {
      expect(contactSchema.safeParse({ ...contact, [field]: "x".repeat(max + 1) }).success).toBe(false);
    }
  });
});