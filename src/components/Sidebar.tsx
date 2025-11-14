import { useEffect } from "react";
import { X } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const Sidebar = ({ isOpen, onClose, selectedTags, onTagToggle, selectedCategory, onCategoryChange }: SidebarProps) => {
  // Sample tags/categories - replace with your dynamic ones if needed
  const tags = ["AI", "FinTech", "Consulting", "Roadmap"];
  const categories = ["All Posts", "Tutorials", "Case Studies"];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // Prevent body scroll when open
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose} // Click outside to close
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-background/95 backdrop-blur-md border-r transform 
        transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:w-64
        ${isOpen ? "translate-x-0" : "translate-x-[-100%]"}
      `}
      >
        <div className="h-full flex flex-col p-4 relative">
          {" "}
          {/* NEW: relative for absolute "X" */}
          {/* UPDATED: "X" Button - absolute top-right, fixed placement, no flex mess */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-accent/10 lg:hidden z-10"
          >
            <X className="w-5 h-5" />
          </button>
          {/* Header for Desktop */}
          <div className="lg:mb-4 lg:hidden:hidden">
            {" "}
            {/* Hide mobile header since "X" is separate */}
            <h2 className="text-xl font-bold">Filters</h2>
          </div>
          {/* Categories */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Categories</h3>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`w-full text-left py-2 px-3 rounded-md mb-1 transition-colors ${
                  selectedCategory === cat ? "bg-accent text-accent-foreground" : "hover:bg-muted"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          {/* Tags */}
          <div>
            <h3 className="font-semibold mb-2">Tags</h3>
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => onTagToggle(tag)}
                className={`inline-flex items-center py-1 px-2 mr-2 mb-2 rounded-full text-sm transition-colors ${
                  selectedTags.includes(tag) ? "bg-accent text-accent-foreground" : "bg-muted hover:bg-accent/10"
                }`}
              >
                {tag}
                {selectedTags.includes(tag) && <span className="ml-1">✓</span>}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
