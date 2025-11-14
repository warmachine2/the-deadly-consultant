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
  const cacheKey = `ghost:posts:${page}:${limit}`;
  try {
    const { data, error } = await supabase.functions.invoke('fetch-ghost-posts', {
      body: {
        endpoint: '/posts/',
        params: {
          limit: limit.toString(),
          page: page.toString(),
          include: 'tags,authors',
          fields: 'id,title,slug,excerpt,custom_excerpt,feature_image,published_at,reading_time',
        },
      },
    });

    if (error) {
      console.error('Error fetching Ghost posts:', error);
      throw error;
    }

    // Cache successful response only if it has the expected shape
    const isValid = data && Array.isArray((data as any).posts);
    if (isValid) {
      try {
        sessionStorage.setItem(cacheKey, JSON.stringify(data));
      } catch {}
      return data as GhostResponse;
    } else {
      console.error('Invalid posts response from backend:', data);
      return {
        posts: [],
        meta: {
          pagination: { page: 1, limit: limit, pages: 0, total: 0 },
        },
      };
    }
  } catch (error) {
    console.error('Error fetching Ghost posts:', error);
    // Fallback to cache if available
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) return JSON.parse(cached);
    } catch {}
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
  const cacheKey = `ghost:post:${slug}`;
  try {
    const { data, error } = await supabase.functions.invoke('fetch-ghost-posts', {
      body: {
        endpoint: `/posts/slug/${slug}/`,
        params: {
          include: 'tags,authors',
        },
      },
    });

    if (error) {
      console.error('Error fetching Ghost post:', error);
      throw error;
    }

    const post = (data && Array.isArray((data as any).posts)) ? (data as any).posts[0] || null : null;
    if (post) {
      try {
        sessionStorage.setItem(cacheKey, JSON.stringify(post));
      } catch {}
    }
    return post;
  } catch (error) {
    console.error('Error fetching Ghost post:', error);
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) return JSON.parse(cached);
    } catch {}
    return null;
  }
};

export const fetchPageBySlug = async (slug: string): Promise<GhostPost | null> => {
  const cacheKey = `ghost:page:${slug}`;
  try {
    const { data, error } = await supabase.functions.invoke('fetch-ghost-posts', {
      body: {
        endpoint: `/pages/slug/${slug}/`,
        params: {
          include: 'tags,authors',
        },
      },
    });

    if (error) {
      console.error('Error fetching Ghost page:', error);
      throw error;
    }

    const page = (data && Array.isArray((data as any).pages)) ? (data as any).pages[0] || null : null;
    if (page) {
      try {
        sessionStorage.setItem(cacheKey, JSON.stringify(page));
      } catch {}
    }
    return page;
  } catch (error) {
    console.error('Error fetching Ghost page:', error);
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) return JSON.parse(cached);
    } catch {}
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

