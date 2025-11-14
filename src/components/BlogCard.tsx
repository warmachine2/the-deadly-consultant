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
}

const BlogCard = ({ post, onClick }: BlogCardProps) => {
  const [imageError, setImageError] = useState(false);

  return (
    <article
      onClick={onClick}
      className="volumetric-glass rounded-2xl overflow-hidden hover-lift cursor-pointer group"
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
        <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2 group-hover:text-accent transition-colors">
          {post.title}
        </h3>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {post.excerpt}
        </p>

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
