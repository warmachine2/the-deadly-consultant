import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Clock, Calendar } from "lucide-react";
import { BlogPost } from "@/components/BlogCard";
import { Button } from "@/components/ui/button";

interface PostModalProps {
  post: BlogPost | null;
  isOpen: boolean;
  onClose: () => void;
  fullContent: string;
}

const PostModal = ({ post, isOpen, onClose, fullContent }: PostModalProps) => {
  if (!post) return null;

  // Function to wrap iframes in glass frame similar to roadmap.tsx
  const wrapIframesInGlass = (html: string): string => {
    if (!html) return "";

    // Regex to match iframe tags (basic, assumes standard YouTube embeds)
    return html.replace(/<iframe([^>]*)>(?:<\/iframe>)?/gi, (match, attributes) => {
      // Extract src if present (for YouTube validation)
      const srcMatch = attributes.match(/src="([^"]+)"/i);
      const src = srcMatch ? srcMatch[1] : null;
      if (!src || (!src.includes("youtube.com") && !src.includes("youtu.be"))) {
        // If not YouTube, wrap simply with rounded-xl (fallback)
        return `<div class="glass rounded-3xl p-6 mb-6"><div class="relative w-full pb-[56.25%]">${match}</div></div>`;
      }

      // For YouTube: Wrap in responsive glass container
      return `
        <div class="glass rounded-3xl p-6 mb-6">
          <div class="relative w-full pb-[56.25%]">
            <iframe
              ${attributes}
              class="absolute top-0 left-0 w-full h-full rounded-2xl"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      `;
    });
  };

  const processedContent = wrapIframesInGlass(fullContent || post.excerpt);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto glass-strong p-0">
        {" "}
        {/* Increased max-w and max-h; removed default padding for full fit */}
        <DialogHeader className="p-6 md:p-8">
          {" "}
          {/* Padded header */}
          <DialogTitle className="text-3xl md:text-5xl font-bold text-foreground mb-4">{post.title}</DialogTitle>
        </DialogHeader>
        {post.feature_image && (
          <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-0">
            {" "}
            {/* Removed mb for seamless flow */}
            <img src={post.feature_image} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex flex-wrap gap-4 mb-6 text-sm text-muted-foreground p-6 md:p-8">
          {" "}
          {/* Added padding to meta */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{new Date(post.published_at).toLocaleDateString()}</span>
          </div>
          {post.reading_time && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.reading_time} min read</span>
            </div>
          )}
        </div>
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6 p-6 md:p-8">
            {" "}
            {/* Added padding to tags */}
            {post.tags.map((tag) => (
              <span key={tag.name} className="glass-subtle px-3 py-1 rounded-full text-sm text-accent/90">
                {tag.name}
              </span>
            ))}
          </div>
        )}
        <div className="prose prose-invert max-w-none mb-6 p-6 md:p-8 [&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:rounded-xl [&_iframe]:min-h-[400px]">
          <div dangerouslySetInnerHTML={{ __html: processedContent }} />
        </div>
        <div className="flex justify-end mt-6 p-6 md:p-8">
          {" "}
          {/* Added padding to footer */}
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostModal;
