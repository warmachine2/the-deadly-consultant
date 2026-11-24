import { Link } from "react-router-dom";
import { ArrowRight, CalendarCheck, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

type AcademyBannerCardProps = {
  className?: string;
};

const academyBenefits = [
  { title: "19-Source PM Contract Board:", description: "Live $85 - $120/hr roles + direct recruiter contacts (<48hr old rule)" },
  { title: "3-Cert Trifecta (60-hr Method):", description: "Pass PMP, PSM I, & PMI-CPMAI fast + 100% PMP app approval" },
  { title: "Enterprise Portfolio Build:", description: "Weekend Power BI PPM Software + Jira AI Agent Orchestration" },
  { title: "100% Placement Guarantee:", description: "Recoup tuition in 4-8 billable days. Land a contract or 100% refund" },
];

const AcademyBannerCard = ({ className }: AcademyBannerCardProps) => {
  return (
    <div className={`volumetric-glass rounded-2xl overflow-hidden shadow-lg w-full ${className || ""}`}>
      <div className="academy-banner-container">
        <div className="academy-banner-artwork">
          <div className="academy-banner-badge aspect-square rounded-full" aria-label="Data & AI Orchestration PM Accelerator">
            <svg className="academy-banner-circuit" viewBox="0 0 240 240" fill="none" aria-hidden="true">
              <path d="M0 65h45l18 18v40H35v35H0M240 65h-40l-20 20v45h30v30h30M45 240v-42l22-22h40v-25M195 240v-45l-25-25h-30v-20M75 0v35l20 20h55l20-20V0M0 195h25l15-15M240 195h-25l-15-15" />
              <path d="M0 52h51l24 24v34H23v61H0M240 52h-46l-26 26v65h30v30h42M58 240v-35l17-17h44v-30M183 240v-38l-19-19h-35v-26" />
              <circle cx="95" cy="55" r="4" /><circle cx="150" cy="55" r="4" />
              <circle cx="35" cy="123" r="4" /><circle cx="210" cy="130" r="4" />
              <circle cx="107" cy="151" r="4" /><circle cx="140" cy="150" r="4" />
            </svg>
            <div className="academy-banner-badge-copy">
              <p className="academy-banner-ribbon">Your 90d Enterprise Pivot</p>
              <p className="academy-banner-badge-name">Data &amp; <span>AI</span></p>
              <p className="academy-banner-badge-role">Orchestration PM<br />Accelerator</p>
              <p className="academy-banner-income"><span>Roadmap to </span><strong>$10k-$18k</strong>/mo Net</p>
            </div>
          </div>
          <div className="academy-banner-content">
            <header className="academy-banner-header">
              <h2 className="academy-banner-title">DATA &amp; AI ORCHESTRATION PM ACADEMY</h2>
              <p className="academy-banner-subtitle">3+ Years Experience to $10k - $18k/Mo ($85 - $120/Hr) Contracts in 90 Days</p>
            </header>
            <div className="academy-banner-benefits">
              {academyBenefits.map(({ title, description }) => (
                <div className="academy-banner-benefit" key={title}>
                  <span className="academy-banner-check"><Check aria-hidden="true" /></span>
                  <div className="academy-banner-benefit-copy">
                    <p className="academy-banner-benefit-title">{title}</p>
                    <p className="academy-banner-benefit-description">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer strip */}
      <div className="px-4 py-2.5 md:px-6 md:py-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2.5 bg-black/25">
        <p className="text-xs sm:text-sm text-white/85 font-medium text-center sm:text-left">
          Ready to pivot into $10k–$18k/mo Data &amp; AI Orchestration PM contracts?
        </p>
        <Button asChild className="academy-banner-booking w-full sm:w-auto px-5 py-2 rounded-xl font-bold text-sm shadow-lg shrink-0">
          <Link to="/book-session">
            <CalendarCheck className="w-4 h-4 shrink-0" /> Book a Call <ArrowRight className="w-4 h-4 shrink-0" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default AcademyBannerCard;
