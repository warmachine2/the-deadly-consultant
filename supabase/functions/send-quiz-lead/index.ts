import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import * as z from "npm:zod@3.25.76";
import { createQuizLeadSchemas } from "./schema.ts";

const { payloadSchema } = createQuizLeadSchemas(z);
const WEBHOOK_URL = "https://n8n.srv1182241.hstgr.cloud/webhook/quiz-leads";
const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), {
  status, headers: { ...corsHeaders, "Content-Type": "application/json" },
});

Deno.serve(async req => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  let body: unknown;
  try { body = await req.json(); } catch { return json({ error: "Invalid JSON" }, 400); }
  const parsed = payloadSchema.safeParse(body);
  if (!parsed.success) return json({ error: "Invalid candidate details", fields: parsed.error.flatten().fieldErrors }, 400);

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data), signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) {
      // Do not log candidate details or webhook bodies that may echo them.
      console.error("Quiz delivery failed", response.status);
      return json({ error: "Quiz delivery failed", status: response.status }, 502);
    }
    return json({ success: true });
  } catch {
    console.error("Quiz delivery unavailable");
    return json({ error: "Quiz delivery unavailable" }, 502);
  }
});