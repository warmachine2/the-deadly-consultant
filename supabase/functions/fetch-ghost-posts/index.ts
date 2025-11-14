import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

const GHOST_API_URL = "https://thedeadlyconsultant.com/ghost/api/content";
const GHOST_API_KEY = "138812683c4aee42ad4d684a05";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { endpoint, params } = await req.json();
    
    console.log('Fetching from Ghost API:', { endpoint, params });
    
    // Build query string with cache-buster
    const queryParams = new URLSearchParams({
      key: GHOST_API_KEY,
      ...params,
    });
    // Add cache-buster to avoid CDN/stale caches
    queryParams.set('t', Date.now().toString());
    
    const url = `${GHOST_API_URL}${endpoint}?${queryParams.toString()}`;
    console.log('Full URL:', url);
    
    // Gentle delay to reduce rate-limit bursts
    await new Promise((r) => setTimeout(r, 1000));
    
    const response = await fetch(url);
    
    console.log('Response status:', response.status);
    console.log('Response content-type:', response.headers.get('content-type'));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ghost API error:', response.status, response.statusText);
      console.error('Error response body:', errorText.substring(0, 500));
      throw new Error(`Ghost API error: ${response.status} - ${response.statusText}`);
    }
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const textResponse = await response.text();
      console.error('Non-JSON response received. Content-Type:', contentType);
      console.error('Response body (first 500 chars):', textResponse.substring(0, 500));
      throw new Error(`Ghost API returned non-JSON response. Content-Type: ${contentType}`);
    }
    
    const data = await response.json();
    console.log('Successfully fetched data from Ghost API');
    
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in fetch-ghost-posts function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
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
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
