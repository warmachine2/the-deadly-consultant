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
  showDebounced: (delayMs: number, sessionKey?: string) => void;
}

export default function useFormkitPopup(
  formId: string,
  triggerRef: RefObject<HTMLAnchorElement>, // Receive static ref
): UseFormkitPopupReturn {
  const [ready, setReady] = useState(false);
  const debounceRef = useRef<number | null>(null);

  // FIXED: Poll for ready after static/dynamic script (no load logic here)
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

    // Fallback: After 3s, force ready + log (allows click, fallback redirect if no modal)
    const fallbackTimeout = setTimeout(() => {
      if (!ready) {
        window.formkitReady = window.formkitReady || {};
        window.formkitReady[formId] = true;
        setReady(true);
        console.log(`Formkit fallback ready for ${formId} (possible adblock/no window.formkit)`);
        clearInterval(pollInterval);
      }
    }, 3000);

    return () => {
      clearInterval(pollInterval);
      clearTimeout(fallbackTimeout);
    };
  }, [formId, ready]);

  // FIXED: Fallback redirect if !ready or no modal
  const fallbackRedirect = useCallback((href: string) => {
    console.log(`Fallback: Redirecting to ${href} (no modal/ready)`);
    setTimeout(() => (window.location.href = href), 500); // Slight delay for UX
  }, []);

  // Show once per session
  const showOncePerSession = useCallback(
    (sessionKey: string) => {
      console.log(
        `showOncePerSession called: session=${!!sessionStorage.getItem(sessionKey)}, ready=${ready}, locked=${!!window.popupLocked}`,
      ); // Debug
      if (sessionStorage.getItem(sessionKey)) {
        console.log(`Already shown this session for ${sessionKey}, skipping`);
        return;
      }
      if (window.popupLocked) {
        console.log(`Popup locked, skipping show for ${sessionKey}`);
        return;
      }
      if (!ready || !triggerRef.current) {
        console.log(`Not ready or no trigger for ${formId}, fallback redirect`);
        fallbackRedirect(triggerRef.current?.href || "https://bifintechconsulting.com/roadmap-signup");
        return;
      }

      console.log(`Showing Formkit popup once for ${sessionKey}`);
      window.popupLocked = true;
      triggerRef.current.click();
    },
    [formId, ready, triggerRef, fallbackRedirect],
  );

  // Debounced show
  const showDebounced = useCallback(
    (delayMs: number, sessionKey?: string) => {
      console.log(
        `showDebounced called: session=${!!(sessionKey && sessionStorage.getItem(sessionKey))}, ready=${ready}, locked=${!!window.popupLocked}`,
      ); // Debug
      if (sessionKey && sessionStorage.getItem(sessionKey)) {
        console.log(`Already shown this session for ${sessionKey}, skipping`);
        return;
      }
      if (debounceRef.current !== null || window.popupLocked) {
        console.log("Debounce or lock active, skipping CTA show");
        return;
      }
      if (!ready || !triggerRef.current) {
        console.log(`Not ready or no trigger for ${formId}, fallback redirect`);
        fallbackRedirect(triggerRef.current?.href || "https://bifintechconsulting.com/roadmap-signup");
        return;
      }

      console.log(`Starting debounced show for CTA (delay: ${delayMs}ms)`);
      window.popupLocked = true;
      if (debounceRef.current !== null) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        if (triggerRef.current) {
          triggerRef.current.click();
          console.log("Trigger clicked for CTA");
        }
        debounceRef.current = null;
      }, delayMs) as unknown as number;
    },
    [formId, ready, triggerRef, fallbackRedirect],
  );

  // Cleanup
  useEffect(() => {
    return () => {
      if (debounceRef.current !== null) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
      window.popupLocked = false;
    };
  }, []);

  // FIXED: Log ready changes for debug
  useEffect(() => {
    console.log(`Ready state changed to: ${ready}`);
  }, [ready]);

  return { ready, showOncePerSession, showDebounced };
}
