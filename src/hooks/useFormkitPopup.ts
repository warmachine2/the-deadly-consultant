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

  // Poll for ConvertKit script initialization
  useEffect(() => {
    console.log(`Starting readiness check for ${formId}`);
    let attempts = 0;
    const maxAttempts = 30; // 3 seconds total
    
    const checkReady = setInterval(() => {
      attempts++;
      const trigger = document.querySelector(`[data-formkit-toggle="${formId}"]`);
      
      if (trigger) {
        console.log(`ConvertKit trigger found for ${formId}, marking ready`);
        setReady(true);
        clearInterval(checkReady);
      } else if (attempts >= maxAttempts) {
        console.log(`ConvertKit not detected after ${maxAttempts} attempts, marking ready anyway`);
        setReady(true);
        clearInterval(checkReady);
      }
    }, 100);

    return () => clearInterval(checkReady);
  }, [formId]);

  // Post-click modal check - poll for modal appearance
  const checkModalAndFallback = useCallback((href: string) => {
    console.log("Post-click: Polling for modal...");
    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    clickTimeoutRef.current = setTimeout(() => {
      const modal = document.querySelector('[class*="formkit"], [data-formkit-id]');
      if (!modal) {
        console.log("No modal appeared after click—redirecting to signup");
        window.open(href, '_blank');
      } else {
        console.log("Modal detected after click—success!");
      }
    }, 2000) as unknown as number;
  }, []);

  // Fallback redirect - open in new tab
  const fallbackRedirect = useCallback((href: string) => {
    console.log(`Fallback: Opening signup in new tab ${href}`);
    window.open(href, '_blank');
  }, []);

  const showAuto = useCallback(() => {
    console.log(`showAuto: ready=${ready}`);
    if (!ready || !triggerRef.current) {
      console.log(`Not ready/no trigger for auto, skipping`);
      return;
    }
    console.log(`Showing auto popup via trigger click`);
    triggerRef.current.click();
    checkModalAndFallback(triggerRef.current.href);
  }, [ready, triggerRef, checkModalAndFallback]);

  const showDebounced = useCallback(
    (delayMs: number) => {
      console.log(`showDebounced: ready=${ready}`);
      if (debounceRef.current !== null) {
        console.log("Debounce active, skipping CTA");
        return;
      }
      if (!ready || !triggerRef.current) {
        console.log(`Not ready/no trigger for CTA, opening in new tab`);
        fallbackRedirect(triggerRef.current?.href || "https://bifintechconsulting.com/roadmap-signup");
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
