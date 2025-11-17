import { useState, useEffect, useRef } from "react";
import { fetchPageBySlug } from "@/lib/ghostApi";
import { GhostPost } from "@/lib/ghostApi";
import TopNav from "@/components/TopNav";

const RoadmapPage = () => {
  const [pageContent, setPageContent] = useState<GhostPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFormkitReady, setIsFormkitReady] = useState(false); // NEW: Track SDK readiness
  const shownRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // NEW: Ref for single interval tracking
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  // Load ConvertKit script with onload for readiness
  useEffect(() => {
    // Check if already loaded to avoid duplicates
    const existingScript = document.querySelector('script[data-uid="fbd8fa5d1b"]');
    if (existingScript) {
      console.log("ConvertKit script already loaded");
      // Assume ready if exists (quick check)
      if (window.formkit) setIsFormkitReady(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://bi-fintech-consultant-academy.kit.com/fbd8fa5d1b/index.js";
    script.async = true;
    script.setAttribute("data-uid", "fbd8fa5d1b");
    script.onload = () => {
      // NEW: Explicit readiness on load
      console.log("ConvertKit script loaded, checking formkit...");
      // Poll briefly for formkit init (SDK sometimes needs a tick)
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
    if (window.formkit?.show && isFormkitReady) {
      // Use readiness state
      console.log("Showing ConvertKit popup");
      window.popupLocked = true;
      window.formkit.show(formId);
      if (!shownRef.current) {
        // Only set session if first show
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
    if (sessionStorage.getItem("roadmap_popup_shown") || shownRef.current) return;

    const attemptShow = (isRetry = false) => {
      const handled = tryShowPopup.current(isRetry);
      if (handled) return true;

      if (!isRetry) {
        // Initial attempt failed → start retry only once
        console.log("Formkit not ready, starting retry...");
        intervalRef.current = window.setInterval(() => {
          if (attemptShow(true)) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
          }
        }, 250);
        // Safety net: Stop after 5s
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

    attemptShow(); // Kick off

    // Cleanup in this effect too
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isFormkitReady]); // NEW: Depend on readiness to re-trigger if loads late

  useEffect(() => {
    const loadPage = async () => {
      const cacheKey = "ghost:page:2026-bi-fintech-consulting-roadmap-pdf-unlock";
      // Try cache first to avoid flicker on re-mounts
      try {
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
          setPageContent(JSON.parse(cached));
          setLoading(false);
        }
      } catch {}

      // Fetch fresh content in background (no loading flicker)
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

  // NEW: CTA click handler with retry/fallback
  const handleCTAClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("CTA clicked: attempting popup");
    const handled = tryShowPopup.current();
    if (!handled) {
      console.log("Popup not ready, falling back to direct link");
      window.open("https://bifintechconsulting.com/roadmap-signup", "_blank");
    }
  };

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

            {/* CTA Section – Updated with shared handler */}
            <section className="glass-strong rounded-3xl p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Ready to Get Started?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Download your free roadmap PDF and start your journey to becoming a successful BI-FinTech consultant.
              </p>
              <a
                href="https://bifintechconsulting.com/roadmap-signup"
                onClick={handleCTAClick} // UPDATED: Use shared handler
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
