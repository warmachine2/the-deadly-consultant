import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import fallbackProofThumb from "@/assets/proof-tile.png";

const ProofTile = ({ className }: { className?: string }) => {
  const teaser = {
    title: "Student Results — Real Pivots, Real Contracts",
    excerpt:
      "Gary went from real estate administration to $11k/mo after tax. Resume first — not studying first. Recruiters reached out while he was still in the program.",
  };

  return (
    <Link to="/proof" className="block">
      <article className={`volumetric-glass rounded-2xl overflow-hidden hover-lift cursor-pointer group col-span-full md:col-span-1 ${className || ""}`}>
        <div className="relative h-48 overflow-hidden">
          <img
            src={fallbackProofThumb}
            alt={teaser.title}
            className="w-full h-full object-cover transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>

        <div className="p-5">
          <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
            {teaser.title}
          </h3>

          <p className="text-sm mb-6 line-clamp-3 text-white">
            {teaser.excerpt}
          </p>

          <span className="w-full flex items-center justify-center gap-2 bg-[#F4C903] text-black px-6 py-3 rounded-xl font-bold text-sm shadow-lg">
            See Student Results
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </article>
    </Link>
  );
};

export default ProofTile;
