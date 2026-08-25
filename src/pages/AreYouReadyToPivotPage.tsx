import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import {
  Sparkles,
  ShieldCheck,
  ArrowRight,
  User,
  Mail,
  MapPin,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  location: z.string().trim().min(1, "Location is required").max(200, "Location must be less than 200 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

type Step = "hero" | "contact" | "quiz" | "result";

type QuestionType = "yesno" | "choice";

interface Question {
  id: number;
  type: QuestionType;
  text: React.ReactNode;
  options: { value: string; label: string }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    type: "yesno",
    text: (
      <>
        Have you examined the job board for the types of jobs you’d be interested in doing?{" "}
        <a
          href="https://www.zerotopmconsultant.com/ai-bi-fintech-pm-job-alerts-repo"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[#F4C903] hover:underline font-semibold"
        >
          View the Job Board
        </a>
      </>
    ),
    options: [
      { value: "Yes", label: "Yes" },
      { value: "No", label: "No" },
    ],
  },
  {
    id: 2,
    type: "yesno",
    text: "Do you have at least 3 years of professional experience + a degree, or 5+ years of experience without a degree?",
    options: [
      { value: "Yes", label: "Yes" },
      { value: "No", label: "No" },
    ],
  },
  {
    id: 3,
    type: "yesno",
    text: "Are you comfortable working remotely from home most (or all) of the time?",
    options: [
      { value: "Yes", label: "Yes" },
      { value: "No", label: "No" },
    ],
  },
  {
    id: 4,
    type: "yesno",
    text: "Are you computer-savvy? (You can handle email, learn new tools, and don’t hate technology)",
    options: [
      { value: "Yes", label: "Yes" },
      { value: "No", label: "No" },
    ],
  },
  {
    id: 5,
    type: "yesno",
    text: "Can you type at least 40 words per minute (or are you willing to practice to get there)?",
    options: [
      { value: "Yes", label: "Yes" },
      { value: "No", label: "No" },
    ],
  },
  {
    id: 6,
    type: "yesno",
    text: (
      <>
        Are you open to moving from a traditional full-time employee role to a consultant setup?{" "}
        <span className="text-white/80 block mt-2 text-sm md:text-base">
          (This means much higher pay - 2x+ usually - and more freedom, but you lose employee benefits like paid vacation and must register your own business)
        </span>
      </>
    ),
    options: [
      { value: "Yes", label: "Yes" },
      { value: "No", label: "No" },
    ],
  },
  {
    id: 7,
    type: "yesno",
    text: (
      <>
        Are you willing to take a Hassan’s proven segmented approach to breaking in?{" "}
        <span className="text-white/80 block mt-2 text-sm md:text-base">
          (Learn how the real job is done → build a strong portfolio → then fast-track 3 key certifications, with training and guidance provided.)
        </span>
      </>
    ),
    options: [
      { value: "Yes", label: "Yes" },
      { value: "No", label: "No" },
    ],
  },
  {
    id: 8,
    type: "yesno",
    text: "Can you follow step-by-step self-paced video training and then show up to live group Q&A sessions (2x per week) when you have questions?",
    options: [
      { value: "Yes", label: "Yes" },
      { value: "No", label: "No" },
    ],
  },
  {
    id: 9,
    type: "choice",
    text: "Which best describes your current situation?",
    options: [
      { value: "a", label: "Employed full-time but under-earning / stuck" },
      { value: "b", label: "Looking for higher-paying contract work" },
      { value: "c", label: "Career changer from a technical background" },
      { value: "d", label: "Already freelancing / consulting and want to level up" },
      { value: "e", label: "Other" },
    ],
  },
  {
    id: 10,
    type: "choice",
    text: "What is your main desired outcome in the next 6–12 months?",
    options: [
      { value: "a", label: "Land my first $8k–$12k/mo contract" },
      { value: "b", label: "Replace my full-time job with consulting income" },
      { value: "c", label: "Significantly increase my income while working remotely" },
      { value: "d", label: "Build a more flexible / location-independent career" },
      { value: "e", label: "Other" },
    ],
  },
  {
    id: 11,
    type: "choice",
    text: "What has been the biggest obstacle so far?",
    options: [
      { value: "a", label: "Don’t know how to break into consulting" },
      { value: "b", label: "Lack of the right experience or portfolio" },
      { value: "c", label: "Unsure which certifications actually matter" },
      { value: "d", label: "Don’t have a clear step-by-step path" },
      { value: "e", label: "Other" },
    ],
  },
  {
    id: 12,
    type: "yesno",
    text: "Can you commit approximately 15 hours per week for the next 12 weeks (or an equivalent total, such as 7–8 hours per week over 24 weeks)?",
    options: [
      { value: "Yes", label: "Yes" },
      { value: "No", label: "No" },
    ],
  },
];

const AreYouReadyToPivotPage = () => {
  const [step, setStep] = useState<Step>("hero");
  const [contactData, setContactData] = useState<ContactFormData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      location: "",
    },
  });

  useEffect(() => {
    if (step !== "result" || !contactData) return;

    const sendLead = async () => {
      try {
        await supabase.functions.invoke("send-quiz-lead", {
          body: {
            name: contactData.name,
            email: contactData.email,
            location: contactData.location,
            score: calculateScore(),
            q1: answers[1] || "",
            q2: answers[2] || "",
            q3: answers[3] || "",
            q4: answers[4] || "",
            q5: answers[5] || "",
            q6: answers[6] || "",
            q7: answers[7] || "",
            q8: answers[8] || "",
            q9: answers[9] || "",
            q10: answers[10] || "",
            q11: answers[11] || "",
            q12: answers[12] || "",
          },
        });
      } catch (err) {
        // Silent fail: do not block the user from seeing results
        console.error("Failed to send quiz lead:", err);
      }
    };

    sendLead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const onContactSubmit = (data: ContactFormData) => {
    setContactData(data);
    setStep("quiz");
    setCurrentQuestionIndex(0);
  };

  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({ ...prev, [QUESTIONS[currentQuestionIndex].id]: value }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setStep("result");
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const currentAnswer = answers[currentQuestion.id];
  const progress = ((currentQuestionIndex + 1) / QUESTIONS.length) * 100;

  const SCORING_CONFIG: Record<number, Record<string, number>> = {
    1: { Yes: 8, No: 0 },
    2: { Yes: 12, No: 0 },
    3: { Yes: 8, No: 0 },
    4: { Yes: 8, No: 0 },
    5: { Yes: 6, No: 0 },
    6: { Yes: 12, No: 0 },
    7: { Yes: 10, No: 0 },
    8: { Yes: 10, No: 0 },
    9: { a: 8, b: 8, c: 8, d: 6, e: 3 },
    10: { a: 8, b: 8, c: 8, d: 6, e: 3 },
    11: { a: 5, b: 5, c: 5, d: 5, e: 2 },
    12: { Yes: 15, No: 0 },
  };

  const MAX_RAW_SCORE = 110;

  const calculateRawScore = () => {
    let raw = 0;
    Object.entries(answers).forEach(([id, value]) => {
      const questionPoints = SCORING_CONFIG[Number(id)];
      if (questionPoints && value in questionPoints) {
        raw += questionPoints[value];
      }
    });
    return raw;
  };

  const calculateScore = () => {
    const raw = calculateRawScore();
    return Math.round((raw / MAX_RAW_SCORE) * 100);
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

  const QuizSection = (
    <section className="volumetric-glass rounded-3xl p-8 md:p-12 max-w-3xl mx-auto relative overflow-hidden">
      <div className="relative z-10">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-white/80 mb-2">
            <span>Question {currentQuestionIndex + 1} of {QUESTIONS.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-3 rounded-full bg-white/10 overflow-hidden border border-white/10">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #F4C903, #FFE361)",
              }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h2
            className="text-xl md:text-2xl font-bold leading-relaxed"
            style={{ color: "#FFE361" }}
          >
            {currentQuestion.text}
          </h2>
        </div>

        {/* Options */}
        <div className={`grid gap-3 ${currentQuestion.type === "yesno" ? "grid-cols-2" : "grid-cols-1"}`}>
          {currentQuestion.options.map((option) => {
            const isSelected = currentAnswer === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleAnswer(option.value)}
                className={`relative flex items-center gap-3 px-5 py-4 rounded-xl border-2 text-left transition-all duration-200 ${
                  isSelected
                    ? "border-[#F4C903] bg-[#F4C903]/20 text-white"
                    : "border-white/20 bg-white/5 text-white/90 hover:border-white/40 hover:bg-white/10"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    isSelected ? "border-[#F4C903] bg-[#F4C903]" : "border-white/40"
                  }`}
                >
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-gray-900" />}
                </div>
                <span className="font-medium text-base md:text-lg">{option.label}</span>
              </button>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10 gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-5 text-base border-white/20 text-white hover:bg-white/10 hover:text-white disabled:opacity-40"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>

          <Button
            type="button"
            onClick={handleNext}
            disabled={!currentAnswer}
            className="px-8 py-5 text-base font-semibold text-white desktop-hover-scale-105 transition-transform disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, #dc2626, #b91c1c)",
              boxShadow: "0 0 20px rgba(220, 38, 38, 0.5), 0 0 40px rgba(220, 38, 38, 0.3)",
            }}
          >
            {currentQuestionIndex === QUESTIONS.length - 1 ? "See Results" : "Next"}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );

  const ResultSection = (
    <section className="volumetric-glass rounded-3xl p-8 md:p-16 text-center max-w-3xl mx-auto relative overflow-hidden">
      <div className="absolute inset-0 rounded-3xl pointer-events-none opacity-30"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(244, 201, 3, 0.15) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-[#F4C903]/20 border-4 border-[#F4C903]/40 mb-2">
          <span className="text-4xl md:text-5xl font-bold text-[#F4C903]">{calculateScore()}</span>
        </div>

        <h2
          className="text-3xl md:text-4xl font-bold"
          style={{ color: "#FFE361" }}
        >
          {calculateScore() >= 80
            ? "High Readiness"
            : calculateScore() >= 60
            ? "Moderate Readiness"
            : "Lower Readiness"}
        </h2>


        {/* Next Steps */}
        <div className="w-full max-w-xl mt-4">
          <h3 className="text-lg md:text-xl font-semibold text-white text-center mb-4">
            Next Steps
          </h3>
          <div className="grid gap-3">
            <a
              href="https://calendly.com/hassan-hammer/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-5 py-4 rounded-xl border-2 border-white/20 bg-white/5 text-white hover:border-[#F4C903]/60 hover:bg-[#F4C903]/10 transition-all duration-200"
            >
              <span className="font-medium text-base md:text-lg">Book a 1:1 call → 30 Minute Meeting - Hassan Hammer</span>
              <ArrowRight className="w-5 h-5 text-[#F4C903] flex-shrink-0 ml-3" />
            </a>

            <a
              href="https://calendly.com/hassan-hammer/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-5 py-4 rounded-xl border-2 border-white/20 bg-white/5 text-white hover:border-[#F4C903]/60 hover:bg-[#F4C903]/10 transition-all duration-200"
            >
              <span className="font-medium text-base md:text-lg">Webinar / Group Presentation</span>
              <ArrowRight className="w-5 h-5 text-[#F4C903] flex-shrink-0 ml-3" />
            </a>

            <a
              href="https://app.thedeadlyconsultant.com/2026-bi-fintech-consulting-roadmap-pdf-unlock/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-5 py-4 rounded-xl border-2 border-white/20 bg-white/5 text-white hover:border-[#F4C903]/60 hover:bg-[#F4C903]/10 transition-all duration-200"
            >
              <span className="font-medium text-base md:text-lg">Free content (PM Consulting Secrets PDF)</span>
              <ArrowRight className="w-5 h-5 text-[#F4C903] flex-shrink-0 ml-3" />
            </a>
          </div>
        </div>

        {/* Results Footer */}
        <div className="w-full max-w-xl mt-8 pt-6 border-t border-white/10">
          <p className="text-center text-sm text-white/60 mb-3">Connect with Hassan</p>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            <a
              href="https://www.zerotopmconsultant.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm md:text-base text-[#F4C903] hover:underline"
            >
              Website
            </a>
            <a
              href="https://www.instagram.com/hassan.hammer.sr71/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm md:text-base text-[#F4C903] hover:underline"
            >
              Instagram
            </a>
            <a
              href="https://www.linkedin.com/in/hassanhammer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm md:text-base text-[#F4C903] hover:underline"
            >
              LinkedIn
            </a>
            <a
              href="https://www.youtube.com/@hassanhammer-sr71"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm md:text-base text-[#F4C903] hover:underline"
            >
              YouTube
            </a>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen overflow-x-hidden">
      <TopNav onSearchChange={() => {}} onToggleSidebar={() => {}} />

      <main className="pt-24 lg:pt-28 px-4 md:px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          {step === "hero" && HeroSection}
          {step === "contact" && ContactSection}
          {step === "quiz" && QuizSection}
          {step === "result" && ResultSection}
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