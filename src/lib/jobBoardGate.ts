export const JOB_BOARD_PATH = "/ai-bi-fintech-pm-job-alerts-repo";
const KEY = "ztopm_job_board_unlocked";
export const UNLOCKED_CLASS = "job-board-unlocked";

export const isJobBoardUnlocked = (): boolean => {
  if (typeof window === "undefined") return false;
  try {
    if (sessionStorage.getItem(KEY) === "true") return true;
    if (localStorage.getItem(KEY) === "true") return true;
  } catch { /* storage blocked */ }
  return document.cookie.includes(`${KEY}=true`);
};

export const applyUnlockedClass = () => {
  document.documentElement.classList.add(UNLOCKED_CLASS);
  document.body?.classList.add(UNLOCKED_CLASS);
};

export const markJobBoardUnlocked = () => {
  try {
    sessionStorage.setItem(KEY, "true");
    localStorage.setItem(KEY, "true");
  } catch { /* storage blocked */ }
  document.cookie = `${KEY}=true; path=/; max-age=172800; SameSite=Lax`;
  applyUnlockedClass();
};

export const getKitUid = () => (window.innerWidth < 768 ? "28fef2dc22" : "63221ca346");
