import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TopNav from "@/components/TopNav";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchPostBySlug, GhostPost } from "@/lib/ghostApi";

const AboutPage = () => {
  const [content, setContent] = useState<GhostPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAboutContent = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch the about-post using the same edge function as other posts
        const post = await fetchPostBySlug("about-post");
        
        if (post) {
          setContent(post);
        } else {
          setError("About content not found");
        }
      } catch (err) {
        console.error("Error fetching about content:", err);
        setError("Failed to load about content");
      } finally {
        setLoading(false);
      }
    };

    fetchAboutContent();
  }, []);

  if (loading) {
    return (
      <>
        <TopNav onSearchChange={() => {}} onToggleSidebar={() => {}} />
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </>
    );
  }

  if (error || !content) {
    return (
      <>
        <TopNav onSearchChange={() => {}} onToggleSidebar={() => {}} />
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "Play, sans-serif" }}>
              About page not found
            </h1>
            <p className="text-white/80 mb-6">
              {error || "The about content is not available yet."}
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all"
            >
              Go to Main Blog
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <TopNav onSearchChange={() => {}} onToggleSidebar={() => {}} />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
        {/* Banner with navigation */}
        <div className="sticky top-0 z-40 bg-gradient-to-r from-gray-900/95 to-purple-900/95 backdrop-blur border-b border-white/10">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-4xl">
            <Link to="/" className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "gap-2 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:backdrop-blur-sm hover:animate-glow-pulse transition-all duration-300",
                  "font-bold tracking-tight"
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
                  "gap-1 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:backdrop-blur-sm hover:animate-glow-pulse transition-all duration-300"
                )}
              >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Home</span>
              </Button>
            </Link>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16 max-w-4xl">
          {/* Featured Image */}
          {content.feature_image && (
            <div className="mb-8 rounded-2xl overflow-hidden">
              <img src={content.feature_image} alt={content.title} className="w-full h-auto" />
            </div>
          )}

          {/* Content Card */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: "Play, sans-serif" }}>
              {content.title}
            </h1>

            {content.tags && content.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {content.tags
                  .filter((tag) => !tag.slug.startsWith("hash-"))
                  .map((tag) => (
                    <span
                      key={tag.slug}
                      className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white/80 border border-white/20"
                    >
                      {tag.name}
                    </span>
                  ))}
              </div>
            )}

            <div
              className="prose prose-invert prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: content.html || "" }}
              style={{
                fontFamily: "Play, sans-serif",
                color: "rgba(255, 255, 255, 0.9)",
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
