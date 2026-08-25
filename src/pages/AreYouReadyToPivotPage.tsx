import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import TopNav from "@/components/TopNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Sparkles, ShieldCheck, ArrowRight, User, Mail, MapPin } from "lucide-react";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  location: z.string().trim().min(1, "Location is required").max(200, "Location must be less than 200 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

type Step = "hero" | "contact";

const AreYouReadyToPivotPage = () => {
  const [step, setStep] = useState<Step>("hero");

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      location: "",
    },
  });

  const onContactSubmit = (data: ContactFormData) => {
    // TODO: store captured contact and advance to quiz questions
    console.log("Captured contact:", data);
  };

  const HeroSection = (
    <section className="volumetric-glass rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
      {/* Subtle static glow behind title */}
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(244, 201, 3, 0.15) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-6 md:gap-8">
        {/* Free badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F4C903]/20 border border-[#F4C903]/40 text-[#F4C903] font-semibold text-sm md:text-base">
          <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
          <span>Free</span>
        </div>

        {/* Main title */}
        <h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
          style={{
            color: "#FFE361",
            textShadow:
              "-0.5px -0.5px 0 #000, 0.5px -0.5px 0 #000, -0.5px 0.5px 0 #000, 0.5px 0.5px 0 #000, 0 4px 12px rgba(0, 0, 0, 0.8), 0 8px 24px rgba(0, 0, 0, 0.6)",
            WebkitTextStroke: "0.5px #000",
          }}
        >
          Are you ready to pivot to PM Consulting?
        </h1>

        {/* No signup required text */}
        <p className="flex items-center gap-2 text-base md:text-lg text-white/90 font-medium">
          <ShieldCheck className="w-5 h-5 text-[#F4C903]" />
          <span>No signup required to see your readiness score</span>
        </p>

        {/* Start Quiz button */}
        <div className="mt-4 md:mt-6">
          <div className="relative group">
            {/* Static amber glow */}
            <div
              className="absolute inset-0 rounded-2xl blur-xl opacity-50"
              style={{
                background:
                  "linear-gradient(90deg, rgba(245, 158, 11, 0.5), rgba(250, 204, 21, 0.6), rgba(245, 158, 11, 0.5))",
              }}
            />
            <button
              type="button"
              onClick={() => setStep("contact")}
              className="relative inline-flex items-center justify-center gap-3 px-10 py-5 md:px-12 md:py-6 text-xl md:text-2xl font-bold rounded-2xl transition-colors duration-300 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-400 text-gray-900 border-2 border-amber-300/60 hover:from-amber-400 hover:via-yellow-400 hover:to-amber-300"
            >
              <span>Start Quiz</span>
              <ArrowRight className="w-6 h-6 md:w-7 md:h-7" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );

  const ContactSection = (
    <section className="volumetric-glass rounded-3xl p-8 md:p-12 max-w-2xl mx-auto relative overflow-hidden">
      <div className="relative z-10">
        <h2
          className="text-2xl md:text-3xl font-bold text-center mb-2"
          style={{ color: "#FFE361" }}
        >
          Get Your Readiness Score
        </h2>
        <p className="text-center text-white/80 mb-8">
          Enter your details to continue. No spam — ever.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onContactSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white text-base font-medium flex items-center gap-2">
                    <User className="w-4 h-4 text-[#F4C903]" />
                    Name <span className="text-red-400">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your full name"
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
                  <FormLabel className="text-white text-base font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#F4C903]" />
                    Email <span className="text-red-400">*</span>
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
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white text-base font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#F4C903]" />
                    Location <span className="text-red-400">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="City, Country"
                      className="bg-input border-border"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full font-semibold py-6 text-lg text-white desktop-hover-scale-105 transition-transform"
              style={{
                background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                boxShadow: "0 0 20px rgba(220, 38, 38, 0.5), 0 0 40px rgba(220, 38, 38, 0.3)",
              }}
            >
              Continue
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </form>
        </Form>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen overflow-x-hidden">
      <TopNav onSearchChange={() => {}} onToggleSidebar={() => {}} />

      <main className="pt-24 lg:pt-28 px-4 md:px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          {step === "hero" ? HeroSection : ContactSection}
        </div>
      </main>

      <footer className="volumetric-glass rounded-t-3xl mt-12 py-6 px-6">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>© 2026 Zero to PM Consultant. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AreYouReadyToPivotPage;
