import { useState } from "react";
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
}

interface BlogCardProps {
  post: BlogPost;
  onClick: () => void;
  className?: string;
}

const BlogCard = ({ post, onClick, className }: BlogCardProps) => {
  const [imageError, setImageError] = useState(false);

  return (
    <article
      onClick={onClick}
      className={`volumetric-glass rounded-2xl overflow-hidden hover-lift cursor-pointer group min-w-[320px] max-w-[320px] mx-auto md:min-w-0 md:max-w-none md:mx-0 ${className || ""}`}
    >
      {/* Image */}
      {post.feature_image && !imageError ? (
        <div className="relative h-48 overflow-hidden">
          <img
            src={post.feature_image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
          <span className="text-4xl">📄</span>
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-cyan-300 transition-all">
          {post.title}
        </h3>

        <p className="text-white/70 text-sm mb-4 line-clamp-2 group-hover:bg-gradient-to-r group-hover:from-[#4A7BA7] group-hover:to-[#6B4FA8] group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">{post.excerpt}</p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag.name}
                className="volumetric-glass-button px-3 py-1 rounded-full text-xs text-white/90 italic font-medium"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-white/60">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{post.reading_time || 5} min</span>
          </div>
          <ArrowRight className="w-5 h-5 text-cyan-400 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
