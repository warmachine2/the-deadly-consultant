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
        <DialogHeader className="p-6 md:p-8">
          <DialogTitle className="text-3xl md:text-5xl font-bold text-foreground mb-4">{post.title}</DialogTitle>
        </DialogHeader>

        {post.feature_image && (
          <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-0">
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

        {/* Full Content – Custom styles for large video fit */}
        <div className="prose prose-invert max-w-none mb-6 p-6 md:p-8">
          <style>{`
            .prose iframe {
              width: 100% !important;
              height: auto !important;
              min-height: 600px !important; /* Taller base height for videos – increased for better fit */
              max-height: 80vh !important; /* Cap to modal height */
              aspect-ratio: 16/9 !important;
              border-radius: 12px !important;
              display: block !important;
              margin: 1rem auto !important;
            }
            .prose iframe[src*="youtube"], .prose iframe[src*="vimeo"] {
              position: relative !important;
              width: 100% !important;
              height: 100% !important;
              min-height: 600px !important; /* Enforce taller min-height */
              top: 0 !important;
              left: 0 !important;
            }
            /* Remove any conflicting wrappers that hide content */
            .prose .video-container, .prose div:has(iframe) {
              position: relative !important;
              width: 100% !important;
              height: auto !important;
              padding-bottom: 0 !important; /* Disable padding trick to avoid height:0 */
              overflow: visible !important;
            }
          `}</style>
          <div dangerouslySetInnerHTML={{ __html: fullContent || post.excerpt }} />
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
