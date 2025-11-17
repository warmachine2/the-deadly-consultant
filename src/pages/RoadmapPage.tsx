import { useState, useEffect, useRef, useCallback } from "react";
import { fetchPageBySlug } from "@/lib/ghostApi";
import { GhostPost } from "@/lib/ghostApi";
import TopNav from "@/components/TopNav";
import useFormkitPopup from "@/hooks/useFormkitPopup";

// FIXED: Extend Window for custom flag (TS-safe, but hook handles it now)
declare global {
  interface Window {
    popupLocked?: boolean;
    roadmapAutoShown?: boolean; // Optional, not used here
  }
}

const RoadmapPage = () => {
  const [pageContent, setPageContent] = useState<GhostPost | null>(null);
  const [loading, setLoading] = useState(true);
  const formId = "8677000"; // FIXED: From log (confirm in ConvertKit dashboard)
  const autoTriggeredRef = useRef(false); // Ensure single auto call
  const refocusObserverRef = useRef<MutationObserver | null>(null); // For refocus

  const { ready, showOncePerSession, showDebounced } = useFormkitPopup(formId);

  // Auto-show ONCE per session upon landing on this page
  useEffect(() => {
    if (!ready || autoTriggeredRef.current) return; // Guard: Only once after ready
    console.log("Auto effect fired"); // Debug
    autoTriggeredRef.current = true;
    // FIXED: Longer buffer for trigger wiring
    setTimeout(() => {
      showOncePerSession("roadmap_popup_shown");
    }, 500); // Increased to 500ms
  }, [ready, showOncePerSession]);

  // NEW: Refocus after modal close (MutationObserver for .ck-subscription-form removal)
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const modalRemoved = Array.from(mutation.removedNodes).some(node => 
            node.nodeType === Node.ELEMENT_NODE && (node as Element).classList.contains('ck-subscription-form')
          );
          if (modalRemoved) {
            console.log("Modal removed, refocusing page"); // Debug
            document.body.focus();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            observer.disconnect();
          }
        }
      });
    });
    refocusObserverRef.current = observer;
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  // NEW: Dev-only session clear (remove for production)
  const clearSession = useCallback(() => {
    sessionStorage.clear();
    console.log("Session cleared for testing");
    window.location.reload();
  }, []);

  // Page load (unchanged)
  useEffect(() => {
    const loadPage = async () => {
      const cacheKey = "ghost:page:2026-bi-fintech-consulting-roadmap-pdf-unlock";
      try {
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
          setPageContent(JSON.parse(cached));
          setLoading(false);
        }
      } catch {}

      try {
        const content = await fetchPageBySlug("2026-bi-fintech-consulting-roadmap-pdf-unlock");
        if (content) {
          setPageContent(content);
          setLoading(false);
        }
      } catch (e) {
        console.error("Roadmap fetch failed:", e);
      }
    };
    loadPage();
  }, []);

  const extractYoutubeUrl = (html: string): string | null => {
    const iframeMatch = html.match(/<iframe[^>]+src="([^"]+youtube[^"]+)"/i);
    return iframeMatch ? iframeMatch[1] : null;
  };

  const filterSmallVideos = (html: string): string => {
    if (!html) return "";

    let filtered = html.replace(/<img