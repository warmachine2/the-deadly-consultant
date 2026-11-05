import type * as Zod from "zod";

// Inject Zod so the same definitions work in both Vite and Deno.
export const createQuizLeadSchemas = (z: typeof Zod) => {
  const text = (max: number, message: string) => z.string().trim().min(1, message).max(max);
  const contactSchema = z.object({
    fullName: text(100, "Full name is required"),
    email: z.string().trim().email("Enter a valid email address").max(255),
    phone: text(40, "Mobile / WhatsApp number is required")
      .regex(/^\+?[\d\s().-]+$/, "Enter a valid phone number")
      .refine(value => value.replace(/\D/g, "").length >= 7 && value.replace(/\D/g, "").length <= 15, "Use 7–15 digits, including your country code"),
    linkedIn: z.string().trim().url("Enter a valid LinkedIn profile URL").max(500)
      .refine(value => {
        try {
          const url = new URL(value);
          return ["https:", "http:"].includes(url.protocol)
            && (url.hostname === "linkedin.com" || url.hostname.endsWith(".linkedin.com"))
            && /^\/in\/[^/]+\/?$/.test(url.pathname);
        } catch { return false; }
      }, "Use your linkedin.com/in/ profile URL"),
    city: text(200, "City & country are required"),
    vipScholarship: z.boolean().default(false),
  });
  const payloadSchema = contactSchema.extend({
    score: z.number().int().min(0).max(100),
    mqlQualified: z.boolean(),
    experienceBracket: z.enum(["5+ years", "3 to 5 years (with university degree)", "3 to 5 years (without degree)", "1 to 2 years", "Under 1 year / Current student"]),
    rolePond: z.enum(["Data_Analyst", "BA_Scrum", "Coordinator_Ops", "Dev_Eng", "Finance_Corp", "Other_WhiteCollar", "Other_General"]),
    currentIncome: text(200, "Income answer is required"),
    contractorOpen: text(200, "Contractor answer is required"),
    status: z.literal("NEW"),
  }).strict().superRefine((data, ctx) => {
    const expected = !["1 to 2 years", "Under 1 year / Current student"].includes(data.experienceBracket);
    if (data.mqlQualified !== expected) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["mqlQualified"], message: "Qualification must match experience" });
  });
  return { contactSchema, payloadSchema };
};