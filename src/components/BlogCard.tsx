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
  const videoSrc = videoSrcMatch ? videoSrcMatch[0].replace(/src=(["'])/, '').replace(/["']$/, '') : null;

  return (
    <article 
      onClick={onClick} 
      className="glass rounded-2xl overflow-hidden hover-lift cursor-pointer group flex flex-col"
    >
      {/* Video Embed or Image – Expanded to dominate/fit whole card */}
      {hasVideo && videoSrc ? (
        <div className="flex-1 relative overflow-hidden min-h-[200px]"> {/* Flex-grow for full fit; min-h ensures min size */}
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      ) : post.feature_image ? (
        <div className="relative flex-1 min-h-[200px] overflow-hidden">
          <img
            src={post.feature_image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      ) : (
        <div className="flex-1 min-h-[200px] bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
          <span className="text-4xl">📄</span>
        </div>
      )}

      <div className="p-3 md:p-4 flex-shrink-0">
        <h3 className="text-lg md:text-xl font-bold text-foreground mb-1 line-clamp-1 group-hover:text-accent transition-colors">
          {post.title}
        </h3>
        
        <p className="text-muted-foreground text-xs md:text-sm mb-2 line-clamp-1">
          {post.excerpt}
        </p>

        
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {post.tags.slice(0, 2).map((tag) => (
              <span
                key={tag.name}
                className="glass-subtle px-1.5 py-0.5 rounded-full text-xs text-accent/90 italic"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        
        <div className="flex items-center justify-between text-xs md:text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 md:w-4 md:h-4" />
            <span>{post.reading_time || 5} min</span>
          </div>
          <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-accent group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </article>
  );
};

export default BlogCard;