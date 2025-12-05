import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';

const testimonials = [
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
  {
    quote: "",
    author: "",
    filled: false,
  },
];

const TestimonialsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const current = testimonials[currentIndex];

  return (
    <section className="py-12 px-4">
      <div className="w-[75%] mx-auto">
        <div className="relative volumetric-glass rounded-2xl px-16 py-8 flex items-center justify-center">
          {/* Left Arrow */}
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#FFDD40]/20 hover:bg-[#FFDD40]/40 transition-colors border border-[#FFDD40]/30"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5 text-[#FFDD40]" />
          </button>

          {/* Testimonial Content */}
          <div className="text-center flex items-center gap-4">
            <Quote className="w-8 h-8 text-[#FFDD40] opacity-60 flex-shrink-0" />
            {current.filled ? (
              <div className="flex items-center gap-3">
                <p className="text-lg md:text-xl text-foreground/90 italic">
                  "{current.quote}"
                </p>
                <span className="text-[#FFDD40] font-semibold whitespace-nowrap">
                  – {current.author}
                </span>
              </div>
            ) : (
              <p className="text-muted-foreground italic text-lg">
                Your success story could be here...
              </p>
            )}
          </div>

          {/* Right Arrow */}
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#FFDD40]/20 hover:bg-[#FFDD40]/40 transition-colors border border-[#FFDD40]/30"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5 text-[#FFDD40]" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-[#FFDD40]' : 'bg-foreground/30'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-6">
          <a
            href="https://www.skool.com/bi-fintech-consultant-academy/about"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="volumetric-glass-button px-6 py-3 text-base">
              See More Success Stories
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
