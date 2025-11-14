import { useState, useEffect, useCallback } from "react";
import TopNav from "@/components/TopNav";
import HeroSection from "@/components/HeroSection";
import Sidebar from "@/components/Sidebar";
import BlogCard, { BlogPost } from "@/components/BlogCard";
import PostModal from "@/components/PostModal";
import { fetchPosts, fetchPostBySlug, transformGhostPost } from "@/lib/ghostApi";
import { Loader2 } from "lucide-react";
import RoadmapCard from "@/components/RoadmapCard";

const Index = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All Posts");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [fullContent, setFullContent] = useState<string>("");
  const [modalLoading, setModalLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // ... (useEffects and handlers unchanged)

  return (
    <div className="min-h-screen">
      <TopNav onSearchChange={setSearchQuery} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* UPDATED: Reduced pt to 16 on mobile for tiles closer to nav/hero */}
      <div className="pt-16 md:pt-20 px-4 md:px-6 pb-12">
        <HeroSection />

        <div className="flex gap-6 relative">
          {/* Sidebar */}
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            selectedTags={selectedTags}
            onTagToggle={handleTagToggle}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          {/* Main Content */}
          <main className="flex-1 min-w-0">{/* ... (loading and grid unchanged) */}</main>
        </div>
      </div>

      {/* ... (Modal & Footer unchanged) */}
    </div>
  );
};

export default Index;
