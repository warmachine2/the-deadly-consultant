import { useState, useEffect, useRef, useCallback } from "react";
import { fetchPageBySlug } from "@/lib/ghostApi";
import { GhostPost } from "@/lib/ghostApi";
import TopNav from "@/components/TopNav";

const RoadmapPage = () => {
  const [pageContent, setPageContent] = useState<GhostPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFormkitReady, setIsFormkitReady] = useState(false);
  const shownRef = useRef(false); // Tracks if we've attempted auto-show (for session guard)
  const intervalRef = useRef<number | null>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const ctaIntervalRef = useRef<number | null>(null); // NEW: Separate ref for CTA retry to avoid conflict

  // Load ConvertKit script with onload for readiness
  useEffect(() => {
    const existingScript = document.querySelector('script[data-uid="fbd8fa5d1b"]');
    if (existingScript) {
      console.log("ConvertKit script already loaded");
      if (window.formkit) setIsFormkitReady(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://bi-fintech-consultant-academy.kit.com/fbd8fa5d1b/index.js";
    script.async = true;
    script.setAttribute("data-uid", "fbd8fa5d1b");
    script.onload = () => {
      console.log("ConvertKit script loaded, checking formkit...");
      const checkReady = () => {
        if (window.formkit) {
          setIsFormkitReady(true);
          console.log("Formkit ready!");
        } else {
          setTimeout(checkReady, 100);
        }
      };
      checkReady();
    };
    document.head.appendChild(script);
    scriptRef.current = script;

    return () => {
      if (scriptRef.current && document.head.contains(scriptRef.current)) {
        document.head.removeChild(scriptRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (ctaIntervalRef.current) {
        clearInterval(ctaIntervalRef.current);
        ctaIntervalRef.current = null;
      }
    };
  }, []);

  // UPDATED: Shared attemptShow function as useCallback to access fresh state
  const attemptShow = useCallback(
    (isAuto = true, isRetry = false) => {
      const formId = "fbd8fa5d1b";

      // For auto-show only: Guard with session + ref to show once per session
      if (isAuto && (sessionStorage.getItem("roadmap_popup_shown") || shownRef.current)) {
        console.log("Auto-show already done this session, skipping");
        return true; // Treated as handled
      }

      // Common lock check
      if (window.popupLocked) {
        console.log("Popup locked, skipping show");
        return false; // Allow retry
      }

      // Readiness check (now uses current state via callback)
      if (window.formkit?.show && isFormkitReady) {
        console.log(isAuto ? "Auto-showing ConvertKit popup once" : "Showing ConvertKit popup via CTA");
        window.popupLocked = true;
        window.formkit.show(formId);

        // Set session/ref only for auto (CTA doesn't set session, allows re-show if closed)
        if (isAuto) {
          sessionStorage.setItem("roadmap_popup_shown", "1");
          shownRef.current = true;
        }

        setTimeout(() => {
          window.popupLocked = false;
        }, 1000);
        return true; // Handled
      }

      return false; // Not ready, retry if applicable
    },
    [isFormkitReady],
  ); // Dep on readiness for fresh check

  // Auto-show effect: Once per session, on readiness
  useEffect(() => {
    if (!isFormkitReady) return; // Wait for ready

    const tryAuto = () => {
      if (attemptShow(true, false)) return true; // isAuto=true

      if (!shownRef.current) {
        // Only start retry if not guarded out
        console.log("Formkit ready but initial auto failed, starting retry...");
        intervalRef.current = window.setInterval(() => {
          if (attemptShow(true, true)) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
          }
        }, 250);
        setTimeout(() => {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            console.log("Auto-show timeout, skipping");
          }
        }, 5000);
      }
      return false;
    };

    tryAuto();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [attemptShow]); // Depend on callback (which deps readiness)

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

  // UPDATED: CTA handler - triggers show (no session guard, allows re-show if closed), with retry if not ready
  const handleCTAClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      console.log("CTA clicked: attempting popup");

      const tryCTA = () => {
        if (attemptShow(false, false)) return true; // isAuto=false, no session guard

        console.log("CTA: Formkit not ready, starting one-time retry...");
        ctaIntervalRef.current = window.setInterval(() => {
          if (attemptShow(false, true)) {
            if (ctaIntervalRef.current) {
              clearInterval(ctaIntervalRef.current);
              ctaIntervalRef.current = null;
            }
          }
        }, 250);
        // Short retry for click: 3s max
        setTimeout(() => {
          if (ctaIntervalRef.current) {
            clearInterval(ctaIntervalRef.current);
            ctaIntervalRef.current = null;
            console.log("CTA retry timeout - popup not shown");
          }
        }, 3000);
        return false;
      };

      tryCTA();
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
                href="https://bifintechconsulting.com/roadmap-signup" // Fallback href if JS fails (but no auto-open)
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
