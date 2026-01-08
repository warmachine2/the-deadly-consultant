import { FileText, Briefcase, BookOpen, Rocket } from "lucide-react";

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
          Your AI-Proof 90-Day Pivot to $10k/mo+{" "}
          <span className="text-[#F4C903]">BI-FinTech & AI Deployment PM</span> Consulting
        </h1>

        {/* Subheadline */}
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 font-medium">
          Escape AI job vaporization. Master{" "}
          <span className="text-[#F4C903]">PMP/PSM/CPMAI trifecta</span> + build $60k PPM tools. Land guaranteed interviews fast. Click below to kick-start your pivot.
        </p>

        {/* CTA Buttons - 2x2 Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-2 md:mt-4 w-full max-w-4xl">
          {/* CTA 1 - Roadmap */}
          <a 
            href="https://thedeadlyconsultant.com/2026-bi-fintech-consulting-roadmap-pdf-unlock" 
            className="group flex flex-col items-center justify-center gap-3 p-4 md:p-6 text-center font-bold rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 text-white border border-cyan-400/40 hover:border-[#F4C903]/60 cta-glow-pulse cursor-pointer min-h-[140px] md:min-h-[160px]" 
            style={{
              background: "linear-gradient(135deg, rgba(15, 15, 15, 0.9) 0%, rgba(30, 30, 40, 0.85) 100%)",
              backdropFilter: "blur(12px) saturate(150%)",
              WebkitBackdropFilter: "blur(12px) saturate(150%)"
            }}
          >
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-[#F4C903]/20 flex items-center justify-center group-hover:from-cyan-500/30 group-hover:to-[#F4C903]/30 transition-all duration-300">
              <FileText className="w-6 h-6 md:w-7 md:h-7 text-[#F4C903]" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs md:text-sm text-white/70">Free Access</span>
              <span className="text-sm md:text-base text-[#F4C903] group-hover:text-white transition-colors">90-Day Roadmap</span>
            </div>
          </a>

          {/* CTA 2 - Job Alerts */}
          <a 
            href="/ai-bi-fintech-pm-job-alerts-repo" 
            className="group flex flex-col items-center justify-center gap-3 p-4 md:p-6 text-center font-bold rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 text-white border border-cyan-400/40 hover:border-[#F4C903]/60 cta-glow-pulse cursor-pointer min-h-[140px] md:min-h-[160px]" 
            style={{
              background: "linear-gradient(135deg, rgba(15, 15, 15, 0.9) 0%, rgba(30, 30, 40, 0.85) 100%)",
              backdropFilter: "blur(12px) saturate(150%)",
              WebkitBackdropFilter: "blur(12px) saturate(150%)"
            }}
          >
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-[#F4C903]/20 flex items-center justify-center group-hover:from-cyan-500/30 group-hover:to-[#F4C903]/30 transition-all duration-300">
              <Briefcase className="w-6 h-6 md:w-7 md:h-7 text-[#F4C903]" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs md:text-sm text-white/70">$10k/mo+ Jobs</span>
              <span className="text-sm md:text-base text-[#F4C903] group-hover:text-white transition-colors">PM Job Board</span>
            </div>
          </a>

          {/* CTA 3 - Strategy Guide */}
          <a 
            data-formkit-toggle="27ad03da2d"
            href="https://bi-fintech-consultant-academy.kit.com/27ad03da2d"
            className="group flex flex-col items-center justify-center gap-3 p-4 md:p-6 text-center font-bold rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 text-white border border-cyan-400/40 hover:border-[#F4C903]/60 cta-glow-pulse cursor-pointer min-h-[140px] md:min-h-[160px]" 
            style={{
              background: "linear-gradient(135deg, rgba(15, 15, 15, 0.9) 0%, rgba(30, 30, 40, 0.85) 100%)",
              backdropFilter: "blur(12px) saturate(150%)",
              WebkitBackdropFilter: "blur(12px) saturate(150%)"
            }}
          >
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-[#F4C903]/20 flex items-center justify-center group-hover:from-cyan-500/30 group-hover:to-[#F4C903]/30 transition-all duration-300">
              <BookOpen className="w-6 h-6 md:w-7 md:h-7 text-[#F4C903]" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs md:text-sm text-white/70">AI-Proof PM</span>
              <span className="text-sm md:text-base text-[#F4C903] group-hover:text-white transition-colors">Strategy PDF</span>
            </div>
          </a>

          {/* CTA 4 - Accelerator */}
          <a 
            href="https://skool.com/bi-fintech-consultant-academy/about" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="group flex flex-col items-center justify-center gap-3 p-4 md:p-6 text-center font-bold rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 text-white border border-cyan-400/40 hover:border-[#F4C903]/60 cta-glow-pulse cursor-pointer min-h-[140px] md:min-h-[160px]" 
            style={{
              background: "linear-gradient(135deg, rgba(15, 15, 15, 0.9) 0%, rgba(30, 30, 40, 0.85) 100%)",
              backdropFilter: "blur(12px) saturate(150%)",
              WebkitBackdropFilter: "blur(12px) saturate(150%)"
            }}
          >
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-[#F4C903]/20 flex items-center justify-center group-hover:from-cyan-500/30 group-hover:to-[#F4C903]/30 transition-all duration-300">
              <Rocket className="w-6 h-6 md:w-7 md:h-7 text-[#F4C903]" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs md:text-sm text-white/70">BI-FinTech PM</span>
              <span className="text-sm md:text-base text-[#F4C903] group-hover:text-white transition-colors">Accelerator</span>
            </div>
          </a>
        </div>

        {/* Supporting List */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 md:gap-x-8 gap-y-2 md:gap-y-3 text-sm sm:text-base md:text-lg text-white/80 w-full max-w-4xl mt-2">
          <li className="flex items-start gap-2">
            <span className="text-[#F4C903]">•</span>
            <span>Escape AI job vaporization.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#F4C903]">•</span>
            <span>Master PMP/PSM/CPMAI trifecta.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#F4C903]">•</span>
            <span>Build $60k PPM BI tools for your portfolio.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#F4C903]">•</span>
            <span>Orchestrate AI Deployment/BI projects. Learn front-line PM consulting skills.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#F4C903]">•</span>
            <span>Land $10k/mo gigs - faster, easier.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#F4C903]">•</span>
            <span>Become a Certified Professional in Project Management & AI Deployment Projects.</span>
          </li>
        </ul>
      </div>
    </section>;
};
export default HeroSection;
