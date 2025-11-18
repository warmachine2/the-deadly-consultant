export default function App() {
  return (
    <>
      {/* Hero – mobile-first, no giant height */}
      <section className="relative bg-gradient-to-br from-blue-950 via-purple-900 to-blue-900 px-4 pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="text-4xl font-black text-white sm:text-5xl md:text-6xl leading-tight">
            Full Stack Training
            <br className="sm:hidden" /> to Become a<br />
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              10k/mo+ BI-
              <br className="sm:hidden" />
              FinTech PM Consultant
            </span>
          </h1>
          <p className="mt-6 text-lg text-gray-200 md:text-xl">
            Explore career paths, essential tools, and inspiring success stories
          </p>
        </div>
      </section>

      {/* Content Tiles / Roadmap Card – starts immediately after hero */}
      <section className="bg-gray-50 px-4 py-12 md:py-20 -mt-8 md:-mt-12">
        {" "}
        {/* negative margin pulls it up slightly for seamless feel */}
        <div className="mx-auto max-w-5xl space-y-12">
          {/* Your roadmap unlock card */}
          <div className="rounded-3xl bg-gradient-to-b from-blue-600 to-purple-700 p-8 text-white text-center shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold">2026 BI-FinTech Consulting Roadmap</h2>
            <p className="mt-4 text-lg opacity-90">Unlock Your $10k/mo Pivot Walkthrough: Your AI-proof blueprint</p>
            <button className="mt-8 rounded-full bg-red-600 px-10 py-5 text-xl font-bold hover:bg-red-700 transition">
              Unlock Full Roadmap →
            </button>
          </div>

          {/* Porsche + warning card */}
          <div className="rounded-3xl overflow-hidden bg-black text-white">
            <img src="/porsche-image.jpg" alt="Success" className="w-full" />{" "}
            {/* replace with your actual image path */}
            <div className="p-8 text-center">
              <h3 className="text-2xl md:text-3xl font-bold">WARNING: Don't Pivot Careers in the AI Era Without...</h3>
              <p className="mt-4 text-lg">Imagine This You're an engineer, programmer, or seasoned pro, grinding...</p>
            </div>
          </div>

          {/* Add more tiles the same way – they will stack beautifully on mobile */}
        </div>
      </section>
    </>
  );
}
