import { X, ChevronDown, Calendar } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  availableTags: string[];
}

const Sidebar = ({ isOpen, onClose, selectedTags, onTagToggle, availableTags }: SidebarProps) => {
  const [showTags, setShowTags] = useState(false);
  const isMobile = useIsMobile();
  const sidebarRef = useRef<HTMLElement>(null);

  const visibleTags = availableTags.filter((t) => {
    const normalized = t.trim().toLowerCase();
    return normalized !== "#featured-static" &&
      normalized !== "featured-static" &&
      normalized !== "#no-hero" &&
      normalized !== "no-hero";
  });

  // Mobile: every open starts at the top of the drawer with the tag pills already visible.
  useEffect(() => {
    if (!isOpen || !isMobile) return;
    sidebarRef.current?.scrollTo({ top: 0, behavior: "instant" });
    setShowTags(true);
  }, [isOpen, isMobile]);

  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, isMobile]);

  const clearAllFilters = () => selectedTags.forEach((tag) => onTagToggle(tag));

  const filterTitle = (extraClass: string) => (
    <h2
      className={`text-lg font-bold text-white tracking-wide drop-shadow-[0_0_10px_rgba(59,130,246,0.5)] hover:text-[#F4C903] transition-colors cursor-default ${extraClass}`}
    >
      Filter by Tags
    </h2>
  );

  const tagsSection = (
    <div>
      <button
        onClick={() => setShowTags(!showTags)}
        className="flex items-center justify-between w-full mb-3 text-sm font-bold text-white tracking-wide drop-shadow-[0_0_8px_rgba(59,130,246,0.4)] hover:text-[#F4C903] transition-colors"
      >
        Tags
        <ChevronDown
          className={`w-4 h-4 transition-transform text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.6)] ${
            showTags ? "rotate-180" : ""
          }`}
        />
      </button>
      {showTags && (
        <div className="flex flex-wrap gap-2">
          {visibleTags.length === 0 ? (
            <p className="text-white/60 text-sm">No tags available</p>
          ) : (
            visibleTags.map((tag) => (
              <button
                key={tag}
                onClick={() => onTagToggle(tag)}
                className={`
                  px-4 py-3 rounded-2xl text-xs font-medium italic transition-all
                  ${selectedTags.includes(tag)
                    ? "volumetric-glass-active text-[#F4C903] font-bold"
                    : "volumetric-glass-button text-white/80 hover:text-[#F4C903] hover:font-bold"}
                `}
              >
                {tag}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );

  const strategyCta = (
    <>
      <a
        href="/book-session"
        className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-md text-center transition-all duration-300 desktop-hover-scale-103 active:scale-[0.98]"
        style={{
          background: "linear-gradient(135deg, #0562AD 0%, #0478c8 100%)",
          boxShadow: "0 0 20px rgba(5, 98, 173, 0.5), 0 4px 12px rgba(5, 98, 173, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Calendar className="w-5 h-5 text-white" />
        <span className="text-sm font-bold text-white">
          Book Free 30-Min Strategy Session
        </span>
      </a>
      <div className="mt-3 px-2 py-2 rounded-md" style={{ background: "rgba(0, 0, 0, 0.4)" }}>
        <p className="text-[11px] text-[#F4C903] leading-tight text-center">
          Map your career pivot and discover if my 90-Day PM Accelerator can help you land these roles
        </p>
      </div>
    </>
  );

  return (
    <>
      {isOpen && isMobile && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      )}

      <aside
        ref={sidebarRef}
        className={`
          md:sticky top-0 md:top-0 left-0
          w-full md:w-64 md:rounded-2xl
          transition-transform duration-300 overflow-y-auto touch-scroll
          [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
          ${
            isOpen
              ? isMobile
                ? "fixed inset-0 z-50 h-[100dvh] bg-background/95 backdrop-blur-md p-6 pb-16 translate-x-0"
                : "volumetric-glass p-6 z-40 md:top-20 max-h-[calc(100vh-5rem)] h-fit translate-x-0"
              : isMobile
                ? "fixed -translate-x-full hidden"
                : "volumetric-glass p-6 z-40 md:top-20 max-h-[calc(100vh-5rem)] h-fit translate-x-0 max-md:hidden"
          }
        `}
      >
        {isMobile ? (
          /* Mobile drawer: filters first, testimonials + booking CTA below */
          <>
            <div className="flex items-start justify-between gap-3 mb-4">
              {filterTitle("")}
              <button
                onClick={onClose}
                aria-label="Close sidebar"
                className="shrink-0 -mt-1 text-white/70 hover:text-white transition"
              >
                <X className="w-8 h-8" />
              </button>
            </div>

            {selectedTags.length > 0 && (
              <button
                onClick={clearAllFilters}
                className="mb-4 w-full px-4 py-3 rounded-2xl text-sm font-bold italic text-[#F4C903] volumetric-glass-active ring-1 ring-[#F4C903]/40 transition-all"
              >
                Clear all filters
              </button>
            )}

            {tagsSection}

            <div className="border-t border-white/10 mt-6 pt-6">
              <TestimonialsCarousel />
              <div className="mt-6">{strategyCta}</div>
            </div>
          </>
        ) : (
          /* Desktop sidebar: unchanged layout */
          <>
            <TestimonialsCarousel />

            <div className="border-t border-white/10 pt-4 mb-4">{strategyCta}</div>

            <div className="border-t border-white/10 pt-4">{filterTitle("mb-4 pr-16")}</div>

            {tagsSection}

            {selectedTags.length > 0 && (
              <button
                onClick={clearAllFilters}
                className="mt-6 w-full px-4 py-3 rounded-2xl text-sm font-medium volumetric-glass-button text-white/80 hover:text-white transition-all"
              >
                Clear All Filters
              </button>
            )}
          </>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
