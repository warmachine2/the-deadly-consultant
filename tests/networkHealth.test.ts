import { test, expect } from "bun:test";
import { normalizeSourceName, SOURCE_ORDER } from "../src/components/NetworkHealthPanel";

// KAN: Kforce must be a recognized Network Health source (backend webhook sends 17 sources).
test("normalizeSourceName maps Kforce variants to the canonical name", () => {
  expect(normalizeSourceName("Kforce")).toBe("Kforce");
  expect(normalizeSourceName("kforce")).toBe("Kforce");
  expect(normalizeSourceName("KFORCE")).toBe("Kforce");
  expect(normalizeSourceName("kforce staffing")).toBe("Kforce");
  expect(normalizeSourceName("Kforce - Boston")).toBe("Kforce");
  expect(normalizeSourceName("  Kforce  ")).toBe("Kforce");
});

test("normalizeSourceName still maps other sources", () => {
  expect(normalizeSourceName("PTP")).toBe("Peterson Technology Partners");
  expect(normalizeSourceName("TEK Systems")).toBe("TEKsystems");
  expect(normalizeSourceName("")).toBe("");
});

test("SOURCE_ORDER contains all 17 sources including Kforce", () => {
  expect(SOURCE_ORDER).toHaveLength(17);
  expect(SOURCE_ORDER).toContain("Kforce");
  expect(new Set(SOURCE_ORDER).size).toBe(17);
});
