import { useState, useEffect, useRef, useCallback } from "react";
import { fetchPageBySlug } from "@/lib/ghostApi";
import { GhostPost } from "@/lib/ghostApi";
import TopNav from "@/components/TopNav";

// FIXED: Extend Window for custom flag (TS-safe)
declare global {
  interface Window {
    roadmapAutoShown?: boolean;
  }
}

const RoadmapPage = () => {
  const [pageContent, setPageContent] = useState<GhostPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFormkitReady, setIsFormkitReady] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);
  const formId = "fbd8fa5d1b";

  // FIXED: Define createTriggerIfNeeded early in effect
  const createTriggerIfNeeded = useCallback(() => {
    if (triggerRef.current) return;
    const trigger = document.createElement("a");
    trigger.href = "https://bifintechconsulting.com/roadmap-signup";
    trigger.setAttribute("data-formkit-toggle", formId);
    trigger.style.display = "none";
    trigger.style.position = "absolute";
    trigger.style.left = "-9999px";
    document.body.appendChild(trigger);
    triggerRef.current = trigger;
    console.log("Hidden trigger created");
  }, [formId]);

  // Load script + trigger (runs once)
  useEffect(() => {
    const existingScript = document.querySelector(`script[data-uid="${formId}"]`);
    if (existingScript) {
      console.log("ConvertKit script already loaded");
      createTriggerIfNeeded();
      setIsFormkitReady(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://bi-fintech-consultant-academy.kit.com/${formId}/index.js`;
    script.async = true;
    script.setAttribute("data-uid", formId);
    script.onload = () => {
      console.log("ConvertKit script loaded");
      setTimeout(() => {
        createTriggerIfNeeded();
        setIsFormkitReady(true);
        console.log("Formkit ready with trigger!");
      }, 500);
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) document.head.removeChild(script);
      if (triggerRef.current && document.body.contains(triggerRef.current)) {
        document.body.removeChild(triggerRef.current);
        triggerRef.current = null;
      }
      window.roadmapAutoShown = false; // Reset on unmount
    };
  }, [createTriggerIfNeeded]);

  // UPDATED: Shared show - no retries
  const attemptShow = useCallback(
    (isAuto = true) => {
      const key = isAuto ? "roadmap_popup_shown" : null;
      if (isAuto && (sessionStorage.getItem(key) || window.roadmapAutoShown)) {
        console.log("Auto-show already done, skipping");
        return true;
      }

      if (window.popupLocked) {
        console.log("Popup locked, skipping");
        return false;
      }

      if (isFormkitReady && triggerRef.current) {
        console.log(isAuto ? "Auto-showing ConvertKit popup once" : "Showing via CTA");
        window.popupLocked = true;
        triggerRef.current.click();

        if (isAuto) {
          sessionStorage.setItem(key, "1");
          window.roadmapAutoShown = true;
        }

        setTimeout(() => {
          window.popupLocked = false;
        }, 2000); // Longer lock
        return true;
      }

      return false;
    },
    [isFormkitReady],
  );

  // Auto-show: Runs ONCE on mount, after ready (empty deps for single fire)
  useEffect(() => {
    if (!isFormkitReady) return;

    // Single delayed attempt (no interval/retry)
    const timer = setTimeout(() => {
      attemptShow(true);
    }, 100); // Tiny buffer post-ready

    return () => clearTimeout(timer);
  }, []); // EMPTY DEPS: Runs once on mount, ignores readiness changes

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
      console.log("CTA clicked");
      attemptShow(false);
    },
    [attemptShow],
  );

  return (
    <div className="min-h-screen">
      <TopNav onSearchChange={() => {}} onToggleSidebar={() => {}} />

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
