import { BlogPost } from "@/components/BlogCard";

const GHOST_API_URL = "https://thedeadlyconsultant.com/ghost/api/content";
const GHOST_API_KEY = "138812683c4aee42ad4d684a05";

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

export const fetchPosts = async (
  page: number = 1,
  limit: number = 20
): Promise<GhostResponse> => {
  try {
    const params = new URLSearchParams({
      key: GHOST_API_KEY,
      formats: 'markdown',
      limit: limit.toString(),
      page: page.toString(),
      include: 'tags,authors'
    });
    
    const url = `${GHOST_API_URL}/posts/?${params.toString()}`;
    console.log('Direct fetch URL:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('Direct fetch error:', response.status, response.statusText);
      throw new Error(`Ghost API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Response posts length:", data?.posts?.length || 0);
    return data;
  } catch (error) {
    console.error("Direct fetch error:", error);
    return {
      posts: [],
      meta: {
        pagination: {
          page: 1,
          limit: 20,
          pages: 0,
          total: 0,
        },
      },
    };
  }
};

export const fetchPostBySlug = async (slug: string): Promise<GhostPost | null> => {
  try {
    const params = new URLSearchParams({
      key: GHOST_API_KEY,
      formats: 'markdown',
      include: 'tags,authors'
    });
    
    const url = `${GHOST_API_URL}/posts/slug/${slug}/?${params.toString()}`;
    console.log("Direct fetch URL:", url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('Direct fetch error:', response.status, response.statusText);
      throw new Error(`Ghost API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    const post = data.posts[0];
    console.log("Post fetched, has markdown:", !!post?.markdown, "has html:", !!post?.html);
    return post;
  } catch (error) {
    console.error("Direct fetch error:", error);
    return null;
  }
};

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

