import { test, expect } from "bun:test";
import { parseCompanyInfo, parseCSV } from "../src/pages/JobAlertsPage";

// KAN: placeholder values in the Company Info column must never reach the card.
test("JSON array of placeholders yields no bullets", () => {
  expect(parseCompanyInfo('["N/A"]')).toEqual([]);
  expect(parseCompanyInfo('["N/A", "None", "null", "undefined"]')).toEqual([]);
});

test("plain and separated placeholders yield no bullets", () => {
  expect(parseCompanyInfo("")).toEqual([]);
  expect(parseCompanyInfo("N/A")).toEqual([]);
  expect(parseCompanyInfo("n/a")).toEqual([]);
  expect(parseCompanyInfo("NA")).toEqual([]);
  expect(parseCompanyInfo("N/A; none; null")).toEqual([]);
  expect(parseCompanyInfo("N/A\nNone")).toEqual([]);
});

test("real bullets survive and placeholders are dropped", () => {
  expect(parseCompanyInfo('["N/A", "Axelon Services Corporation"]')).toEqual([
    "Axelon Services Corporation",
  ]);
  expect(parseCompanyInfo("Global IT services leader; N/A")).toEqual([
    "Global IT services leader",
  ]);
});

test("non-array JSON and non-string entries yield no bullets", () => {
  expect(parseCompanyInfo('{"a":1}')).toEqual([]);
  expect(parseCompanyInfo("[null, 42]")).toEqual([]);
});

// --- Company overview fallback bullets (KAN-364 style source fallbacks) ---

// Builds a CSV with a header row plus one job row. Column 17 is Sources,
// column 16 is Company Info (the same indices the live master sheet uses).
const csvWithJob = (source: string, companyInfo: string) => {
  const cells = Array(22).fill("");
  cells[0] = "2026-01-15";
  cells[1] = "Senior Project Manager";
  cells[16] = companyInfo;
  cells[17] = source;
  const header = Array(22)
    .fill("")
    .map((_, i) => `header${i}`)
    .join(",");
  return `${header}\n${cells.map((c) => `"${c}"`).join(",")}\n`;
};

const jobFrom = (source: string, companyInfo: string) => {
  const jobs = parseCSV(csvWithJob(source, companyInfo));
  const job = jobs.find((j) => j.source === source);
  expect(job).toBeDefined();
  return job!;
};

const MOTION_BULLETS = [
  "Motion Recruitment Partners",
  "Leading North American IT staffing and consulting firm specializing in contract Project Management, Agile, and tech leadership",
  "Deep recruitment expertise across the San Francisco Bay Area and 16+ nationwide tech hubs",
  "Delivering enterprise IT solutions, digital transformation, and specialized consulting talent",
];

test("Motion Recruitment with no company info gets the four standard bullets", () => {
  expect(jobFrom("Motion Recruitment", "").companyInfo).toEqual(MOTION_BULLETS);
});

test("Motion Recruitment with only one bullet still gets the four standard bullets", () => {
  expect(
    jobFrom("Motion Recruitment", "Motion Recruitment Partners").companyInfo,
  ).toEqual(MOTION_BULLETS);
});

test("Motion Recruitment with two real bullets keeps them", () => {
  expect(
    jobFrom("Motion Recruitment", "Motion Recruitment Partners; Agile delivery").companyInfo,
  ).toEqual(["Motion Recruitment Partners", "Agile delivery"]);
});

test("NTT Data fallback bullets are unchanged", () => {
  expect(jobFrom("NTT Data", "").companyInfo).toEqual([
    "NTT DATA Corporation",
    "Global IT services and consulting leader operating in 50+ countries",
    "Premier provider of digital innovation, cloud transformation, and systems integration",
    "Delivering enterprise AI and BI-FinTech solutions worldwide",
  ]);
});

test("sources without a fallback get no invented bullets", () => {
  expect(jobFrom("Kforce", "").companyInfo).toBeUndefined();
});
