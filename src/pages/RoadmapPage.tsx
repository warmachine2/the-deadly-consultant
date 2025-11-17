import { useState, useEffect, useRef, useCallback } from "react";
import { fetchPageBySlug } from "@/lib/ghostApi";
import { GhostPost } from "@/lib/ghostApi";
import TopNav from "@/components/TopNav";

const RoadmapPage = () => {
  const [pageContent, setPageContent] = useState<GhostPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFormkitReady, setIsFormkitReady] = useState(false);
  const shownRef = useRef(false);
  const autoAttemptedRef = useRef(false); // NEW: Strict guard for single auto attempt
  const intervalRef = useRef<number | null>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null); // NEW: Ref for hidden trigger element
  const formId = "fbd8fa5d1b"; // Centralized

  // Load ConvertKit script + create hidden trigger
  useEffect(() => {
    const existingScript = document.querySelector('script[data-uid="' + formId + '"]');
    if (existingScript) {
      console.log("ConvertKit script already loaded");
      createTriggerIfNeeded(); // Ensure trigger exists
      setIsFormkitReady(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://bi-fintech-consultant-academy.kit.com/" + formId + "/index.js";
    script.async = true;
    script.setAttribute("data-uid", formId);
    script.onload = () => {
      console.log("ConvertKit script loaded");
      // Short delay for event wiring
      setTimeout(() => {
        createTriggerIfNeeded();
        setIsFormkitReady(true);
        console.log("Formkit ready with trigger!");
      }, 500);
    };
    document.head.appendChild(script);
    scriptRef.current = script;

    const createTriggerIfNeeded = () => {
      if (triggerRef.current) return; // Already created
      const trigger = document.createElement("a");
      trigger.href = "https://bifintechconsulting.com/roadmap-signup"; // Fallback if clicked manually
      trigger.setAttribute("data-formkit-toggle", formId);
      trigger.style.display = "none"; // Hidden
      trigger.style.position = "absolute";
      trigger.style.left = "-9999px";
      document.body.appendChild(trigger);
      triggerRef.current = trigger;
      console.log("Hidden trigger created");
    };

    return () => {
      if (scriptRef.current && document.head.contains(scriptRef.current)) {
        document.head.removeChild(scriptRef.current);
      }
      if (triggerRef.current && document.body.contains(triggerRef.current)) {
        document.body.removeChild(triggerRef.current);
        triggerRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  // UPDATED: Shared show function - clicks hidden trigger
  const attemptShow = useCallback(
    (isAuto = true) => {
      // Auto guard: Once per session + single attempt
      if (isAuto && (sessionStorage.getItem("roadmap_popup_shown") || shownRef.current || autoAttemptedRef.current)) {
        console.log("Auto-show already attempted this session, skipping");
        return true;
      }

      if (window.popupLocked) {
        console.log("Popup locked, skipping show");
        return false;
      }

      if (isFormkitReady && triggerRef.current) {
        console.log(isAuto ? "Auto-showing ConvertKit popup once" : "Showing ConvertKit popup via CTA");
        window.popupLocked = true;
        triggerRef.current.click(); // Trigger the modal!

        if (isAuto) {
          sessionStorage.setItem("roadmap_popup_shown", "1");
          shownRef.current = true;
          autoAttemptedRef.current = true; // Mark as attempted
        }

        setTimeout(() => {
          window.popupLocked = false;
        }, 1000);
        return true;
      }

      return false;
    },
    [isFormkitReady],
  );

  // Auto-show: On readiness, once per session + single attempt (no interval to avoid multiples)
  useEffect(() => {
    if (!isFormkitReady || autoAttemptedRef.current) return; // NEW: Strict single-run guard

    // Single attempt with short delay if needed
    const tryAuto = () => {
      if (attemptShow(true)) {
        console.log("Auto-show successful");
        return;
      }
      // If trigger not yet wired, one retry after 250ms
      console.log("Auto initial failed, one retry...");
      setTimeout(() => {
        if (!autoAttemptedRef.current && attemptShow(true)) {
          console.log("Auto retry successful");
        } else {
          console.log("Auto-show skipped after retry");
        }
      }, 250);
    };

    tryAuto();

    // No interval—keeps it to at most 2 calls (initial + retry)
  }, [isFormkitReady, attemptShow]); // Deps ensure re-run only if readiness changes, but guard prevents

  // Page content load (unchanged)
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

  // UPDATED: CTA - clicks trigger (allows re-show)
  const handleCTAClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      console.log("CTA clicked: attempting popup");
      if (!attemptShow(false)) {
        console.log("CTA: Trigger not ready");
      }
    },
    [attemptShow],
  );

  return (
    <div className="min-h-screen">
      <TopNav onSearchChange={() => {}} onToggleSidebar={() => {}} />

      <main className="container mx-auto px-4 py-8 max-w-5xl mt-24">
        {/* Hero Section */}
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
            {/* YouTube Video */}
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

            {/* Content */}
            <section className="glass rounded-3xl p-8 md:p-12 mb-8">
              <style>{`
                .prose img[width] {
                  max-width: 100%;
                }
                .prose img[width]:is([width="1"], [width="2"], [width="3"], [width="4"], [width="5"], [width="10"], [width="20"], [width="50"], [width="100"], [width="120"], [width="150"], [width="200"], [width="250"]) {
                  display: none !important;
                }
                .prose iframe[width] {
                  min-width: 100%;
                }
                .prose iframe:is([width="100"], [width="120"], [width="150"], [width="200"], [width="250"], [width="300"], [width="350"]) {
                  display: none !important;
                }
                .prose .kg-card:has(img[width]:is([width="1"], [width="2"], [width="3"], [width="4"], [width="5"], [width="10"], [width="20"], [width="50"], [width="100"], [width="120"], [width="150"], [width="200"], [width="250"])) {
                  display: none !important;
                }
              `}</style>
              <div
                className="prose prose-invert prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: filterSmallVideos(pageContent.html || "") }}
              />
            </section>

            {/* CTA Section */}
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
