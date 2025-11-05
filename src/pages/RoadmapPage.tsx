import { useState, useEffect } from "react";
import { fetchPageBySlug } from "@/lib/ghostApi";
import { GhostPost } from "@/lib/ghostApi";
import TopNav from "@/components/TopNav";
import EmailCaptureModal from "@/components/EmailCaptureModal";

const RoadmapPage = () => {
  const [pageContent, setPageContent] = useState<GhostPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

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

  const handleEmailSubmit = (data: { name: string; email: string }) => {
    console.log("Email captured:", data);
    setModalOpen(false);
    // Placeholder for future backend integration
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
              {loading ? "Loading..." : pageContent?.title || "2026 BI-FinTech Consulting Roadmap"}
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
              <div
                className="prose prose-invert prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: pageContent.html || "" }}
              />
            </section>

            {/* CTA Section */}
            <section className="glass-strong rounded-3xl p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Download your free roadmap PDF and start your journey to becoming a successful BI-FinTech consultant.
              </p>
              <button
                onClick={() => setModalOpen(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-lg"
              >
                Get Your Free Roadmap PDF
              </button>
            </section>
          </>
        ) : (
          <div className="glass rounded-3xl p-12 text-center">
            <p className="text-muted-foreground">
              Content not available. Please check back later.
            </p>
          </div>
        )}
      </main>

      <EmailCaptureModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleEmailSubmit}
      />
    </div>
  );
};

export default RoadmapPage;
