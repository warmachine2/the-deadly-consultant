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
  title: "10k/mo+ AI-Proof Pivot: BI-FinTech & AI Deployment PM Consulting",
  description:
    "Escape AI job vaporization. Master PMP/PSM/CPMAI trifecta + build $60k PPM tools. Land guaranteed interviews fast.",
  ogImage: "https://ZeroToPMConsultant.com/og-image.png",
  ogTitle: "10k/mo+ AI-Proof Pivot: BI-FinTech & AI Deployment PM Consulting",
  ogDescription:
    "Escape AI job vaporization. Master PMP/PSM/CPMAI trifecta + build $60k PPM tools. Land guaranteed interviews fast.",
  twitterImage: "https://ZeroToPMConsultant.com/og-image.png",
  twitterTitle: "10k/mo+ AI-Proof Pivot: BI-FinTech & AI Deployment PM Consulting",
  twitterDescription:
    "Escape AI job vaporization. Master PMP/PSM/CPMAI trifecta + build $60k PPM tools. Land guaranteed interviews fast.",
};

// Ghost Content API keys are public and safe to include in code
const ghostApiKey = '2cd123c73978a865e977713943';

export async function getSiteMeta(): Promise<SiteMeta> {
  if (!ghostApiKey) {
    console.warn("VITE_GHOST_CONTENT_API_KEY not found, using default meta tags");
    return DEFAULT_META;
  }

  try {
    const response = await fetch(`https://hassan-khalid-khan.ghost.io/ghost/api/content/settings/?key=${ghostApiKey}`);

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
