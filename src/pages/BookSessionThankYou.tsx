import { useEffect } from "react";
import TopNav from "@/components/TopNav";
import ThankYouContent from "@/components/ThankYouContent";

const CALENDLY_SCRIPT_SRC = "https://assets.calendly.com/assets/external/widget.js";

const BookSessionThankYou = () => {
  useEffect(() => {
    if (document.querySelector(`script[src="${CALENDLY_SCRIPT_SRC}"]`)) return;
    const script = document.createElement("script");
    script.src = CALENDLY_SCRIPT_SRC;
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNav />
      <div className="container mx-auto px-4 py-8 pt-24 max-w-2xl">
        <div className="volumetric-glass rounded-2xl p-6 text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: "#FFE361" }}>
            Step 1: Choose Your Strategy Session Time
          </h1>
          <p className="text-white/80 text-sm md:text-base">
            Your information has been received! Select a date and time slot below to lock in your 1-on-1 Pivot Strategy Call with Hassan.
          </p>
        </div>

        <div
          className="calendly-inline-widget rounded-2xl overflow-hidden shadow-lg mb-8"
          data-url="https://calendly.com/hassan-hammer/30min"
          style={{ minWidth: "320px", width: "100%", height: "980px" }}
        />

        <ThankYouContent />
      </div>
    </div>
  );
};

export default BookSessionThankYou;
