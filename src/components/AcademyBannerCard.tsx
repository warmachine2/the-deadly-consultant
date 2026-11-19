import { Link } from "react-router-dom";
import { ArrowRight, CalendarCheck } from "lucide-react";

type AcademyBannerCardProps = {
  className?: string;
};

const AcademyBannerCard = ({ className }: AcademyBannerCardProps) => {
  return (
    <div className={`volumetric-glass rounded-2xl overflow-hidden shadow-lg w-full max-w-4xl mx-auto ${className || ""}`}>
      <img
        src="/academy-banner.jpg"
        alt="Data & AI Orchestration PM Academy"
        className="w-full h-auto block select-none"
      />

      {/* Footer strip */}
      <div className="px-4 py-2.5 md:px-5 md:py-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2.5 bg-black/25">
        <p className="text-xs sm:text-sm text-white/85 font-medium text-center sm:text-left">
          Ready to pivot into $10k–$18k/mo Data &amp; AI Orchestration PM contracts?
        </p>
        <Link
          to="/book-session"
          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2 rounded-xl font-bold text-sm text-black bg-[#F4C903] hover:bg-[#ffe14d] shadow-lg transition-colors whitespace-nowrap shrink-0"
        >
          <CalendarCheck className="w-4 h-4 shrink-0" /> Book a Call <ArrowRight className="w-4 h-4 shrink-0" />
        </Link>
      </div>
    </div>
  );
};

export default AcademyBannerCard;
