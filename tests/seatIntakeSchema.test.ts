import { test, expect } from "bun:test";
import { formSchema, matchesSeatPassword } from "../src/lib/seatIntakeSchema";

const intake = {
  fullName: "Jane Doe",
  email: "jane@example.com",
  whatsapp: "+1 416 555 0123",
  linkedin: "https://www.linkedin.com/in/jane-doe",
  resume: new File(["resume"], "resume.pdf", { type: "application/pdf" }),
  currentRole: "Business Analyst at Example",
  contractLocation: "Canada",
};

test("seven-field intake accepts submissions without years of experience", () => {
  const result = formSchema.parse(intake);
  expect(Object.keys(result)).toHaveLength(7);
  expect(result).not.toHaveProperty("yearsExperience");
});

test("proof consent is no longer collected or retained", () => {
  expect(formSchema.parse({ ...intake, proofConsent: "Full name ok" })).not.toHaveProperty("proofConsent");
});

test("all seven remaining fields are required", () => {
  for (const field of Object.keys(intake)) {
    const candidate: Record<string, unknown> = { ...intake };
    delete candidate[field];
    expect(formSchema.safeParse(candidate).success).toBe(false);
  }
});

test("old passphrases no longer unlock intake", async () => {
  for (const password of ["remake", "consultant", "accelerator", "seat", ""]) {
    expect(await matchesSeatPassword(password)).toBe(false);
  }
});