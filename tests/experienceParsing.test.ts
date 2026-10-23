import { test, expect } from "bun:test";
import { parseExperienceYears } from "../src/pages/JobAlertsPage";

// Ranges take the first number
test("range 5-7 years -> 5", () => {
  expect(parseExperienceYears("5-7 years")).toBe(5);
});

test("range with en dash 5–7 years -> 5", () => {
  expect(parseExperienceYears("5–7 years")).toBe(5);
});

test("range with 'to' 3 to 5 years -> 3", () => {
  expect(parseExperienceYears("3 to 5 years")).toBe(3);
});

test("range plus 5-7+ years -> 5", () => {
  expect(parseExperienceYears("5-7+ years")).toBe(5);
});

// Simple patterns
test("5+ years -> 5", () => {
  expect(parseExperienceYears("5+ years")).toBe(5);
});

test("3 years -> 3", () => {
  expect(parseExperienceYears("3 years")).toBe(3);
});

test("2 yrs -> 2", () => {
  expect(parseExperienceYears("2 yrs")).toBe(2);
});

// Senior fallback roles group under >= 5 Years
test("senior role with no number -> 5", () => {
  expect(parseExperienceYears("Not specified", "Senior Business Analyst")).toBe(5);
});

test("lead role in experience text -> 5", () => {
  expect(parseExperienceYears("Lead experience preferred")).toBe(5);
});

test("principal role -> 5", () => {
  expect(parseExperienceYears("", "Principal Consultant")).toBe(5);
});

test("director role -> 5", () => {
  expect(parseExperienceYears("", "Director of Program Management")).toBe(5);
});

test("head role -> 5", () => {
  expect(parseExperienceYears("", "Head of Delivery")).toBe(5);
});

// No number, non-senior -> 0 (current behaviour)
test("unspecified non-senior -> 0", () => {
  expect(parseExperienceYears("Not specified", "Business Analyst")).toBe(0);
});

test("empty text -> 0", () => {
  expect(parseExperienceYears("", "")).toBe(0);
});

// Explicit number beats senior keyword
test("explicit years beats senior keyword", () => {
  expect(parseExperienceYears("2 years required", "Senior Analyst")).toBe(2);
});
