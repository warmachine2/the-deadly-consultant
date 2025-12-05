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
  const [showTags, setShowTags] = useState(true);
  const isMobile = useIsMobile();
  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (isOpen && isMobile) {
      sidebarRef.current?.scrollTo({ top: 0, behavior: "instant" });
    }
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

  return (
    <>
      {isOpen && isMobile && <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={onClose} />}

      <aside
        ref={sidebarRef}
        className={`
          fixed md:sticky top-0 md:top-0 left-0 z-40
          w-full md:w-64 volumetric-glass rounded-2xl md:rounded-2xl
          p-6
          transition-transform duration-300 overflow-y-auto
          ${
            isMobile
              ? isOpen
                ? "translate-x-0 h-screen"
                : "-translate-x-full hidden"
              : "md:top-20 h-[calc(100vh-5rem)] translate-x-0"
          }
        `}
      >
        {/* Close button — top-right */}
        {isMobile && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-white/70 hover:text-white transition z-50"
            aria-label="Close sidebar"
          >
            <X className="w-8 h-8" />
          </button>
        )}

        {/* Testimonials - compact */}
        <TestimonialsCarousel />

        {/* Strategy Session CTA */}
        <div className="border-t border-white/10 pt-4 mb-4">
          <a
            href="https://calendly.com/hassankhalidkhan"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-md text-center transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, #0562AD 0%, #0478c8 100%)",
              boxShadow: "0 0 20px rgba(5, 98, 173, 0.5), 0 4px 12px rgba(5, 98, 173, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2)",
            }}
          >
            <Calendar className="w-5 h-5 text-white" />
            <span className="text-sm font-bold text-white">
              Book Free 45-Min Strategy Session
            </span>
          </a>
          <div className="mt-3 px-2 py-2 rounded-md" style={{ background: "rgba(0, 0, 0, 0.4)" }}>
            <p className="text-[11px] text-[#F4C903] leading-tight text-center">
              Map your career pivot and discover if my 90-Day BI-FinTech Accelerator can help you land these roles
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4">
          <h2 className="text-lg font-bold text-white mb-4 tracking-wide drop-shadow-[0_0_10px_rgba(59,130,246,0.5)] pr-16 hover:text-[#F4C903] transition-colors cursor-default">
            Filter by Tags
          </h2>
        </div>

        {/* Tags */}
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
              {availableTags.length === 0 ? (
                <p className="text-white/60 text-sm">No tags available</p>
              ) : (
                availableTags.map((tag) => (
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

        {/* Clear filters button */}
        {selectedTags.length > 0 && (
          <button
            onClick={() => selectedTags.forEach(tag => onTagToggle(tag))}
            className="mt-6 w-full px-4 py-3 rounded-2xl text-sm font-medium volumetric-glass-button text-white/80 hover:text-white transition-all"
          >
            Clear All Filters
          </button>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
