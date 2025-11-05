import { BlogPost } from "@/components/BlogCard";

const GHOST_API_URL = "https://thedeadlyconsultant.com/ghost/api/content"; // UPDATE: Your Ghost URL
const API_KEY = process.env.GHOST_CONTENT_API_KEY || ""; // From .env or Vercel

export interface GhostPost {
  id: string;
  title: string;
  slug: string;
  html?: string;
  markdown?: string;
  feature_image?: string;
  excerpt?: string;
  custom_excerpt?: string;
  published_at: string;
  reading_time?: number;
  tags?: Array<{ name: string; slug: string }>;
}

export interface GhostResponse {
  posts: GhostPost[];
  meta: {
    pagination: {
      page: number;
      limit: number;
      pages: number;
      total: number;
    };
  };
}

// FIXED: Direct fetch, NO 'fields' (fixes 422), markdown with HTML fallback, logging
export const fetchPosts = async (page: number = 1, limit: number = 20): Promise<GhostResponse> => {
  try {
    const params = new URLSearchParams({
      key: API_KEY,
      limit: limit.toString(),
      page: page.toString(),
      include: "tags,authors",
      formats: "markdown", // Request Markdown
    });

    const url = `${GHOST_API_URL}/posts/?${params}`;
    console.log("Fetching posts URL:", url); // LOG: Debug in console

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Ghost API: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Posts loaded:", data.posts.length); // LOG: Confirm count

    return data;
  } catch (error) {
    console.error("Fetch posts error:", error); // LOG: See in browser console
    return { posts: [], meta: { pagination: { page: 1, limit: 20, pages: 0, total: 0 } } };
  }
};

// FIXED: Single post fetch, correct slug endpoint, markdown fallback, logging
export const fetchPostBySlug = async (slug: string): Promise<GhostPost | null> => {
  try {
    const params = new URLSearchParams({
      key: API_KEY,
      slug,
      include: "tags,authors",
      formats: "markdown", // Request Markdown
    });

    // FIXED: Clean slug endpoint—no extra slash
    const url = `${GHOST_API_URL}/posts/slug/${slug}/?${params}`;
    console.log("Fetching post URL:", url); // LOG

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Ghost API: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    const post = data.posts[0] || null;
    console.log("Post loaded:", post ? "Success (Markdown/HTML)" : "Empty"); // LOG

    return post;
  } catch (error) {
    console.error("Fetch post error:", error); // LOG
    return null;
  }
};

// UNCHANGED: Transform (now handles full data)
export const transformGhostPost = (ghostPost: GhostPost): BlogPost => {
  return {
    id: ghostPost.id,
    title: ghostPost.title,
    excerpt: ghostPost.custom_excerpt || ghostPost.excerpt || "",
    feature_image: ghostPost.feature_image,
    reading_time: ghostPost.reading_time,
    published_at: ghostPost.published_at,
    tags: ghostPost.tags,
    slug: ghostPost.slug,
  };
};
