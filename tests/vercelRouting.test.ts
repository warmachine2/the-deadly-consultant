import { expect, test } from "bun:test";
import config from "../vercel.json";

const fallback = config.rewrites[0];
const sourcePattern = new RegExp(`^${fallback.source}$`);

test("clean-URL fallback targets the existing root without an HTML extension", () => {
  expect(config.cleanUrls).toBe(true);
  expect(config.rewrites).toHaveLength(1);
  expect(fallback.destination).toBe("/");
  // Higher-level rewrites are filesystem-first on Vercel, unlike forced routes.
  expect("routes" in config).toBe(false);
});

for (const route of [
  "/seat",
  "/3ks-tracker",
  "/free-workshop/thank-you",
  "/book-session/thank-you",
  "/unknown/path",
]) {
  test(`${route} matches the SPA fallback`, () => {
    expect(sourcePattern.test(route)).toBe(true);
  });
}

test("missing file requests do not match the SPA fallback", () => {
  for (const file of ["/assets/missing.js", "/missing.pdf", "/missing.png", "/data.json"]) {
    expect(sourcePattern.test(file)).toBe(false);
  }
});

test("the private intake response keeps its exact noindex header", () => {
  const seat = config.headers.find((entry) => entry.source === "/seat");
  expect(seat?.headers).toContainEqual({
    key: "X-Robots-Tag",
    value: "noindex, nofollow",
  });
});