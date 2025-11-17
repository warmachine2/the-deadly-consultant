import { useState, useEffect, useCallback, useRef, RefObject } from "react";

// FIXED: Ambient declaration
declare global {
  interface Window {
    popupLocked?: boolean;
    formkit?: any; // ConvertKit global
    formkitReady?: { [key: string]: boolean };
  }
}

interface UseFormkitPopupReturn {
  ready: boolean;
  showOncePerSession: (sessionKey: string) => void;
  showDebounced: (delayMs: number, sessionKey?: string) => void; // Optional key (skip check if undefined for CTA)
}

export default function useFormkitPopup(
  formId: string,
  triggerRef: RefObject<HTMLAnchorElement>, // Receive static ref
): UseFormkitPopupReturn {
  const [ready, setReady] = useState(false);
  const debounceRef = useRef<number | null>(null);
  const clickTimeoutRef = useRef<number | null>(null); // For post-click modal poll

  // FIXED: Set ready=true immediately after script load (passed from page onload)
  window.formkitReady = window.formkitReady || {};
  useEffect(() => {
    // Initial check
    if (window.formkit) {
      window.formkitReady[formId] = true;
      setReady(true);
      console.log(`Formkit ready for ${formId}! (initial)`);
      return;
    }

    // Poll if not
    const pollInterval = setInterval(() => {
      if (window.formkit) {
        window.formkitReady[formId] = true;
        setReady(true);
        console.log(`Formkit ready for ${formId}! (polled)`);
        clearInterval(pollInterval);
      }
    }, 100);

    // Fallback after 2s (force for click even if no global)
    const fallbackTimeout = setTimeout(() => {
      if (!ready) {
        window.formkitReady[formId] = true;
        setReady(true);
        console.log(`Formkit fallback ready for ${formId} (force for click)`);
        clearInterval(pollInterval);
      }
    }, 2000);

    return () => {
      clearInterval(pollInterval);
      clearTimeout(fallbackTimeout);
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

  // FIXED: Fallback redirect
  const fallbackRedirect = useCallback((href: string) => {
    console.log(`Immediate fallback: Redirecting to ${href}`);
    setTimeout(() => (window.location.href = href), 500);
  }, []);

  // Show once per session (auto: requires key)
  const showOncePerSession = useCallback(
    (sessionKey: string) => {
      console.log(
        `showOncePerSession: session=${!!sessionStorage.getItem(sessionKey)}, ready=${ready}, locked=${!!window.popupLocked}`,
      );
      if (sessionStorage.getItem(sessionKey)) {
        console.log(`Already shown for ${sessionKey}, skipping auto`);
        return;
      }
      if (window.popupLocked) {
        console.log(`Locked, skipping auto`);
        return;
      }
      if (!ready || !triggerRef.current) {
        console.log(`Not ready/no trigger for auto, fallback redirect`);
        fallbackRedirect(triggerRef.current?.href || "https://bifintechconsulting.com/roadmap-signup");
        return;
      }
      console.log(`Showing auto popup for ${sessionKey}`);
      window.popupLocked = true;
      triggerRef.current.click();
      checkModalAndFallback(triggerRef.current.href); // Poll for modal
    },
    [formId, ready, triggerRef, fallbackRedirect, checkModalAndFallback],
  );

  // Debounced show (CTA: optional key—skip session if undefined)
  const showDebounced = useCallback(
    (delayMs: number, sessionKey?: string) => {
      const hasSessionKey = !!sessionKey;
      console.log(`showDebounced: hasSessionKey=${hasSessionKey}, ready=${ready}, locked=${!!window.popupLocked}`);
      if (hasSessionKey && sessionStorage.getItem(sessionKey!)) {
        console.log(`Shown for ${sessionKey}, skipping (but CTA should not pass key)`);
        return;
      }
      if (debounceRef.current !== null || window.popupLocked) {
        console.log("Debounce/locked, skipping CTA");
        return;
      }
      if (!ready || !triggerRef.current) {
        console.log(`Not ready/no trigger for CTA, fallback redirect`);
        fallbackRedirect(triggerRef.current?.href || "https://bifintechconsulting.com/roadmap-signup");
        return;
      }
      console.log(`Starting CTA debounced show (delay: ${delayMs}ms)`);
      window.popupLocked = true;
      if (debounceRef.current !== null) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        if (triggerRef.current) {
          triggerRef.current.click();
          console.log("CTA trigger clicked");
          checkModalAndFallback(triggerRef.current.href); // FIXED: Poll for modal/redirect
        }
        debounceRef.current = null;
      }, delayMs) as unknown as number;
    },
    [formId, ready, triggerRef, fallbackRedirect, checkModalAndFallback],
  );

  // Cleanup
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
      window.popupLocked = false;
    };
  }, []);

  // Log ready changes
  useEffect(() => {
    console.log(`Ready state: ${ready}`);
  }, [ready]);

  return { ready, showOncePerSession, showDebounced };
}
