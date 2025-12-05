import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TopNav from "@/components/TopNav";
import { fetchPostBySlug, GhostPost } from "@/lib/ghostApi";
import { Loader2 } from "lucide-react";

const AboutPage = () => {
  const [content, setContent] = useState<GhostPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAboutContent = async () => {
      setLoading(true);
      setError(null);

      try {
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
      <div className="min-h-screen">
        <TopNav onSearchChange={() => {}} onToggleSidebar={() => {}} />
        <div className="flex justify-center items-center min-h-[60vh] pt-24">
          <Loader2 className="w-8 h-8 text-accent animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-screen">
        <TopNav onSearchChange={() => {}} onToggleSidebar={() => {}} />
        <div className="flex items-center justify-center min-h-[60vh] pt-24 px-4">
          <div className="volumetric-glass rounded-3xl p-12 text-center max-w-md">
            <h1 className="text-3xl font-bold text-white mb-4">
              About page not found
            </h1>
            <p className="text-muted-foreground mb-6">
              {error || "The about content is not available yet."}
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
            {/* Featured Image */}
            {content.feature_image && (
              <div className="w-full h-64 md:h-80 overflow-hidden">
                <img 
                  src={content.feature_image} 
                  alt={content.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-6 md:p-10">
              <h1 className="text-3xl md:text-4xl font-bold text-[#F4C903] mb-6" style={{ textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 0 0 20px rgba(0, 0, 0, 0.5)', WebkitTextStroke: '1px #000' }}>
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

              <div
                className="prose prose-invert prose-lg max-w-none text-foreground
                  [&_h1]:text-[#F4C903] [&_h2]:text-[#F4C903] [&_h3]:text-[#F4C903] [&_h4]:text-[#F4C903] [&_h5]:text-[#F4C903] [&_h6]:text-[#F4C903]
                  [&_h1]:font-bold [&_h2]:font-bold [&_h3]:font-bold [&_h4]:font-bold"
                dangerouslySetInnerHTML={{ __html: content.html || "" }}
              />
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

export default AboutPage;
