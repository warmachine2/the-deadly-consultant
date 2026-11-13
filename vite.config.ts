import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { writeFile, readFile } from "fs/promises";
import { componentTagger } from "lovable-tagger";
import { getSiteMeta } from "./src/lib/siteMeta";
import { SEO_PAGES, renderSeoPageIntoShell } from "./src/lib/seoPages";

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
    {
      // SEO: give non-JS crawlers readable HTML in the raw response. Runs only at
      // the end of `vite build` (npm run build), never in the dev server.
      name: "prerender-seo-pages",
      apply: "build" as const,
      enforce: "post" as const,
      async closeBundle() {
        const outDir = path.resolve(__dirname, "dist");
        let shell: string;
        try {
          shell = await readFile(path.join(outDir, "index.html"), "utf-8");
        } catch (error) {
          console.error("[prerender-seo-pages] dist/index.html not found - skipping prerender.", error);
          return;
        }
        for (const page of SEO_PAGES) {
          try {
            await writeFile(path.join(outDir, page.file), renderSeoPageIntoShell(shell, page), "utf-8");
          } catch (error) {
            console.error(`[prerender-seo-pages] failed to write ${page.file} - skipping.`, error);
          }
        }
      },
    },
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
