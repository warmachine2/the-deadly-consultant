const HeroSection = () => {
  return (
    <section
      className="volumetric-glass rounded-3xl p-8 md:p-12 hero-bokeh relative overflow-hidden
      pt-20 pb-16        /* ← NEW: small padding on mobile */
      md:pt-32 md:pb-24  /* ← keep your beautiful big padding on desktop/tablet */
      lg:pt-40 lg:pb-32"
    >
      /* ← optional extra breathing room on large screens */
      {/* Bokeh orbs layer – untouched */}
      <div className="bokeh-orbs" aria-hidden="true">
        <div className="bokeh-orb bokeh-orb-1"></div>
        <div className="bokeh-orb bokeh-orb-2"></div>
        <div className="bokeh-orb bokeh-orb-3"></div>
        <div className="bokeh-orb bokeh-orb-4"></div>
        <div className="bokeh-orb bokeh-orb-5"></div>
      </div>
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 animate-fade-in tracking-wide">
          Full Stack Training to Become a 10k/mo+ BI-FinTech PM Consultant
        </h1>
        <p className="text-lg md:text-xl mb-6 text-[#A0B0C0]">
          Explore career paths, essential tools, and inspiring success stories
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
