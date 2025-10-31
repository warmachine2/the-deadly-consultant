import { BlogPost } from "@/components/BlogCard";

// Replace with your actual Ghost Content API key
const GHOST_API_URL = "https://thedeadlyconsultant.com/ghost/api/content";
const GHOST_API_KEY = "a864dbac3bd190d7bf4c2f852a";

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
    // Return mock data for demo purposes
    return getMockPosts(page, limit);
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

// Mock data for demo purposes
const getMockPosts = (page: number, limit: number): GhostResponse => {
  const mockPosts: GhostPost[] = [
    {
      id: "1",
      title: "Breaking Into BI Analytics: A Complete Roadmap",
      slug: "bi-analytics-roadmap",
      excerpt: "Your step-by-step guide to pivoting into Business Intelligence and earning $10k+/month. Learn the essential tools, certifications, and strategies.",
      published_at: new Date().toISOString(),
      reading_time: 8,
      tags: [{ name: "Roadmaps", slug: "roadmaps" }, { name: "BI Analytics", slug: "bi-analytics" }],
    },
    {
      id: "2",
      title: "PMP Certification: Is It Still Worth It in 2025?",
      slug: "pmp-certification-2025",
      excerpt: "An honest assessment of PMP certification value in today's AI-driven world. Find out if it's the right investment for your career.",
      published_at: new Date(Date.now() - 86400000).toISOString(),
      reading_time: 6,
      tags: [{ name: "PMP Certs", slug: "pmp-certs" }, { name: "Career Pivot", slug: "career-pivot" }],
    },
    {
      id: "3",
      title: "AI-Proof Your Career: Skills That Will Last",
      slug: "ai-proof-career-skills",
      excerpt: "Discover the timeless skills that AI can't replace. Position yourself for long-term success in the age of automation.",
      published_at: new Date(Date.now() - 172800000).toISOString(),
      reading_time: 7,
      tags: [{ name: "AI-Proof", slug: "ai-proof" }, { name: "Guides", slug: "guides" }],
    },
    {
      id: "4",
      title: "Top 10 Tools Every BI Consultant Needs",
      slug: "top-bi-tools",
      excerpt: "From Tableau to Power BI, here are the essential tools you need to master for a successful BI consulting career.",
      published_at: new Date(Date.now() - 259200000).toISOString(),
      reading_time: 5,
      tags: [{ name: "Tools", slug: "tools" }, { name: "BI Analytics", slug: "bi-analytics" }],
    },
    {
      id: "5",
      title: "From Corporate to Freelance: My $15k/Month Journey",
      slug: "corporate-to-freelance-journey",
      excerpt: "A personal story of leaving the corporate grind and building a thriving freelance BI consulting business. Real numbers, real insights.",
      published_at: new Date(Date.now() - 345600000).toISOString(),
      reading_time: 10,
      tags: [{ name: "Stories", slug: "stories" }, { name: "FinTech", slug: "fintech" }],
    },
    {
      id: "6",
      title: "FinTech for Beginners: Where to Start",
      slug: "fintech-for-beginners",
      excerpt: "Breaking into the lucrative FinTech industry doesn't require a finance degree. Here's how to get started with what you already know.",
      published_at: new Date(Date.now() - 432000000).toISOString(),
      reading_time: 6,
      tags: [{ name: "FinTech", slug: "fintech" }, { name: "Career Pivot", slug: "career-pivot" }],
    },
  ];

  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedPosts = mockPosts.slice(start, end);

  return {
    posts: paginatedPosts,
    meta: {
      pagination: {
        page,
        limit,
        pages: Math.ceil(mockPosts.length / limit),
        total: mockPosts.length,
      },
    },
  };
};
