import { useState } from "react";
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

  // Even safer function: Precise regex for standard iframe tags, proper HTML closing
  const wrapIframesInGlass = (html: string): string => {
    if (!html) return html;

    // More precise regex: Matches <iframe attrs></iframe> or <iframe attrs />
    // Non-greedy inner content (usually empty for embeds)
    const iframeRegex = /<iframe\b[^>]*>(?:[^<]*|<\/iframe>|<\/>)/gis;

    return html.replace(iframeRegex, (match) => {
      // Extract attributes from the opening tag
      const openTagMatch = match.match(/<iframe([^>\/>]*)>/i);
      const attributes = openTagMatch ? openTagMatch[1] : "";
      const srcMatch = attributes.match(/src\s*=\s*"([^"]+)"/i);
      const src = srcMatch ? srcMatch[1] : null;

      // Close any open tag if needed, but focus on replacement
      const fullMatch = match.replace(/<\/iframe>$|\/>$/i, ""); // Clean closing for extraction

      if (src && (src.includes("youtube.com") || src.includes("youtu.be"))) {
        // YouTube: Responsive glass wrapper – use proper </iframe> closing for valid HTML
        return `<div class="glass rounded-3xl p-6 mb-6"><div class="relative w-full pb-[56.25%]"><iframe ${attributes} class="absolute top-0 left-0 w-full h-full rounded-2xl" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></div></div>`;
      } else if (src) {
        // Non-YouTube: Simple glass wrapper around original match
        return `<div class="glass rounded-3xl p-6 mb-6 rounded-xl overflow-hidden">${match}</div>`;
      } else {
        // Fallback: Wrap original
        return `<div class="glass rounded-3xl p-6 mb-6">${match}</div>`;
      }
    });
  };

  const originalContent = fullContent || post.excerpt;
  const processedContent = wrapIframesInGlass(originalContent);

  // Enhanced debug: Log snippets to spot issues (remove after fix confirmed)
  console.log("Original snippet:", originalContent.substring(0, 200) + "...");
  console.log("Processed snippet:", processedContent.substring(0, 200) + "...");
  console.log("Original length:", originalContent.length, "Processed length:", processedContent.length);

  // Temporary fallback: If processed is much shorter, use original (for testing)
  const contentToRender = processedContent.length < originalContent.length * 0.8 ? originalContent : processedContent;
  if (processedContent.length < originalContent.length * 0.8) {
    console.error("Content loss detected – using original as fallback!");
  }

  const [imageError, setImageError] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto volumetric-glass p-0">
        <DialogHeader className="p-6 md:p-8">
          <DialogTitle className="text-3xl md:text-5xl font-bold text-foreground mb-4">{post.title}</DialogTitle>
        </DialogHeader>
        {post.feature_image && !imageError ? (
          <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-6">
            <img
              src={post.feature_image}
              alt={post.title}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          </div>
        ) : post.feature_image ? (
          <div className="h-64 md:h-96 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center rounded-xl mb-6">
            <span className="text-6xl">📄</span>
          </div>
        ) : null}
        <div className="flex flex-wrap gap-4 mb-6 text-sm text-muted-foreground p-6 md:p-8">
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
            {post.tags.map((tag) => (
              <span key={tag.name} className="glass-subtle px-3 py-1 rounded-full text-sm text-accent/90">
                {tag.name}
              </span>
            ))}
          </div>
        )}
        <div className="prose prose-invert max-w-none mb-6 p-6 md:p-8 [&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:rounded-xl [&_iframe]:min-h-[400px]">
          <div dangerouslySetInnerHTML={{ __html: contentToRender }} />
        </div>
        <div className="flex justify-end mt-6 p-6 md:p-8">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostModal;
