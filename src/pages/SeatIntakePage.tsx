import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema, LOCATION_OPTIONS, matchesSeatPassword, type FormData } from "@/lib/seatIntakeSchema";
import { Button } from "@/components/ui/button";
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

const STORAGE_KEY = "seat_unlocked_password_v2";

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
    document.title = "Student Intake | Zero to PM Consultant";
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

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await matchesSeatPassword(pass)) {
      sessionStorage.setItem(STORAGE_KEY, "true");
      setUnlocked(true);
      setPassError("");
      setPass("");
    } else {
      setPassError("Incorrect password. Check your payment confirmation.");
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

      const submittedAt = new Date().toISOString();
      const { error: dbErr } = await supabase.from("student_seat_intakes").insert({
        full_name: data.fullName,
        email: data.email,
        whatsapp_number: data.whatsapp,
        linkedin_url: data.linkedin,
        resume_file_path: path,
        current_title_employer: data.currentRole,
        contract_location: data.contractLocation,
        submitted_at: submittedAt,
      });
      if (dbErr) throw new Error("Could not save your intake. Please try again.");

      // Best-effort notification to the n8n pipeline. Its own try/catch keeps
      // webhook downtime from ever breaking the student's submission.
      try {
        await fetch("https://n8n.srv1182241.hstgr.cloud/webhook/student-seat-intake", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: data.fullName,
            email: data.email,
            whatsapp: data.whatsapp,
            linkedin: data.linkedin,
            fileName,
            resumeFilePath: path,
            currentRole: data.currentRole,
            contractLocation: data.contractLocation,
            submittedAt,
          }),
        });
      } catch {
        // Notification failed — the intake is already saved, so ignore silently.
      }

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
                  Student Intake
                </h1>
                <Input
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  type="password"
                  placeholder="Enter password"
                  autoComplete="off"
                  maxLength={50}
                  className="bg-input border-border mb-2"
                />
                {passError && <p className="text-destructive text-sm mb-2">{passError}</p>}
                <Button
                  type="submit"
                  className="cta-red h-auto w-full mt-4 px-6 py-3.5 font-bold text-primary-foreground text-base md:text-lg tracking-wide shadow-none"
                >
                  Unlock Student Intake
                </Button>
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
                  Student Intake
                </h1>

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
                                  htmlFor={`contract-${o}`}
                                  className="flex items-center gap-3 rounded-lg border border-white/20 p-3 cursor-pointer text-white transition-colors hover:bg-white/5 has-[:checked]:border-[#FFE361] has-[:checked]:bg-[#FFE361]/10"
                                >
                                  <RadioGroupItem
                                    value={o}
                                    id={`contract-${o}`}
                                    className="h-5 w-5 border-white/60 text-white data-[state=checked]:border-[#FFE361] data-[state=checked]:text-[#FFE361] data-[state=checked]:bg-[#FFE361]/20 [&>span>svg]:h-3.5 [&>span>svg]:w-3.5 [&>span>svg]:fill-[#FFE361]"
                                  />
                                  <span className="text-white text-base leading-snug">{o}</span>
                                </label>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="cta-red h-auto w-full px-6 py-3.5 font-bold text-primary-foreground text-base md:text-lg tracking-wide shadow-none"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="inline mr-2 h-5 w-5 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Student Intake"
                      )}
                    </Button>
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
