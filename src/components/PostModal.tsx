import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BlogPost } from "./BlogCard";
import { Loader2 } from "lucide-react";

interface PostModalProps {
  post: BlogPost | null;
  isOpen: boolean;
  onClose: () => void;
  fullContent: string;
  isLoading?: boolean;  // Optional loading state for spinner
}

export default function PostModal({ 
  post, 
  isOpen, 
  onClose, 
  fullContent, 
  isLoading = false  // Default to false
}: PostModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* Frosted glass panel - unchanged */}
      <DialogContent className="max-w-4xl mx-auto max-h-[90vh] overflow-y-auto p-0 !bg-transparent glass-effect rounded-3xl border-border/50 backdrop-blur-md bg-background/20">
        <DialogHeader className="p-6 border-b">  {/* Kept light padding for header */}
          <DialogTitle className="text-2xl font-bold">{post?.title || "Loading Post..."}</DialogTitle>
        </DialogHeader>
        
        {/* UPDATED: Added glass frame for video wrappers - targets <figure> or similar around iframes */}
        <div className="p-8 prose prose-invert max-w-none [&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:h-96 [&_iframe]:rounded-lg [&_iframe]:shadow-lg [&_figure]:glass-effect [&_figure]:rounded-3xl [&_figure]:overflow-hidden [&_div[class*='kg-embed']]:glass-effect [&_div[class*='kg-embed']]:rounded-3xl [&_div[class*='kg-embed']]:overflow-hidden">
          {isLoading ? (  // Loading spinner
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
              <span className="ml-2 text-muted-foreground">Loading post content...</span>
            </div>
          ) : (
            <div 
              dangerouslySetInnerHTML={{ 
                __html: fullContent || '<p>No content available. <a href="#" onClick={(e) => { e.preventDefault(); onClose(); }}>Close and try another post.</a></p>' 
              }} 
            />
          )}
        </div>
        
        <div className="p-6 pt-0 border-t flex justify-end">  {/* Footer with close button