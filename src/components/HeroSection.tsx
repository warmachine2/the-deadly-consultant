import { useState } from "react";
const HeroSection = () => {
  const [isHovered, setIsHovered] = useState(false);
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
          <span className="text-[#F4C903]">High Value Contracts</span> confidently.
        </p>

        {/* CTA Button */}
        <a href="https://thedeadlyconsultant.com/2026-bi-fintech-consulting-roadmap-pdf-unlock" className="inline-block mt-4 px-8 py-4 text-base md:text-lg lg:text-xl font-bold rounded-xl transition-all duration-300 hover:scale-105 volumetric-glass-button text-white hover:text-[#F4C903] border border-white/20 text-center" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} style={{
        boxShadow: isHovered ? "0 0 30px rgba(0, 212, 255, 0.8), 0 0 60px rgba(0, 212, 255, 0.5)" : "0 0 20px rgba(255, 255, 255, 0.2), 0 0 40px rgba(255, 255, 255, 0.1)"
      }}>
          Download Free BI-FinTech PM Consulting Roadmap
        </a>

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
            <span>Build $60k PPM BI tools for your portfolio</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#F4C903]">•</span>
            <span>Orchestrate AI Deployment/BI projects. Learn front-line PM consulting skills.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#F4C903]">•</span>
            <span>Land $10k/mo gigs - faster, easier</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#F4C903]">•</span>
            <span>Become a Certified Professional in Project Management & AI Deployment Projects</span>
          </li>
        </ul>
      </div>
    </section>;
};
export default HeroSection;