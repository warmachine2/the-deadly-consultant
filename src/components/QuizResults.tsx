import { Link } from "react-router-dom";
import { ArrowRight, Download, BriefcaseBusiness, ClipboardList, Building2, CalendarDays, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import CalendlyInlineWidget from "@/components/CalendlyInlineWidget";
import CriticalResourcesSection from "@/components/CriticalResourcesSection";
import { readinessTier, resultPath, marketPackagingInsight } from "@/lib/quizResults";

const TIER_LABELS = {
  enterprise: "Enterprise Ready — High Consulting Fit",
  emerging: "Emerging Contender — Strategic Packaging Gaps",
  foundation: "Foundational Stage — Core Prerequisites Needed",
};
const TIER_ACCENTS = {
  enterprise: "border-[hsl(var(--quiz-enterprise))] bg-[hsl(var(--quiz-enterprise)/0.1)]",
  emerging: "border-[hsl(var(--quiz-emerging))] bg-[hsl(var(--quiz-emerging)/0.1)]",
  foundation: "border-[hsl(var(--quiz-foundation))] bg-[hsl(var(--quiz-foundation)/0.1)]",
};
const PDF_URL = "/V4_Roadmap_2026.pdf";
const actionClass = "h-auto min-h-14 whitespace-normal px-5 py-4 text-base font-semibold rounded-[8px] border-border/30 text-foreground";

const QuizResults = ({ score, mqlQualified, rolePond }: { score: number; mqlQualified: boolean; rolePond: string }) => {
  const tier = readinessTier(score);
  const qualified = resultPath(mqlQualified) === "qualified";
  const gaps = [
    { title: "Market Packaging", Icon: BriefcaseBusiness, text: marketPackagingInsight(rolePond) },
    { title: "Proof-of-Work Assets", Icon: ClipboardList, text: "A plain text resume cannot demonstrate how you lead delivery. Build live Jira / Linear sprint artifacts and PRDs that show prioritization, requirements, dependencies, and stakeholder decisions." },
    { title: "Incorporated Operating Model", Icon: Building2, text: "Enterprise consulting through your own corporation can unlock a 2x–3x take-home earnings model versus capped payroll employment. Plan corporation setup, HST / taxes, insurance, and cash runway; actual take-home depends on your rate, costs, and tax situation." },
  ];

  return (
    <div className="w-full space-y-10" data-result-path={qualified ? "qualified" : "foundation"}>
      <section className="text-center space-y-5" aria-label="Readiness diagnosis">
        <div className={`mx-auto flex h-36 w-36 flex-col items-center justify-center rounded-full border-4 ${TIER_ACCENTS[tier]}`}>
          <span className="text-4xl font-bold text-[hsl(var(--quiz-highlight))]">{score}<span className="text-xl text-foreground">/100</span></span>
          <span className="mt-1 text-sm text-foreground">Readiness Score</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-[hsl(var(--quiz-highlight))]">{TIER_LABELS[tier]}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 text-left">
          {gaps.map(({ title, Icon, text }, index) => (
            <article key={title} className="volumetric-glass rounded-[8px] p-5">
              <Icon className="w-7 h-7 mb-4 text-[hsl(var(--quiz-highlight))]" />
              <p className="text-sm text-muted-foreground mb-1">Gap {index + 1}</p>
              <h3 className="text-lg font-semibold mb-3 text-[hsl(var(--quiz-highlight))]">{title}</h3>
              <p className="text-sm leading-relaxed text-foreground">{text}</p>
            </article>
          ))}
        </div>
      </section>

      {qualified ? (
        <>
          <section className="space-y-6 text-center" aria-label="Consulting diagnostic booking">
            <h2 className="text-2xl md:text-3xl font-bold text-[hsl(var(--quiz-highlight))]">Your Experience Qualifies for $10,000–$18,000/Mo PM Consulting Contracts</h2>
            <p className="text-foreground max-w-2xl mx-auto">Watch the critical resources below, then schedule your 15-minute 1-on-1 Consulting Diagnostic directly with Hassan.</p>
          </section>
          <CriticalResourcesSection />
          <section className="max-w-2xl mx-auto space-y-4" aria-label="Book your 1-on-1 consulting diagnostic">
            <h3 className="text-xl font-semibold text-center text-[hsl(var(--quiz-highlight))] flex items-center justify-center gap-2"><CalendarDays className="w-5 h-5" /> Choose Your Consulting Diagnostic Time</h3>
            <CalendlyInlineWidget />
          </section>
          <div className="grid sm:grid-cols-2 gap-3">
            <Button asChild variant="outline" className={actionClass}><a href={PDF_URL} target="_blank" rel="noopener noreferrer"><Download className="w-5 h-5 shrink-0" /> Download V4 90-Day Pivot Roadmap (PDF) ↓</a></Button>
            <Button asChild variant="outline" className={actionClass}><Link to="/ai-bi-fintech-pm-job-alerts-repo">Browse Live $85–$120/hr Contract Roles <ArrowRight className="w-5 h-5 shrink-0" /></Link></Button>
          </div>
        </>
      ) : (
        <>
          <section className="text-center space-y-5">
            <h2 className="text-2xl md:text-3xl font-bold text-[hsl(var(--quiz-highlight))]">Your Custom PM Consulting Foundation Plan</h2>
            <p className="text-foreground max-w-2xl mx-auto">You are in the foundational development phase. To reach the 3-year threshold required for $85–$120/hr enterprise banking contracts, follow this step-by-step acceleration plan.</p>
            <div className="pt-4 space-y-4">
              <GraduationCap className="w-8 h-8 mx-auto text-[hsl(var(--quiz-foundation))]" />
              <h3 className="text-xl font-semibold text-[hsl(var(--quiz-highlight))]">Join the Next Live Free PM Consulting Workshop</h3>
              <Button asChild className={`highlight-glow-button ${actionClass}`}><Link to="/free-workshop">Register for Free Masterclass <ArrowRight className="w-5 h-5 shrink-0" /></Link></Button>
            </div>
            <Button asChild variant="outline" className={actionClass}><a href={PDF_URL} target="_blank" rel="noopener noreferrer"><Download className="w-5 h-5 shrink-0" /> Download The V4 90-Day Foundation Roadmap (PDF) ↓</a></Button>
          </section>
          <CriticalResourcesSection />
        </>
      )}
    </div>
  );
};

export default QuizResults;