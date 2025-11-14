import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BlogPost } from "./BlogCard";
import { Loader2 } from "lucide-react";

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
  isLoading = false, // Default to false
}: PostModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 glass-effect rounded-3xl">
        {" "}
        {/* NEW: Added glass-effect + rounded-3xl for style match */}
        <DialogHeader className="p-6 border-b">
          {" "}
          {/* Border for separation */}
          <DialogTitle className="text-2xl font-bold">{post?.title || "Loading Post..."}</DialogTitle>
        </DialogHeader>
        <div className="p-6 prose prose-invert max-w-none">
          {" "}
          {/* Tailwind prose for nice Ghost HTML styling */}
          {isLoading ? ( // Loading spinner
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
          {" "}
          {/* Footer with close button */}
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
