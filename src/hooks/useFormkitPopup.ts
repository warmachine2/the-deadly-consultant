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
  const modalPollRef = useRef<number | null>(null);
  const isShowingRef = useRef(false);

  // Utility: detect if a CK modal/iframe is present
  const isModalOpen = useCallback(() => {
    return (
      !!document.querySelector('.ck-subscription-form, .ck-modal, [role="dialog"][class*="ck-"], [data-formkit-id]') ||
      !!document.querySelector('iframe[src*="kit.com"], iframe[src*="convertkit"]')
    );
  }, []);

  // Ready when the hidden trigger exists (script attaches behavior to it)
  useEffect(() => {
    console.log(`Starting readiness check for ${formId}`);
    let attempts = 0;
    const maxAttempts = 50; // 5s
    const timer = setInterval(() => {
      attempts++;
      const trigger = document.querySelector(`[data-formkit-toggle="${formId}"]`);
      if (trigger) {
        setReady(true);
        console.log(`Formkit ready: trigger present for ${formId}`);
        clearInterval(timer);
      } else if (attempts >= maxAttempts) {
        console.log(`Formkit trigger not found after ${maxAttempts} attempts`);
        clearInterval(timer);
      }
    }, 100);
    return () => clearInterval(timer);
  }, [formId]);

  // Post-click: poll for modal and cancel fallback if detected
  const checkModalAndFallback = useCallback((href: string) => {
    console.log("Post-click: watching for modal...");
    if (modalPollRef.current) clearInterval(modalPollRef.current);
    const start = Date.now();
    modalPollRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      if (isModalOpen()) {
        console.log("Modal detected — cancelling fallback");
        if (modalPollRef.current) {
          clearInterval(modalPollRef.current);
          modalPollRef.current = null;
        }
        return;
      }
      if (elapsed > 3000) {
        console.log("No modal after 3s — opening fallback in new tab");
        if (modalPollRef.current) {
          clearInterval(modalPollRef.current);
          modalPollRef.current = null;
        }
        window.open(href, '_blank');
        // Allow future shows since popup didn't appear
        isShowingRef.current = false;
      }
    }, 150) as unknown as number;
  }, [isModalOpen]);

  // Fallback redirect - open in new tab
  const fallbackRedirect = useCallback((href: string) => {
    console.log(`Fallback: Opening signup in new tab ${href}`);
    window.open(href, '_blank');
  }, []);

  const showAuto = useCallback(() => {
    console.log(`showAuto: ready=${ready}`);
    if (!ready || !triggerRef.current) return;
    if ((window as any).__ckAutoDone) {
      console.log('Auto popup already attempted — skip');
      return;
    }
    if (isShowingRef.current || isModalOpen()) {
      console.log('Popup already showing — skip auto');
      return;
    }
    (window as any).__ckAutoDone = true;
    isShowingRef.current = true;
    console.log(`Showing auto popup via trigger click`);
    triggerRef.current.click();
    checkModalAndFallback(triggerRef.current.href);
  }, [ready, triggerRef, checkModalAndFallback, isModalOpen]);

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
      if (isShowingRef.current || isModalOpen()) {
        console.log('Popup already showing — skip CTA');
        return;
      }
      console.log(`Starting CTA debounced show (delay: ${delayMs}ms)`);
      if (debounceRef.current !== null) {
        clearTimeout(debounceRef.current);
      }
      isShowingRef.current = true;
      debounceRef.current = setTimeout(() => {
        if (triggerRef.current) {
          triggerRef.current.click();
          console.log("CTA trigger clicked");
          checkModalAndFallback(triggerRef.current.href);
        }
        debounceRef.current = null;
      }, delayMs) as unknown as number;
    },
    [ready, triggerRef, fallbackRedirect, checkModalAndFallback, isModalOpen],
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
      if (modalPollRef.current !== null) {
        clearInterval(modalPollRef.current);
        modalPollRef.current = null;
      }
      isShowingRef.current = false;
    };
  }, []);

  // Observe DOM to reset showing flag when modal closes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (!isModalOpen()) {
        isShowingRef.current = false;
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [isModalOpen]);

  // Log ready changes
  useEffect(() => {
    console.log(`Ready state: ${ready}`);
  }, [ready]);

  return { ready, showAuto, showDebounced };
}
