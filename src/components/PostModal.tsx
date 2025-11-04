import { X, Clock, Calendar } from "lucide-react";
import { BlogPost } from "./BlogCard";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface PostModalProps {
  post: BlogPost | null;
  isOpen: boolean;
  onClose: () => void;
  fullContent?: string;
}

const PostModal = ({ post, isOpen, onClose, fullContent }: PostModalProps) => {
  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative glass-strong rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-fade-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="sticky top-4 right-4 float-right p-2 rounded-lg hover:bg-white/20 transition-colors z-10"
          aria-label="Close modal"
        >
          <X className="w-6 h-6 text-foreground" />
        </button>

        {/* Featured Image */}
        {post.feature_image && (
          <div className="relative h-64 md:h-96 overflow-hidden rounded-t-3xl">
            <img
              src={post.feature_image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        )}

        {/* Content */}
        <div className="p-6 md:p-10">
          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(post.published_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{post.reading_time || 5} min read</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            {post.title}
          </h1>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <span
                  key={tag.name}
                  className="glass px-3 py-1.5 rounded-full text-sm text-accent/90 italic"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          {/* Excerpt */}
          <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Full Content */}
          {fullContent ? (
            <div className="p-6 overflow-auto max-h-[70vh] markdown prose prose-invert max-w-none text-sm leading-relaxed prose-headings:font-play prose-headings:font-bold prose-headings:text-[#E5E7EB] prose-p:text-[#E5E7EB] prose-strong:font-bold prose-strong:text-[#F3F4F6] prose-code:bg-[#1E1E1E] prose-code:rounded prose-code:px-2 prose-code:py-1 prose-code:text-[#E5E7EB] prose-pre:bg-[#1E1E1E] prose-pre:rounded-xl prose-pre:p-4 prose-pre:overflow-x-auto prose-ul:text-[#9CA3AF] prose-ol:text-[#9CA3AF] prose-li:text-[#E5E7EB] prose-a:text-accent prose-a:hover:text-accent/80 prose-a:underline prose-blockquote:border-l-accent prose-blockquote:text-[#9CA3AF] prose-img:rounded-xl">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {fullContent}
              </ReactMarkdown>
            </div>
          ) : (
            <div className="glass-subtle rounded-2xl p-8 text-center">
              <p className="text-muted-foreground">
                Full content loading... Visit{" "}
                <a
                  href={`https://thedeadlyconsultant.com/${post.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:text-accent/80 underline"
                >
                  the original post
                </a>{" "}
                for the complete article.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostModal;
