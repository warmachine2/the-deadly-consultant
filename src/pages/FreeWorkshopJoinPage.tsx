import { Link } from "react-router-dom";
import TopNav from "@/components/TopNav";
import { Video, KeyRound, FileText, Briefcase } from "lucide-react";

const TEAMS_LINK = "https://teams.microsoft.com/meet/269620559856833?p=KhZ7uxx7J22Yo6ZrIh";

const FreeWorkshopJoinPage = () => {
  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="volumetric-glass rounded-2xl p-8 md:p-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#FFE361" }}>
              Live Workshop: How to Land $10k–$18k/mo Data &amp; AI Orchestration PM Consulting
              Contracts
            </h1>
            <p className="text-white text-base md:text-lg mb-8">
              Live session runs every Saturday from 11:00 AM to 12:00 PM EST (Toronto / New York)
            </p>

            <a
              href={TEAMS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="highlight-glow-button inline-flex items-center justify-center gap-3 w-full px-6 py-4 font-bold text-white text-base md:text-lg tracking-wide shadow-none"
            >
              <Video className="w-6 h-6" />
              Join Microsoft Teams Meeting
            </a>
          </div>

          <div className="volumetric-glass rounded-2xl p-8 text-center">
            <div className="flex justify-center items-center gap-3 mb-4">
              <KeyRound className="w-6 h-6 text-[#FFE361]" />
              <h2 className="text-2xl font-bold" style={{ color: "#FFE361" }}>
                Meeting Details
              </h2>
            </div>
            <p className="text-white mb-1">
              Meeting ID: <span className="font-mono font-bold">269 620 559 856 833</span>
            </p>
            <p className="text-white mb-5">
              Passcode: <span className="font-mono font-bold">65XP2vs9</span>
            </p>
            <p className="text-white/90 text-sm md:text-base">
              You can join directly in your web browser without downloading Teams, or open in the
              Microsoft Teams app. Please join 5 minutes early to test your audio.
            </p>
          </div>

          <div className="volumetric-glass rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-5" style={{ color: "#FFE361" }}>
              Quick Links
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/2026-bi-fintech-consulting-roadmap-pdf-unlock">
                <button className="gold-glow-border w-full px-5 py-3 font-bold text-white hover:text-[#F4C903] inline-flex items-center justify-center gap-2">
                  <FileText className="w-5 h-5" />
                  2026 Roadmap
                </button>
              </Link>
              <Link to="/ai-bi-fintech-pm-job-alerts-repo">
                <button className="gold-glow-border w-full px-5 py-3 font-bold text-white hover:text-[#F4C903] inline-flex items-center justify-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Job Alerts
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FreeWorkshopJoinPage;
