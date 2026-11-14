import { afterEach, describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { isJobBoardUnlocked, markJobBoardUnlocked, UNLOCK_TTL_MS } from "../src/lib/jobBoardGate";

const KEY = "ztopm_job_board_unlocked";
const now = Date.now();
const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
const originalDocument = Object.getOwnPropertyDescriptor(globalThis, "document");
afterEach(() => {
  for (const [key, descriptor] of [["window", originalWindow], ["document", originalDocument]] as const) {
    if (descriptor) Object.defineProperty(globalThis, key, descriptor);
    else Reflect.deleteProperty(globalThis, key);
  }
});

function environment(path = "/", initial: (string | null)[] = [null, null, null]) {
  const storage = (value: string | null) => {
    const data = new Map(value === null ? [] : [[KEY, value]]);
    return { getItem: (key: string) => data.get(key) ?? null,
      setItem: (key: string, value: string) => data.set(key, value), removeItem: (key: string) => data.delete(key) };
  };
  const classes = () => {
    const values = new Set(["job-board-unlocked"]);
    return { add: (...items: string[]) => items.forEach(item => values.add(item)),
      remove: (...items: string[]) => items.forEach(item => values.delete(item)), contains: (item: string) => values.has(item) };
  };
  const listeners = new Map<string, (event: any) => void>();
  const scripts: any[] = [];
  let cookie = initial[2] === null ? "" : `${KEY}=${initial[2]}`;
  let lastCookie = "";
  const window = { localStorage: storage(initial[0]), sessionStorage: storage(initial[1]),
    innerWidth: 1280, location: { pathname: path }, addEventListener: (name: string, cb: any) => listeners.set(name, cb),
    dispatchEvent: (event: Event) => listeners.get(event.type)?.(event) };
  const document = {
    documentElement: { classList: classes() }, body: { classList: classes(), appendChild: (script: any) => scripts.push(script) },
    get cookie() { return cookie; }, set cookie(value: string) { lastCookie = value; cookie = value.includes("max-age=0") ? "" : value.split(";")[0]; },
    addEventListener: (name: string, cb: any) => listeners.set(name, cb), querySelectorAll: () => [],
    createElement: () => ({ setAttribute() {} }),
  };
  return { window, document, scripts, listeners, lastCookie: () => lastCookie };
}

const loader = readFileSync(new URL("../index.html", import.meta.url), "utf8")
  .split("<script>").find(block => block.includes("function isUnlocked()"))?.split("</script>")[0];

for (const runtime of ["React", "HTML"] as const) {
  describe(`${runtime} 24-hour unlock`, () => {
    function setup(values: (string | null)[], path = "/") {
      const env = environment(path, values);
      Object.defineProperty(globalThis, "window", { configurable: true, value: env.window });
      Object.defineProperty(globalThis, "document", { configurable: true, value: env.document });
      if (runtime === "HTML") {
        if (!loader) throw new Error("Kit loader missing");
        runInNewContext(loader, { ...env, Date, Number, Event, setTimeout: () => 1, clearTimeout() {} });
      }
      return env;
    }
    const check = (env: ReturnType<typeof environment>) => runtime === "React" ? isJobBoardUnlocked() : env.scripts.length === 0;

    test("TTL is exactly 86400000ms", () => expect(UNLOCK_TTL_MS).toBe(86400000));
    for (const [label, value] of [["legacy", "true"], ["invalid", "NaN"], ["zero", "0"],
      ["infinite", "Infinity"], ["24h boundary", String(now - 86400000)], ["old", String(now - 86400001)],
      ["future", String(now + 86400000)]] as const) {
      test(`rejects ${label} and clears storage, cookie and classes`, () => {
        const env = setup([value, value, value]);
        expect(check(env)).toBe(false);
        expect(env.window.localStorage.getItem(KEY)).toBeNull();
        expect(env.window.sessionStorage.getItem(KEY)).toBeNull();
        expect(env.document.cookie).toBe("");
        expect(env.document.body.classList.contains("job-board-unlocked")).toBe(false);
        expect(env.document.documentElement.classList.contains("job-board-unlocked")).toBe(false);
      });
    }
    for (const source of [0, 1, 2]) {
      test(`accepts a recent timestamp in persistence source ${source}`, () => {
        const values: (string | null)[] = [null, null, null];
        values[source] = String(now - 3600000);
        const env = setup(values);
        expect(check(env)).toBe(true);
        if (runtime === "React") markJobBoardUnlocked();
        expect([env.window.localStorage.getItem(KEY), env.window.sessionStorage.getItem(KEY),
          env.document.cookie ? env.document.cookie.split("=")[1] : null]).toEqual(values);
      });
    }
    for (const path of ["/ai-bi-fintech-pm-job-alerts-repo", "/pm-job-board-canada"]) {
      test(`preserves popup suppression on ${path}`, () => {
        const env = setup(["true", "true", "true"], path);
        if (runtime === "React") expect(isJobBoardUnlocked()).toBe(false);
        expect(env.document.documentElement.classList.contains("job-board-unlocked")).toBe(true);
        expect(env.scripts).toHaveLength(0);
      });
    }
    test("unlock writes timestamps and a 24h cookie without blocking native submission", () => {
      const env = setup([null, null, null]);
      let blocked = false;
      if (runtime === "React") markJobBoardUnlocked();
      else env.listeners.get("submit")?.({ target: { classList: { contains: () => true } }, preventDefault: () => { blocked = true; } });
      const timestamp = Number(env.window.localStorage.getItem(KEY));
      expect(timestamp).toBeGreaterThanOrEqual(now);
      expect(timestamp).toBeLessThanOrEqual(Date.now());
      expect(env.window.sessionStorage.getItem(KEY)).toBe(String(timestamp));
      expect(env.lastCookie()).toBe(`${KEY}=${timestamp}; path=/; max-age=86400; SameSite=Lax`);
      expect(blocked).toBe(false);
    });
  });
}