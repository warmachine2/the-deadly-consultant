import { BlogPost } from "@/components/BlogCard";
import { supabase } from "@/integrations/supabase/client";

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
    const { data, error } = await supabase.functions.invoke('fetch-ghost-posts', {
      body: {
        endpoint: '/posts/',
        params: {
          limit: limit.toString(),
          page: page.toString(),
          include: 'tags,authors',
          fields: 'id,title,slug,excerpt,custom_excerpt,feature_image,published_at,reading_time'
        }
      }
    });

    if (error) {
      console.error("Error fetching Ghost posts:", error);
      throw error;
    }

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
    const { data, error } = await supabase.functions.invoke('fetch-ghost-posts', {
      body: {
        endpoint: `/posts/slug/${slug}/`,
        params: {
          include: 'tags,authors'
        }
      }
    });

    if (error) {
      console.error("Error fetching Ghost post:", error);
      throw error;
    }

    return data.posts[0];
  } catch (error) {
    console.error("Error fetching Ghost post:", error);
    return null;
  }
};

export const fetchPageBySlug = async (slug: string): Promise<GhostPost | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('fetch-ghost-posts', {
      body: {
        endpoint: `/pages/slug/${slug}/`,
        params: {
          include: 'tags,authors'
        }
      }
    });

    if (error) {
      console.error("Error fetching Ghost page:", error);
      throw error;
    }

    return data.pages[0];
  } catch (error) {
    console.error("Error fetching Ghost page:", error);
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

