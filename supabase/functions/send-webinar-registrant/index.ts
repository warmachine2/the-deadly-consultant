import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

const WEBHOOK_URL = "https://n8n.srv1182241.hstgr.cloud/webhook/webinar-registrants";

const QUALIFIER_OPTIONS = [
  "Professional with 3+ years experience, currently under-earning, want $10k/mo+ PM contracts",
  "Already in PM / consulting and looking for better contracts",
  "Less than 3 years of professional experience",
  "Just researching / not sure yet",
];

const isNonEmptyString = (v: unknown, max: number) =>
  typeof v === "string" && v.trim().length > 0 && v.trim().length <= max;

const isValidEmail = (v: unknown) =>
  typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && v.length <= 255;

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
    const firstName = payload.firstName ?? payload["First Name"];
    const email = payload.email ?? payload["Email"];
    const phone = payload.phone ?? payload["Phone/WhatsApp"];
    const qualifier = payload.qualifier ?? payload["Qualifier"];
    const source = payload.source ?? payload["Source"];

    if (!isNonEmptyString(firstName, 100)) {
      return new Response(
        JSON.stringify({ error: "Invalid or missing firstName" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 },
      );
    }
    if (!isValidEmail(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid or missing email" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 },
      );
    }
    if (!isNonEmptyString(phone, 30)) {
      return new Response(
        JSON.stringify({ error: "Invalid or missing phone" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 },
      );
    }
    if (typeof qualifier !== "string" || !QUALIFIER_OPTIONS.includes(qualifier.trim())) {
      return new Response(
        JSON.stringify({ error: "Invalid or missing qualifier" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 },
      );
    }

    const normalizedSource =
      typeof source === "string" && source.trim().length > 0
        ? source.trim().slice(0, 100)
        : "direct";

    const webhookPayload = {
      "First Name": String(firstName).trim(),
      "Email": String(email).trim(),
      "Phone/WhatsApp": String(phone).trim(),
      "Qualifier": qualifier.trim(),
      "Source": normalizedSource,
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
        JSON.stringify({ error: `Webhook error: ${response.status}` }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 502 },
      );
    }

    return new Response(
      JSON.stringify({ status: "ok" }),
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
