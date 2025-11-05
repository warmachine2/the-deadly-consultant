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
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100 &&
        !loading &&
        hasMore
      ) {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchPosts(nextPage, 20).then((response) => {
          const newPosts = response.posts.map(transformGhostPost);
          setPosts((prev) => [...prev, ...newPosts]);
          setHasMore(response.meta.pagination.page < response.meta.pagination.pages);
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore, page]);

  const handlePostClick = useCallback(async (post: BlogPost) => {
    setSelectedPost(post);
    setModalOpen(true);
    setFullContent("");

    try {
      const fullPost = await fetchPostBySlug(post.slug);
      if (fullPost) {
        const content = fullPost.markdown || fullPost.html || "";
        setFullContent(content);
      }
    } catch (error) {
      console.error("Error fetching full post:", error);
    }
  }, []);

  const handleTagToggle = (tagName: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagName)
        ? prev.filter((t) => t !== tagName)
        : [...prev, tagName]
    );
  };

  const allTags = Array.from(
    new Set(posts.flatMap((post) => post.tags?.map((tag) => tag.name) || []))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <TopNav onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <HeroSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {loading && posts.length === 0 ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPosts.map((post) => (
                  <BlogCard
                    key={post.id}
                    post={post}
                    onClick={() => handlePostClick(post)}
                  />
                ))}
              </div>
            )}
            {loading && posts.length > 0 && (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}
          </div>

          <Sidebar
            tags={allTags}
            selectedTags={selectedTags}
            onTagToggle={handleTagToggle}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        </div>
      </div>

      <PostModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        post={selectedPost}
        fullContent={fullContent}
      />
    </div>
  );
};

export default Index;