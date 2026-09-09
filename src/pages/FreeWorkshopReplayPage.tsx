import { Link } from "react-router-dom";
import TopNav from "@/components/TopNav";
import { PlayCircle } from "lucide-react";

const FreeWorkshopReplayPage = () => {
  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="volumetric-glass rounded-2xl p-8 md:p-12 text-center">
            <PlayCircle className="w-16 h-16 mx-auto mb-6 text-[#FFE361]" />
            <h1 className="text-3xl md:text-4xl font-bold" style={{ color: "#FFE361" }}>
              Workshop Replay
            </h1>
          </div>

          <div className="volumetric-glass rounded-2xl p-8 text-center">
            <p className="text-white text-base md:text-lg">
              Session 1 recording will appear here once the live workshop concludes.
            </p>
          </div>

          <div className="volumetric-glass rounded-2xl p-8 text-center">
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/free-workshop">
                <button className="gold-glow-border w-full px-5 py-3 font-bold text-white hover:text-[#F4C903]">
                  Register for the live workshop
                </button>
              </Link>
              <Link to="/2026-bi-fintech-consulting-roadmap-pdf-unlock">
                <button className="gold-glow-border w-full px-5 py-3 font-bold text-white hover:text-[#F4C903]">
                  2026 Roadmap
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FreeWorkshopReplayPage;
