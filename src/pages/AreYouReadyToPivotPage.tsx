import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import TopNav from "@/components/TopNav";
import CriticalResourcesSection from "@/components/CriticalResourcesSection";
import {
  QUIZ_LANDING_SCREEN,
  isQuestionScreen,
  isResultScreen,
  isLeadCaptureScreen,
  resultScreen,
  nextQuizScreen,
  previousQuizScreen,
  currentQuestionIndexForScreen,
  startAssessmentScreen,
} from "@/lib/quizScreens";

import { QUESTIONS, summarizeQuizAnswers } from "@/lib/quizDiagnostic";

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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Globe,
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react";

const GOLD_BUTTON_CLASS =
  "bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-400 text-gray-900 border-2 border-amber-300/60 hover:from-amber-400 hover:via-yellow-400 hover:to-amber-300 transition-colors";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  location: z.string().trim().min(1, "Location is required").max(200, "Location must be less than 200 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const LANDING_CHECKMARKS = [
  "Check Your PMP & Enterprise Contract Eligibility (3+ Years Experience Benchmark)",
  "Audit Your Resume & Portfolio Against Live $85–$120/Hr GTA & North American Specs",
  "Unlock Your Custom 0–100 Readiness Score + The V4 90-Day Pivot Roadmap PDF",
];

