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
          fixed md:sticky top-16 md:top-0 left-0 z-40
          w-full md:w-64 volumetric-glass rounded-2xl md:rounded-2xl
          p-6
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

        <h2 className="text-xl font-bold text-white mt-4 mb-6 tracking-wide drop-shadow-[0_0_10px_rgba(59,130,246,0.5)] pr-16">
          Filters
        </h2>

        {/* Categories & Tags stay exactly the same */}
        {/* ... your Categories and Tags code ... */}
      </aside>
    </>
  );
};

export default Sidebar;
