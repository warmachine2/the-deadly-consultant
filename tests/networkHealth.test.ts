import { test, expect } from "bun:test";
import { normalizeSourceName, SOURCE_ORDER } from "../src/components/NetworkHealthPanel";

const TES = "TES – The Employment Solution";

// KAN: Kforce must be a recognized Network Health source.
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

// KAN-239: TES – The Employment Solution (Canadian agency) is a monitored source.
test("normalizeSourceName maps TES variants to the canonical name", () => {
  expect(normalizeSourceName("TES")).toBe(TES);
  expect(normalizeSourceName("tes")).toBe(TES);
  expect(normalizeSourceName("The Employment Solution")).toBe(TES);
  expect(normalizeSourceName(TES)).toBe(TES);
  expect(normalizeSourceName(`  ${TES}  `)).toBe(TES);
});

// The loose "tes" match must never capture another agency's rows.
test("the TES match does not steal other agencies", () => {
  expect(normalizeSourceName("TEKsystems")).toBe("TEKsystems");
  expect(normalizeSourceName("SI Systems")).toBe("SI Systems");
  expect(normalizeSourceName("Tundra Technical Solutions")).toBe("Tundra Technical Solutions");
  expect(normalizeSourceName("GTT (Global Technical Talent)")).toBe("GTT (Global Technical Talent)");
});

// Motion Recruitment is the 19th monitored source.
test("normalizeSourceName maps Motion variants to the canonical name", () => {
  expect(normalizeSourceName("Motion Recruitment")).toBe("Motion Recruitment");
  expect(normalizeSourceName("motion recruitment")).toBe("Motion Recruitment");
  expect(normalizeSourceName("MOTION RECRUITMENT")).toBe("Motion Recruitment");
  expect(normalizeSourceName("Motion")).toBe("Motion Recruitment");
  expect(normalizeSourceName("  Motion Recruitment  ")).toBe("Motion Recruitment");
});

// The loose "motion" match must never capture another agency's rows.
test("the Motion match does not steal other agencies", () => {
  expect(normalizeSourceName("TES – The Employment Solution")).toBe(TES);
  expect(normalizeSourceName("Peterson Technology Partners")).toBe("Peterson Technology Partners");
  expect(normalizeSourceName("Soho Square Solutions")).toBe("Soho Square Solutions");
});


test("SOURCE_ORDER contains all 19 sources including TES and Motion Recruitment", () => {
  expect(SOURCE_ORDER).toHaveLength(19);
  expect(SOURCE_ORDER).toContain("Kforce");
  expect(SOURCE_ORDER).toContain(TES);
  expect(SOURCE_ORDER).toContain("Motion Recruitment");
  expect(new Set(SOURCE_ORDER).size).toBe(19);
  expect(SOURCE_ORDER.indexOf(TES)).toBe(SOURCE_ORDER.indexOf("TEKsystems") + 1);
  expect(SOURCE_ORDER.indexOf("Motion Recruitment")).toBe(SOURCE_ORDER.indexOf(TES) + 1);
});
