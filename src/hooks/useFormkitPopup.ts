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
  triggerRef: RefObject<HTMLAnchorElement>, // Receive static ref
): UseFormkitPopupReturn {
  const [ready, setReady] = useState(false);
  const debounceRef = useRef<number | null>(null);
  const clickTimeoutRef = useRef<number | null>(null); // For post-click modal poll

  // FIXED: Poll for ready (removed force fallback—ready only if actually loaded)
  useEffect(() => {
    console.log(`Starting poll for ${formId} ready state`);
    const pollInterval = setInterval(() => {
      if (window.formkit) {
        window.formkitReady = window.formkitReady || {};
        window.formkitReady[formId] = true;
        setReady(true);
        console.log(`Formkit ready for ${formId}! (polled)`);
        clearInterval(pollInterval);
      }
    }, 100);

    // Optional: Extend poll timeout if needed, but no force ready
    const longPoll = setTimeout(() => {
      if (!ready) {
        console.log(`Extended poll for ${formId}—still waiting...`);
      }
    }, 5000);

    return () => {
      clearInterval(pollInterval);
      clearTimeout(longPoll);
    };
  }, [formId, ready]);

  // FIXED: Post-click modal check (poll 3s, redirect if no .ck-subscription-form)
  const checkModalAndFallback = useCallback((href: string) => {
    console.log("Post-click: Polling for modal...");
    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    clickTimeoutRef.current = setTimeout(() => {
      const modal = document.querySelector(".ck-subscription-form");
      if (!modal) {
        console.log("No modal appeared after click—redirecting to signup");
        window.location.href = href;
      } else {
        console.log("Modal detected after click—success!");
      }
    }, 3000) as unknown as number;
  }, []);

  // FIXED: Fallback redirect (use trigger href only)
  const fallbackRedirect = useCallback((href: string) => {
    console.log(`Immediate fallback: Redirecting to ${href}`);
    setTimeout(() => (window.location.href = href), 500);
  }, []);

  const showAuto = useCallback(() => {
    console.log(`showAuto: ready=${ready}`);
    if (!ready || !triggerRef.current) {
      console.log(`Not ready/no trigger for auto, fallback redirect`);
      fallbackRedirect(triggerRef.current?.href || "https://bifintechconsulting.com/roadmap-signup");
      return;
    }
    if (!window.formkit) {
      console.log("Formkit not loaded—fallback redirect");
      fallbackRedirect(triggerRef.current.href);
      return;
    }
    console.log(`Showing auto popup`);
    triggerRef.current.click();
    checkModalAndFallback(triggerRef.current.href);
  }, [ready, triggerRef, fallbackRedirect, checkModalAndFallback]);

  const showDebounced = useCallback(
    (delayMs: number) => {
      console.log(`showDebounced: ready=${ready}`);
      if (debounceRef.current !== null) {
        console.log("Debounce active, skipping CTA");
        return;
      }
      if (!ready || !triggerRef.current) {
        console.log(`Not ready/no trigger for CTA, fallback redirect`);
        fallbackRedirect(triggerRef.current?.href || "https://bifintechconsulting.com/roadmap-signup");
        return;
      }
      if (!window.formkit) {
        console.log("Formkit not loaded—fallback redirect");
        fallbackRedirect(triggerRef.current.href);
        return;
      }
      console.log(`Starting CTA debounced show (delay: ${delayMs}ms)`);
      if (debounceRef.current !== null) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        if (triggerRef.current) {
          triggerRef.current.click();
          console.log("CTA trigger clicked");
          checkModalAndFallback(triggerRef.current.href);
        }
        debounceRef.current = null;
      }, delayMs) as unknown as number;
    },
    [ready, triggerRef, fallbackRedirect, checkModalAndFallback],
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
    };
  }, []);

  // Log ready changes
  useEffect(() => {
    console.log(`Ready state: ${ready}`);
  }, [ready]);

  return { ready, showAuto, showDebounced };
}
