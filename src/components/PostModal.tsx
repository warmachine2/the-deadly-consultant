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
      // Extract