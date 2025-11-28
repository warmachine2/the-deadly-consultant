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
      
      <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 animate-fade-in tracking-wide text-left w-full">
          <span className="block text-4xl text-primary-foreground mb-6 md:text-5xl">
            Your AI-Proof 90-Day Pivot to $10k/mo+ BI/FinTech & <span style={{
            color: "#F4C903"
          }}>AI Deployment PM</span> Consulting
          </span>
          <span className="block text-3xl md:text-xl">Full Project Management Training. Land High Value Contracts Confidently.<span style={{
            color: "#F4C903"
          }}>high value contracts</span> confidently.</span>
        </h1>
        
        <a href="https://thedeadlyconsultant.com/2026-bi-fintech-consulting-roadmap-pdf-unlock" className="inline-block mt-8 px-8 py-4 text-center font-bold text-2xl md:text-4xl rounded-xl transition-all duration-300 hover:scale-105 volumetric-glass-button text-white hover:text-[#F4C903] border border-white/20" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} style={{
        boxShadow: isHovered ? "0 0 30px rgba(0, 212, 255, 0.8), 0 0 60px rgba(0, 212, 255, 0.5)" : "0 0 20px rgba(255, 255, 255, 0.2), 0 0 40px rgba(255, 255, 255, 0.1)",
        fontFamily: "sans-serif"
      }}>Get Started with Free Roadmap</a>
        
        <p className="mt-4 text-lg md:text-2xl italic text-white/90 text-left w-full">
          Escape AI job vaporization – master PMP/PSM/CPMAI trifecta + build $60k PPM tools for your portfolio. Land $10k/mo gigs. Faster, easier, guaranteed.
        </p>
      </div>
    </section>;
};
export default HeroSection;