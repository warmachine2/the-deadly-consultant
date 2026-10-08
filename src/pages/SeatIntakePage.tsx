import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import TopNav from "@/components/TopNav";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Lock } from "lucide-react";

const PASSPHRASES = ["remake", "consultant", "accelerator", "seat"];
const STORAGE_KEY = "seat_unlocked";
const MAX_FILE_BYTES = 10 * 1024 * 1024;

const LOCATION_OPTIONS = ["Canada", "USA", "Remote either"] as const;
const CONSENT_OPTIONS = ["Full name ok", "First name only", "Do not use my name"] as const;

const isAllowedResume = (f: File) => /\.(pdf|docx)$/i.test(f.name);

const formSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required").max(150),
  email: z.string().trim().email("Invalid email address").max(255),
  whatsapp: z
    .string()
    .trim()
    .min(7, "WhatsApp number is required")
    .max(30)
    .regex(/^\+?[0-9\s\-()]+$/, "Include country code, digits only (e.g. +1 416 555 0123)"),
  linkedin: z
    .string()
    .trim()
    .url("Enter a valid URL")
    .max(500)
    .refine((v) => /linkedin\.com\//i.test(v), "Must be a LinkedIn profile URL"),
  resume: z
    .custom<File>((v) => v instanceof File, "Resume file is required")
    .refine((f) => isAllowedResume(f), "Only PDF or DOCX files are accepted")
    .refine((f) => f.size <= MAX_FILE_BYTES, "File must be 10MB or smaller"),
  currentRole: z.string().trim().min(1, "Current title and employer is required").max(200),
  yearsExperience: z.coerce
    .number({ invalid_type_error: "Enter a number" })
    .min(3, "Minimum 3 years of professional experience")
    .max(60),
  contractLocation: z.enum(LOCATION_OPTIONS, { required_error: "Please select an option" }),
  proofConsent: z.enum(CONSENT_OPTIONS, { required_error: "Please select an option" }),
});

type FormData = z.infer<typeof formSchema>;

const clean = (v: string) =>
  v.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Za-z0-9-]/g, "");

/** "Jane Doe" + resume.pdf -> "Doe-Jane-original.pdf" */
export const buildResumeFileName = (fullName: string, originalName: string) => {
  const parts = fullName.trim().split(/\s+/).map(clean).filter(Boolean);
  const last = parts.length > 1 ? parts[parts.length - 1] : "";
  const first = parts.length > 1 ? parts.slice(0, -1).join("-") : parts[0] || "Student";
  const ext = /\.docx$/i.test(originalName) ? "docx" : "pdf";
  const base = [last, first].filter(Boolean).join("-").replace(/-+/g, "-");
  return `${base || "Student"}-original.${ext}`;
};

const labelCls = "text-white text-base font-medium mb-1";
const helperCls = "text-muted-foreground text-sm";

