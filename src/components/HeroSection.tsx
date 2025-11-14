const HeroSection = () => {
  return (
    <section className="volumetric-glass rounded-3xl p-8 md:p-12 mb-8 hover-lift relative bg-cover bg-center bg-[url('/optical-fiber-background[1].jpg')]">
      {" "}
      {/* UPDATED: Swapped to your new photo name - covers full section, centered */}
      <div className="max-w-4xl mx-auto text-center">
        {" "}
        {/* Inner div unchanged - text overlays the bg */}
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 animate-fade-in tracking-wide">
          Full Stack Training to Become a 10k/mo+ BI-FinTech PM Consultant
        </h1>
        <p className="text-lg md:text-xl text-white/80 mb-6">
          Explore career paths, essential tools, and inspiring success stories
        </p>
      </div>
    </section>
  );
};
export default HeroSection;
