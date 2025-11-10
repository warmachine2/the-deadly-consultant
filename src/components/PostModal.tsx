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

  // Improved function to wrap iframes in glass frame (preserves all other content)
  const wrapIframesInGlass = (html: string): string => {
    if (!html) return "";

    // Regex to match full <iframe>...</iframe> (handles self-closing or explicit close)
    const iframeRegex = /<iframe\b[^<]*(?:[^<]*?<\/iframe>)?(?:<[^<]*>)?/gi;
    let processed = "";
    let lastIndex = 0;

    // Find all matches and build the output
    let match;
    while ((match = iframeRegex.exec(html)) !== null) {
      // Preserve content before this iframe
      const before = html.substring(lastIndex, match.index);
      lastIndex = iframeRegex.lastIndex;

      // Extract attributes for the iframe
      const iframeMatch = match[0].match(/<iframe([^>]*)>/i);
      const attributes = iframeMatch ? iframeMatch[1] : "";
      const srcMatch = attributes.match(/src="([^"]+)"/i);
      const src = srcMatch ? srcMatch[1] : null;

      let replacement;
      if (src && (src.includes("youtube.com") || src.includes("youtu.be"))) {
        // YouTube: Responsive glass wrapper like roadmap.tsx – applied to all, but "top" one will appear first
        replacement = `
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
      } else if (src) {
        // Non-YouTube iframe: Simple rounded wrapper
        replacement = `<div class="glass rounded-3xl p-6 mb-6 rounded-xl overflow-hidden">${match[0]}</div>`;
      } else {
        // Invalid iframe: Just wrap as-is
        replacement = `<div class="glass rounded-3xl p-6 mb-6">${match[0]}</div>`;
      }

      processed += before + replacement;
    }

    // Add the remaining content after the last match
    processed += html.substring(lastIndex);

    return processed;
  };

  const originalContent = fullContent || post.excerpt;
  const processedContent = wrapIframesInGlass(originalContent);

  // If there's a "top video" (first iframe in content), it's now wrapped – no separate handling needed

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto glass-strong p-0">
        <DialogHeader className="p-6 md:p-8">
          <DialogTitle className="text-3xl md:text-5xl font-bold text-foreground mb-4">{post.title}</DialogTitle>
        </DialogHeader>
        {post.feature_image && (
          <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-6">
            {" "}
            {/* Added mb-6 for consistency */}
            <img src={post.feature_image} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}
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
          <div dangerouslySetInnerHTML={{ __html: processedContent }} />
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
