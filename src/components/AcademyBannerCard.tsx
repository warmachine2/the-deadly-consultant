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
          <img
            className="academy-banner-badge"
            src="/academy-badge.png"
            width={986}
            height={1026}
            alt="Your 90d Enterprise Pivot — Data & AI Orchestration PM Accelerator — Roadmap to $10k-$18k/mo Net"
          />
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
