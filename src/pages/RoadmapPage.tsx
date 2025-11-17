import { useState, useEffect, useRef } from "react";
import { fetchPageBySlug } from "@/lib/ghostApi";
import { GhostPost } from "@/lib/ghostApi";
import TopNav from "@/components/TopNav";

const RoadmapPage = () => {
  const [pageContent, setPageContent] = useState<GhostPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFormkitReady, setIsFormkitReady] = useState(false); // NEW: Track SDK readiness
  const shownRef = useRef(false);
  const intervalRef = useRef<number | null>(null); // FIXED: number | null for browser setInterval
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  // Load ConvertKit script with onload for readiness
  useEffect(() => {
    // Check if already loaded to avoid duplicates
    const existingScript = document.querySelector('script[data-uid="fbd8fa5d1b"]');
    if (existingScript) {
      console.log('ConvertKit script already loaded');
      // Assume ready if exists (quick check)
      if (window.formkit) setIsFormkitReady(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://bi-fintech-consultant-academy.kit.com/fbd8fa5d1b/index.js';
    script.async = true;
    script.setAttribute('data-uid', 'fbd8fa5d1b');
    script.onload = () => { // NEW: Explicit readiness on load
      console.log('ConvertKit script loaded, checking formkit...');
      // Poll briefly for formkit init (SDK sometimes needs a tick)
      const checkReady = () => {
        if (window.formkit) {
          setIsFormkitReady(true);
          console.log('Formkit ready!');
        } else {
          setTimeout(checkReady, 100);
        }
      };
      checkReady();
    };
    document.head.appendChild(script);
    scriptRef.current = script;

    return () => {
      // Cleanup on unmount
      if (scriptRef.current && document.head.contains(scriptRef.current)) {
        document.head.removeChild(scriptRef.current);
      }
      // NEW: Clear any lingering interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  // Shared helper: Try show with lock/retry (used by both auto and CTA)
  const tryShowPopup = useRef<(retry?: boolean) => boolean>(() => {
    const formId = "fbd8fa5d1b";
    if (window.popupLocked) {
      console.log("Popup locked, skipping show");
      return false; // Not handled, allow retry if needed
    }
    if (window.formkit?.show && isFormkitReady) { // Use readiness state
      console.log("Showing ConvertKit popup");
      window.popupLocked = true;
      window.formkit.show(formId);
      if (!shownRef.current) { // Only set session if first show
        sessionStorage.setItem("roadmap_popup_shown", "1");
        shownRef.current = true;
      }
      setTimeout(() => {
        window.popupLocked = false;
      }, 1000);
      return true; // Handled
    }
    return false; // Not ready, retry if flag set
  });

  // Show ConvertKit popup once on first visit only
  useEffect(() => {
    const formId = "fbd8fa5d1b";
    if (session