import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

const WEBHOOK_URL = "https://n8n.srv1182241.hstgr.cloud/webhook/quiz-leads";

const quizLeadSchema = {
  name: (v: unknown) => typeof v === "string" && v.trim().length > 0 && v.trim().length <= 100,
  email: (v: unknown) => typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && v.length <= 255,
  location: (v: unknown) => typeof v === "string" && v.trim().length > 0 && v.trim().length <= 200,
  score: (v: unknown) => typeof v === "number" && v >= 0 && v <= 100,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 405 },
    );
  }

  try {
    const payload = await req.json();
    const { name, email, location, score, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12 } = payload;

    // Validate required contact fields
    if (!quizLeadSchema.name(name)) {
      return new Response(
        JSON.stringify({ error: "Invalid or missing name" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 },
      );
    }
    if (!quizLeadSchema.email(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid or missing email" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 },
      );
    }
    if (!quizLeadSchema.location(location)) {
      return new Response(
        JSON.stringify({ error: "Invalid or missing location" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 },
      );
    }
    if (!quizLeadSchema.score(score)) {
      return new Response(
        JSON.stringify({ error: "Invalid or missing score" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 },
      );
    }

    // Validate answers are strings
    const answers = { q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12 };
    for (const [key, value] of Object.entries(answers)) {
      if (typeof value !== "string" || value.trim().length === 0 || value.length > 200) {
        return new Response(
          JSON.stringify({ error: `Invalid or missing answer for ${key}` }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 },
        );
      }
    }

    const webhookPayload = {
      name: String(name).trim(),
      email: String(email).trim(),
      location: String(location).trim(),
      score,
      q1: String(q1),
      q2: String(q2),
      q3: String(q3),
      q4: String(q4),
      q5: String(q5),
      q6: String(q6),
      q7: String(q7),
      q8: String(q8),
      q9: String(q9),
      q10: String(q10),
      q11: String(q11),
      q12: String(q12),
      timestamp: new Date().toISOString(),
    };

    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(webhookPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Webhook error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: `Webhook error: ${response.status}`, details: errorText }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 502 },
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
    );
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 },
    );
  }
});