const SeatIntakePage = () => {
  const [unlocked, setUnlocked] = useState(
    () => typeof window !== "undefined" && sessionStorage.getItem(STORAGE_KEY) === "true",
  );
  const [pass, setPass] = useState("");
  const [passError, setPassError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Paid Student Seat Intake | Zero to PM Consultant";
    let meta = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const prevContent = meta?.getAttribute("content") ?? null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "robots");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", "noindex, nofollow");
    return () => {
      document.title = prevTitle;
      if (prevContent === null) meta?.remove();
      else meta?.setAttribute("content", prevContent);
    };
  }, []);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      whatsapp: "",
      linkedin: "",
      currentRole: "",
    },
  });

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (PASSPHRASES.includes(pass.trim().toLowerCase())) {
      sessionStorage.setItem(STORAGE_KEY, "true");
      setUnlocked(true);
      setPassError("");
    } else {
      setPassError("Incorrect passphrase. Check your payment confirmation.");
    }
  };

  const { toast } = useToast();

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const fileName = buildResumeFileName(data.fullName, data.resume.name);
      // Unique folder per submission so files never overwrite each other.
      const path = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}/${fileName}`;
      const { error: upErr } = await supabase.storage
        .from("student-resumes")
        .upload(path, data.resume, { upsert: false, contentType: data.resume.type || undefined });
      if (upErr) throw new Error("Resume upload failed. Please try again.");

      const { error: dbErr } = await supabase.from("student_seat_intakes").insert({
        full_name: data.fullName,
        email: data.email,
        whatsapp_number: data.whatsapp,
        linkedin_url: data.linkedin,
        resume_file_path: path,
        current_title_employer: data.currentRole,
        years_experience: data.yearsExperience,
        contract_location: data.contractLocation,
        proof_consent: data.proofConsent,
        submitted_at: new Date().toISOString(),
      });
      if (dbErr) throw new Error("Could not save your intake. Please try again.");
      setSubmitted(true);
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-2xl mx-auto">
          <div className="volumetric-glass rounded-2xl p-8 md:p-12">
            {!unlocked ? (
              <form onSubmit={handleUnlock} className="text-center">
                <Lock className="mx-auto mb-4 h-10 w-10" style={{ color: "#FFE361" }} />
                <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#FFE361" }}>
                  Student Seat Access
                </h1>
                <p className="text-white mb-8 text-base md:text-lg">
                  Enter the passphrase provided in your payment confirmation (WhatsApp/Email) to
                  unlock the student intake form.
                </p>
                <Input
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="Enter passphrase"
                  autoComplete="off"
                  maxLength={50}
                  className="bg-input border-border mb-2"
                />
                {passError && <p className="text-destructive text-sm mb-2">{passError}</p>}
                <button
                  type="submit"
                  className="cta-red w-full mt-4 px-6 py-3.5 font-bold text-white text-base md:text-lg tracking-wide shadow-none"
                >
                  Unlock Intake Form
                </button>
              </form>
            ) : submitted ? (
              <p className="text-white text-center text-base md:text-lg leading-relaxed">
                Got it. I will add this WhatsApp number to the student group within 24 hours. Do
                not post the old resume. The remake starts from the file you just sent.
              </p>
            ) : (
              <>
                <h1
                  className="text-3xl md:text-4xl font-bold mb-4 text-center"
                  style={{ color: "#FFE361" }}
                >
                  Paid Student Seat Intake
                </h1>
                <p className="text-white text-center mb-8 text-base md:text-lg">
                  Complete every field so we can start your resume remake and onboarding.
                </p>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelCls}>Full Name</FormLabel>
                          <FormControl>
                            <Input className="bg-input border-border" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelCls}>Email Used at Checkout</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="you@example.com"
                              className="bg-input border-border"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className={helperCls}>
                            Must match the email you used when purchasing your seat.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="whatsapp"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelCls}>
                            WhatsApp Number (with country code)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="+1 416 555 0123"
                              className="bg-input border-border"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className={helperCls}>
                            Number I will add to the student WhatsApp group. Must be the number that
                            has WhatsApp.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="linkedin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelCls}>LinkedIn Profile URL</FormLabel>
                          <FormControl>
                            <Input
                              type="url"
                              placeholder="https://www.linkedin.com/in/..."
                              className="bg-input border-border"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="resume"
                      render={({ field: { onChange, value: _v, ...rest } }) => (
                        <FormItem>
                          <FormLabel className={labelCls}>
                            Resume File (PDF or DOCX, max 10MB)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="file"
                              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                              className="bg-input border-border cursor-pointer"
                              onChange={(e) => onChange(e.target.files?.[0])}
                              {...rest}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="currentRole"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelCls}>Current Title and Employer</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Senior Business Analyst at TD Bank"
                              className="bg-input border-border"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className={helperCls}>
                            Current title and employer — so the remake does not invent a job
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="yearsExperience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelCls}>
                            Years of Professional Experience
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={3}
                              className="bg-input border-border"
                              {...field}
                              value={field.value ?? ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contractLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelCls}>Where You Can Take a Contract</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="space-y-2"
                            >
                              {LOCATION_OPTIONS.map((o) => (
                                <label
                                  key={o}
                                  className="flex items-center gap-3 rounded-lg border border-border p-3 cursor-pointer text-white"
                                >
                                  <RadioGroupItem value={o} />
                                  {o}
                                </label>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="proofConsent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelCls}>Proof Use Consent</FormLabel>
                          <FormDescription className={helperCls}>
                            Before/after resume and recruiter screenshots. This is how the next
                            student believes it.
                          </FormDescription>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="space-y-2"
                            >
                              {CONSENT_OPTIONS.map((o) => (
                                <label
                                  key={o}
                                  className="flex items-center gap-3 rounded-lg border border-border p-3 cursor-pointer text-white"
                                >
                                  <RadioGroupItem value={o} />
                                  {o}
                                </label>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="cta-red w-full px-6 py-3.5 font-bold text-white text-base md:text-lg tracking-wide shadow-none"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="inline mr-2 h-5 w-5 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Student Intake"
                      )}
                    </button>
                  </form>
                </Form>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SeatIntakePage;
