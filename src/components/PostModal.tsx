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
  const videoSrcMatch = hasVideo ? post.html.match(/src=(["'])[^>]*\1/) : null;
  const videoSrc = videoSrcMatch ? videoSrcMatch[0].replace(/src=(["'])/, "").replace(/["']$/, "") : null;

  return (
    <article
      onClick={onClick}
      className="glass rounded-2xl overflow-hidden hover-lift cursor-pointer group flex flex-col"
    >
      {/* Video Embed or Image – Expanded to dominate/fit whole card */}
      {hasVideo && videoSrc ? (
        <div className="flex-1 relative overflow-hidden min-h-[250px]">
          {" "}
          {/* Flex-grow for full fit; increased min-h for larger video */}
          <div className="relative w-full h-full">
            <iframe
              src={`${videoSrc}?rel=0`}
              className="absolute top-0 left-0 w-full h-full rounded-t-2xl"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={post.title}
              loading="lazy"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />{" "}
          {/* Darker overlay for text readability */}
        </div>
      ) : post.feature_image ? (
        <div className="relative flex-1 min-h-[250px] overflow-hidden">
          {" "}
          {/* Match video sizing for consistency */}
          <img
            src={post.feature_image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      ) : (
        <div className="flex-1 min-h-[250px] bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
          <span className="text-4xl">📄</span>
        </div>
      )}

      {/* Content – Compressed to make room for dominant video */}
      <div className="p-2 md:p-3 flex-shrink-0">
        {" "}
        {/* Further reduced padding */}
        <h3 className="text-base md:text-lg font-bold text-foreground mb-1 line-clamp-1 group-hover:text-accent transition-colors">
          {" "}
          {/* Smaller title */}
          {post.title}
        </h3>
        <p className="text-muted-foreground text-xs md:text-sm mb-1 line-clamp-1">
          {" "}
          {/* Even shorter */}
          {post.excerpt}
        </p>
        {/* Tags – Optional, smaller */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-1">
            {post.tags.slice(0, 2).map((tag) => (
              <span key={tag.name} className="glass-subtle px-1 py-0.5 rounded-full text-xs text-accent/90 italic">
                {tag.name}
              </span>
            ))}
          </div>
        )}
        {/* Footer – Compact */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{post.reading_time || 5} min</span>
          </div>
          <ArrowRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
