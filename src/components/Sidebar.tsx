import { X, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const tags = ["PMP Certs", "AI-Proof", "Tools", "Career Pivot", "BI Analytics", "FinTech"];
const categories = ["All Posts", "Roadmaps", "Stories", "Guides"];

const Sidebar = ({ isOpen, onClose, selectedTags, onTagToggle, selectedCategory, onCategoryChange }: SidebarProps) => {
  const [showTags, setShowTags] = useState(true);
  const [showCategories, setShowCategories] = useState(true);
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
          fixed md:sticky top-0 left-0 z-40
          w-full md:w-64 volumetric-glass rounded-2xl md:rounded-2xl p-6 pt-20 md:pt-6
          transition-transform duration-300 overflow-y-auto
          ${
            isMobile
              ? isOpen
                ? "translate-x-0 h-screen"
                : "-translate-x-full hidden"
              : "md:top-16 h-[calc(100vh-4rem)] translate-x-0"
          }
        `}
      >
        {/* × BUTTON — TOP-RIGHT, CLEAN, IMPOSSIBLE TO MOVE LEFT */}
        {isMobile && (
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition z-50"
            aria-label="Close sidebar"
          >
            <X className="w-8 h-8" />
          </button>
        )}

        {/* Title with right padding so it never overlaps the button */}
        <h2 className="text-xl font-bold text-white mb-6 tracking-wide drop-shadow-[0_0_10px_rgba(59,130,246,0.5)] pr-16">
          Filters
        </h2>

        {/* Rest of your code 100% unchanged */}
        <div className="mb-6">
          <button
            onClick={() => setShowCategories(!showCategories)}
            className="flex items-center justify-between w-full mb-3 text-sm font-bold text-white tracking-wide drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]"
          >
            Categories
            <ChevronDown
              className={`w-4 h-4 transition-transform text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.6)] ${
                showCategories ? "rotate-180" : ""
              }`}
            />
          </button>
          {showCategories && (
            <div className="flex flex-col gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => onCategoryChange(category)}
                  className={`
                    w-full text-left px-4 py-4 rounded-2xl text-sm font-medium transition-all
                    ${selectedCategory === category ? "volumetric-glass-active" : "volumetric-glass-button text-white/80"}
                  `}
                >
                  <span
                    className={
                      selectedCategory === category
                        ? "bg-gradient-to-r from-[#4A7BA7] to-[#6B4FA8] bg-clip-text text-transparent"
                        : ""
                    }
                  >
                    {category}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <button
            onClick={() => setShowTags(!showTags)}
            className="flex items-center justify-between w-full mb-3 text-sm font-bold text-white tracking-wide drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]"
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
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => onTagToggle(tag)}
                  className={`
                    px-4 py-4 rounded-2xl text-xs font-medium italic transition-all
                    ${selectedTags.includes(tag) ? "volumetric-glass-active" : "volumetric-glass-button text-white/80"}
                  `}
                >
                  <span
                    className={
                      selectedTags.includes(tag)
                        ? "bg-gradient-to-r from-[#4A7BA7] to-[#6B4FA8] bg-clip-text text-transparent"
                        : ""
                    }
                  >
                    {tag}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
