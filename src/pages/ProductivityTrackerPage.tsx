import TopNav from "@/components/TopNav";

const ProductivityTrackerPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <TopNav />
      
      <main className="pt-24 pb-16 px-4 md:px-8 max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 text-center">
          <span className="text-[#F4C903]">3KS</span> Productivity Tracker
        </h1>
        <p className="text-white/70 text-center mb-8">
          Master your productivity with the 3KS system
        </p>
        
        {/* YouTube Video Embed */}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden volumetric-glass">
          <iframe
            className="absolute inset-0 w-full h-full"
            src="https://www.youtube.com/embed/_qDk7KFPXE4"
            title="3KS Productivity Tracker"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </main>
    </div>
  );
};

export default ProductivityTrackerPage;
