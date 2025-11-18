import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import debounce from "lodash/debounce";
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

  const isOpeningRef = useRef(false);

  // ... (all your useEffects and functions stay exactly the same)

  return (
    <div className="min-h-screen">
      <TopNav onSearchChange={setSearchQuery} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* ← THIS IS THE ONLY LINE THAT CHANGED — perfect mobile spacing, no overlap */}
      <div className="px-0 md:px-6 pb-12 pt-16 md:pt-0 -mt-8 md:-mt-0">
        <HeroSection />
        <div className="flex flex-col md:flex-row gap-0 md:gap-6 relative -mt-12 md:-mt-0">
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            selectedTags={selectedTags}
            onTagToggle={handleTagToggle}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          <main className="flex-1 min-w-0">
            {loading && posts.length === 0 ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-accent animate-spin" />
              </div>
            ) : (
              <>
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-0">
                  <RoadmapCard />
                  {filteredPosts.map((post) => (
                    <BlogCard key={post.id} post={post} onClick={() => debouncedHandlePostClick(post)} />
                  ))}
                </div>

                {filteredPosts.length === 0 && !loading && (
                  <div className="glass-effect rounded-3xl p-12 text-center">
                    <p className="text-xl text-muted-foreground">No posts found. Try adjusting your filters.</p>
                  </div>
                )}

                {loading && posts.length > 0 && (
                  <div className="flex justify-center mt-8">
                    <Loader2 className="w-6 h-6 text-accent animate-spin" />
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* Modal and footer unchanged */}
      {modalOpen && (
        <PostModal
          key={selectedPost?.slug || "modal-unique"}
          post={selectedPost}
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedPost(null);
            setFullContent("");
            setModalLoading(false);
            isOpeningRef.current = false;
          }}
          fullContent={fullContent}
          isLoading={modalLoading}
        />
      )}

      <footer className="glass-effect rounded-t-3xl mt-12 py-6 px-6">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 The Deadly Consultant. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
