import { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react";
import { fetchPageBySlug } from "@/lib/ghostApi";
import { GhostPost } from "@/lib/ghostApi";
import TopNav from "@/components/TopNav";
import useFormkitPopup from "@/hooks/useFormkitPopup";


const RoadmapPage = () => {
  const [pageContent, setPageContent] = useState<GhostPost | null>(null);
  const [loading, setLoading] = useState(true);
  // FIXED: Use the actual ConvertKit form UID from embed code
  const formId = "fbd8fa5d1b";
  // FIXED: Use the subdomain from embed code
  const creatorSubdomain = "bi-fintech-consultant-academy";
  const autoTriggeredRef = useRef(false);
  const ctaTriggeredRef = useRef(false);
  const triggerRef = useRef<HTMLAnchorElement | null>(null);
  const scriptLoadedRef = useRef(false); // Ensure single script load
  const refocusObserverRef = useRef<MutationObserver | null>(null);
  const cleanupTimeoutRef = useRef<number | null>(null); // For force cleanup

  const { ready, showAuto, showDebounced } = useFormkitPopup(formId, triggerRef); // Destructure correctly

  // Dynamic Script Load - ConvertKit embed script
  useLayoutEffect(() => {
    if (scriptLoadedRef.current) return;
    console.log("Loading ConvertKit script dynamically");

    const existingScript = document.querySelector(`script[data-uid="${formId}"]`);
    if (existingScript) {
      console.log("ConvertKit script already present");
      scriptLoadedRef.current = true;
      return;
    }

    const script = document.createElement("script");
    script.src = `https://${creatorSubdomain}.kit.com/${formId}/index.js`;
    script.async = true;
    script.setAttribute("data-uid", formId);
    script.onload = () => {
      console.log("ConvertKit script loaded - marking as ready");
      scriptLoadedRef.current = true;
      // Mark ready after short delay to ensure ConvertKit initializes
      setTimeout(() => {
        console.log("ConvertKit initialized, triggering ready state");
        if (window.formkitReady) {
          window.formkitReady[formId] = true;
        }
      }, 500);
    };
    script.onerror = () => {
      console.error("Failed to load ConvertKit script");
      scriptLoadedRef.current = true;
    };
    document.head.appendChild(script);
  }, [formId, creatorSubdomain]);

  useEffect(() => {
    if (autoTriggeredRef.current || !ready) return;
    console.log("Auto effect fired");
    autoTriggeredRef.current = true;
    setTimeout(() => {
      console.log(`Auto-show attempt: ready=${ready}`);
      showAuto();
    }, 2000);
  }, [showAuto, ready]);

  useEffect(() => {
    return () => {
      if (cleanupTimeoutRef.current) {
        clearTimeout(cleanupTimeoutRef.current);
        cleanupTimeoutRef.current = null;
      }
    };
  }, []);

  const forceCleanup = useCallback(() => {
    console.log("Force cleanup: Removing all ConvertKit elements");
    const ckElements = document.querySelectorAll('[class*="ck-"], [data-formkit-toggle]');
    ckElements.forEach((el) => el.remove());
    document.body.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Observer for modal close (enhanced: clear all CK elements)
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          const modalRemoved = Array.from(mutation.removedNodes).some(
            (node) =>
              node.nodeType === Node.ELEMENT_NODE && (node as Element).classList.contains("ck-subscription-form"),
          );
          if (modalRemoved) {
            console.log("Modal removed, refocusing + full cleanup");
            forceCleanup(); // FIXED: Force remove all
            observer.disconnect();
            // Reconnect observer for next show
            setTimeout(() => observer.observe(document.body, { childList: true, subtree: true }), 100);
          }
        }
      });
    });
    refocusObserverRef.current = observer;
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [forceCleanup]);

  // Escape listener (enhanced: full cleanup)
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const modal = document.querySelector(".ck-subscription-form");
        if (modal) {
          modal.remove();
          console.log("Escape closed modal, full cleanup");
          forceCleanup(); // FIXED: Force remove all
        }
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [forceCleanup]);

  // FIXED: Set force cleanup timeout after show (10s safety net)
  const setCleanupTimeout = useCallback(() => {
    if (cleanupTimeoutRef.current) clearTimeout(cleanupTimeoutRef.current);
    cleanupTimeoutRef.current = setTimeout(forceCleanup, 10000) as unknown as number; // 10s force close
  }, [forceCleanup]);

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
      e.stopPropagation();
      if (ctaTriggeredRef.current) {
        console.log("CTA already triggered, skipping");
        return;
      }
      console.log("CTA onClick fired");
      ctaTriggeredRef.current = true;
      showDebounced(1000);
      setCleanupTimeout();
      console.log("CTA triggered");
    },
    [showDebounced, setCleanupTimeout],
  );

  const formHref = "https://bifintechconsulting.com/roadmap-signup"; // FIXED: Use the href from embed code

  return (
    <div className="min-h-screen">
      <style>{`
        /* Mobile-only full-screen ConvertKit modal */
        @media (max-width: 767px) {
          [data-formkit-toggle] ~ .formkit-slide-in,
          .ck-subscription-form,
          [class*="formkit-modal"],
          [class*="ck-modal"] {
            width: 100vw !important;
            height: 100vh !important;
            max-width: 100vw !important;
            max-height: 100vh !important;
            border-radius: 0 !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            transform: none !important;
            margin: 0 !important;
            overflow-y: auto !important;
            padding: 1rem !important;
          }
          
          /* Scale down text and form elements inside ConvertKit modal on mobile */
          .ck-subscription-form h1,
          .ck-subscription-form h2,
          .ck-subscription-form h3,
          [class*="formkit"] h1,
          [class*="formkit"] h2,
          [class*="formkit"] h3 {
            font-size: 1.5rem !important;
            line-height: 1.3 !important;
            margin-bottom: 0.75rem !important;
          }
          
          .ck-subscription-form p,
          .ck-subscription-form label,
          .ck-subscription-form div,
          [class*="formkit"] p,
          [class*="formkit"] label,
          [class*="formkit"] div {
            font-size: 0.875rem !important;
            line-height: 1.4 !important;
          }
          
          .ck-subscription-form input,
          .ck-subscription-form button,
          [class*="formkit"] input,
          [class*="formkit"] button {
            font-size: 0.875rem !important;
            padding: 0.625rem 0.875rem !important;
          }
          
          .ck-subscription-form button,
          [class*="formkit"] button {
            font-size: 1rem !important;
            padding: 0.75rem 1.25rem !important;
          }
          
          /* Ensure proper spacing and prevent overflow */
          .ck-subscription-form *,
          [class*="formkit"] * {
            max-width: 100% !important;
            word-wrap: break-word !important;
          }
        }
      `}</style>
      <TopNav onSearchChange={() => {}} onToggleSidebar={() => {}} />

      {/* FIXED: Static Hidden Trigger with correct href */}
      <a
        ref={triggerRef}
        href={formHref}
        data-formkit-toggle={formId}
        style={{
          display: "none",
          position: "absolute",
          left: "-9999px",
        }}
      />

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
                href={formHref} // FIXED: Correct fallback URL
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
