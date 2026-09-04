import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "The strategy session with Hassan was a game-changer – he delivered an ultra-actionable AI-Proof 90-day roadmap that's fast-tracking my pivot to $10k/mo+ Data & AI Orchestration PM consulting. Invaluable insights on CPMAI trifecta and $60k tools. Following it now!",
    author: "Jeffrey Osarfo",
    filled: true,
  },
  {
    quote: "Hassan's systems landed me $12k/mo gig",
    author: "Pilot Student",
    filled: true,
  },
  {
    quote: "",
    author: "",
    filled: false,
  },
];

const TestimonialsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Manual navigation only - no auto-rotation

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const current = testimonials[currentIndex];

  return (
    <div className="mb-6">
      <div className="flex flex-col items-center">
        {/* Quote and Content - Fixed height container */}
        <div className="text-center px-2 min-h-[80px] flex flex-col justify-center">
          <Quote className="w-5 h-5 text-[#FFDD40] opacity-60 mx-auto mb-2" />
          {current.filled ? (
            <>
              <p className="text-sm text-foreground/90 italic leading-snug mb-1">
                "{current.quote}"
              </p>
              <span className="text-[#FFDD40] font-semibold text-xs">
                – {current.author}
              </span>
            </>
          ) : (
            <p className="text-muted-foreground italic text-sm">
              Your story here...
            </p>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-3 mt-3">
          <button
            onClick={goToPrev}
            className="p-0.5 hover:opacity-70 transition-opacity"
            aria-label="Previous"
          >
            <ChevronLeft className="w-4 h-4 text-[#FFDD40]" />
          </button>

          <div className="flex gap-1.5">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-[#FFDD40]' : 'bg-foreground/30'
                }`}
                aria-label={`Testimonial ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={goToNext}
            className="p-0.5 hover:opacity-70 transition-opacity"
            aria-label="Next"
          >
            <ChevronRight className="w-4 h-4 text-[#FFDD40]" />
          </button>
        </div>

        {/* CTA Link */}
        <a
          href="https://www.skool.com/bi-fintech-consultant-academy/about"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 text-[#FFDD40] text-xs hover:underline transition-all"
        >
          See More Success Stories →
        </a>
      </div>
    </div>
  );
};

export default TestimonialsCarousel;
