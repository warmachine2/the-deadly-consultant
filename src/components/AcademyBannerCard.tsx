import { Link } from "react-router-dom";
import { ArrowRight, CalendarCheck } from "lucide-react";

type AcademyBannerCardProps = {
  className?: string;
};

const AcademyBannerCard = ({ className }: AcademyBannerCardProps) => {
  return (
    <div className={`volumetric-glass rounded-2xl overflow-hidden shadow-lg ${className || ""}`}>
      {/* Banner: scrolls horizontally inside the card on small screens */}
      <div className="w-full overflow-x-auto touch-scroll">
        <img
          src="/academy-banner.jpg"
          alt="Data & AI Orchestration PM Academy"
          className="min-w-[680px] w-full h-auto block md:min-w-0 select-none"
        />
      </div>

      {/* Mobile-only readability hint */}
      <p className="md:hidden text-[11px] text-white/65 text-center py-1.5 border-t border-white/10 bg-black/20">
        Swipe horizontally to view full banner →
      </p>

      {/* Footer strip */}
      <div className="px-4 py-3 md:px-6 md:py-3.5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 bg-black/25">
        <p className="text-xs sm:text-sm text-white/85 font-medium text-center sm:text-left">
          Ready to pivot into $10k–$18k/mo Data &amp; AI Orchestration PM contracts?
        </p>
        <Link
          to="/book-session"
          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-sm md:text-base text-black bg-[#F4C903] hover:bg-[#ffe14d] shadow-lg transition-colors whitespace-nowrap shrink-0"
        >
          <CalendarCheck className="w-4 h-4 shrink-0" /> Book a Call <ArrowRight className="w-4 h-4 shrink-0" />
        </Link>
      </div>
    </div>
  );
};

export default AcademyBannerCard;
