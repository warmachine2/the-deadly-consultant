import { Link } from "react-router-dom";
import TopNav from "@/components/TopNav";
import { CheckCircle2, Briefcase, FileText } from "lucide-react";

const FreeWorkshopThankYouPage = () => {
  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="volumetric-glass rounded-2xl p-8 md:p-12 text-center">
            <CheckCircle2 className="w-16 h-16 mx-auto mb-6 text-[#FFE361]" />
            <h1
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: "#FFE361" }}
            >
              Your Spot Is Reserved!
            </h1>
            <p className="text-white text-base md:text-lg">
              Thanks for registering — your free workshop spot is confirmed.
            </p>
          </div>

          <div className="volumetric-glass rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-3" style={{ color: "#FFE361" }}>
              Workshop Details
            </h2>
            <p className="text-white">
              We&rsquo;ll send the live workshop date, access link, and calendar invite
              directly to your email shortly.
            </p>
          </div>

          <div className="volumetric-glass rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-3">
              <Briefcase className="w-6 h-6 text-[#FFE361]" />
              <h2 className="text-2xl font-bold" style={{ color: "#FFE361" }}>
                Start Browsing Now
              </h2>
            </div>
            <p className="text-white mb-5">
              Get a head start — check out the open PM consulting contracts on our job board.
            </p>
            <Link to="/ai-bi-fintech-pm-job-alerts-repo">
              <button className="gold-glow-border px-5 py-3 font-bold text-white hover:text-[#F4C903]">
                Browse open contracts
              </button>
            </Link>
          </div>

          <div className="volumetric-glass rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-3">
              <FileText className="w-6 h-6 text-[#FFE361]" />
              <h2 className="text-2xl font-bold" style={{ color: "#FFE361" }}>
                2026 PM Consulting Roadmap
              </h2>
            </div>
            <p className="text-white">
              Coming soon — we&rsquo;re putting the finishing touches on the full roadmap
              guide.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FreeWorkshopThankYouPage;
