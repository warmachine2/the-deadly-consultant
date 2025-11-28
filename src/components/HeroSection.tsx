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
          <span className="block text-4xl md:text-4xl text-primary-foreground">Your AI-Proof 90-Day Pivot to $10k/mo+ BI/FinTech & <span style={{ color: "#F4C903" }}>AI Deployment PM</span> Consulting</span>
          <span className="block text-3xl md:text-base">Full project management consulting training. Land high value contracts confidently. </span>
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