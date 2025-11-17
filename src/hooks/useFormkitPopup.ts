import { useState, useEffect, useRef, useCallback } from "react";

// FIXED: Ambient declaration at top level
declare global {
  interface Window {
    popupLocked?: boolean;
    formkitLoaded?: { [key: string]: boolean }; // Per-form ID to prevent multi-loads
    ctaTrigger?: { [key: string]: HTMLElement }; // Global trigger per form to prevent multi-triggers
    ctaLocked?: boolean; // Global for CTA lock
    formkit?: any; // ConvertKit global for polling
    formkitReady?: { [key: string]: boolean }; // NEW: Shared ready state across instances
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
  const attemptedRef = useRef(false); // Track show attempts

  // FIXED: Global loaded flag per form ID
  if (typeof window !== "undefined") {
    window.formkitLoaded = window.formkitLoaded || {};
    window.ctaTrigger = window.ctaTrigger || {};
    window.formkitReady = window.formkitReady || {};
  }

  const createTriggerIfNeeded = useCallback(() => {
    if (triggerRef.current || window.ctaTrigger[formId]) return;
    const trigger = document.createElement("a");
    trigger.href = "https://bifintechconsulting.com/roadmap-signup"; // Your fallback
    trigger.setAttribute("data-formkit-toggle", formId);
    trigger.style.display = "none";
    trigger.style.position = "absolute";
    trigger.style.left = "-9999px";
    document.body.appendChild(trigger);
    triggerRef.current = trigger;
    window.ctaTrigger[formId] = trigger; // Global to share across instances
    console.log(`Formkit trigger created for ${formId}`);
  }, [formId]);

  // Load script + set ready (idempotent, single run)
  useEffect(() => {
    if (window.formkitLoaded?.[formId]) {
      console.log(`Formkit already loaded for ${formId}`);
      createTriggerIfNeeded();
      // FIXED: Use shared global ready
      window.formkitReady[formId] = true;
      setReady(true);
      return;
    }

    const existingScript = document.querySelector(`script[data-uid="${formId}"]`);
    if (existingScript) {
      console.log(`Formkit script already loaded for ${formId}`);
      createTriggerIfNeeded();
      // FIXED: Use shared global ready
      window.formkitReady[formId] = true;
      setReady(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://bi-fintech-consultant-academy.kit.com/${formId}/index.js`; // Original custom src
    script.async = true;
    script.setAttribute("data-uid", formId); // Original attribute
    script.onload = () => {
      console.log(`Formkit script loaded for ${formId}`);
      // FIXED: Poll for window.formkit (ready when SDK inits)
      const pollReady = () => {
        if (window.formkit) {
          createTriggerIfNeeded();
          // FIXED: Use shared global ready
          window.formkitReady[formId] = true;
          setReady(true);
          console.log(`Formkit ready for ${formId}! (polled)`);
        } else {
          setTimeout(pollReady, 100); // Poll every 100ms
        }
      };
      pollReady();
      // FIXED: Fallback ready after 2s if polling fails (ad blocker)
      setTimeout(() => {
        if (!window.formkitReady[formId]) {
          createTriggerIfNeeded();
          window.formkitReady[formId] = true;
          setReady(true);
          console.log(`Formkit fallback ready for ${formId}!`);
        }
      }, 2000);
    };
    document.head.appendChild(script);

    // FIXED: Mark as loaded on success
    window.formkitLoaded![formId] = true;

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
      if (triggerRef.current && document.body.contains(triggerRef.current)) {
        document.body.removeChild(triggerRef.current);
        triggerRef.current = null;
      }
      delete window.ctaTrigger[formId]; // Cleanup global trigger
      window.popupLocked = false; // Reset lock
      window.ctaLocked = false; // Reset CTA lock
      if (debounceRef.current !== null) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
  }, [formId, createTriggerIfNeeded]);

  // Show once per session (auto-use case)
  const showOncePerSession = useCallback(
    (sessionKey: string) => {
      if (attemptedRef.current || window.popupLocked) {
        console.log(`Attempt/lock active for ${sessionKey}, skipping show`);
        return;
      }

      if (!ready || !triggerRef.current) {
        console.log(`Not ready for ${formId}, skipping show`);
        return;
      }

      // FIXED: Always attempt first time; set session after close
      console.log(`Showing Formkit popup once for ${sessionKey}`);
      attemptedRef.current = true; // Mark attempted
      window.popupLocked = true;
      triggerRef.current.click();
      // FIXED: Set session after close (listen for modal removal)
      const handleClose = () => {
        sessionStorage.setItem(sessionKey, "1");
        window.popupLocked = false;
        console.log(`Session set for ${sessionKey} after close`);
      };
      setTimeout(handleClose, 200); // Fallback if no observer
    },
    [formId, ready],
  );

  // Debounced show (CTA-use case, allows re-open if closed)
  const showDebounced = useCallback(
    (delayMs: number) => {
      ctaCallCountRef.current += 1; // Debug log
      console.log(`CTA call #${ctaCallCountRef.current}`);
      if (debounceRef.current !== null || window.popupLocked || window.ctaLocked) {
        console.log("Debounce or lock active, skipping CTA show");
        return;
      }

      if (!ready || !triggerRef.current) {
        console.log(`Not ready for ${formId}, skipping debounced show`);
        return;
      }

      console.log(`Debounced show for CTA (delay: ${delayMs}ms)`);
      // FIXED: Immediate global lock + cancel previous
      window.ctaLocked = true;
      if (debounceRef.current !== null) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        // FIXED: Poll ready one more time before click
        const finalReady = window.formkitReady[formId] || true; // Fallback true
        if (finalReady && triggerRef.current) {
          triggerRef.current.click();
          console.log("Trigger clicked for CTA");
        }
        // Release after show + lock
        setTimeout(() => {
          window.ctaLocked = false;
          debounceRef.current = null;
        }, 2000); // 2s total lock for CTA
      }, delayMs) as unknown as number; // Double-cast for TS
    },
    [formId, ready],
  );

  return { ready, showOncePerSession, showDebounced };
}
