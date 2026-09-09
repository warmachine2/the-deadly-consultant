import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import TopNav from "@/components/TopNav";
import { Loader2 } from "lucide-react";

const QUALIFIER_OPTIONS = [
  "Professional with 3+ years experience, currently under-earning, want $10k/mo+ PM contracts",
  "Already in PM / consulting and looking for better contracts",
  "Less than 3 years of professional experience",
  "Just researching / not sure yet",
] as const;

const formSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().min(1, "Phone/WhatsApp is required").max(30),
  qualifier: z.enum(QUALIFIER_OPTIONS, {
    required_error: "Please select the option that best describes you",
  }),
});

type FormData = z.infer<typeof formSchema>;

const TZ = "America/Toronto";

/** Offset in minutes between UTC and America/Toronto at a given instant. */
const tzOffsetMs = (date: Date) => {
  const asTz = new Date(date.toLocaleString("en-US", { timeZone: TZ }));
  const asUtc = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
  return asTz.getTime() - asUtc.getTime();
};

/** Next Saturday 11:00 AM Toronto time, as a real (UTC) Date. */
const getNextSession = (now: Date = new Date()): Date => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const weekdayMap: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  };
  const dow = weekdayMap[get("weekday")] ?? 0;
  const hour = parseInt(get("hour"), 10) % 24;

  let daysAhead = (6 - dow + 7) % 7;
  // Saturday after 12:00 PM -> next week's session
  if (daysAhead === 0 && hour >= 12) daysAhead = 7;

  const y = parseInt(get("year"), 10);
  const m = parseInt(get("month"), 10);
  const d = parseInt(get("day"), 10);

  // Build target wall-clock time in Toronto, then convert to UTC instant.
  const naiveUtc = Date.UTC(y, m - 1, d + daysAhead, 11, 0, 0);
  const guess = new Date(naiveUtc - tzOffsetMs(new Date(naiveUtc)));
  return new Date(naiveUtc - tzOffsetMs(guess));
};

const formatSessionDate = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);

const CountdownCard = () => {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const session = useMemo(() => getNextSession(now), [now]);
  const diff = Math.max(0, session.getTime() - now.getTime());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);

  const units: Array<[string, number]> = [
    ["Days", days],
    ["Hours", hours],
    ["Mins", mins],
    ["Secs", secs],
  ];

  return (
    <div className="volumetric-glass rounded-2xl p-6 mb-8 text-center">
      <span
        className="inline-block text-xs md:text-sm font-bold tracking-widest mb-2"
        style={{ color: "#FFE361" }}
      >
        NEXT LIVE SESSION
      </span>
      <p className="text-white text-sm md:text-base font-medium mb-5">
        {formatSessionDate(session)} &bull; 11:00 AM &ndash; 12:00 PM EST
      </p>
      <div className="grid grid-cols-4 gap-2 md:gap-3">
        {units.map(([label, value]) => (
          <div
            key={label}
            className="rounded-xl px-2 py-3 border border-[#FFE361]/50 bg-black/40"
          >
            <div className="text-2xl md:text-3xl font-bold" style={{ color: "#FFE361" }}>
              {String(value).padStart(2, "0")}
            </div>
            <div className="text-[10px] md:text-xs uppercase tracking-wider text-white/80">
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const FreeWorkshopPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const rawSource = searchParams.get("source");
      const source = rawSource && rawSource.trim().length > 0 ? rawSource.trim() : "direct";

      const { error } = await supabase.functions.invoke("send-webinar-registrant", {
        body: {
          firstName: data.firstName,
          email: data.email,
          phone: data.phone,
          qualifier: data.qualifier,
          source,
        },
      });

      if (error) {
        throw new Error(error.message || "Submission failed");
      }

      navigate("/free-workshop/thank-you");
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-2xl mx-auto">
          <div className="volumetric-glass rounded-2xl p-8 md:p-12">
            <h1
              className="text-3xl md:text-4xl font-bold mb-4 text-center"
              style={{ color: "#FFE361" }}
            >
              Free Live Workshop: How to Land $10k–$18k/mo Data and AI Orchestration PM Consulting
              Contracts
            </h1>
            <p className="text-white text-center mb-8 text-base md:text-lg">
              I&rsquo;ll show you the exact roadmap + the hidden job board I used to go from
              $3.5k/mo to $18k/mo take-home.
            </p>

            <div className="mb-6">
              <button
                type="button"
                disabled={isSubmitting}
                className="highlight-glow-button w-full px-6 py-3.5 font-bold text-white text-base md:text-lg tracking-wide shadow-none"
                onClick={form.handleSubmit(onSubmit)}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="inline mr-2 h-5 w-5 animate-spin" />
                    Reserving...
                  </>
                ) : (
                  "Reserve My Free Spot"
                )}
              </button>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-base font-medium mb-1">
                        First Name (required)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="First Name"
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-base font-medium mb-1">
                        Email (required)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="you@example.com"
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
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-base font-medium mb-1">
                        Phone/WhatsApp (required)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+1 555 123 4567"
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
                  name="qualifier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-base font-medium mb-1">
                        Which best describes you?
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="space-y-3 mt-2"
                        >
                          {QUALIFIER_OPTIONS.map((option) => (
                            <label
                              key={option}
                              htmlFor={option}
                              className="flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors hover:bg-white/5 has-[:checked]:bg-white/10"
                            >
                              <RadioGroupItem
                                value={option}
                                id={option}
                                className="mt-0.5 h-5 w-5 border-white/60 text-white data-[state=checked]:border-[#F4C903] data-[state=checked]:text-[#F4C903] data-[state=checked]:bg-[#F4C903]/10 [&>span>svg]:h-3.5 [&>span>svg]:w-3.5 [&>span>svg]:fill-[#F4C903]"
                              />
                              <span className="text-white text-sm leading-snug">
                                {option}
                              </span>
                            </label>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FreeWorkshopPage;
