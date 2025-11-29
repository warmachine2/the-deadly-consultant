const HeroSection = () => {
  return <section className="volumetric-glass rounded-3xl p-8 md:p-12 mb-0 md:mb-8 hero-bokeh relative overflow-hidden">
      {/* Bokeh orbs layer */}
      <div className="bokeh-orbs" aria-hidden="true">
        <div className="bokeh-orb bokeh-orb-1"></div>
        <div className="bokeh-orb bokeh-orb-2"></div>
        <div className="bokeh-orb bokeh-orb-3"></div>
        <div className="bokeh-orb bokeh-orb-4"></div>
        <div className="bokeh-orb bokeh-orb-5"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-start gap-6">
        {/* Main Headline */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight animate-fade-in">
          Your AI-Proof 90-Day Pivot to $10k/mo+ BI/FinTech &{" "}
          <span className="text-[#F4C903]">AI Deployment PM</span> Consulting
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl lg:text-2xl text-white/90 font-medium">
          Full Project Management Training. Land{" "}
          <span className="text-[#F4C903]">High Value Contracts</span>.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col md:flex-row gap-4 mt-4 md:items-stretch">
          {/* Main CTA Button */}
          <a 
            href="https://thedeadlyconsultant.com/2026-bi-fintech-consulting-roadmap-pdf-unlock" 
            className="inline-flex flex-col justify-center px-8 py-4 text-base md:text-lg lg:text-xl font-bold rounded-xl transition-colors duration-300 hover:scale-105 active:scale-95 text-white hover:text-[#F4C903] border border-cyan-400/60 text-center cta-glow-pulse min-h-[140px]"
            style={{
              background: "rgba(15, 15, 15, 0.85)",
              backdropFilter: "blur(9px) saturate(150%)",
              WebkitBackdropFilter: "blur(9px) saturate(150%)",
            }}
          >
            <span className="block">Download Free <span className="text-[#F4C903]">AI-Proof</span></span>
            <span className="block">BI-FinTech PM Consulting</span>
            <span className="block">Roadmap</span>
          </a>

          {/* Second CTA Button - Strategy Guide */}
          <button 
            className="flex flex-col justify-center px-8 py-4 text-base md:text-lg lg:text-xl font-bold rounded-xl transition-colors duration-300 hover:scale-105 active:scale-95 text-white hover:text-[#F4C903] border border-cyan-400/60 text-center cta-glow-pulse cursor-not-allowed min-h-[140px]"
            style={{
              background: "rgba(15, 15, 15, 0.85)",
              backdropFilter: "blur(9px) saturate(150%)",
              WebkitBackdropFilter: "blur(9px) saturate(150%)",
            }}
          >
            <span className="block">AI-Proof BI-FinTech PM</span>
            <span className="block"><span className="text-[#F4C903]">Contracts Strategy Guide</span></span>
            <span className="block">(Free)</span>
            <span className="text-[9px] text-white/70 tracking-wide mt-1">coming soon</span>
          </button>

          {/* Third CTA Button - Contract Alerts */}
          <button 
            className="flex flex-col justify-center px-8 py-4 text-base md:text-lg lg:text-xl font-bold rounded-xl transition-colors duration-300 hover:scale-105 active:scale-95 text-white hover:text-[#F4C903] border border-cyan-400/60 text-center cta-glow-pulse cursor-not-allowed min-h-[140px]"
            style={{
              background: "rgba(15, 15, 15, 0.85)",
              backdropFilter: "blur(9px) saturate(150%)",
              WebkitBackdropFilter: "blur(9px) saturate(150%)",
            }}
          >
            <span className="block">Weekly $10k/mo+</span>
            <span className="block"><span className="text-[#F4C903]">Contract Alerts</span></span>
            <span className="block">(Members Only)</span>
            <span className="text-[9px] text-white/70 tracking-wide mt-1">coming soon</span>
          </button>
        </div>

        {/* Supporting List */}
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-3 text-base md:text-lg text-white/80 w-full max-w-4xl">
          <li className="flex items-start gap-2">
            <span className="text-[#F4C903]">•</span>
            <span>Escape AI job vaporization. </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#F4C903]">•</span>
            <span>Master PMP/PSM/CPMAI trifecta. </span>
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