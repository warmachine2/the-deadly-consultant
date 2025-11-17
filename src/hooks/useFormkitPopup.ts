import { useState, useEffect, useCallback, useRef, RefObject } from "react";

declare global {
  interface Window {
    formkit?: any;
    formkitReady?: { [key: string]: boolean };
  }
}

interface UseFormkitPopupReturn {
  ready: boolean;
  showAuto: () => void;
  showDebounced: (delayMs: number) => void;
}

export default function useFormkitPopup(
  formId: string,
  triggerRef: RefObject<HTMLAnchorElement>,
): UseFormkitPopupReturn {
  const [ready, setReady] = useState(false);
  const debounceRef = useRef<number | null>(null);
  const clickTimeoutRef = useRef<number | null>(null);
  const openLockRef = useRef(false);

  // Detect if a ConvertKit modal is actually visible (not just injected/hidden)
  const isModalOpen = () => {
    const candidates = document.querySelectorAll(
      '[data-formkit-id], .formkit-modal, .ck-subscription-form'
    );
    return Array.from(candidates).some((el) => {
      const elAny = el as HTMLElement;
      const style = window.getComputedStyle(elAny);
      const rect = elAny.getBoundingClientRect();
      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        parseFloat(style.opacity || "1") > 0 &&
        rect.width > 0 &&
        rect.height > 0
      );
    });
  };

  // Poll for trigger presence and mark ready
  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 30; // ~3s

    const checkReady = setInterval(() => {
      attempts++;
      const trigger = document.querySelector(
        `[data-formkit-toggle="${formId}"]`
      );

      if (trigger) {
        setReady(true);
        clearInterval(checkReady);
      } else if (attempts >= maxAttempts) {
        setReady(true); // best-effort ready even if we didn't find the trigger yet
        clearInterval(checkReady);
      }
    }, 100);

    return () => clearInterval(checkReady);
  }, [formId]);

  // After clicking, wait briefly for modal; if none, fallback to href in new tab
  const checkModalAndFallback = useCallback((href: string) => {
    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    clickTimeoutRef.current = setTimeout(() => {
      if (!isModalOpen()) {
        window.open(href, "_blank");
      }
      // Release the open lock regardless to allow the next attempt later
      openLockRef.current = false;
    }, 2000) as unknown as number;
  }, []);

  // Fallback redirect - open in new tab
  const fallbackRedirect = useCallback((href: string) => {
    window.open(href, "_blank");
  }, []);

  const showAuto = useCallback(() => {
    if (!ready || !triggerRef.current) return;
    if (isModalOpen() || openLockRef.current) return;

    openLockRef.current = true;
    triggerRef.current.click();
    checkModalAndFallback(triggerRef.current.href);
  }, [ready, triggerRef, checkModalAndFallback]);

  const showDebounced = useCallback(
    (delayMs: number) => {
      if (debounceRef.current !== null) return;
      if (!ready || !triggerRef.current) {
        fallbackRedirect(
          triggerRef.current?.href ||
            "https://bifintechconsulting.com/roadmap-signup"
        );
        return;
      }

      if (debounceRef.current !== null) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        if (!triggerRef.current) return;
        if (isModalOpen() || openLockRef.current) {
          // Skip if already open/opening
        } else {
          openLockRef.current = true;
          triggerRef.current.click();
          checkModalAndFallback(triggerRef.current.href);
        }
        debounceRef.current = null;
      }, delayMs) as unknown as number;
    },
    [ready, triggerRef, fallbackRedirect, checkModalAndFallback]
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current !== null) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
      if (clickTimeoutRef.current !== null) {
        clearTimeout(clickTimeoutRef.current);
        clickTimeoutRef.current = null;
      }
      openLockRef.current = false;
    };
  }, []);

  // Optional: log state changes while debugging
  useEffect(() => {
    // console.log(`FormKit ready: ${ready}`);
  }, [ready]);

  return { ready, showAuto, showDebounced };
}
