import { useState, useEffect } from "react";
import { fetchPageBySlug } from "@/lib/ghostApi";
import { GhostPost } from "@/lib/ghostApi";
import TopNav from "@/components/TopNav";

const RoadmapPage = () => {
  const [pageContent, setPageContent] = useState<GhostPost | null>(null);
  const [loading, setLoading] = useState(true);

  // Load ConvertKit script + Auto-show modal when ready
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://bifintechconsulting.com/fkd.js";
    script.async = true;
    document.head.appendChild(script);

    // Poll for window.formkit (reliable across load times)
    let attempts = 0;
    const maxAttempts = 100; // 10 seconds max
    const interval = setInterval(() => {
      attempts++;
      if (window.formkit && typeof window.formkit.show === "function") {
        clearInterval(interval);
        window.formkit.show("fbd8fa5d1b"); // Instant popup
      } else if (attempts >= maxAttempts) {
        clearInterval(interval);
        console.warn("ConvertKit modal failed to load");
      }
    }, 100);

    return () => {
      clearInterval(interval);
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
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

  // ... rest of your extractYoutubeUrl, filterSmallVideos, youtubeUrl logic unchanged

  return (
    <div className="min-h-screen">
      {/* Your existing TopNav, main content, hero, video, etc. */}

      {/* CTA – Fallback button if user closes modal */}
      <section className="glass-strong rounded-3xl p-8 md:p-12 text-center">
        {/* ... existing text ... */}
        <a
          data-formkit-toggle="fbd8fa5d1b"
          href="https://bifintechconsulting.com/roadmap-signup"
          className="inline-block bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-lg"
        >
          Get Your Free Roadmap PDF
        </a>
      </section>
    </div>
  );
};

export default RoadmapPage;
