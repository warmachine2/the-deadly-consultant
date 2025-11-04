import { useState, useEffect, useCallback } from "react";
import TopNav from "@/components/TopNav";
import HeroSection from "@/components/HeroSection";
import Sidebar from "@/components/Sidebar";
import BlogCard, { BlogPost } from "@/components/BlogCard";
import PostModal from "@/components/PostModal";
import { fetchPosts, fetchPostBySlug, transformGhostPost } from "@/lib/ghostApi";
import { Loader2 } from "lucide-react";

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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

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

  // Filter posts
  useEffect(() => {
    let filtered = [...posts];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter((post) =>
        post.tags?.some((tag) => selectedTags.includes(tag.name))
      );
    }

    // Category filter (simplified - you can enhance this)
    if (selectedCategory !== "All Posts") {
      filtered = filtered.filter((post) =>
        post.tags?.some((tag) => tag.name === selectedCategory)
      );
    }

    setFilteredPosts(filtered);
  }, [searchQuery, selectedTags, selectedCategory, posts]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
        !loading &&
        hasMore
      ) {
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

  const handlePostClick = async (post: BlogPost) => {
    setSelectedPost(post);
    setModalOpen(true);
    
    // Fetch full content
    try {
      const fullPost = await fetchPostBySlug(post.slug);
      if (fullPost?.markdown) {
        setFullContent(fullPost.markdown);
      } else if (fullPost?.html) {
        setFullContent(fullPost.html);
      }
    } catch (error) {
      console.error("Error fetching full post:", error);
    }
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen">
      <TopNav
        onSearchChange={setSearchQuery}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="pt-24 md:pt-20 px-4 md:px-6 pb-12">
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
          <main className="flex-1 min-w-0">
            {loading && posts.length === 0 ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-accent animate-spin" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPosts.map((post) => (
                    <BlogCard
                      key={post.id}
                      post={post}
                      onClick={() => handlePostClick(post)}
                    />
                  ))}
                </div>

                {filteredPosts.length === 0 && !loading && (
                  <div className="glass-strong rounded-3xl p-12 text-center">
                    <p className="text-xl text-muted-foreground">
                      No posts found. Try adjusting your filters.
                    </p>
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

      {/* Post Modal */}
      <PostModal
        post={selectedPost}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedPost(null);
          setFullContent("");
        }}
        fullContent={fullContent}
      />

      {/* Footer */}
      <footer className="glass-strong rounded-t-3xl mt-12 py-6 px-6">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 The Deadly Consultant. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
