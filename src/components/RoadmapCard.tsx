import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchPageBySlug } from "@/lib/ghostApi";
import { GhostPost } from "@/lib/ghostApi";

const RoadmapCard = ({ className }: { className?: string }) => {
  const [pageContent, setPageContent] = useState<GhostPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPage = async () => {
      setLoading(true);
      try {
        const content = await fetchPageBySlug("2026-bi-fintech-consulting-roadmap-pdf-unlock");
        setPageContent(content);
      } catch (error) {
        console.error("Error loading roadmap teaser:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPage();
  }, []);

  // Extract YouTube URL and derive thumbnail
  const extractYoutubeUrl = (html: string): string | null => {
    const iframeMatch = html.match(/<iframe[^>]+src="([^"]+youtube[^"]+)"/i);
    return iframeMatch ? iframeMatch[1] : null;
  };

  const getYoutubeThumbnail = (url: string): string => {
    const videoIdMatch = url.match(/(?:\/embed\/|v=)([^&\n?#]+)/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;
    return videoId ? `https://img.youtube.com/vi/${videoId}/0.jpg` : "";
  };

  const youtubeUrl = pageContent?.html ? extractYoutubeUrl(pageContent.html) : null;
  const thumbnail = youtubeUrl ? getYoutubeThumbnail(youtubeUrl) : "";

  // Teaser data (dynamic from fetched content)
  const teaser = {
    title: pageContent?.title || "2026 BI-FinTech Roadmap – Unlock Your $10k/mo Pivot",
    excerpt: pageContent?.excerpt || "Stuck grinding $3k-$4k/mo despite your engineering skills? AI’s eating jobs—pivot to BI-FinTech PM roles for $17k/mo+ remote freedom. Get the cracked blueprint: mindset, hybrid PM, vendor-grade tools, and certs (PMP, PSM, AZ305).",
  };

  if (loading) {
    return (
      <article className={`volumetric-glass rounded-2xl overflow-hidden hover-lift col-span-full md:col-span-1 animate-pulse ${className || ""}`}>
        <div className="h-48 bg-muted" />
        <div className="p-5 space-y-2">
          <div className="h-6 bg-muted rounded" />
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-10 bg-muted rounded" />
        </div>
      </article>
    );
  }

  return (
    <article className={`volumetric-glass rounded-2xl overflow-hidden hover-lift cursor-pointer group col-span-full md:col-span-1 ${className || ""}`}>
      {/* Dynamic Thumbnail from YouTube */}
      {thumbnail ? (
        <div className="relative h-48 overflow-hidden">
          <img
            src={thumbnail}
            alt={teaser.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
          <span className="text-4xl">🚀</span> {/* Fallback if no video */}
        </div>
      )}

      {/* Content (Teaser Only – ~half the full page) */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-cyan-300 transition-all">
          {teaser.title}
        </h3>
        
        <p className="text-white/70 text-sm mb-6 line-clamp-3 group-hover:bg-gradient-to-r group-hover:from-[#4A7BA7] group-hover:to-[#6B4FA8] group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
          {teaser.excerpt}
        </p>

        {/* CTA Button: Plain red, enticing link to full page */}
        <Link
          to="/2026-bi-fintech-consulting-roadmap-pdf-unlock"
          className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105 shadow-lg group-hover:shadow-glow-pulse"
        >
          Unlock Full Roadmap
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </article>
  );
};

export default RoadmapCard;
