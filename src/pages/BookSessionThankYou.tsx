import { useEffect, useState } from "react";
import TopNav from "@/components/TopNav";
import ThankYouContent from "@/components/ThankYouContent";

const CALENDLY_SCRIPT_SRC = "https://assets.calendly.com/assets/external/widget.js";

const BookSessionThankYou = () => {
  const [widgetHeight, setWidgetHeight] = useState(1060);

  useEffect(() => {
    if (document.querySelector(`script[src="${CALENDLY_SCRIPT_SRC}"]`)) return;
    const script = document.createElement("script");
    script.src = CALENDLY_SCRIPT_SRC;
    script.async = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.event === "calendly.page_height" && e.data?.payload?.height) {
        const h = parseInt(String(e.data.payload.height), 10);
        if (!isNaN(h) && h > 400) {
          setWidgetHeight(Math.max(1060, h + 40));
        }
      }
    };
    window.addEventListener("message", handleMessage);
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

            <div
              className="calendly-inline-widget bg-white rounded-xl overflow-hidden"
              data-url="https://calendly.com/hassan-hammer/30min?hide_gdpr_banner=1"
              data-resize="true"
              style={{ minWidth: "100%", width: "100%", height: `${widgetHeight}px`, overflow: "hidden" }}
            />
          </div>

          <ThankYouContent />
        </div>
      </main>
    </div>
  );
};


export default BookSessionThankYou;
