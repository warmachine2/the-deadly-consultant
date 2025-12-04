import TopNav from "@/components/TopNav";

const ProductivityTrackerPage = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <TopNav />
      
      <main className="container mx-auto px-4 py-8 max-w-5xl mt-20 lg:mt-24">
        <section className="volumetric-glass rounded-3xl p-8 md:p-12 mb-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              <span className="text-[#F4C903]">3KS</span> Productivity Tracker
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-6">
              Master your productivity with the 3KS system
            </p>
          </div>
        </section>
        
        {/* YouTube Video Embed */}
        <section className="volumetric-glass rounded-3xl p-6 mb-8">
          <div className="relative w-full pb-[56.25%]">
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-2xl"
              src="https://www.youtube.com/embed/_qDk7KFPXE4"
              title="3KS Productivity Tracker"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProductivityTrackerPage;
