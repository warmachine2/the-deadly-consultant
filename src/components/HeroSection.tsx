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
          Data, <span className="text-[#F4C903]">FinTech</span> & <span className="text-[#F4C903]">AI Project Management</span> <span className="text-[#F4C903]">Consulting</span><br />
          AI-proof pivots into high-value <span className="text-[#F4C903]">consulting</span> contracts
        </p>

        {/* CTA Buttons - 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mt-2 md:mt-4 w-full max-w-4xl">
          {/* Main CTA Button - Roadmap - Mobile */}
          <a 
            href="https://www.zerotopmconsultant.com/2026-bi-fintech-consulting-roadmap-pdf-unlock"
            className="flex md:hidden flex-row items-center justify-center gap-3 px-4 py-3 text-lg sm:text-xl font-bold rounded-xl transition-colors duration-300 text-white hover:text-[#F4C903] border border-cyan-400/60 cta-glow-pulse cursor-pointer min-h-[100px]" 
            style={{
              background: "rgba(15, 15, 15, 0.85)",
              backdropFilter: "blur(9px) saturate(150%)",
              WebkitBackdropFilter: "blur(9px) saturate(150%)"
            }}
          >
            <div className="flex flex-col text-center flex-1">
              <span className="block">Get Free Instant Access to</span>
              <span className="block"><span className="text-[#F4C903]">90-Day Roadmap</span></span>
            </div>
          </a>
          
          {/* Main CTA Button - Roadmap - Desktop */}
          <a 
            href="https://www.zerotopmconsultant.com/2026-bi-fintech-consulting-roadmap-pdf-unlock" 
            className="hidden md:flex flex-row items-center justify-center gap-4 px-6 py-4 text-[1.625rem] font-bold rounded-xl transition-colors duration-300 text-white hover:text-[#F4C903] border border-cyan-400/60 cta-glow-pulse cursor-pointer min-h-[120px]" 
            style={{
              background: "rgba(15, 15, 15, 0.85)",
              backdropFilter: "blur(9px) saturate(150%)",
              WebkitBackdropFilter: "blur(9px) saturate(150%)"
            }}
          >
            <div className="flex flex-col text-center flex-1">
              <span className="block">Get Free Instant Access to</span>
              <span className="block"><span className="text-[#F4C903]">90-Day Roadmap</span></span>
            </div>
          </a>

          {/* Second CTA Button - Job Alerts - Mobile */}
          <a 
            href="/ai-bi-fintech-pm-job-alerts-repo" 
            className="flex md:hidden flex-row items-center justify-center gap-3 px-4 py-3 text-lg sm:text-xl font-bold rounded-xl transition-colors duration-300 text-white hover:text-[#F4C903] border border-cyan-400/60 cta-glow-pulse cursor-pointer min-h-[100px]" 
            style={{
              background: "rgba(15, 15, 15, 0.85)",
              backdropFilter: "blur(9px) saturate(150%)",
              WebkitBackdropFilter: "blur(9px) saturate(150%)"
            }}
          >
            <div className="flex flex-col text-center flex-1">
              <span className="block">$10k/mo+ Job Alerts</span>
              <span className="block">+ AI/BI-FinTech <span className="text-[#F4C903]">PM Job Board</span></span>
            </div>
          </a>
          
          {/* Second CTA Button - Job Alerts - Desktop */}
          <a 
            href="/ai-bi-fintech-pm-job-alerts-repo" 
            className="hidden md:flex flex-row items-center justify-center gap-4 px-6 py-4 text-[1.625rem] font-bold rounded-xl transition-colors duration-300 text-white hover:text-[#F4C903] border border-cyan-400/60 cta-glow-pulse cursor-pointer min-h-[120px]" 
            style={{
              background: "rgba(15, 15, 15, 0.85)",
              backdropFilter: "blur(9px) saturate(150%)",
              WebkitBackdropFilter: "blur(9px) saturate(150%)"
            }}
          >
            <div className="flex flex-col text-center flex-1">
              <span className="block">$10k/mo+ Job Alerts</span>
              <span className="block">+ AI/BI-FinTech <span className="text-[#F4C903]">PM Job Board</span></span>
            </div>
          </a>

          {/* Third CTA Button - Strategy Guide - Mobile Link */}
          <a 
            data-formkit-toggle="0edbc71770"
            href="https://bi-fintech-consultant-academy.kit.com/0edbc71770"
            className="flex md:hidden flex-row items-center justify-center gap-3 px-4 py-3 text-lg sm:text-xl font-bold rounded-xl transition-colors duration-300 text-white hover:text-[#F4C903] border border-cyan-400/60 cta-glow-pulse cursor-pointer min-h-[100px]" 
            style={{
              background: "rgba(15, 15, 15, 0.85)",
              backdropFilter: "blur(9px) saturate(150%)",
              WebkitBackdropFilter: "blur(9px) saturate(150%)"
            }}
          >
            <div className="flex flex-col text-center flex-1">
              <span className="block">AI-Proof BI-FinTech PM</span>
              <span className="block"><span className="text-[#F4C903]">Strategy PDF</span></span>
            </div>
          </a>
          
          {/* Third CTA Button - Strategy Guide - Desktop Link */}
          <a 
            data-formkit-toggle="27ad03da2d"
            href="https://bi-fintech-consultant-academy.kit.com/27ad03da2d"
            className="hidden md:flex flex-row items-center justify-center gap-4 px-6 py-4 text-[1.625rem] font-bold rounded-xl transition-colors duration-300 text-white hover:text-[#F4C903] border border-cyan-400/60 cta-glow-pulse cursor-pointer min-h-[120px]" 
            style={{
              background: "rgba(15, 15, 15, 0.85)",
              backdropFilter: "blur(9px) saturate(150%)",
              WebkitBackdropFilter: "blur(9px) saturate(150%)"
            }}
          >
            <div className="flex flex-col text-center flex-1">
              <span className="block">AI-Proof BI-FinTech PM</span>
              <span className="block"><span className="text-[#F4C903]">Strategy PDF</span></span>
            </div>
          </a>

          {/* Fourth CTA Button - Accelerator - Mobile */}
          <a 
            href="https://skool.com/bi-fintech-consultant-academy/about" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex md:hidden flex-row items-center justify-center gap-3 px-4 py-3 text-lg sm:text-xl font-bold rounded-xl transition-colors duration-300 text-white hover:text-[#F4C903] border border-cyan-400/60 cta-glow-pulse cursor-pointer min-h-[100px]" 
            style={{
              background: "rgba(15, 15, 15, 0.85)",
              backdropFilter: "blur(9px) saturate(150%)",
              WebkitBackdropFilter: "blur(9px) saturate(150%)"
            }}
          >
            <div className="flex flex-col text-center flex-1">
              <span className="block">AI-Proof 10k/mo+</span>
              <span className="block"><span className="text-[#F4C903]">BI-FinTech PM</span> Accelerator</span>
            </div>
          </a>
          
          {/* Fourth CTA Button - Accelerator - Desktop */}
          <a 
            href="https://skool.com/bi-fintech-consultant-academy/about" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hidden md:flex flex-row items-center justify-center gap-4 px-6 py-4 text-[1.625rem] font-bold rounded-xl transition-colors duration-300 text-white hover:text-[#F4C903] border border-cyan-400/60 cta-glow-pulse cursor-pointer min-h-[120px]" 
            style={{
              background: "rgba(15, 15, 15, 0.85)",
              backdropFilter: "blur(9px) saturate(150%)",
              WebkitBackdropFilter: "blur(9px) saturate(150%)"
            }}
          >
            <div className="flex flex-col text-center flex-1">
              <span className="block">AI-Proof 10k/mo+</span>
              <span className="block"><span className="text-[#F4C903]">BI-FinTech PM</span> Accelerator</span>
            </div>
          </a>
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