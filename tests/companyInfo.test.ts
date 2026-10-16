import { test, expect } from "bun:test";
import { parseCompanyInfo } from "../src/pages/JobAlertsPage";

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
