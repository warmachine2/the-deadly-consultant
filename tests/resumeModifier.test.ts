import { describe, it, expect } from "bun:test";
import { validateSubmission, validateScratchSubmission, type ScratchSubmission, docXmlToText, sha256Hex, RESUME_MODIFIER_DIGEST } from "../src/lib/resumeModifier";

const base = { resumeFile: false, resumeText: "x".repeat(20), jobInputType: "paste" as const, jobText: "PM role", jobScreenshotDataUrl: "", jobUrl: "" };
describe("resume modifier", () => {
  it("requires resume text of at least 20 chars without file", () => {
    expect(validateSubmission({ ...base, resumeText: "short" })).not.toBeNull();
    expect(validateSubmission(base)).toBeNull();
  });
  it("url mode requires http", () => {
    expect(validateSubmission({ ...base, jobInputType: "url", jobUrl: "example.com" })).not.toBeNull();
    expect(validateSubmission({ ...base, jobInputType: "url", jobUrl: "https://x.com" })).toBeNull();
  });
  it("screenshot mode requires image", () => {
    expect(validateSubmission({ ...base, jobInputType: "screenshot" })).not.toBeNull();
  });
  it("converts docx xml to text", () => {
    expect(docXmlToText("<w:p><w:t>A &amp; B</w:t></w:p><w:p><w:t>C</w:t></w:p>")).toBe("A & B\nC");
  });
  it("wrong password does not match digest", async () => {
    expect(await sha256Hex("wrong")).not.toBe(RESUME_MODIFIER_DIGEST);
  });
});

const scratch: ScratchSubmission = {
  firstName: "Jane", lastName: "Doe", address: "123 Main Street, Toronto", phone: "+14165550100", email: "jane@example.com",
  employers: [
    { startDate: "Jan 2022", endDate: "Present", companyName: "Acme", position: "Project Manager" },
    { startDate: "Jan 2020", endDate: "Dec 2021", companyName: "Example", position: "Coordinator" },
  ],
  education: [{ title: "B.Eng.", dateRange: "2016 – 2020" }, { title: "Cloud certification", dateRange: "2022" }],
  accolades: "", idealPosition: "Lead AI and cloud deployment projects in FinTech.",
};

describe("scratch resume validation", () => {
  for (const key of ["firstName", "lastName", "address", "phone", "email"] as const) {
    it(`requires ${key}`, () => {
      expect(validateScratchSubmission({ ...scratch, [key]: "   " })).not.toBeNull();
    });
  }
  it("requires at least one employer", () => {
    expect(validateScratchSubmission({ ...scratch, employers: [] })).toBe("Please add at least one employer.");
  });
  for (const key of ["startDate", "endDate", "companyName", "position"] as const) {
    it(`requires each employer's ${key}`, () => {
      expect(validateScratchSubmission({ ...scratch, employers: [{ ...scratch.employers[0], [key]: "" }] })).not.toBeNull();
    });
  }
  it("requires idealPosition", () => {
    expect(validateScratchSubmission({ ...scratch, idealPosition: " " })).toBe("Please describe your ideal project management position.");
  });
  it("accepts two employers and multiple education entries without accolades", () => {
    expect(validateScratchSubmission(scratch)).toBeNull();
  });
  it("rejects malformed email", () => {
    expect(validateScratchSubmission({ ...scratch, email: "not-an-email" })).toBe("Please enter a valid email address.");
  });
});
