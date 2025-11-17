import { useState, useEffect, useRef, useCallback } from "react";

// FIXED: Ambient declaration at top level
declare global {
  interface Window {
    popupLocked?: boolean;
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
  const debounceRef = useRef<number | null>(null); // Browser-safe: number | null

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

  // Load script + set ready (runs once)
  useEffect(() => {
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
        clearTimeout(debounceRef.current); // FIXED: Type guard for clearTimeout
        debounceRef.current = null;
      }
    };
  }, [formId, createTriggerIfNeeded]);

  // Show once per session (auto-use case)
  const showOncePerSession = useCallback(
    (sessionKey: string) => {
      if (sessionStorage.getItem(sessionKey) || window.popupLocked) {
        console.log(`Session guard or lock active for ${sessionKey}, skipping show`);
        return;
      }

      if (!ready || !triggerRef.current) {
        console.log(`Not ready for ${formId}, skipping show`);
        return;
      }

      console.log(`Showing Formkit popup once for ${sessionKey}`);
      window.popupLocked = true;
      triggerRef.current.click();
      sessionStorage.setItem(sessionKey, "1");
      setTimeout(() => {
        window.popupLocked = false;
      }, 1000); // 1s lock
    },
    [formId, ready],
  );

  // Debounced show (CTA-use case, allows re-open if closed)
  const showDebounced = useCallback(
    (delayMs: number) => {
      if (debounceRef.current !== null || window.popupLocked) {
        console.log("Debounce or lock active, skipping CTA show");
        return;
      }

      if (!ready || !triggerRef.current) {
        console.log(`Not ready for ${formId}, skipping debounced show`);
        return;
      }

      console.log(`Debounced show for CTA (delay: ${delayMs}ms)`);
      debounceRef.current = setTimeout(() => {
        window.popupLocked = true;
        triggerRef.current!.click();
        // Lock during show
        setTimeout(() => {
          window.popupLocked = false;
          debounceRef.current = null;
        }, 1000);
      }, delayMs) as number; // FIXED: Cast to number for strict TS
    },
    [formId, ready],
  );

  return { ready, showOncePerSession, showDebounced };
}
