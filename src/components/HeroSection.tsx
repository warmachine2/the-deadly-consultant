import strategyGuideThumbnail from "@/assets/strategy-guide-thumbnail.jpg";
import acceleratorThumbnail from "@/assets/accelerator-thumbnail.png";
import jobBoardThumbnail from "@/assets/job-board-tile-icon.jpg";

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mt-2 md:mt-4 w-full max-w-4xl">
          {/* Main CTA Button */}
          <a href="https://thedeadlyconsultant.com/2026-bi-fintech-consulting-roadmap-pdf-unlock" className="inline-flex flex-col justify-center px-4 md:px-6 py-3 md:py-4 text-base sm:text-lg md:text-2xl font-bold rounded-xl transition-colors duration-300 hover:scale-105 active:scale-95 text-white hover:text-[#F4C903] border border-cyan-400/60 text-center cta-glow-pulse min-h-[100px] md:min-h-[120px]" style={{
          background: "rgba(15, 15, 15, 0.85)",
          backdropFilter: "blur(9px) saturate(150%)",
          WebkitBackdropFilter: "blur(9px) saturate(150%)"
        }}>
            <span className="block">Get Free Instant Access to</span>
            <span className="block"><span className="text-[#F4C903]">90-Day Roadmap</span></span>
            <span className="block text-[9px] sm:text-[10px] md:text-xs text-white/80 mt-1">PMP/PSM/CPMAI Trifecta + build $60k Tools - Escape AI Now</span>
          </a>

          {/* Second CTA Button - Job Alerts - Mobile */}
          <a 
            href="/ai-bi-fintech-pm-job-alerts-repo" 
            className="flex md:hidden flex-row items-center gap-3 px-4 py-3 text-base sm:text-lg font-bold rounded-xl transition-colors duration-300 hover:scale-105 active:scale-95 text-white hover:text-[#F4C903] border border-cyan-400/60 cta-glow-pulse cursor-pointer min-h-[100px]" 
            style={{
              background: "rgba(15, 15, 15, 0.85)",
              backdropFilter: "blur(9px) saturate(150%)",
              WebkitBackdropFilter: "blur(9px) saturate(150%)"
            }}
          >
            <div className="w-px h-12 bg-white/20 flex-shrink-0" />
            <div className="relative flex-shrink-0">
              <div 
                className="absolute inset-0 rounded-lg"
                style={{
                  boxShadow: "0 0 8px 2px rgba(255, 255, 255, 0.5), 0 0 12px 3px rgba(0, 212, 255, 0.6)",
                }}
              />
              <img 
                src={jobBoardThumbnail} 
                alt="Job Board Preview" 
                className="w-16 h-20 object-cover rounded-lg relative z-10"
              />
            </div>
            <div className="w-px h-12 bg-white/20 flex-shrink-0" />
            <div className="flex flex-col text-center flex-1">
              <span className="block">$10k/mo+ Job Alerts</span>
              <span className="block">+ AI/BI-FinTech <span className="text-[#F4C903]">PM Job Board</span></span>
            </div>
          </a>
          
          {/* Second CTA Button - Job Alerts - Desktop */}
          <a 
            href="/ai-bi-fintech-pm-job-alerts-repo" 
            className="hidden md:flex flex-row items-center gap-4 px-6 py-4 text-2xl font-bold rounded-xl transition-colors duration-300 hover:scale-105 active:scale-95 text-white hover:text-[#F4C903] border border-cyan-400/60 cta-glow-pulse cursor-pointer min-h-[120px]" 
            style={{
              background: "rgba(15, 15, 15, 0.85)",
              backdropFilter: "blur(9px) saturate(150%)",
              WebkitBackdropFilter: "blur(9px) saturate(150%)"
            }}
          >
            <div className="w-px h-16 bg-white/20 flex-shrink-0" />
            <div className="relative flex-shrink-0">
              <div 
                className="absolute inset-0 rounded-lg"
                style={{
                  boxShadow: "0 0 10px 2px rgba(255, 255, 255, 0.5), 0 0 14px 4px rgba(0, 212, 255, 0.6)",
                }}
              />
              <img 
                src={jobBoardThumbnail} 
                alt="Job Board Preview" 
                className="w-20 h-24 object-cover rounded-lg relative z-10"
              />
            </div>
            <div className="w-px h-16 bg-white/20 flex-shrink-0" />
            <div className="flex flex-col text-center flex-1">
              <span className="block">$10k/mo+ Job Alerts</span>
              <span className="block">+ AI/BI-FinTech <span className="text-[#F4C903]">PM Job Board</span></span>
            </div>
          </a>

          {/* Third CTA Button - Strategy Guide - Mobile Link */}
          <a 
            data-formkit-toggle="0edbc71770"
            href="https://bi-fintech-consultant-academy.kit.com/0edbc71770"
            className="flex md:hidden flex-row items-center gap-3 px-4 py-3 text-base sm:text-lg font-bold rounded-xl transition-colors duration-300 hover:scale-105 active:scale-95 text-white hover:text-[#F4C903] border border-cyan-400/60 cta-glow-pulse cursor-pointer min-h-[100px]" 
            style={{
              background: "rgba(15, 15, 15, 0.85)",
              backdropFilter: "blur(9px) saturate(150%)",
              WebkitBackdropFilter: "blur(9px) saturate(150%)"
            }}
          >
            <div className="w-px h-12 bg-white/20 flex-shrink-0" />
            <div className="relative flex-shrink-0">
              <div 
                className="absolute inset-0 rounded-lg"
                style={{
                  boxShadow: "0 0 8px 2px rgba(255, 255, 255, 0.5), 0 0 12px 3px rgba(0, 212, 255, 0.6)",
                }}
              />
              <img 
                src={strategyGuideThumbnail} 
                alt="Strategy Guide Preview" 
                className="w-16 h-20 object-cover rounded-lg relative z-10"
              />
            </div>
            <div className="w-px h-12 bg-white/20 flex-shrink-0" />
            <div className="flex flex-col text-center flex-1">
              <span className="block">AI-Proof BI-FinTech PM</span>
              <span className="block"><span className="text-[#F4C903]">Strategy PDF</span></span>
            </div>
          </a>
          
          {/* Third CTA Button - Strategy Guide - Desktop Link */}
          <a 
            data-formkit-toggle="27ad03da2d"
            href="https://bi-fintech-consultant-academy.kit.com/27ad03da2d"
            className="hidden md:flex flex-row items-center gap-4 px-6 py-4 text-2xl font-bold rounded-xl transition-colors duration-300 hover:scale-105 active:scale-95 text-white hover:text-[#F4C903] border border-cyan-400/60 cta-glow-pulse cursor-pointer min-h-[120px]" 
            style={{
              background: "rgba(15, 15, 15, 0.85)",
              backdropFilter: "blur(9px) saturate(150%)",
              WebkitBackdropFilter: "blur(9px) saturate(150%)"
            }}
          >
            <div className="w-px h-16 bg-white/20 flex-shrink-0" />
            <div className="relative flex-shrink-0">
              <div 
                className="absolute inset-0 rounded-lg"
                style={{
                  boxShadow: "0 0 10px 2px rgba(255, 255, 255, 0.5), 0 0 14px 4px rgba(0, 212, 255, 0.6)",
                }}
              />
              <img 
                src={strategyGuideThumbnail} 
                alt="Strategy Guide Preview" 
                className="w-20 h-24 object-cover rounded-lg relative z-10"
              />
            </div>
            <div className="w-px h-16 bg-white/20 flex-shrink-0" />
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
            className="flex md:hidden flex-row items-center gap-3 px-4 py-3 text-base sm:text-lg font-bold rounded-xl transition-colors duration-300 hover:scale-105 active:scale-95 text-white hover:text-[#F4C903] border border-cyan-400/60 cta-glow-pulse cursor-pointer min-h-[100px]" 
            style={{
              background: "rgba(15, 15, 15, 0.85)",
              backdropFilter: "blur(9px) saturate(150%)",
              WebkitBackdropFilter: "blur(9px) saturate(150%)"
            }}
          >
            <div className="w-px h-12 bg-white/20 flex-shrink-0" />
            <div className="relative flex-shrink-0">
              <img 
                src={acceleratorThumbnail} 
                alt="BI-FinTech Accelerator" 
                className="w-[74px] h-[74px] object-contain relative z-10"
                style={{
                  filter: "drop-shadow(0 0 6px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 10px rgba(0, 212, 255, 0.7))",
                }}
              />
            </div>
            <div className="w-px h-12 bg-white/20 flex-shrink-0" />
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
            className="hidden md:flex flex-row items-center gap-4 px-6 py-4 text-2xl font-bold rounded-xl transition-colors duration-300 hover:scale-105 active:scale-95 text-white hover:text-[#F4C903] border border-cyan-400/60 cta-glow-pulse cursor-pointer min-h-[120px]" 
            style={{
              background: "rgba(15, 15, 15, 0.85)",
              backdropFilter: "blur(9px) saturate(150%)",
              WebkitBackdropFilter: "blur(9px) saturate(150%)"
            }}
          >
            <div className="w-px h-16 bg-white/20 flex-shrink-0" />
            <div className="relative flex-shrink-0">
              <img 
                src={acceleratorThumbnail} 
                alt="BI-FinTech Accelerator" 
                className="w-[92px] h-[92px] object-contain relative z-10"
                style={{
                  filter: "drop-shadow(0 0 8px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 12px rgba(0, 212, 255, 0.7))",
                }}
              />
            </div>
            <div className="w-px h-16 bg-white/20 flex-shrink-0" />
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