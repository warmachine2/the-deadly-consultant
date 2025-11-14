import { X, ChevronDown } from "lucide-react";
import { useState } from "react";

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

const Sidebar = ({
  isOpen,
  onClose,
  selectedTags,
  onTagToggle,
  selectedCategory,
  onCategoryChange,
}: SidebarProps) => {
  const [showTags, setShowTags] = useState(true);
  const [showCategories, setShowCategories] = useState(true);

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-16 left-0 h-[calc(100vh-4rem)] z-40
          w-64 volumetric-glass rounded-r-3xl md:rounded-3xl p-6
          transition-transform duration-300 overflow-y-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="md:hidden absolute top-4 right-4 p-2 rounded-xl volumetric-glass-button"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        <h2 className="text-lg font-bold text-white mb-6 tracking-wide drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">Filters</h2>

        {/* Categories */}
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
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => onCategoryChange(category)}
                  className={`
                    w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                    ${
                      selectedCategory === category
                        ? "volumetric-glass-active text-white"
                        : "volumetric-glass-button text-white/80"
                    }
                  `}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tags */}
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
                    px-3 py-1.5 rounded-full text-xs font-medium italic transition-all
                    ${
                      selectedTags.includes(tag)
                        ? "volumetric-glass-active text-white"
                        : "volumetric-glass-button text-white/80"
                    }
                  `}
                >
                  {tag}
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
