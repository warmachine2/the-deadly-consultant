import { useEffect, useState } from "react";
import { getJobBoardUnlockTimestamp, isJobBoardUnlocked, UNLOCK_CHANGE_EVENT, UNLOCK_TTL_MS } from "@/lib/jobBoardGate";

/** Keep Kit link attributes current even when access expires in an open tab. */
export const useJobBoardUnlocked = () => {
  const [unlocked, setUnlocked] = useState(isJobBoardUnlocked);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const sync = () => {
      clearTimeout(timer);
      const timestamp = getJobBoardUnlockTimestamp();
      setUnlocked(timestamp !== null);
      if (timestamp !== null) timer = setTimeout(sync, Math.max(1, timestamp + UNLOCK_TTL_MS - Date.now()));
    };
    sync();
    window.addEventListener("focus", sync);
    window.addEventListener("storage", sync);
    window.addEventListener(UNLOCK_CHANGE_EVENT, sync);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("focus", sync);
      window.removeEventListener("storage", sync);
      window.removeEventListener(UNLOCK_CHANGE_EVENT, sync);
    };
  }, []);
  return unlocked;
};