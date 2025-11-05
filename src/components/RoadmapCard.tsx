import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom"; // For button link

const RoadmapCard = () => {
  // Teaser data (half-content: title + short excerpt from your roadmap page)
  const teaser = {
    title: "2026 BI-FinTech Roadmap – Unlock Your $10k/mo Pivot",
    excerpt: "Stuck grinding $3k-$4k/mo despite your engineering skills? AI’s eating jobs—pivot to BI-FinTech PM roles for $17k/mo+ remote freedom. Get the cracked blueprint: mindset, hybrid PM, vendor-grade tools, and certs (PMP, PSM, AZ305).",
    image: "https://your-placeholder-image-url.com/roadmap-hero.jpg", // Replace with actual (e.g., Porsche or roadmap graphic)
  };

  return (
    <article className="glass rounded-2xl overflow-hidden hover-lift cursor-pointer group col-span-full md:col-span-1"> {/* Full-width on mobile, fits grid */}
      {/* Image */}
      {teaser.image ? (
        <div className="relative h-48 overflow-hidden">
          <img
            src={teaser.image}
            alt={teaser.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
          <span className="text-4xl">🚀</span> {/* Roadmap emoji fallback */}
        </div>
      )}

      {/* Content (Teaser Only – ~half the full page) */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-1 group-hover:text-accent transition-colors">
          {teaser.title}
        </h3>
        
        <p className="text-muted-foreground text-sm mb-6 line-clamp-3"> {/* Shorter clamp for teaser feel */}
          {teaser.excerpt}
        </p>

        {/* CTA Button: Enticing link to full page */}
        <Link
          to="/2026-bi-fintech-consulting-roadmap-pdf-unlock"
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground px-6 py-3 rounded-xl font-semibold text-sm transition-all group-hover:scale-105 hover:shadow-glow-pulse"
        >
          Unlock Full Roadmap
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </article>
  );
};

export default RoadmapCard;
