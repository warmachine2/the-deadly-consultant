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
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-16 left-0 h-[calc(100vh-4rem)] z-40
          w-64 glass-strong rounded-r-3xl md:rounded-3xl p-6
          transition-transform duration-300 overflow-y-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="md:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-white/20"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5 text-foreground" />
        </button>

        <h2 className="text-lg font-bold text-foreground mb-6">Filters</h2>

        {/* Categories */}
        <div className="mb-6">
          <button
            onClick={() => setShowCategories(!showCategories)}
            className="flex items-center justify-between w-full mb-3 text-sm font-semibold text-foreground"
          >
            Categories
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
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
                    w-full text-left px-3 py-2 rounded-lg text-sm transition-all
                    ${
                      selectedCategory === category
                        ? "glass-strong text-accent font-medium"
                        : "hover:bg-white/10 text-muted-foreground"
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
            className="flex items-center justify-between w-full mb-3 text-sm font-semibold text-foreground"
          >
            Tags
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
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
                        ? "glass-strong text-accent hover-glow"
                        : "glass text-muted-foreground hover:bg-white/20"
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
