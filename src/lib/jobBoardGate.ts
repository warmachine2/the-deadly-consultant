export const JOB_BOARD_PATH = "/ai-bi-fintech-pm-job-alerts-repo";
const KEY = "ztopm_job_board_unlocked";
export const UNLOCKED_CLASS = "job-board-unlocked";
export const UNLOCK_TTL_MS = 24 * 60 * 60 * 1000;
export const UNLOCK_CHANGE_EVENT = "job-board-unlock-change";

const onJobBoardPath = () => {
  const p = window.location.pathname.toLowerCase();
  return [JOB_BOARD_PATH, "/pm-job-board-canada", "/job-board", "/jobs"].some(path => p.includes(path)) ||
    p === "/seat" || p.startsWith("/seat/");
};

export const getJobBoardUnlockTimestamp = (): number | null => {
  if (typeof window === "undefined") return null;
  const values: (string | null)[] = [];
  for (const name of ["localStorage", "sessionStorage"] as const) {
    try { values.push(window[name].getItem(KEY)); } catch { /* storage blocked */ }
  }
  values.push(document.cookie.split(";").map(part => part.trim())
    .find(part => part.startsWith(`${KEY}=`))?.slice(KEY.length + 1) ?? null);
  const now = Date.now();
  const timestamps = values.map(Number).filter(timestamp => Number.isFinite(timestamp) &&
    timestamp > 0 && now >= timestamp && now - timestamp < UNLOCK_TTL_MS);
  if (timestamps.length) return Math.max(...timestamps);
  for (const name of ["localStorage", "sessionStorage"] as const) {
    try { window[name].removeItem(KEY); } catch { /* storage blocked */ }
  }
  document.cookie = `${KEY}=; path=/; max-age=0; SameSite=Lax`;
  if (!onJobBoardPath()) {
    document.documentElement.classList.remove(UNLOCKED_CLASS);
    document.body?.classList.remove(UNLOCKED_CLASS);
  }
  return null;
};

export const isJobBoardUnlocked = (): boolean => getJobBoardUnlockTimestamp() !== null;

export const applyUnlockedClass = () => {
  document.documentElement.classList.add(UNLOCKED_CLASS);
  document.body?.classList.add(UNLOCKED_CLASS);
};

export const markJobBoardUnlocked = (refresh = false) => {
  if (!refresh && isJobBoardUnlocked()) {
    applyUnlockedClass();
    return;
  }
  const timestamp = String(Date.now());
  for (const name of ["localStorage", "sessionStorage"] as const) {
    try { window[name].setItem(KEY, timestamp); } catch { /* storage blocked */ }
  }
  document.cookie = `${KEY}=${timestamp}; path=/; max-age=86400; SameSite=Lax`;
  applyUnlockedClass();
  window.dispatchEvent(new Event(UNLOCK_CHANGE_EVENT));
};

export const getKitUid = () => (window.innerWidth < 768 ? "28fef2dc22" : "63221ca346");
