import { describe, it, expect } from "bun:test";
import { validateSubmission, docXmlToText, sha256Hex, RESUME_MODIFIER_DIGEST } from "../src/lib/resumeModifier";

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
