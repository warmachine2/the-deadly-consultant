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
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 animate-fade-in tracking-wide">
          <span className="block text-4xl md:text-4xl">Your 10k/mo+ AI-Proof 90-Day Pivot</span>
          <span className="block text-3xl md:text-5xl">BI/FinTech & AI Deployment PM</span>
          <span className="block text-3xl md:text-5xl">
            
            <span style={{
            color: "white"
          }}>I will help you with full training, one source, killer portfolio, 3 Certs (PMP, PSM, CPMAI). Become deadly competent</span>
          </span>
        </h1>
        
      </div>
    </section>;
};
export default HeroSection;