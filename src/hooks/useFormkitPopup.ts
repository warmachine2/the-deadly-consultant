import { useEffect, useMemo, useRef, useState } from "react";

// Module-scoped singletons to avoid duplicate script/trigger across mounts
let scriptLoadPromise: Promise<void> | null = null;
let triggerEl: HTMLAnchorElement | null = null;
let isReady = false;

function ensureScript(formId: string) {
  if (isReady) return Promise.resolve();
  if (scriptLoadPromise) return scriptLoadPromise;

  // If already present in DOM, mark ready immediately
  const existing = document.querySelector(`script[data-uid="${formId}"]`);
  if (existing) {
    isReady = true;
    return Promise.resolve();
  }

  scriptLoadPromise = new Promise<void>((resolve) => {
    const script = document.createElement("script");
    script.src = `https://bi-fintech-consultant-academy.kit.com/${formId}/index.js`;
    script.async = true;
    script.setAttribute("data-uid", formId);
    script.onload = () => {
      // Small delay to allow kit to hydrate DOM
      setTimeout(() => {
        isReady = true;
        resolve();
      }, 200);
    };
    document.head.appendChild(script);
  });

  return scriptLoadPromise;
}

function ensureTrigger(formId: string) {
  if (triggerEl) return triggerEl;
  const el = document.createElement("a");
  el.href = "https://bifintechconsulting.com/roadmap-signup";
  el.setAttribute("data-formkit-toggle", formId);
  el.style.display = "none";
  el.style.position = "absolute";
  el.style.left = "-9999px";
  document.body.appendChild(el);
  triggerEl = el;
  return el;
}

function showForm(formId: string) {
  // Prefer official API if present, fallback to hidden trigger
  if (window.formkit?.show) {
    window.formkit.show(formId);
    return true;
  }
  const el = ensureTrigger(formId);
  el.click();
  return true;
}

export function useFormkitPopup(formId: string) {
  const [ready, setReady] = useState(false);
  const lockRef = useRef(false); // shared debounce/lock

  useEffect(() => {
    let mounted = true;
    ensureScript(formId).then(() => {
      if (!mounted) return;
      ensureTrigger(formId);
      setReady(true);
    });
    return () => {
      mounted = false;
    };
  }, [formId]);

  const api = useMemo(
    () => ({
      ready,
      // Auto once per session using a key
      showOncePerSession: (sessionKey = `formkit_once_${formId}`) => {
        if (!ready) return false;
        if (sessionStorage.getItem(sessionKey)) return false;
        if (lockRef.current) return false;
        lockRef.current = true;
        sessionStorage.setItem(sessionKey, "1");
        setTimeout(() => (lockRef.current = false), 800);
        return showForm(formId);
      },
      // Debounced manual show via CTA
      showDebounced: (ms = 800) => {
        if (!ready) return false;
        if (lockRef.current) return false;
        lockRef.current = true;
        setTimeout(() => (lockRef.current = false), ms);
        return showForm(formId);
      },
    }),
    [ready, formId],
  );

  return api;
}

export default useFormkitPopup;
