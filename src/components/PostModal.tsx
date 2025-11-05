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
        {/* Full Content – Custom styles for large video fit */}
        <div className="prose prose-invert max-w-none mb-6 p-6 md:p-8">
          {/* Standard <style> tag for global overrides (no 'jsx' attribute) */}
          <style>{`
            .prose iframe {
              width: 100% !important;
              height: auto !important;
              min-height: 500px !important; /* Taller base height for videos */
              aspect-ratio: 16/9 !important; /* Keep wide but allow taller scaling */
              border-radius: 12px !important;
              display: block !important;
              margin: 1rem auto !important;
            }
            .prose .video-container, .prose iframe[src*="youtube"], .prose iframe[src*="vimeo"] {
              position: relative;
              width: 100%;
              padding-bottom: 56.25%; /* 16:9 aspect; reduce to 40% for even taller if needed */
              height: 0;
              overflow: hidden;
            }
            .prose .video-container iframe, .prose iframe[src*="youtube"], .prose iframe[src*="vimeo"] {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              min-height: 500px; /* Enforce taller min-height */
            }
          `}</style>
          <div
            className="video-wrapper" // Wrapper for responsive video
            dangerouslySetInnerHTML={{ __html: fullContent || post.excerpt }}
          />
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
