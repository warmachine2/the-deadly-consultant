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
        if (mutation.type === "childList") {
          const modalRemoved = Array.from(mutation.removedNodes).some(
            (node) =>
              node.nodeType === Node.ELEMENT_NODE && (node as Element).classList.contains("ck-subscription-form"),
          );
          if (modalRemoved) {
            console.log("Modal removed, refocusing page"); // Debug
            document.body.focus();
            window.scrollTo({ top: 0, behavior: "smooth" });
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

  // FIXED: Full regex for filterSmallVideos (balanced, no truncation)
  const filterSmallVideos = (html: string): string => {
    if (!html) return "";

    let filtered = html.replace(/<img[^>]*width="?(\d+)"?[^>]*>/gi, (match, width) => {
      const w = parseInt(width);
      return w < 300 ? "" : match;
    });

    filtered = filtered.replace(/<iframe[^>]*>/gi, (match) => {
      const widthMatch = match.match(/width="?(\d+)"?/i);
      if (widthMatch) {
        const w = parseInt(widthMatch[1]);
        return w < 400 ? "" : match;
      }
      return match;
    });

    return filtered;
  };

  const youtubeUrl = pageContent?.html ? extractYoutubeUrl(pageContent.html) : null;

  const handleCTAClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation(); // FIXED: Prevent bubble
      console.log("CTA onClick fired"); // Debug
      showDebounced(1000); // 1s debounce for CTA
      // FIXED: Fallback navigation if popup fails (after 2s)
      setTimeout(() => {
        if (!window.popupLocked) {
          // If no lock, redirect
          console.log("Popup failed, redirecting to fallback");
          window.location.href = "https://bifintechconsulting.com/roadmap-signup";
        }
      }, 2000); // Longer timeout
    },
    [showDebounced],
  );

  return (
    <div className="min-h-screen">
      <TopNav onSearchChange={() => {}} onToggleSidebar={() => {}} />
      {/* NEW: Dev button for clearing session (remove for production) */}
      <button onClick={clearSession} className="fixed top-4 right-4 z-50 bg-blue-500 text-white px-4 py-2 rounded">
        Clear Session (Dev)
      </button>

      <main className="container mx-auto px-4 py-8 max-w-5xl mt-24">
        <section className="glass-strong rounded-3xl p-8 md:p-12 mb-8 hover-lift">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 animate-fade-in">
              {pageContent?.title || ""}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-6">
              Your complete guide to becoming a 10k/mo+ consultant
            </p>
          </div>
        </section>

        {loading ? (
          <div className="glass rounded-3xl p-12 text-center">
            <div className="animate-pulse text-muted-foreground">Loading content...</div>
          </div>
        ) : pageContent ? (
          <>
            {youtubeUrl && (
              <section className="mb-8">
                <div className="glass rounded-3xl p-6">
                  <div className="relative w-full pb-[56.25%]">
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-2xl"
                      src={youtubeUrl}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              </section>
            )}

            <section className="glass rounded-3xl p-8 md:p-12 mb-8">
              <style>{`
                .prose img[width] { max-width: 100%; }
                .prose img[width]:is([width="1"], [width="2"], [width="3"], [width="4"], [width="5"], [width="10"], [width="20"], [width="50"], [width="100"], [width="120"], [width="150"], [width="200"], [width="250"]) { display: none !important; }
                .prose iframe[width] { min-width: 100%; }
                .prose iframe:is([width="100"], [width="120"], [width="150"], [width="200"], [width="250"], [width="300"], [width="350"]) { display: none !important; }
                .prose .kg-card:has(img[width]:is([width="1"], [width="2"], [width="3"], [width="4"], [width="5"], [width="10"], [width="20"], [width="50"], [width="100"], [width="120"], [width="150"], [width="200"], [width="250"])) { display: none !important; }
              `}</style>
              <div
                className="prose prose-invert prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: filterSmallVideos(pageContent.html || "") }}
              />
            </section>

            <section className="glass-strong rounded-3xl p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Ready to Get Started?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Download your free roadmap PDF and start your journey to becoming a successful BI-FinTech consultant.
              </p>
              <a
                href="https://bifintechconsulting.com/roadmap-signup"
                onClick={handleCTAClick}
                className="inline-block bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-lg"
              >
                Get Your Free Roadmap PDF
              </a>
            </section>
          </>
        ) : (
          <div className="glass rounded-3xl p-12 text-center">
            <p className="text-muted-foreground">Content not available. Please check back later.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default RoadmapPage;
