import { useState, useEffect, useRef } from "react";
import { fetchPageBySlug } from "@/lib/ghostApi";
import { GhostPost } from "@/lib/ghostApi";
import TopNav from "@/components/TopNav";

const RoadmapPage = () => {
  const [pageContent, setPageContent] = useState<GhostPost | null>(null);
  const [loading, setLoading] = useState(true);
  const shownRef = useRef(false);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  // Load ConvertKit script and install a single-run guard to prevent multi-open
  useEffect(() => {
    const POPUP_KEY = 'convertkit-popup-shown';
    const w = window as any;

    // If already shown this session, don't do anything else
    if (sessionStorage.getItem(POPUP_KEY) === 'true') {
      return;
    }

    // Ensure script loaded only once
    const existingScript = document.querySelector('script[src*="kit.com/fbd8fa5d1b"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://bi-fintech-consultant-academy.kit.com/fbd8fa5d1b/index.js';
      script.async = true;
      script.setAttribute('data-uid', 'fbd8fa5d1b');
      document.head.appendChild(script);
      scriptRef.current = script;
    }

    // Patch formkit.show to be idempotent for the session
    let attempts = 0;
    const maxAttempts = 150; // ~30s @ 200ms
    const intervalId = setInterval(() => {
      attempts++;
      const w = window as any;
      const fk = w.formkit;

      // Once SDK is present, wrap show() so it runs at most once per session
      if (fk && typeof fk.show === 'function' && !w.__ck_show_patched) {
        w.__ck_show_patched = true;
        const originalShow = fk.show.bind(fk);
        fk.show = (id: string) => {
          if (sessionStorage.getItem(POPUP_KEY) === 'true') {
            // Already shown this session
            return;
          }
          // Mark as shown and open once
          sessionStorage.setItem(POPUP_KEY, 'true');
          try {
            originalShow(id);
          } catch (e) {
            console.error('ConvertKit show error:', e);
          }
        };

        // Auto-open once after patch if not already shown
        setTimeout(() => {
          if (sessionStorage.getItem(POPUP_KEY) !== 'true') {
            try {
              fk.show('fbd8fa5d1b');
            } catch (e) {
              console.error('Auto-open error:', e);
            }
          }
        }, 2000);

        clearInterval(intervalId);
      }

      if (attempts >= maxAttempts) {
        clearInterval(intervalId);
        if (!w.formkit) console.error('ConvertKit load failed');
      }
    }, 200);

    return () => {
      clearInterval(intervalId);
      // Keep sessionStorage POPUP_KEY so it never re-opens this session
    };
  }, []);

  useEffect(() => {
    const loadPage = async () => {
      const cacheKey = 'ghost:page:2026-bi-fintech-consulting-roadmap-pdf-unlock';
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
        const content = await fetchPageBySlug('2026-bi-fintech-consulting-roadmap-pdf-unlock');
        if (content) {
          setPageContent(content);
          setLoading(false);
        }
      } catch (e) {
        console.error('Roadmap fetch failed:', e);
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

            {/* CTA Section – Fallback button */}
            <section className="glass-strong rounded-3xl p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Ready to Get Started?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Download your free roadmap PDF and start your journey to becoming a successful BI-FinTech consultant.
              </p>
              <a
                data-formkit-toggle="fbd8fa5d1b"
                href="https://bifintechconsulting.com/roadmap-signup"
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
