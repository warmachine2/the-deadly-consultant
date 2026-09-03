import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { WORKSHOP_REGISTER_URL } from "@/components/TopNav";

const HeroSection = () => {
  return <section className="volumetric-glass rounded-3xl p-4 md:p-12 mb-0 md:mb-8 hero-bokeh relative overflow-hidden mx-2 md:mx-0">
      {/* Bokeh orbs layer */}
      <div className="bokeh-orbs" aria-hidden="true">
        <div className="bokeh-orb bokeh-orb-1"></div>
        <div className="bokeh-orb bokeh-orb-2"></div>
        <div className="bokeh-orb bokeh-orb-3"></div>
        <div className="bokeh-orb bokeh-orb-4"></div>
        <div className="bokeh-orb bokeh-orb-5"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-start gap-4 md:gap-6">
        {/* Main Headline */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight animate-fade-in">
          Zero-To-<span className="text-[#F4C903]">PM</span>-Consultant
        </h1>

        {/* Subheadline */}
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 font-medium">
          Data & <span className="text-[#F4C903]">AI Orchestration</span> <span className="text-[#F4C903]">PM Consulting</span><br />
          Pivot into high-value <span className="text-[#F4C903]">consulting</span> contracts
        </p>

        {/* Two primary hero cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 md:mt-4 w-full max-w-4xl">
          {/* Card 1 - Workshop */}
          <a
            href={WORKSHOP_REGISTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="gold-glow-border flex flex-col justify-center gap-2 px-5 py-5 md:px-6 md:py-6 rounded-xl text-left cursor-pointer"
          >
            <span className="text-lg sm:text-xl md:text-2xl font-bold text-[#F4C903]">
              Reserve My Free Workshop Spot
            </span>
            <span className="text-sm md:text-base text-white/90">
              How experienced professionals land $10k–$18k/mo Data and AI orchestration PM contracts
            </span>
            <span className="text-xs md:text-sm text-white/60">
              Includes the 90-day roadmap when you register.
            </span>
          </a>

          {/* Card 2 - Quiz */}
          <Link
            to="/are-you-ready-to-pivot-to-pm-consulting"
            className="gold-glow-border flex flex-col justify-center gap-2 px-5 py-5 md:px-6 md:py-6 rounded-xl text-left cursor-pointer"
          >
            <span className="text-lg sm:text-xl md:text-2xl font-bold text-[#F4C903]">
              Take the PM Consulting Readiness Quiz
            </span>
            <span className="text-sm md:text-base text-white/90">
              3 minutes. See if you qualify — score is instant, no signup.
            </span>
            <span className="text-xs md:text-sm text-white/60">
              Finish the quiz to unlock the 90-day roadmap.
            </span>
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

        {/* Gift strip */}
        <div className="w-full max-w-4xl mt-2 rounded-xl border border-[#F4C903]/30 bg-black/40 px-4 py-3 md:px-5 md:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm md:text-base font-semibold text-[#F4C903]">Open PM Consulting Contracts</p>
            <p className="text-xs md:text-sm text-white/70">Live recruiter-sourced Data &amp; AI Orchestration PM contracts.</p>
          </div>
          <Link
            to="/ai-bi-fintech-pm-job-alerts-repo"
            className="flex items-center gap-1 text-sm md:text-base font-semibold text-white hover:text-[#F4C903] whitespace-nowrap"
          >
            Browse open contracts <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>;
};
export default HeroSection;
