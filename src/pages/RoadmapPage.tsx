import { useState, useEffect } from "react";
import { fetchPageBySlug } from "@/lib/ghostApi";
import { GhostPost } from "@/lib/ghostApi";
import TopNav from "@/components/TopNav";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const RoadmapPage = () => {
  const [pageContent, setPageContent] = useState<GhostPost | null>(null);
  const [loading, setLoading] = useState(true);

  // Load ConvertKit FormKit script (only once)
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://bifintechconsulting.com/fkd.js";
    script.setAttribute("data-formkit-account", "bifintechconsulting.com");
    script.async = true;
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const loadPage = async () => {
      setLoading(true);
      const content = await fetchPageBySlug("2026-bi-fintech-consulting-roadmap-pdf-unlock");
      setPageContent(content);
      setLoading(false);
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

      {/* Banner with return/home buttons */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-gray-900/95 to-purple-900/95 backdrop-blur border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-5xl">
          <Link to="/" className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "gap-2 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:backdrop-blur-sm hover:animate-glow-pulse transition-all duration-300",
                "font-bold tracking-tight",
              )}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="text-lg" style={{ fontFamily: "Play, sans-serif" }}>
                The Deadly Consultant
              </span>
            </Button>
          </Link>

          <Link to="/">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "gap-1 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:backdrop-blur-sm hover:animate-glow-pulse transition-all duration-300",
              )}
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </Button>
          </Link>
        </div>
      </div>

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

            {/* CTA Section – ConvertKit Modal Toggle */}
            <section className="glass-strong rounded-3xl p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Ready to Get Started?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Download your free roadmap PDF and start your journey to becoming a successful BI-FinTech consultant.
              </p>
              {/* Injected: ConvertKit Modal Toggle Link */}
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
