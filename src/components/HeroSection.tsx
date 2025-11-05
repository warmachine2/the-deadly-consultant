import { Search } from "lucide-react";

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const HeroSection = ({ searchQuery, onSearchChange }: HeroSectionProps) => {
  return (
    <section className="glass-strong rounded-3xl p-8 md:p-12 mb-8 hover-lift">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 animate-fade-in">
          Full Stack Training to Become a 10k/mo+ BI-FinTech PM Consultant
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-6">
          Explore career paths, essential tools, and inspiring success stories
        </p>
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 glass rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 placeholder:text-muted-foreground"
          />
        </div>
      </div>
    </section>
  );
};
export default HeroSection;