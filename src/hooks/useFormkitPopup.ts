import { useState, useEffect, useRef, useCallback } from "react";

// FIXED: Move declare global to top level (after imports)
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
  const debounceRef = useRef<NodeJS.Timeout | null>(null); // For CTA debounce

  const createTriggerIfNeeded = useCallback(() => {
    if (triggerRef.current) return;
    const trigger = document.createElement("a");
    trigger.href = `https://app.convertkit.com/forms/${formId}/subscriptions/new`; // Standard fallback
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
    script.src = `https://f.convertkit.com/${formId}/ckjs/ck.5.js`; // Updated to official CKJS (more reliable than custom subdomain)
    script.async = true;
    script.setAttribute("data-ck-subscription-one-click", formId); // One-click mode for modals
    script.onload = () => {
      console.log(`Formkit script loaded for ${formId}`);
      setTimeout(() => {
        createTriggerIfNeeded();
        setReady(true);
        console.log(`Formkit ready for ${formId}!`);
      }, 500); // Buffer for event binding
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) document.head.removeChild(script);
      if (triggerRef.current && document.body.contains(triggerRef.current)) {
        document.body.removeChild(triggerRef.current);
        triggerRef.current = null;
      }
      window.popupLocked = false; // Reset lock
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
  }, [formId, createTriggerIfNeeded]);

  // Show once per session (auto-use case)
  const showOncePerSession = useCallback((sessionKey: string) => {
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
    sessionStorage.setItem(sessionKey