import { Clock, ArrowRight } from "lucide-react";

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  feature_image?: string;
  reading_time?: number;
  published_at: string;
  tags?: Array<{ name: string }>;
  slug: string;
  html?: string; // Added: For video detection/embed
}

interface BlogCardProps {
  post: BlogPost;
  onClick: () => void;
}

const BlogCard = ({ post, onClick }: BlogCardProps) => {
  // Detect if post has embedded video (YouTube/Vimeo iframe in html)
  const hasVideo = post.html && post.html.match(/<iframe[^>]+src=(["'])[^"]*(youtube|vimeo)\.com[^>]*\1/i);
  const videoSrc = hasVideo
    ? post.html
        .match(/<iframe[^>]+src=(["'])[^>]*\1/)?.[0]
        ?.match(/src=(["'])[^>]*\1/)?.[0]
        ?.replace(/src=["']|["']/g, "")
    : null;

  return (
    <article onClick={onClick} className="glass rounded-2xl overflow-hidden hover-lift cursor-pointer group">
      {/* Video Embed or Image – Full fit for video */}
      {hasVideo && videoSrc ? (
        <div className="relative h-64 overflow-hidden">
          {" "}
          {/* Increased height for full fit */}
          <div className="relative w-full pb-[56.25%]">
            {" "}
            {/* 16:9 responsive aspect */}
            <iframe
              src={videoSrc}
              className="absolute top-0 left-0 w-full h-full rounded-t-2xl"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={post.title}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />{" "}
          {/* Overlay for readability */}
        </div>
      ) : post.feature_image ? (
        <div className="relative h-48 overflow-hidden">
          <img
            src={post.feature_image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
          <span className="text-4xl">📄</span>
        </div>
      )}

      {/* Content – Slightly reduced padding for video-dominant cards */}
      <div className="p-3 md:p-5">
        {" "}
        {/* Adjusted p- for balance with taller video */}
        <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2 group-hover:text-accent transition-colors">
          {post.title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{post.excerpt}</p>
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag.name} className="glass-subtle px-2 py-1 rounded-full text-xs text-accent/90 italic">
                {tag.name}
              </span>
            ))}
          </div>
        )}
        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{post.reading_time || 5} min</span>
          </div>
          <ArrowRight className="w-5 h-5 text-accent group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
