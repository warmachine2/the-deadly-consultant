// Index page - Main blog home
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import debounce from "lodash/debounce";
import TopNav from "@/components/TopNav";
import HeroSection from "@/components/HeroSection";
import BlogCard, { BlogPost } from "@/components/BlogCard";
import PostModal from "@/components/PostModal";
import Sidebar from "@/components/Sidebar";
import { fetchPosts, fetchPostBySlug, transformGhostPost } from "@/lib/ghostApi";
import { Loader2, Filter } from "lucide-react";
import RoadmapCard from "@/components/RoadmapCard";

const Index = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [fullContent, setFullContent] = useState<string>("");
  const [modalLoading, setModalLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const isOpeningRef = useRef(false);

  // Extract unique tags from all posts
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach(post => {
      post.tags?.forEach(tag => tagSet.add(tag.name));
    });
    return Array.from(tagSet).sort();
  }, [posts]);

  // Fetch initial posts
  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        const response = await fetchPosts(1, 20);
        const transformedPosts = response.posts.map(transformGhostPost);
        setPosts(transformedPosts);
        setFilteredPosts(transformedPosts);
        setHasMore(response.meta.pagination.page < response.meta.pagination.pages);
      } catch (error) {
        console.error("Error loading posts:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  // Filter posts by search query and tags
  useEffect(() => {
    let filtered = [...posts];

    if (searchQuery) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter((post) =>
        selectedTags.some(selectedTag =>
          post.tags?.some(tag => tag.name === selectedTag)
        )
      );
    }

    setFilteredPosts(filtered);
  }, [searchQuery, posts, selectedTags]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !loading && hasMore) {
        loadMorePosts();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore, page]);

  const loadMorePosts = async () => {
    setLoading(true);
    try {
      const nextPage = page + 1;
      const response = await fetchPosts(nextPage, 20);
      const transformedPosts = response.posts.map(transformGhostPost);
      setPosts((prev) => [...prev, ...transformedPosts]);
      setPage(nextPage);
      setHasMore(response.meta.pagination.page < response.meta.pagination.pages);
    } catch (error) {
      console.error("Error loading more posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostClick = useCallback((post: BlogPost) => {
    if (!post?.slug) return;
    navigate(`/${post.slug}`);
  }, [navigate]);

  const debouncedHandlePostClick = useMemo(() => debounce(handlePostClick, 300), [handlePostClick]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <TopNav onSearchChange={setSearchQuery} />

      {/* Fixed overlap + perfect mobile spacing */}
      <div className="px-0 md:px-6 pb-12 pt-20 lg:pt-20">
        {/* Hidden visually but kept in DOM for thumbnail/preview generation */}
        <HeroSection />

        {/* Mobile filter button */}
        <div className="md:hidden px-4 mb-4 mt-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 px-4 py-3 volumetric-glass-button rounded-xl text-white/80"
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
            {selectedTags.length > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-accent/30 rounded-full text-xs" style={{ color: "#F4C903" }}>
                {selectedTags.length}
              </span>
            )}
          </button>
        </div>

        <div className="mt-4 md:mt-8 flex gap-6">
          {/* Sidebar */}
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            selectedTags={selectedTags}
            onTagToggle={handleTagToggle}
            availableTags={availableTags}
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
                  {filteredPosts
                    .filter((post) => !post.title.toLowerCase().includes('deadly job alerts'))
                    .sort((a, b) => {
                      // Custom ordering: Hassan Hammer should be after "Reviving an e39 door" and before "WARNING: Don't pivot"
                      const hassanTitle = 'introducing "hassan hammer" fitness';
                      const e39Title = 'reviving an e39 door';
                      const warningTitle = "warning: don't pivot careers in the ai era";
                      
                      const aLower = a.title.toLowerCase();
                      const bLower = b.title.toLowerCase();
                      
                      const aIsHassan = aLower.includes(hassanTitle);
                      const bIsHassan = bLower.includes(hassanTitle);
                      const aIsE39 = aLower.includes(e39Title);
                      const bIsE39 = bLower.includes(e39Title);
                      const aIsWarning = aLower.includes(warningTitle);
                      const bIsWarning = bLower.includes(warningTitle);
                      
                      // If comparing Hassan with e39, Hassan should come after
                      if (aIsHassan && bIsE39) return 1;
                      if (bIsHassan && aIsE39) return -1;
                      
                      // If comparing Hassan with Warning, Hassan should come before
                      if (aIsHassan && bIsWarning) return -1;
                      if (bIsHassan && aIsWarning) return 1;
                      
                      return 0; // Keep original order for other posts
                    })
                    .map((post) => (
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
