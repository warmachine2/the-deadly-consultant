import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

const GHOST_API_URL = "https://app.thedeadlyconsultant.com/ghost/api/v3/content";
const GHOST_API_KEY = Deno.env.get("GHOST_KEY") || "";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Injected Guard: Check for key
  if (!GHOST_API_KEY) {
    console.error("Missing GHOST_KEY environment variable");
    return new Response(
      JSON.stringify({
        error: "Server misconfiguration: GHOST_KEY is not set",
        posts: [],
        meta: { pagination: { page: 1, limit: 20, pages: 0, total: 0 } },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
    );
  }

  try {
    const { endpoint, params } = await req.json();

    console.log("Fetching from Ghost API:", { endpoint, params });

    // Build query string with cache-buster
    const queryParams = new URLSearchParams({
      key: GHOST_API_KEY,
      formats: "html,plaintext",
      ...params,
    });
    // Add cache-buster to avoid CDN/stale caches
    queryParams.set("t", Date.now().toString());

    const baseUrl = `${GHOST_API_URL}${endpoint}`;
    const url = `${baseUrl}?${queryParams.toString()}`;
    console.log("Full URL:", url);

    // Gentle delay to reduce rate-limit bursts
    await new Promise((r) => setTimeout(r, 1000));

    // Fixed: Clean headers without v5.0
    const reqHeaders = new Headers({
      Accept: "application/json",
      "User-Agent": "LovableCloud/1.0 (+https://lovable.dev)",
    });

    let response = await fetch(url, { headers: reqHeaders });

    console.log("Response status:", response.status);
    console.log("Response content-type:", response.headers.get("content-type"));

    // If server returns HTML (often a CDN/protection page), retry with explicit version query param
    let contentType = response.headers.get("content-type") || "";
    if (contentType.includes("text/html")) {
      console.warn("HTML received on first attempt, retrying with explicit v=3 parameter");
      const retryParams = new URLSearchParams(queryParams);
      retryParams.set("v", "3");
      const retryUrl = `${GHOST_API_URL}${endpoint}?${retryParams.toString()}`;
      console.log("Retry URL:", retryUrl);
      response = await fetch(retryUrl, { headers: reqHeaders });
      contentType = response.headers.get("content-type") || "";
      console.log("Retry status:", response.status);
      console.log("Retry content-type:", contentType);
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Ghost API error:", response.status, response.statusText);
      console.error("Error response body:", errorText.substring(0, 500));
      // Soft-fail for non-OK responses to prevent blank screens
      return new Response(
        JSON.stringify({
          error: `Ghost API error: ${response.status} - ${response.statusText}`,
          posts: [],
          meta: { pagination: { page: 1, limit: 20, pages: 0, total: 0 } },
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" }, status: 200 },
      );
    }

    // Check if response is JSON
    if (!contentType || !contentType.includes("application/json")) {
      const textResponse = await response.text();
      console.error("Non-JSON response received. Content-Type:", contentType);
      console.error("Response body (first 500 chars):", textResponse.substring(0, 500));
      // Soft-fail when HTML or other content is returned
      return new Response(
        JSON.stringify({
          error: `Ghost API returned non-JSON response. Content-Type: ${contentType}`,
          posts: [],
          meta: { pagination: { page: 1, limit: 20, pages: 0, total: 0 } },
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" }, status: 200 },
      );
    }

    const data = await response.json();
    console.log("Successfully fetched data from Ghost API");

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in fetch-ghost-posts function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    // Soft-fail: return empty structure with 200 so UI can render gracefully
    return new Response(
      JSON.stringify({
        error: errorMessage,
        posts: [],
        meta: {
          pagination: {
            page: 1,
            limit: 20,
            pages: 0,
            total: 0,
          },
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" },
      },
    );
  }
});
