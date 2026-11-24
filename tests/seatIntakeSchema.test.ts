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

test("all six required fields are required", () => {
  for (const field of ["fullName", "email", "whatsapp", "resume", "currentRole", "contractLocation"]) {
    const candidate: Record<string, unknown> = { ...intake };
    delete candidate[field];
    expect(formSchema.safeParse(candidate).success).toBe(false);
  }
});

test("blank linkedin passes and normalizes to an empty string", () => {
  const result = formSchema.parse({ ...intake, linkedin: "" });
  expect(result.linkedin).toBe("");
});

test("omitted linkedin passes and normalizes to an empty string", () => {
  const candidate: Record<string, unknown> = { ...intake };
  delete candidate.linkedin;
  const result = formSchema.parse(candidate);
  expect(result.linkedin).toBe("");
});

test("a filled-in LinkedIn URL still validates and is preserved", () => {
  const result = formSchema.parse({ ...intake, linkedin: "https://www.linkedin.com/in/jane-doe" });
  expect(result.linkedin).toBe("https://www.linkedin.com/in/jane-doe");
});

test("a non-empty invalid linkedin value still fails validation", () => {
  for (const value of ["not-a-url", "https://example.com"]) {
    const result = formSchema.safeParse({ ...intake, linkedin: value });
    expect(result.success).toBe(false);
  }
});

test("old passphrases no longer unlock intake", async () => {
  for (const password of ["remake", "consultant", "accelerator", "seat", ""]) {
    expect(await matchesSeatPassword(password)).toBe(false);
  }
});