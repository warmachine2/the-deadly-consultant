import { z } from "zod";

export const LOCATION_OPTIONS = ["Canada", "USA", "Remote either"] as const;

export const formSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required").max(150),
  email: z.string().trim().email("Invalid email address").max(255),
  whatsapp: z.string().trim().min(7, "WhatsApp number is required").max(30)
    .regex(/^\+?[0-9\s\-()]+$/, "Include country code, digits only (e.g. +1 416 555 0123)"),
  linkedin: z.string().trim().url("Enter a valid URL").max(500)
    .refine((v) => /linkedin\.com\//i.test(v), "Must be a LinkedIn profile URL"),
  resume: z.custom<File>((v) => v instanceof File, "Resume file is required")
    .refine((f) => f instanceof File && /\.(pdf|docx)$/i.test(f.name), "Only PDF or DOCX files are accepted")
    .refine((f) => f instanceof File && f.size <= 10 * 1024 * 1024, "File must be 10MB or smaller"),
  currentRole: z.string().trim().min(1, "Current title and employer is required").max(200),
  contractLocation: z.enum(LOCATION_OPTIONS, { required_error: "Please select an option" }),
});

export type FormData = z.infer<typeof formSchema>;

// A digest avoids embedding the shared password in the downloaded page source.
// This convenience gate is not a substitute for server-side authorization.
export async function matchesSeatPassword(password: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(password));
  const hex = Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
  return hex === "9f3687625bcfcd27bc52a2fd3a73cc583925e8e50d1d5e6ed425ea30d05053d6";
}