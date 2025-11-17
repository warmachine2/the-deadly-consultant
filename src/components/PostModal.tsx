import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BlogPost } from "./BlogCard";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

interface PostModalProps {
  post: BlogPost | null;
  isOpen: boolean;
  onClose: () => void;
  fullContent: string;
  isLoading?: boolean; // Optional loading state for spinner
}

export default function PostModal({
  post,
  isOpen,
  onClose,
  fullContent,
  isLoading = false,
}: PostModalProps) {
  // Debug: Track modal mounts and unmounts
  useEffect(() => {
    console.log('PostModal mounted/rendered', { postId: post?.id, slug: post?.slug, isOpen });
    return () => {
      console.log('PostModal unmounted', { postId: post?.id, slug: post?.slug });
    };
  }, [post?.id, post?.slug, isOpen]);

  // Only render when explicitly open
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {/* Frosted glass panel */}
      <DialogContent className="max-w-4xl mx-auto max-h-[90vh] overflow-y-auto p-0 !bg-transparent glass-effect rounded-3xl border-border/50 backdrop-blur-md bg-background/20">
        <DialogHeader className="p-6 border-b">
          <DialogTitle className="text-2xl font-bold">{post?.title || "Loading Post..."}</DialogTitle>
        </DialogHeader>

        <div className="p-8 prose prose-invert max-w-none [&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:h-96 [&_iframe]:rounded-lg [&_iframe]:shadow-lg [&_figure]:glass-effect [&_figure]:rounded-3xl [&_figure]:overflow-hidden [&_div[class*='kg-embed']]:glass-effect [&_div[class*='kg-embed']]:rounded-3xl [&_div[class*='kg-embed']]:overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
              <span className="ml-2 text-muted-foreground">Loading post content...</span>
            </div>
          ) : (
            <div
              dangerouslySetInnerHTML={{
                __html:
                  fullContent ||
                  '<p>No content available. <a href="#" onClick={(e) => { e.preventDefault(); onClose(); }}>Close and try another post.</a></p>',
              }}
            />
          )}
        </div>

        <div className="p-6 pt-0 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-colors"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
