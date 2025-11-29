import TopNav from "@/components/TopNav";
import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <>
      <TopNav />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="volumetric-glass rounded-2xl p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
              About <span style={{ color: "#F4C903" }}>The Deadly Consultant</span>
            </h1>
            
            <div className="space-y-6 text-white/80 text-base md:text-lg leading-relaxed">
              <p>
                Welcome to The Deadly Consultant — your go-to resource for AI-proof BI and FinTech consulting strategies.
              </p>
              
              <p>
                Founded by <span className="text-white font-semibold">Hassan Khan B.Eng., PMP, AZ305</span>, this platform is dedicated to helping consultants thrive in an evolving industry landscape.
              </p>
              
              <p>
                With years of experience in business intelligence and financial technology consulting, we provide actionable insights, roadmaps, and strategies to help you build a sustainable consulting practice.
              </p>
              
              <div className="pt-6">
                <Link to="/">
                  <button className="px-6 py-3 rounded-xl font-semibold text-white volumetric-glass-button hover:text-[#F4C903] transition-all duration-300">
                    ← Back to Home
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
