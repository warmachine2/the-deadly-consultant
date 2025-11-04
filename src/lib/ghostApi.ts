import { BlogPost } from "@/components/BlogCard";
import { supabase } from "@/integrations/supabase/client";

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
    const params = {
      limit: limit.toString(),
      page: page.toString(),
      include: 'tags,authors',
      formats: 'markdown'
    };
    
    console.log("Fetching posts with params:", params);
    
    const { data, error } = await supabase.functions.invoke('fetch-ghost-posts', {
      body: {
        endpoint: '/posts/',
        params
      }
    });

    if (error) {
      console.error("Error fetching Ghost posts:", error);
      throw error;
    }

    console.log("Response posts length:", data?.posts?.length || 0);
    return data;
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
    const params = {
      include: 'tags,authors',
      formats: 'markdown'
    };
    
    console.log("Fetching post by slug:", slug, "with params:", params);
    
    const { data, error } = await supabase.functions.invoke('fetch-ghost-posts', {
      body: {
        endpoint: `/posts/slug/${slug}/`,
        params
      }
    });

    if (error) {
      console.error("Error fetching Ghost post:", error);
      throw error;
    }

    const post = data.posts[0];
    console.log("Post fetched, has markdown:", !!post?.markdown, "has html:", !!post?.html);
    return post;
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

