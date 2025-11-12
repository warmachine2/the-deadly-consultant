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
    
    // Build query string
    const queryParams = new URLSearchParams({
      key: GHOST_API_KEY,
      ...params
    });
    
    const url = `${GHOST_API_URL}${endpoint}?${queryParams.toString()}`;
    console.log('Full URL:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('Ghost API error:', response.status, response.statusText);
      throw new Error(`Ghost API error: ${response.statusText}`);
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
