interface GhostSettings {
  title: string;
  description: string;
  og_image?: string;
  og_title?: string;
  og_description?: string;
  twitter_image?: string;
  twitter_title?: string;
  twitter_description?: string;
}

interface GhostSettingsResponse {
  settings: GhostSettings;
}

interface SiteMeta {
  title: string;
  description: string;
  ogImage: string;
  ogTitle: string;
  ogDescription: string;
  twitterImage: string;
  twitterTitle: string;
  twitterDescription: string;
}

const DEFAULT_META: SiteMeta = {
  title: "The Deadly Consultant - Career Paths & BI-FinTech Success Stories",
  description:
    "Unlock your $10k+/mo BI-FinTech pivot. Explore career roadmaps, essential tools, PMP certifications, and inspiring success stories.",
  ogImage: "https://lovable.dev/opengraph-image-p98pqg.png",
  ogTitle: "The Deadly Consultant - Career Paths & BI-FinTech Success",
  ogDescription:
    "Unlock your $10k+/mo BI-FinTech pivot. Explore career roadmaps, essential tools, and inspiring success stories.",
  twitterImage: "https://lovable.dev/opengraph-image-p98pqg.png",
  twitterTitle: "The Deadly Consultant - Career Paths & BI-FinTech Success",
  twitterDescription:
    "Unlock your $10k+/mo BI-FinTech pivot. Explore career roadmaps, essential tools, and inspiring success stories.",
};

// Handle both Node.js (build time) and browser (runtime) contexts
const ghostApiKey = 
  (typeof process !== 'undefined' && process.env?.VITE_GHOST_CONTENT_API_KEY) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GHOST_CONTENT_API_KEY) ||
  undefined;

export async function getSiteMeta(): Promise<SiteMeta> {
  if (!ghostApiKey) {
    console.warn("VITE_GHOST_CONTENT_API_KEY not found, using default meta tags");
    return DEFAULT_META;
  }

  try {
    const response = await fetch(`https://thedeadlyconsultant.com/ghost/api/content/settings/?key=${ghostApiKey}`);

    if (!response.ok) {
      throw new Error(`Ghost API returned ${response.status}`);
    }

    const data = (await response.json()) as GhostSettingsResponse;
    const settings: GhostSettings = data.settings;

    return {
      title: settings.title || DEFAULT_META.title,
      description: settings.description || DEFAULT_META.description,
      ogImage: settings.og_image || DEFAULT_META.ogImage,
      ogTitle: settings.og_title || settings.title || DEFAULT_META.ogTitle,
      ogDescription: settings.og_description || settings.description || DEFAULT_META.ogDescription,
      twitterImage: settings.twitter_image || settings.og_image || DEFAULT_META.twitterImage,
      twitterTitle: settings.twitter_title || settings.og_title || settings.title || DEFAULT_META.twitterTitle,
      twitterDescription:
        settings.twitter_description ||
        settings.og_description ||
        settings.description ||
        DEFAULT_META.twitterDescription,
    };
  } catch (error) {
    console.error("Failed to fetch Ghost site settings:", error);
    return DEFAULT_META;
  }
}
