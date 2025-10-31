import { BlogPost } from "@/components/BlogCard";

// Replace with your actual Ghost Content API key
const GHOST_API_URL = "https://thedeadlyconsultant.com/ghost/api/content";
const GHOST_API_KEY = "138812683c4aee42ad4d684a05";

export interface GhostPost {
  id: string;
  title: string;
  slug: string;
  html?: string;
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
    const response = await fetch(
      `${GHOST_API_URL}/posts/?key=${GHOST_API_KEY}&limit=${limit}&page=${page}&include=tags,authors&fields=id,title,slug,excerpt,custom_excerpt,feature_image,published_at,reading_time`
    );

    if (!response.ok) {
      throw new Error(`Ghost API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching Ghost posts:", error);
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
    const response = await fetch(
      `${GHOST_API_URL}/posts/slug/${slug}/?key=${GHOST_API_KEY}&include=tags,authors`
    );

    if (!response.ok) {
      throw new Error(`Ghost API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.posts[0];
  } catch (error) {
    console.error("Error fetching Ghost post:", error);
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

