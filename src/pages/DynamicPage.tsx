import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import TopNav from "@/components/TopNav";
import { fetchPostBySlug, fetchPageBySlug, GhostPost } from "@/lib/ghostApi";
import { Loader2, CalendarCheck } from "lucide-react";

// Strategy Session Button Component
const StrategySessionButton = () => (
  <div className="my-8 text-center">
    <a
      href="https://calendly.com/hassankhalidkhan"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center px-8 py-4 rounded-2xl font-bold text-white transition-all duration-300 hover:scale-105 strategy-session-glow"
      style={{
        background: 'linear-gradient(135deg, rgba(0, 100, 200, 0.8), rgba(0, 150, 255, 0.6))',
        boxShadow: '0 0 30px rgba(0, 150, 255, 0.5), 0 0 60px rgba(0, 150, 255, 0.3)',
        border: '1px solid rgba(0, 150, 255, 0.4)'
      }}
    >
      <CalendarCheck className="w-5 h-5 mr-2" />
      Book Free 45-Min Strategy Session
    </a>
  </div>
);

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
            <h1 className="text-3xl font-bold text-white mb-4">
              Page not found
            </h1>
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
              <h1 className="text-3xl md:text-4xl font-bold text-[#FFE361] mb-6" style={{ textShadow: '-0.5px -0.5px 0 #000, 0.5px -0.5px 0 #000, -0.5px 0.5px 0 #000, 0.5px 0.5px 0 #000, 0 4px 12px rgba(0, 0, 0, 0.8), 0 8px 24px rgba(0, 0, 0, 0.6)', WebkitTextStroke: '0.5px #000' }}>
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

              {slug === 'roadmap-thank-you' && (
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
                /* Body text and list items - white - override all inline styles */
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
                /* Links can have accent color on hover */
                .dynamic-page-content a:hover {
                  color: #FFE361 !important;
                }
                /* Bullet points */
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
                /* Strategy session button glow animation */
                @keyframes strategyGlow {
                  0%, 100% {
                    box-shadow: 0 0 30px rgba(0, 150, 255, 0.5), 0 0 60px rgba(0, 150, 255, 0.3);
                  }
                  50% {
                    box-shadow: 0 0 40px rgba(0, 150, 255, 0.7), 0 0 80px rgba(0, 150, 255, 0.5), 0 0 100px rgba(0, 150, 255, 0.3);
                  }
                }
                .strategy-session-btn {
                  animation: strategyGlow 2s ease-in-out infinite;
                }
              `}</style>

              {/* Render content with injected strategy buttons */}
              {(() => {
                const rawHtml = (() => {
                  let html = slug === 'roadmap-thank-you' 
                    ? (content.html || "")
                        .replace(
                          /href="[^"]*"([^>]*>Back to Video)/gi,
                          'href="/2026-bi-fintech-consulting-roadmap-pdf-unlock"$1'
                        )
                        .replace(/Accelerate to mastery/gi, 'Accelerate To Mastery')
                        .replace(
                          /href="[^"]*"([^>]*>Join Now)/gi,
                          'href="https://www.skool.com/bi-fintech-consultant-academy/about"$1'
                        )
                    : (content.html || "");
                  // Strip inline color styles from headings
                  html = html.replace(/<(h[1-6])([^>]*?)style="[^"]*color[^"]*"([^>]*)>/gi, '<$1$2$3>');
                  html = html.replace(/<(h[1-6])([^>]*?)style='[^']*color[^']*'([^>]*)>/gi, '<$1$2$3>');
                  return html;
                })();

                // Find position of "Your AI-Proof" heading to insert button before it
                const aiProofMatch = rawHtml.match(/<h[2-4][^>]*>[^<]*Your AI-Proof/i);
                const aiProofIndex = aiProofMatch ? rawHtml.indexOf(aiProofMatch[0]) : -1;

                // Find the last image in the content to insert button before it
                const imgMatches = [...rawHtml.matchAll(/<figure[^>]*>[\s\S]*?<img[^>]*>[\s\S]*?<\/figure>|<img[^>]*>/gi)];
                const lastImgMatch = imgMatches.length > 0 ? imgMatches[imgMatches.length - 1] : null;
                const lastImgIndex = lastImgMatch ? rawHtml.lastIndexOf(lastImgMatch[0]) : -1;

                // Strategy button HTML
                const strategyButtonHtml = `
                  <div style="margin: 2rem 0; text-align: center;">
                    <a 
                      href="https://calendly.com/hassankhalidkhan" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      class="strategy-session-btn"
                      style="
                        display: inline-flex;
                        align-items: center;
                        padding: 1rem 2rem;
                        border-radius: 1rem;
                        font-weight: bold;
                        color: white;
                        text-decoration: none;
                        transition: transform 0.3s ease;
                        background: linear-gradient(135deg, rgba(0, 100, 200, 0.8), rgba(0, 150, 255, 0.6));
                        border: 1px solid rgba(0, 150, 255, 0.4);
                      "
                      onmouseover="this.style.transform='scale(1.05)'"
                      onmouseout="this.style.transform='scale(1)'"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 0.5rem;"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="m9 16 2 2 4-4"/></svg>
                      Book Free 45-Min Strategy Session
                    </a>
                  </div>
                `;

                // Build final HTML with injected buttons
                let finalHtml = rawHtml;
                
                // Insert before "Your AI-Proof" heading (if found)
                if (aiProofIndex > 0) {
                  finalHtml = finalHtml.slice(0, aiProofIndex) + strategyButtonHtml + finalHtml.slice(aiProofIndex);
                }

                // Insert before the last image (if found and different from aiProofIndex area)
                // Recalculate index since we may have inserted content
                const adjustedLastImgIndex = lastImgMatch 
                  ? finalHtml.lastIndexOf(lastImgMatch[0]) 
                  : -1;
                
                if (adjustedLastImgIndex > 0 && lastImgMatch) {
                  finalHtml = finalHtml.slice(0, adjustedLastImgIndex) + strategyButtonHtml + finalHtml.slice(adjustedLastImgIndex);
                }

                return (
                  <div
                    className={`prose prose-invert prose-lg max-w-none text-foreground dynamic-page-content
                      [&_h1]:font-bold [&_h2]:font-bold [&_h3]:font-bold [&_h4]:font-bold
                      ${slug === 'roadmap-thank-you' ? 'roadmap-thank-you-content' : ''}`}
                    dangerouslySetInnerHTML={{ __html: finalHtml }}
                  />
                );
              })()}
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
