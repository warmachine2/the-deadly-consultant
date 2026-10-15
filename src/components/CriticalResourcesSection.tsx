import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface CriticalVideo {
  title: string;
  embedSrc: string;
  articleHref?: string;
}

const CRITICAL_VIDEOS: CriticalVideo[] = [
  {
    title:
      "From $3,500/Month to $18,000/Month: My FinTech Data & AI PM Consultant Story",
    embedSrc: "https://www.youtube.com/embed/9Kxmo-5ND98",
    articleHref: "/my-18k-mo-fintech-data-ai-pm-consultant-story",
  },
  {
    title:
      "I Train 3+ Year Pros Into $10k/mo Data & AI PM Consultants (Full Walkthrough)",
    embedSrc: "https://www.youtube.com/embed/RALM8vDXrk4",
    articleHref:
      "/i-train-3-year-pros-into-10k-mo-data-ai-pm-consultants-full-walkthrough",
  },
  {
    title: "PM Consulting Secrets - How to make $10k/mo+",
    embedSrc: "https://www.youtube.com/embed/rJnACxKL0Tk",
  },
];

const CriticalResourcesSection = () => {
  return (
    <section className="volumetric-glass rounded-2xl p-6 md:p-8">
      <h2
        className="text-2xl md:text-3xl font-bold text-center mb-2"
        style={{ color: "#FFE361" }}
      >
        Critical Resources - Please watch
      </h2>
      <p className="text-sm md:text-base text-white/80 text-center max-w-2xl mx-auto mb-6">
        Watch these before your next step — they show exactly how the pivot happens.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        {CRITICAL_VIDEOS.map((video, index) => (
          <article
            key={video.embedSrc}
            className={
              index === 2
                ? "flex flex-col gap-3 md:col-span-2 md:max-w-md md:mx-auto md:w-full"
                : "flex flex-col gap-3"
            }
          >
            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10">
              <iframe
                className="absolute inset-0 w-full h-full"
                src={video.embedSrc}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <h3 className="text-base md:text-lg font-semibold leading-snug text-white">
              {video.title}
            </h3>
            {video.articleHref && (
              <Link
                to={video.articleHref}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#F4C903] hover:text-white transition-colors"
              >
                Read the full article
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </article>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          to="/proof"
          className="highlight-glow-button inline-flex items-center justify-center gap-2 px-6 py-3.5 font-bold text-white text-base md:text-lg tracking-wide shadow-none"
        >
          View Student Results &amp; Proof
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
};

export default CriticalResourcesSection;
