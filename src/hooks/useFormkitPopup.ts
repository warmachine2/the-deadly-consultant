import { useState, useEffect, useRef, useCallback } from "react";

// FIXED: Ambient declaration at top level
declare global {
  interface Window {
    popupLocked?: boolean;
    formkit?: any; // ConvertKit global
  }
}

interface UseFormkitPopupReturn {
  ready: boolean;
  showOncePerSession: (sessionKey: string) => void;
  showDebounced: (delayMs: number) => void;
}

export default function useFormkitPopup(formId: string): UseFormkitPopupReturn {
  const [ready, setReady] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);
  const debounceRef = useRef<number | null>(null); // number | null for browser setTimeout
  const ctaCallCountRef = useRef(0); // Debug log
  const attemptedRef = useRef(false); // NEW: Track show attempts to prevent multi-runs

  const createTriggerIfNeeded = useCallback(() => {
    if (triggerRef.current) return;
    const trigger = document.createElement("a");
    trigger.href = "https://bifintechconsulting.com/roadmap-signup"; // Your fallback
    trigger.setAttribute("data-formkit-toggle", formId);
    trigger.style.display = "none";
    trigger.style.position = "absolute";
    trigger.style.left = "-9999px";
    document.body.appendChild(trigger);
    triggerRef.current = trigger;
    console.log(`Formkit trigger created for ${formId}`);
  }, [formId]);

  // Load script + set ready (runs once, idempotent)
  useEffect(() => {
    // FIXED: Check if Formkit already initialized globally
    if (window.formkit) {
      console.log(`Formkit already initialized for ${formId}`);
      createTriggerIfNeeded();
      setReady(true);
      return;
    }

    const existingScript = document.querySelector(`script[data-uid="${formId}"]`);
    if (existingScript) {
      console.log(`Formkit script already loaded for ${formId}`);
      createTriggerIfNeeded();
      setReady(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://bi-fintech-consultant-academy.kit.com/${formId}/index.js`; // Original custom src
    script.async = true;
    script.setAttribute("data-uid", formId); // Original attribute
    script.onload = () => {
      console.log(`Formkit script loaded for ${formId}`);
      // Buffer for event binding
      setTimeout(() => {
        createTriggerIfNeeded();
        setReady(true);
        console.log(`Formkit ready for ${formId}!`);
      }, 500);
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
      if (triggerRef.current && document.body.contains(triggerRef.current)) {
        document.body.removeChild(triggerRef.current);
        triggerRef.current = null;
      }
      window.popupLocked = false; // Reset lock
      if (debounceRef.current !== null) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
  }, [formId, createTriggerIfNeeded]);

  // Show once per session (auto-use case)
  const showOncePerSession = useCallback(
    (sessionKey: string) => {
      if (attemptedRef.current || sessionStorage.getItem(sessionKey) || window.popupLocked) {
        console.log(`Attempt/session guard or lock active for ${sessionKey}, skipping show`);
        return;
      }

      if (!ready || !triggerRef.current) {
        console.log(`Not ready for ${formId}, skipping show`);
        return;
      }

      console.log(`Showing Formkit popup once for ${sessionKey}`);
      attemptedRef.current = true; // Mark attempted
      window.popupLocked = true;
      triggerRef.current.click();
      sessionStorage.setItem(sessionKey, "1"); // Set after click (success)
      setTimeout(() => {
        window.popupLocked = false;
      }, 1000); // 1s lock
    },
    [formId, ready],
  );

  // Debounced show (CTA-use case, allows re-open if closed)
  const showDebounced = useCallback(
    (delayMs: number) => {
      ctaCallCountRef.current += 1; // Debug log
      console.log(`CTA call #${ctaCallCountRef.current}`);
      if (debounceRef.current !== null || window.popupLocked) {
        console.log("Debounce or lock active, skipping CTA show");
        return;
      }

      if (!ready || !triggerRef.current) {
        console.log(`Not ready for ${formId}, skipping debounced show`);
        return;
      }

      console.log(`Debounced show for CTA (delay: ${delayMs}ms)`);
      // FIXED: Immediate lock + cancel previous if any
      window.popupLocked = true;
      if (debounceRef.current !== null) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        triggerRef.current!.click();
        // Release after show + lock
        setTimeout(() => {
          window.popupLocked = false;
          debounceRef.current = null;
        }, 1000);
      }, delayMs) as unknown as number; // Double-cast for TS
    },
    [formId, ready],
  );

  return { ready, showOncePerSession, showDebounced };
}
