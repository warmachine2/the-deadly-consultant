import { Link } from "react-router-dom";
import { ArrowRight, CalendarCheck } from "lucide-react";

type AcademyBannerCardProps = {
  className?: string;
};

const AcademyBannerCard = ({ className }: AcademyBannerCardProps) => {
  return (
    <div className={`volumetric-glass rounded-2xl overflow-hidden shadow-lg w-full flex flex-col lg:flex-row lg:items-stretch ${className || ""}`}>
      {/* Left: full banner image (top slot on mobile) */}
      <div className="w-full lg:w-[68%] xl:w-[980px] 2xl:w-[1060px] shrink-0 flex items-center bg-[#E6EFF8]">
        <img
          src="/academy-banner.jpg"
          alt="Data & AI Orchestration PM Academy"
          className="w-full h-auto block select-none"
        />
      </div>

      {/* Right / mobile-bottom CTA panel */}
      <div className="flex-1 px-4 py-2.5 md:px-5 lg:px-7 lg:py-5 border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col sm:flex-row lg:flex-col items-center lg:items-start justify-between lg:justify-center gap-2.5 lg:gap-3.5 bg-black/25">
        <span className="hidden lg:block text-base xl:text-lg font-bold text-[#F4C903] leading-snug">
          Ready to Launch Your $10k–$18k/mo Consulting Pivot?
        </span>
        <p className="text-xs sm:text-sm text-white/85 font-medium text-center sm:text-left lg:text-sm lg:text-white/80">
          <span className="lg:hidden">
            Ready to pivot into $10k–$18k/mo Data &amp; AI Orchestration PM contracts?
          </span>
          <span className="hidden lg:inline">
            Book a free 1-on-1 strategy session to map your 90-day Data &amp; AI Orchestration PM consulting roadmap.
          </span>
        </p>
        <Link
          to="/book-session"
          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto lg:w-full xl:w-auto px-5 py-2 lg:px-6 lg:py-3 rounded-xl font-bold text-sm lg:text-base text-black bg-[#F4C903] hover:bg-[#ffe14d] shadow-lg transition-colors whitespace-nowrap shrink-0"
        >
          <CalendarCheck className="w-4 h-4 shrink-0" /> Book a Call <ArrowRight className="w-4 h-4 shrink-0" />
        </Link>
      </div>
    </div>
  );
};

export default AcademyBannerCard;