const AreYouReadyToPivotPage = () => {
  // Screen 0 = landing, 1–10 = questions, 11 = lead capture, 12 = results
  const [currentScreen, setCurrentScreen] = useState<number>(QUIZ_LANDING_SCREEN);
  const [contactData, setContactData] = useState<ContactFormData | null>(null);
  const [quizState, setQuizState] = useState(() => ({ answers: {} as Record<number, string>, ...summarizeQuizAnswers({}) }));
  const { answers, score } = quizState;
  const [pendingScreen, setPendingScreen] = useState<number | null>(null);
  const questionHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (pendingScreen === null) return;
    const timeout = window.setTimeout(() => {
      setCurrentScreen(nextQuizScreen(pendingScreen, QUESTIONS.length));
      setPendingScreen(null);
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [pendingScreen]);

  useEffect(() => {
    if (isQuestionScreen(currentScreen, QUESTIONS.length)) questionHeadingRef.current?.focus();
  }, [currentScreen]);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      location: "",
    },
  });

  const [roadmapOpen, setRoadmapOpen] = useState(false);
  const [submittingRoadmap, setSubmittingRoadmap] = useState(false);

  const ROADMAP_PDF_URL = "https://www.zerotopmconsultant.com/V4_Roadmap_2026.pdf";

  const onRoadmapSubmit = async (data: ContactFormData) => {
    setContactData(data);
    setSubmittingRoadmap(true);

    // Open the PDF immediately (synchronously) so it is not blocked by the browser
    const pdfWindow = window.open(ROADMAP_PDF_URL, "_blank", "noopener,noreferrer");

    try {
      await supabase.functions.invoke("send-quiz-lead", {
        body: {
          name: data.name,
          email: data.email,
          location: data.location,
          score,
          q1: answers[1] || "N/A",
          q2: answers[2] || "N/A",
          q3: answers[3] || "N/A",
          q4: answers[4] || "N/A",
          q5: answers[5] || "N/A",
          q6: answers[6] || "N/A",
          q7: answers[7] || "N/A",
          q8: answers[8] || "N/A",
          q9: answers[9] || "N/A",
          q10: answers[10] || "N/A",
          q11: answers[11] || "N/A",
          q12: answers[12] || "N/A",
          timestamp: new Date().toISOString(),
        },
      });
    } catch (err) {
      console.error("Failed to send quiz lead:", err);
    } finally {
      setSubmittingRoadmap(false);
      setRoadmapOpen(false);
      setCurrentScreen(resultScreen(QUESTIONS.length));
      if (!pdfWindow) window.location.href = ROADMAP_PDF_URL;
    }
  };

  const handleAnswer = (value: string) => {
    if (pendingScreen !== null || !isQuestionScreen(currentScreen, QUESTIONS.length)) return;
    setQuizState(previous => {
      const updatedAnswers = { ...previous.answers, [currentScreen]: value };
      return { answers: updatedAnswers, ...summarizeQuizAnswers(updatedAnswers) };
    });
    setPendingScreen(currentScreen);
  };

  const handleBack = () => {
    setPendingScreen(null);
    setCurrentScreen(previous => previousQuizScreen(previous));
  };

  const currentQuestionIndex = currentQuestionIndexForScreen(currentScreen, QUESTIONS.length);
  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const currentAnswer = answers[currentQuestion.id];
  const progress = ((currentQuestionIndex + 1) / QUESTIONS.length) * 100;

  const LandingSection = (
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
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F4C903]/20 border border-[#F4C903]/40 text-[#F4C903] font-semibold text-xs md:text-sm tracking-wider">
          <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
          <span>FREE 3-MINUTE PM CONSULTING READINESS AUDIT</span>
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
          Are You Ready to Pivot Into $10,000–$18,000/Mo Data & AI PM Consulting Contracts?
        </h1>

        {/* Sub-headline */}
        <p className="max-w-2xl text-base md:text-lg text-muted-foreground">
          Take this 10-question diagnostic to see if your current work history qualifies for
          $85–$120/hr incorporated enterprise contracts—and uncover the exact packaging gaps keeping
          recruiters from calling you back.
        </p>

        {/* Value checkmarks */}
        <ul className="w-full max-w-2xl space-y-3 text-left">
          {LANDING_CHECKMARKS.map((checkmark) => (
            <li
              key={checkmark}
              className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 px-5 py-4"
            >
              <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-[#F4C903] flex-shrink-0 mt-0.5" />
              <span className="text-base md:text-lg text-white font-medium">{checkmark}</span>
            </li>
          ))}
        </ul>

        {/* Start assessment button */}
        <div className="mt-2 md:mt-4">
          <button
            type="button"
            onClick={() => setCurrentScreen(startAssessmentScreen())}
            className="highlight-glow-button inline-flex items-center justify-center gap-3 px-10 py-4 md:px-12 md:py-5 text-xl md:text-2xl font-bold text-white hover:text-white tracking-wide shadow-none"
          >
            <span>Start My 3-Minute Assessment</span>
            <ArrowRight className="w-6 h-6 md:w-7 md:h-7" />
          </button>
        </div>

        {/* Trust badge */}
        <p className="flex flex-wrap items-center justify-center gap-2 text-sm md:text-base text-muted-foreground">
          <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-[#F4C903] flex-shrink-0" />
          <span>
            Free & Confidential • 4,800+ Live Enterprise Roles Monitored Daily • Trusted by GTA Data
            & Tech Leaders
          </span>
        </p>
      </div>
    </section>
  );

  const RoadmapForm = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onRoadmapSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white text-base font-medium flex items-center gap-2">
                <User className="w-4 h-4 text-[#F4C903]" />
                Name <span className="text-[#F4C903]">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Your full name" className="bg-input border-border" {...field} />
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
                Email <span className="text-[#F4C903]">*</span>
              </FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" className="bg-input border-border" {...field} />
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
                Location <span className="text-[#F4C903]">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="City, Country" className="bg-input border-border" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={submittingRoadmap}
          className={`w-full font-bold py-6 text-lg rounded-xl ${GOLD_BUTTON_CLASS}`}
        >
          {submittingRoadmap ? "Unlocking..." : "Submit & Open Roadmap"}
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </form>
    </Form>
  );

  const QuizSection = (
    <section className="volumetric-glass rounded-3xl p-5 sm:p-8 md:p-12 max-w-3xl mx-auto relative overflow-hidden">
      <div className="mb-8">
        <div className="flex justify-between text-sm text-foreground mb-2" aria-live="polite">
          <span>Question {currentScreen} of {QUESTIONS.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div role="progressbar" aria-label="Assessment progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}
          className="h-3 rounded-full bg-muted overflow-hidden border border-border/10">
          <div className="h-full rounded-full bg-[hsl(var(--quiz-highlight))] transition-[width] duration-200 motion-reduce:transition-none" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div key={currentScreen} className="animate-in fade-in duration-200 motion-reduce:animate-none">
        <h2 ref={questionHeadingRef} tabIndex={-1} className="mb-8 text-xl md:text-2xl font-bold leading-relaxed focus:outline-none">
          {currentQuestion.text}
        </h2>
        <div className="grid grid-cols-1 gap-3">
          {currentQuestion.options.map(option => {
            const isSelected = currentAnswer === option.value;
            return (
              <Button key={option.value} type="button" variant="outline" aria-pressed={isSelected}
                aria-disabled={pendingScreen !== null}
                onClick={() => handleAnswer(option.value)}
                className={`h-auto min-h-16 w-full justify-start whitespace-normal gap-3 px-4 sm:px-5 py-4 rounded-[8px] border-2 text-left text-foreground hover:text-foreground transition-colors motion-reduce:transition-none ${
                  isSelected
                    ? "border-[hsl(var(--quiz-highlight))] bg-[hsl(var(--quiz-highlight)/0.2)] hover:bg-[hsl(var(--quiz-highlight)/0.2)]"
                    : "border-border/20 bg-accent/5 hover:border-border/20 hover:bg-accent/5"
                }`}>
                <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  isSelected ? "border-[hsl(var(--quiz-highlight))] text-[hsl(var(--quiz-highlight))]" : "border-border/40"
                }`}>
                  {isSelected && <CheckCircle2 className="w-4 h-4" />}
                </span>
                <span className="font-medium text-base md:text-lg">{option.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {currentScreen > 1 && (
        <div className="mt-6">
          <Button type="button" variant="ghost" onClick={handleBack}
            className="text-muted-foreground hover:text-foreground px-0 hover:bg-transparent">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
        </div>
      )}
    </section>
  );

  const LeadCaptureSection = (
    <section className="volumetric-glass rounded-3xl p-6 md:p-12 max-w-xl mx-auto animate-in fade-in duration-200 motion-reduce:animate-none">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">Unlock Your Readiness Score & Roadmap</h2>
      <p className="text-muted-foreground text-center mb-8">Enter your details to unlock the roadmap immediately.</p>
      {RoadmapForm}
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
          <span className="text-4xl md:text-5xl font-bold text-[#F4C903]">{score}</span>
        </div>

        <h2
          className="text-3xl md:text-4xl font-bold"
          style={{ color: "#FFE361" }}
        >
          {score >= 80
            ? "High Readiness"
            : score >= 60
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
              <span className="font-medium text-base md:text-lg">Book a meeting</span>
              <ArrowRight className="w-5 h-5 text-[#F4C903] flex-shrink-0 ml-3" />
            </a>

            <a
              href="https://calendly.com/hassan-hammer/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-5 py-4 rounded-xl border-2 border-white/20 bg-white/5 text-white hover:border-[#F4C903]/60 hover:bg-[#F4C903]/10 transition-all duration-200"
            >
              <span className="font-medium text-base md:text-lg">PM Consulting Pivot Group Workshop (Free)</span>
              <ArrowRight className="w-5 h-5 text-[#F4C903] flex-shrink-0 ml-3" />
            </a>

            <button
              type="button"
              onClick={() => setRoadmapOpen(true)}
              className="flex items-center justify-between px-5 py-4 rounded-xl border-2 border-white/20 bg-white/5 text-white text-left hover:border-[#F4C903]/60 hover:bg-[#F4C903]/10 transition-all duration-200"
            >
              <span className="font-medium text-base md:text-lg">$10k/mo+ Data & AI Orchestration PM Accelerator Roadmap</span>
              <ArrowRight className="w-5 h-5 text-[#F4C903] flex-shrink-0 ml-3" />
            </button>
          </div>
        </div>

        {/* Results Footer */}

        <div className="w-full max-w-xl mt-8 pt-6 border-t border-white/10">
          <p className="text-center text-sm text-white/60 mb-3">Connect with Hassan</p>
          <div className="flex flex-wrap items-start justify-center gap-6 md:gap-10">
            {[
              { label: "Website", href: "https://www.zerotopmconsultant.com/", Icon: Globe },
              { label: "Instagram", href: "https://www.instagram.com/hassan.hammer.sr71/", Icon: Instagram },
              { label: "LinkedIn", href: "https://www.linkedin.com/in/hassanhammer", Icon: Linkedin },
              { label: "YouTube", href: "https://www.youtube.com/@hassanhammer-sr71", Icon: Youtube },
            ].map(({ label, href, Icon }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm md:text-base text-[#F4C903] hover:underline"
                >
                  {label}
                </a>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-[#F4C903]/80 hover:text-[#F4C903]"
                >
                  <Icon className="w-5 h-5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Roadmap unlock dialog */}
      <Dialog open={roadmapOpen} onOpenChange={setRoadmapOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center" style={{ color: "#FFE361" }}>
              Enter your details to unlock the roadmap immediately
            </DialogTitle>
          </DialogHeader>
          <div className="text-left">{RoadmapForm}</div>
        </DialogContent>
      </Dialog>
    </section>
  );

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <TopNav onSearchChange={() => {}} onToggleSidebar={() => {}} />

      <main className="flex-1 pt-24 lg:pt-28 px-4 md:px-6 pb-12 flex flex-col justify-center">
        <div className="max-w-4xl mx-auto">
          {currentScreen === QUIZ_LANDING_SCREEN && LandingSection}
          {isQuestionScreen(currentScreen, QUESTIONS.length) && QuizSection}
          {isLeadCaptureScreen(currentScreen, QUESTIONS.length) && LeadCaptureSection}
          {isResultScreen(currentScreen, QUESTIONS.length) && (
            <div className="space-y-6 max-w-3xl mx-auto">
              {ResultSection}
              <CriticalResourcesSection />
            </div>
          )}
        </div>
      </main>

      <footer className="volumetric-glass rounded-t-3xl mt-auto py-6 px-6">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>© 2026 Zero to PM Consultant. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AreYouReadyToPivotPage;