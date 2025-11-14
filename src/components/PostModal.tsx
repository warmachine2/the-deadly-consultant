import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
        return `<div class="glass rounded-3xl p-6 mb-6 rounded-xl overflow-hidden">${match}</div>`;
      }
