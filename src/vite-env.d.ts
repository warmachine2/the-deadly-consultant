/// <reference types="vite/client" />

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}



interface ImportMetaEnv {
  readonly VITE_GHOST_CONTENT_API_KEY?: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string;
  readonly VITE_SUPABASE_PROJECT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
