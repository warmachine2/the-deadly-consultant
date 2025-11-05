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
    const handleScroll