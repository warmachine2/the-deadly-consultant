import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Clock, Calendar } from "lucide-react";
import { BlogPost } from "@/components/BlogCard";
import { Button } from "@/components/ui/button";
import "@/styles/dialog-fixes.css";

interface PostModalProps {
  post: BlogPost | null;
  isOpen: boolean;
  onClose: () => void;
  fullContent: string;
}

const PostModal = ({ post, isOpen, onClose, fullContent }: PostModalProps) => {

  const wrapIframesInGlass = (html: string): string => {
    if (!html) return html;

    const iframeRegex = /<iframe\b[^>]*>(?:.*?)<\/iframe>/gis;

    return html.replace(iframeRegex, (match) => {
      const openTagMatch = match.match(/<iframe([^>]*)>/i);
      const attributes = openTagMatch ? openTagMatch[1] : "";
      const srcMatch = attributes.match(/src\s*=\s*"([^"]+)"/i);
      const src = srcMatch ? srcMatch[1] : null;

      if (src && (src.includes("youtube.com") || src.includes("youtu.be"))) {
        return `<div class="glass rounded-3xl p-6 mb-6"><div class="relative w-full pb-[56.25%]"><iframe ${attributes} class="absolute top-0 left-0 w-full h-full rounded-2xl" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></div></div>`;
      }
      
      return `<div class="glass rounded-3xl p-6 mb-6 rounded-xl overflow-hidden">${match}</div>`;
    });
  };

  const processedContent = wrapIframesInGlass(fullContent);
  const hasContent = fullContent && fullContent.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="modal-stable volumetric-glass max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border-white/15">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            {post?.title || ""}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {post?.excerpt || ""}
          </DialogDescription>
          {post && (
            <div className="flex items-center gap-4 text-sm text-white/70 mt-2">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(post.published_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{post.reading_time ?? 0} min read</span>
              </div>
            </div>
          )}
        </DialogHeader>
        
        {hasContent ? (
          <div 
            className="prose prose-invert max-w-none mt-6 text-white/90"
            dangerouslySetInnerHTML={{ __html: processedContent }}
          />
        ) : (
          <div className="flex justify-center items-center py-12">
            <div className="text-white/70">Loading content...</div>
          </div>
        )}
        
        {post?.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-white/10">
            {post.tags.map((tag) => (
              <Button
                key={tag.name}
                variant="outline"
                size="sm"
                className="volumetric-glass-button text-white/80"
              >
                {tag.name}
              </Button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PostModal;
