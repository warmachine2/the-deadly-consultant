import TopNav from "@/components/TopNav";
import ThankYouContent from "@/components/ThankYouContent";
import CalendlyInlineWidget from "@/components/CalendlyInlineWidget";

const BookSessionThankYou = () => {
  return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="volumetric-glass rounded-2xl p-2 sm:p-6 md:p-8 text-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: "#FFE361" }}>
              Step 1: Choose Your Strategy Session Time
            </h1>
            <p className="text-white/80 text-sm md:text-base mb-6">
              Your information has been received! Select a date and time slot below to lock in your 1-on-1 Pivot Strategy Call with Hassan.
            </p>

            <CalendlyInlineWidget />
          </div>

          <ThankYouContent />
        </div>
      </main>
    </div>
  );
};


export default BookSessionThankYou;
