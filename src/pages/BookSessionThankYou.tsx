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
      <div className="container mx-auto px-4 py-8 pt-24 max-w-4xl">
        <div
          className="calendly-inline-widget rounded-2xl overflow-hidden shadow-lg mb-8"
          data-url="https://calendly.com/hassan-hammer/30min"
          style={{ minWidth: "320px", width: "100%", height: "700px" }}
        />

        <ThankYouContent />
      </div>
    </div>
  );
};

export default BookSessionThankYou;
