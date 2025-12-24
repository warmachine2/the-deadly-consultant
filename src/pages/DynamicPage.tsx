import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import TopNav from "@/components/TopNav";
import { fetchPageBySlug, fetchPostBySlug, GhostPost } from "@/lib/ghostApi";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Loader2 } from "lucide-react";

const DynamicPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [content, setContent] = useState<GhostPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      if (!slug) return;

      setLoading(true);
      setNotFound(false);

      try {
        // Try fetching as a page first
        let result = await fetchPageBySlug(slug);

        if (result) {
          setContent(result);
          setLoading(false);
          return;
        }

        // If not found as page, try as post
        result = await fetchPostBySlug(slug);

        if (result) {
          setContent(result);
          setLoading(false);
          return;
        }

        // Not found
        setNotFound(true);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching content:", error);
        setNotFound(true);
        setLoading(false);
      }
    };

    fetchContent();
  }, [slug]);

  const StrategySessionCTA = (
    <div className="my-8 flex justify-center">
      <a 
        href="/book-session"
        className="inline-flex items-center justify-center gap-3 px-8 py-4 text-lg font-bold rounded-2xl transition-all duration-300 
          bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-400
          text-gray-900 hover:text-gray-800
          border-2 border-amber-300/60
          hover:scale-105 hover:from-amber-400 hover:via-yellow-400 hover:to-amber-300
          active:scale-95
          cta-glow-pulse-gentle"
      >
        <CalendarCheck className="w-6 h-6" />
        Book Free 45-Min Strategy Session
      </a>
    </div>
  );

  const renderedContent = useMemo(() => {
    if (!content?.html) return null;

    const rawHtml = (() => {
      let html =
        slug === "roadmap-thank-you"
          ? (content.html || "")
              .replace(
                /href="[^"]*"([^>]*>Back to Video)/gi,
                'href="/2026-bi-fintech-consulting-roadmap-pdf-unlock"$1'
              )
              .replace(/Accelerate to mastery/gi, "Accelerate To Mastery")
              .replace(
                /href="[^"]*"([^>]*>Join Now)/gi,
                'href="https://www.skool.com/bi-fintech-consultant-academy/about"$1'
              )
          : content.html || "";

      // Strip inline color styles from headings
      html = html.replace(
        /<(h[1-6])([^>]*?)style="[^"]*color[^"]*"([^>]*)>/gi,
        "<$1$2$3>"
      );
      html = html.replace(
        /<(h[1-6])([^>]*?)style='[^']*color[^']*'([^>]*)>/gi,
        "<$1$2$3>"
      );
      return html;
    })();

    const CTA_1 = "<!--LOVABLE_STRATEGY_CTA_1-->";
    const CTA_2 = "<!--LOVABLE_STRATEGY_CTA_2-->";

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(rawHtml, "text/html");
      const body = doc.body;

      const containsText = (el: Element | null, text: string) =>
        (el?.textContent || "").toLowerCase().includes(text.toLowerCase());

      // Remove bottom "Ready to get started" glass panel (if present inside Ghost HTML)
      const readyNode = Array.from(body.querySelectorAll("*"))
        .filter((el) => (el.textContent || "").trim().length > 0)
        .find((el) => containsText(el, "ready to get started"));
      if (readyNode) {
        const removable =
          readyNode.closest("section,article,aside,footer,div") || readyNode;
        removable.remove();
      }

      // Target #1: button under "Mini-Roadmap Overview" figure but above "Your AI-Proof..." heading
      const figures = Array.from(body.querySelectorAll("figure"));
      const miniFigure = figures.find((fig) => containsText(fig, "mini-roadmap overview"));

      const headings = Array.from(body.querySelectorAll("h1,h2,h3,h4,h5,h6"));
      const aiProofHeading = headings.find((h) => containsText(h, "your ai-proof"));

      if (aiProofHeading && miniFigure) {
        // only place CTA_1 if the heading is after the mini figure
        const orderOk =
          miniFigure.compareDocumentPosition(aiProofHeading) &
          Node.DOCUMENT_POSITION_FOLLOWING;
        if (orderOk) {
          aiProofHeading.insertAdjacentHTML("beforebegin", CTA_1);
        } else {
          miniFigure.insertAdjacentHTML("afterend", CTA_1);
        }
      } else if (aiProofHeading) {
        aiProofHeading.insertAdjacentHTML("beforebegin", CTA_1);
      } else if (miniFigure) {
        miniFigure.insertAdjacentHTML("afterend", CTA_1);
      }

      // Target #2: button above the bottom-most picture
      const visuals = Array.from(body.querySelectorAll("figure, img"));
      const lastVisual = visuals.length ? visuals[visuals.length - 1] : null;
      if (lastVisual) {
        lastVisual.insertAdjacentHTML("beforebegin", CTA_2);
      }

      const finalHtml = body.innerHTML;
      const segments = finalHtml.split(new RegExp(`${CTA_1}|${CTA_2}`, "g"));
      const markers = Array.from(
        finalHtml.matchAll(new RegExp(`${CTA_1}|${CTA_2}`, "g"))
      ).map((m) => m[0]);

      const nodes: JSX.Element[] = [];
      for (let i = 0; i < segments.length; i++) {
        const htmlSeg = segments[i];
        if (htmlSeg.trim()) {
          nodes.push(
            <div key={`html-${i}`} dangerouslySetInnerHTML={{ __html: htmlSeg }} />
          );
        }
        if (markers[i]) {
          nodes.push(<div key={`cta-${i}`}>{StrategySessionCTA}</div>);
        }
      }

      return nodes;
    } catch {
      // If parsing fails, render without injection (safe fallback)
      return (
        <div
          dangerouslySetInnerHTML={{ __html: rawHtml }}
          className="dynamic-page-content"
        />
      );
    }
  }, [content?.html, slug]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <TopNav onSearchChange={() => {}} onToggleSidebar={() => {}} />
        <div className="flex justify-center items-center min-h-[60vh] pt-24">
          <Loader2 className="w-8 h-8 text-accent animate-spin" />
        </div>
      </div>
    );
  }

  if (notFound || !content) {
    return (
      <div className="min-h-screen">
        <TopNav onSearchChange={() => {}} onToggleSidebar={() => {}} />
        <div className="flex items-center justify-center min-h-[60vh] pt-24 px-4">
          <div className="volumetric-glass rounded-3xl p-12 text-center max-w-md">
            <h1 className="text-3xl font-bold text-white mb-4">Page not found</h1>
            <p className="text-muted-foreground mb-6">
              Visit the main blog to explore our content.
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-3 volumetric-glass-button rounded-xl text-white hover:text-[#F4C903] transition-all"
            >
              Go to Main Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden">
      <TopNav onSearchChange={() => {}} onToggleSidebar={() => {}} />

      <div className="pt-20 lg:pt-24 px-4 md:px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Content Card */}
          <article className="volumetric-glass rounded-3xl overflow-hidden">
            {/* Featured Image - Hidden visually but kept for thumbnail/preview generation */}
            {content.feature_image && (
              <div className="sr-only">
                <img
                  src={content.feature_image}
                  alt={content.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-6 md:p-10">
              <h1
                className="text-3xl md:text-4xl font-bold text-[#FFE361] mb-6"
                style={{
                  textShadow:
                    "-0.5px -0.5px 0 #000, 0.5px -0.5px 0 #000, -0.5px 0.5px 0 #000, 0.5px 0.5px 0 #000, 0 4px 12px rgba(0, 0, 0, 0.8), 0 8px 24px rgba(0, 0, 0, 0.6)",
                  WebkitTextStroke: "0.5px #000",
                }}
              >
                {content.title}
              </h1>

              {content.tags && content.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {content.tags
                    .filter((tag) => !tag.slug.startsWith("hash-"))
                    .map((tag) => (
                      <span
                        key={tag.slug}
                        className="px-3 py-1 volumetric-glass-button rounded-full text-sm text-white/80 hover:text-[#F4C903] hover:font-bold transition-all cursor-default"
                      >
                        {tag.name}
                      </span>
                    ))}
                </div>
              )}

              {slug === "roadmap-thank-you" && (
                <style>{`
                  .roadmap-thank-you-content h1,
                  .roadmap-thank-you-content h2 {
                    color: white !important;
                  }
                  .roadmap-thank-you-content p:first-of-type {
                    color: white !important;
                  }
                  .roadmap-thank-you-content p:nth-of-type(2) {
                    color: #a3a3a3 !important;
                  }
                  .roadmap-thank-you-content a {
                    color: #FCDC49 !important;
                  }
                `}</style>
              )}

              <style>{`
                .dynamic-page-content h1,
                .dynamic-page-content h2,
                .dynamic-page-content h3,
                .dynamic-page-content h4,
                .dynamic-page-content h5,
                .dynamic-page-content h6,
                .dynamic-page-content h1 *,
                .dynamic-page-content h2 *,
                .dynamic-page-content h3 *,
                .dynamic-page-content h4 *,
                .dynamic-page-content h5 *,
                .dynamic-page-content h6 *,
                .dynamic-page-content h1[style],
                .dynamic-page-content h2[style],
                .dynamic-page-content h3[style],
                .dynamic-page-content h4[style],
                .dynamic-page-content h5[style],
                .dynamic-page-content h6[style] {
                  color: #FFE361 !important;
                }

                /* Body text and list items */
                .dynamic-page-content p,
                .dynamic-page-content p[style],
                .dynamic-page-content p *,
                .dynamic-page-content li,
                .dynamic-page-content li[style],
                .dynamic-page-content li *,
                .dynamic-page-content ul,
                .dynamic-page-content ol,
                .dynamic-page-content span,
                .dynamic-page-content span[style],
                .dynamic-page-content div:not(.dynamic-page-content),
                .dynamic-page-content div[style],
                .dynamic-page-content strong,
                .dynamic-page-content em,
                .dynamic-page-content b,
                .dynamic-page-content i,
                .dynamic-page-content a,
                .dynamic-page-content blockquote,
                .dynamic-page-content blockquote * {
                  color: white !important;
                }

                .dynamic-page-content a:hover {
                  color: #FFE361 !important;
                }

                .dynamic-page-content ul li::marker,
                .dynamic-page-content ol li::marker {
                  color: white !important;
                }

                /* Default YouTube embeds - landscape 16:9 */
                .dynamic-page-content iframe[src*="youtube.com/embed"] {
                  display: block;
                  margin: 0 auto;
                  width: 100%;
                  max-width: 800px;
                  aspect-ratio: 16 / 9;
                  height: auto;
                }

                /* YouTube Shorts - vertical 9:16 */
                .dynamic-page-content iframe[src*="youtube.com/embed/shorts"],
                .dynamic-page-content .youtube-short iframe {
                  max-width: 400px;
                  aspect-ratio: 9 / 16;
                  height: auto;
                }

                @media (min-width: 768px) {
                  .dynamic-page-content iframe[src*="youtube.com/embed/shorts"],
                  .dynamic-page-content .youtube-short iframe {
                    max-width: 450px;
                  }
                }
              `}</style>

              <div
                className={`prose prose-invert prose-lg max-w-none text-foreground dynamic-page-content
                  [&_h1]:font-bold [&_h2]:font-bold [&_h3]:font-bold [&_h4]:font-bold
                  ${slug === "roadmap-thank-you" ? "roadmap-thank-you-content" : ""}`}
              >
                {renderedContent}
              </div>
            </div>
          </article>

          {/* Back to home link */}
          <div className="mt-8 text-center">
            <Link
              to="/"
              className="inline-block px-6 py-3 volumetric-glass-button rounded-xl text-white hover:text-[#F4C903] transition-all"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      <footer className="volumetric-glass rounded-t-3xl mt-12 py-6 px-6">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 The Deadly Consultant. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default DynamicPage;
