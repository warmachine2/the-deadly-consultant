import { useState, useEffect, useRef } from "react";
import { fetchPageBySlug } from "@/lib/ghostApi";
import { GhostPost } from "@/lib/ghostApi";
import TopNav from "@/components/TopNav";

const RoadmapPage = () => {
  const [pageContent, setPageContent] = useState<GhostPost | null>(null);
  const [loading, setLoading] = useState(true);
  const shownRef = useRef(false);

  // Load official ConvertKit script + Auto-show modal when ready (only once)
  useEffect(() => {
    // Global flag to prevent multi-mount issues (e.g., dev mode)
    if ((window as any).__convertKitShown) return;
    (window as any).__convertKitShown = true;

    const script = document.createElement("script");
    script.src = "https://bi-fintech-consultant-academy.kit.com/fbd8fa5d1b/index.js";
    script.async = true;
    script.setAttribute("data-uid", "fbd8fa5d1b");
    document.head.appendChild(script);

    // Poll for window.formkit (reliable across load times)
    let attempts = 0;
    const maxAttempts = 200; // 20 seconds max
    const interval = setInterval(() => {
      attempts++;
      const w = window as any;
      if (w.formkit && typeof w.formkit.show === "function" && !shownRef.current) {
        clearInterval(interval);
        // Debounce show with 1s delay for stability
        setTimeout(() => {
          if (!shownRef.current) {
            shownRef.current = true;
            console.log("ConvertKit ready – showing popup (once, debounced)");
            w.formkit.show("fbd8fa5d1b");
          }
        }, 1000);
      } else if (attempts >= maxAttempts) {
        clearInterval(interval);
        console.error("ConvertKit failed to load after 20s – check script src or network");
      }
    }, 100);

    return () => {
      clearInterval(interval);
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
      // Cleanup global flag on unmount (rare, but safe)
      delete (window as any).__convertKitShown;
    };
  }, []);

  useEffect(() => {
    const loadPage = async () => {
      setLoading(true);
      const content = await fetchPageBySlug("2026-bi-fintech-consulting-roadmap-pdf-unlock");
      setPageContent(content);
      setLoading(false);
    };
    loadPage();
  }, []);

  const extractYoutubeUrl = (html: string): string | null => {
    const iframeMatch = html.match(/<iframe[^>]+src="([^"]+youtube[^"]+)"/i);
    return iframeMatch ? iframeMatch[1] : null;
  };

  const filterSmallVideos = (html: string): string => {
    if (!html) return "";

    let filtered = html.replace(/<img[^>]*width="?(\d+)"?[^>]*>/gi, (match, width) => {
      const w = parseInt(width);
      return w < 300 ? "" : match;
    });

    filtered = filtered.replace(/<iframe[^>]*>/gi, (match) => {
      const widthMatch = match.match(/width="?(\d+)"?/i);
      if (widthMatch) {
        const w = parseInt(widthMatch[1]);
        return w < 400 ? "" : match;
      }
      return match;
    });

    return filtered;
  };

  const youtubeUrl = pageContent?.html ? extractYoutubeUrl(pageContent.html) : null;

  return (
    <div className="min-h-screen">
      <TopNav onSearchChange={() => {}} onToggleSidebar={() => {}} />

      <main className="container mx-auto px-4 py-8 max-w-5xl mt-24">
        {/* Hero Section */}
        <section className="glass-strong rounded-3xl p-8 md:p-12 mb-8 hover-lift">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 animate-fade-in">
              {pageContent?.title || ""}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-6">
              Your complete guide to becoming a 10k/mo+ consultant
            </p>
          </div>
        </