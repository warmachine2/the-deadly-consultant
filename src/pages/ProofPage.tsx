import { useEffect } from "react";
import { Link } from "react-router-dom";
import TopNav, { WORKSHOP_REGISTER_URL } from "@/components/TopNav";
import { User } from "lucide-react";

const TITLE = "Student Results | Zero to PM Consultant";
const DESC =
  "Gary went from real estate administration to $11k/mo after tax. Resume first. Recruiters reached out while he was still in the program.";

const chips = [
  "3 yrs real estate admin",
  "Resume first — not studying first",
  "Recruiters while still in the program",
  "$11k/mo after tax",
];

const shivaChips = [
  "Mid-program",
  "3 PM interviews",
  "$10k/mo opportunities",
];

const ProofPage = () => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = TITLE;
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute("content") ?? "";
    meta?.setAttribute("content", DESC);
    return () => {
      document.title = prevTitle;
      meta?.setAttribute("content", prevDesc);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-5xl mx-auto space-y-10">
          <header className="text-center space-y-3">
            <p className="text-xs uppercase tracking-widest text-white/70">Zero to PM Consultant · Proof</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white">Student Results</h1>
            <p className="text-white text-base md:text-lg max-w-2xl mx-auto">
              Professionals with 3+ years of experience. Same path: <span className="text-[#F4C903]">Data &amp; AI Orchestration PM</span> work, resume first, then the contracts.
            </p>
          </header>

          {/* Gary */}
          <section className="volumetric-glass rounded-2xl p-6 md:p-8 grid md:grid-cols-2 gap-8">
            <div>
              <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/h2uhvfn0PeI"
                  title="Gary — student result"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <p className="mt-2 text-xs text-white/60">Gary</p>
            </div>
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">Gary</h2>
                <p className="text-white/80">Real estate administration → junior PM path</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {chips.map((c) => (
                  <span key={c} className="text-xs text-white px-3 py-1 rounded-full border border-cyan-400/50 bg-white/5">
                    {c}
                  </span>
                ))}
              </div>
              <blockquote className="text-lg md:text-xl italic text-[#F4C903] border-l-2 border-[#FFE361] pl-4">
                “We didn’t start with studying. We remade my resume to how it would eventually look. Before I knew it, recruiters were reaching out - while I was still working through the program.”
              </blockquote>
              <ul className="text-sm text-white/80 space-y-1">
                <li>6 months in the accelerator, part-time</li>
                <li>PMP and PSM complete; CPMAI in progress</li>
                <li>Reverse learning: job skills, tools, and portfolio first; certifications after</li>
              </ul>
            </div>
          </section>

          {/* Shiva */}
          <section className="volumetric-glass rounded-2xl p-6 md:p-8 grid md:grid-cols-2 gap-8">
            <div>
              <div className="relative w-full max-w-sm mx-auto aspect-[9/16] rounded-xl overflow-hidden">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube-nocookie.com/embed/AkqEOSpEihs"
                  title="Shiva — student result"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <p className="mt-2 text-xs text-white/60">Shiva</p>
            </div>
            <div className="space-y-4 md:self-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">Shiva</h2>
                <p className="text-white/80">PM accelerator student → active interview pipeline</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {shivaChips.map((chip) => (
                  <span key={chip} className="text-xs text-white px-3 py-1 rounded-full border border-cyan-400/50 bg-white/5">
                    {chip}
                  </span>
                ))}
              </div>
              <blockquote className="text-lg md:text-xl italic text-[#F4C903] border-l-2 border-[#FFE361] pl-4">
                “Three $10k/mo PM interviews — while still mid-program.”
              </blockquote>
            </div>
          </section>

          {/* Empty slots */}
          <section className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center">More results coming</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[0].map((i) => (
                <div key={i} className="volumetric-glass rounded-2xl p-8 flex flex-col items-center justify-center gap-4 min-h-[220px] opacity-70">
                  <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
                    <User className="w-8 h-8 text-white/40" />
                  </div>
                  <p className="text-white/50">Next student — slot open</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="volumetric-glass rounded-2xl p-8 text-center space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold">If you have 3+ years of professional experience</h2>
            <a href={WORKSHOP_REGISTER_URL} target="_blank" rel="noopener noreferrer" className="inline-block">
              <button className="highlight-glow-button px-6 py-3 font-bold">Reserve My Free Workshop Spot</button>
            </a>
            <p className="text-sm text-white/80 max-w-xl mx-auto">
              How experienced professionals land $10k–$18k/mo Data &amp; AI Orchestration PM contracts. Includes the 90-day roadmap when you register.
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <Link to="/are-you-ready-to-pivot-to-pm-consulting" className="text-cyan-400 hover:underline">
                Take the PM Consulting Readiness Quiz →
              </Link>
              <Link to="/ai-bi-fintech-pm-job-alerts-repo" className="text-white/70 hover:underline">
                Browse open contracts →
              </Link>
            </div>
          </section>

          <p className="text-xs text-white/50 text-center pb-8">
            One student’s result. Your outcome depends on experience, market, and work inside the program.
          </p>
        </div>
      </main>
    </div>
  );
};

export default ProofPage;
