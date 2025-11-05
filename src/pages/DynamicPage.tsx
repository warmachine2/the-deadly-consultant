import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import TopNav from "@/components/TopNav";

const GHOST_API_URL = "https://thedeadlyconsultant.com/ghost/api/content";
const GHOST_API_KEY = "138812683c4aee42ad4d684a05";

interface GhostContent {
  id: string;
  title: string;
  html: string;
  feature_image?: string;
  tags?: Array<{ name: string; slug: string }>;
  published_at: string;
}

const DynamicPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [content, setContent] = useState<GhostContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      if (!slug) return;

      setLoading(true);
      setNotFound(false);

      try {
        // Try fetching as a page first
        let response = await fetch(
          `${GHOST_API_URL}/pages/slug/${slug}/?key=${GHOST_API_KEY}&include=tags`
        );

        let data;
        if (response.ok) {
          data = await response.json();
          if (data.pages && data.pages[0]) {
            setContent(data.pages[0]);
            setLoading(false);
            return;
          }
        }

        // If not found as page, try as post
        response = await fetch(
          `${GHOST_API_URL}/posts/slug/${slug}/?key=${GHOST_API_KEY}&include=tags`
        );

        if (response.ok) {
          data = await response.json();
          if (data.posts && data.posts[0]) {
            setContent(data.posts[0]);
            setLoading(false);
            return;
          }
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
      <>
        <TopNav onSearchChange={() => {}} onToggleSidebar={() => {}} />
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </>
    );
  }

  if (notFound || !content) {
    return (
      <>
        <TopNav onSearchChange={() => {}} onToggleSidebar={() => {}} />
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Play, sans-serif' }}>
              Page not found
            </h1>
            <p className="text-white/80 mb-6">
              Visit the main blog to explore our content.
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
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          {/* Featured Image */}
          {content.feature_image && (
            <div className="mb-8 rounded-2xl overflow-hidden">
              <img
                src={content.feature_image}
                alt={content.title}
                className="w-full h-auto"
              />
            </div>
          )}

          {/* Content Card */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8 md:p-12">
            {/* Title */}
            <h1
              className="text-4xl md:text-5xl font-bold text-white mb-6"
              style={{ fontFamily: 'Play, sans-serif' }}
            >
              {content.title}
            </h1>

            {/* Tags */}
            {content.tags && content.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {content.tags.map((tag) => (
                  <span
                    key={tag.slug}
                    className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm text-white/80 border border-white/20"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* HTML Content */}
            <div
              className="prose prose-invert prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: content.html }}
              style={{
                fontFamily: 'Play, sans-serif',
                color: 'rgba(255, 255, 255, 0.9)',
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default DynamicPage;
