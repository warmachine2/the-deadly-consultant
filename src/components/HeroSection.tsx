import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { JOB_BOARD_PATH } from "@/lib/jobBoardGate";
import { useJobBoardUnlocked } from "@/hooks/useJobBoardUnlocked";

const DESKTOP_KIT_UID = "63221ca346";
const MOBILE_KIT_UID = "28fef2dc22";

const HeroSection = () => {
  // Unlocked visitors never load Kit, so link them straight to the board.
  const unlocked = useJobBoardUnlocked();
  const [kitUid, setKitUid] = useState(
    () => (typeof window !== "undefined" && window.innerWidth < 768 ? MOBILE_KIT_UID : DESKTOP_KIT_UID)
  );

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    const apply = () => setKitUid(mql.matches ? DESKTOP_KIT_UID : MOBILE_KIT_UID);
    apply();
    mql.addEventListener("change", apply);
    return () => mql.removeEventListener("change", apply);
  }, []);

  return <section className="volumetric-glass rounded-3xl p-4 md:p-12 mb-0 md:mb-8 hero-bokeh relative overflow-hidden mx-2 md:mx-0">
      {/* Bokeh orbs layer */}
      <div className="bokeh-orbs" aria-hidden="true">
        <div className="bokeh-orb bokeh-orb-1"></div>
        <div className="bokeh-orb bokeh-orb-2"></div>
        <div className="bokeh-orb bokeh-orb-3"></div>
        <div className="bokeh-orb bokeh-orb-4"></div>
        <div className="bokeh-orb bokeh-orb-5"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center gap-4 md:gap-6">
        {/* Main Headline */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight animate-fade-in text-center">
          Zero-To-<span className="text-[#F4C903]">PM</span>-Consultant
        </h1>

        {/* Subheadline */}
      <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 font-medium text-center">
        Data & <span className="text-[#F4C903]">AI Orchestration PM Consulting</span><br />
        <span className="text-[#9CA3AF]">90 Day PM Consultant Accelerator - Guaranteed Placement</span>
      </p>

        {/* Gift strip */}
        <div className="w-full max-w-2xl mt-2 rounded-xl border border-[#F4C903]/30 bg-black/40 px-4 py-3 md:px-5 md:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm md:text-base font-semibold text-[#F4C903]">Open PM Consulting Contracts</p>
            <p className="text-xs md:text-sm text-white/70">Live recruiter-sourced Data &amp; AI Orchestration PM contracts.</p>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-1.5 shrink-0">
            <svg
              className="h-[34px] w-24 rounded-md border border-[#F4C903]/30 bg-[#14161A] shadow-sm"
              viewBox="0 0 96 34"
              aria-hidden="true"
            >
              {/* panels */}
              <rect x="3" y="3" width="28" height="28" rx="3" fill="#1B1D22" />
              <rect x="34" y="3" width="28" height="28" rx="3" fill="#1B1D22" />
              <rect x="65" y="3" width="28" height="28" rx="3" fill="#1B1D22" />

              {/* left: pie chart */}
              <g stroke="#1B1D22" strokeWidth="0.6">
                <path d="M17,17 L17,8 A9,9 0 1 1 11.71,24.28 Z" fill="#E5C229" />
                <path d="M17,17 L11.71,24.28 A9,9 0 0 1 9.72,11.71 Z" fill="#9CA3AF" />
                <path d="M17,17 L9.72,11.71 A9,9 0 0 1 11.71,9.72 Z" fill="#22C55E" />
                <path d="M17,17 L11.71,9.72 A9,9 0 0 1 17,8 Z" fill="#00B4D8" />
              </g>

              {/* middle: bar chart */}
              <g stroke="#2A2D33" strokeWidth="0.5">
                <line x1="36" y1="10" x2="60" y2="10" />
                <line x1="36" y1="17" x2="60" y2="17" />
                <line x1="36" y1="24" x2="60" y2="24" />
              </g>
              <rect x="38" y="15" width="5.5" height="12" rx="1" fill="#DC2626" />
              <rect x="45.5" y="8" width="5.5" height="19" rx="1" fill="#2563EB" />
              <rect x="53" y="22" width="5.5" height="5" rx="1" fill="#7C3AED" />

              {/* right: line / area chart */}
              <g stroke="#2A2D33" strokeWidth="0.5">
                <line x1="67" y1="10" x2="91" y2="10" />
                <line x1="67" y1="17" x2="91" y2="17" />
                <line x1="67" y1="24" x2="91" y2="24" />
              </g>
              <polygon
                points="67,26 71,21 75,23 80,16 84,11 88,15 91,20 91,29 67,29"
                fill="#00D4FF"
                opacity="0.18"
              />
              <polyline
                points="67,26 71,21 75,23 80,16 84,11 88,15 91,20"
                fill="none"
                stroke="#00D4FF"
                strokeWidth="1.5"
              />
              <g fill="#F4C903">
                <circle cx="67" cy="26" r="1.3" />
                <circle cx="71" cy="21" r="1.3" />
                <circle cx="75" cy="23" r="1.3" />
                <circle cx="80" cy="16" r="1.3" />
                <circle cx="84" cy="11" r="1.3" />
                <circle cx="88" cy="15" r="1.3" />
                <circle cx="91" cy="20" r="1.3" />
              </g>
            </svg>
            <a
              data-formkit-toggle={unlocked ? undefined : kitUid}
              href={unlocked ? JOB_BOARD_PATH : `https://bi-fintech-consultant-academy.kit.com/${kitUid}`}
              className="flex items-center gap-1 text-sm md:text-base font-semibold text-white hover:text-[#F4C903] whitespace-nowrap"
            >
              Browse open contracts <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Primary hero CTA */}
        <div className="w-full max-w-2xl flex flex-col items-center gap-4 md:gap-5 mt-2 md:mt-4">
          <Link
            to="/free-workshop"
            className="hero-card-beam flex flex-col justify-center gap-2 px-5 py-5 md:px-6 md:py-6 rounded-xl text-center items-center cursor-pointer transition-colors duration-300 w-full"
            style={{
              background: "rgba(15, 15, 15, 0.85)",
              backdropFilter: "blur(9px) saturate(150%)",
              WebkitBackdropFilter: "blur(9px) saturate(150%)"
            }}
          >
            <span className="text-lg sm:text-xl md:text-2xl font-bold text-[#F4C903]">
              Reserve My Free Workshop Spot
            </span>
            <span className="text-sm md:text-base font-bold text-white/95">
              How Pros (3+ Yrs Exp) Land $10k–$18k/mo Data &amp; AI Orchestration PM Contracts in 90 Days
            </span>
            <span className="text-xs sm:text-sm md:text-base italic text-white/85">
              Without starting over—by projectizing your past experience, building a live Power BI/PPM portfolio, and getting triple-certified.
            </span>
            <span className="text-xs md:text-sm text-white/60">
              Includes the 90-day roadmap when you register.
            </span>
          </Link>

          <Link
            to="/are-you-ready-to-pivot-to-pm-consulting"
            className="inline-flex items-center gap-1.5 text-base md:text-lg font-semibold text-[#F4C903] underline underline-offset-4 decoration-[#F4C903] hover:text-white hover:decoration-white transition-colors group cursor-pointer"
          >
            <span>Take the PM Consulting Readiness Quiz</span>
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1" />
          </Link>



        </div>


        {/* Supporting List */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 md:gap-x-8 gap-y-2 md:gap-y-3 text-sm sm:text-base md:text-lg text-white/80 w-full max-w-4xl mt-2">
          <li className="flex items-start gap-2">
            <span className="text-[#F4C903]">•</span>
            <span>Escape AI job <span className="text-[#F4C903]">vaporization</span>.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#F4C903]">•</span>
            <span>Master <span className="text-[#F4C903]">PMP/PSM/CPMAI</span> trifecta.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#F4C903]">•</span>
            <span>Build <span className="text-[#F4C903]">$60k PPM BI tools</span> for your portfolio.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#F4C903]">•</span>
            <span>Orchestrate AI Deployment/BI projects. Learn <span className="text-[#F4C903]">front-line PM</span> <span className="text-[#F4C903]">consulting</span> skills.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#F4C903]">•</span>
            <span>Land <span className="text-[#F4C903]">$10k/mo+</span> gigs - faster, easier.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#F4C903]">•</span>
            <span>Become a <span className="text-[#F4C903]">Certified Professional</span> in Project Management & AI Deployment Projects.</span>
          </li>
        </ul>

      </div>
    </section>;
};
export default HeroSection;
