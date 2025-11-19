import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { getSiteMeta } from "./src/lib/siteMeta";

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    {
      name: "inject-ghost-meta",
      transformIndexHtml: async (html: string) => {
        const meta = await getSiteMeta();
        
        return html
          .replace(/%VITE_SITE_TITLE%/g, meta.title)
          .replace(/%VITE_SITE_DESCRIPTION%/g, meta.description)
          .replace(/%VITE_SITE_OG_IMAGE%/g, meta.ogImage)
          .replace(/%VITE_SITE_OG_TITLE%/g, meta.ogTitle)
          .replace(/%VITE_SITE_OG_DESCRIPTION%/g, meta.ogDescription)
          .replace(/%VITE_SITE_TWITTER_IMAGE%/g, meta.twitterImage)
          .replace(/%VITE_SITE_TWITTER_TITLE%/g, meta.twitterTitle)
          .replace(/%VITE_SITE_TWITTER_DESCRIPTION%/g, meta.twitterDescription);
      },
    },
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
