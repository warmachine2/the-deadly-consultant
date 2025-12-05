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
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          What Our Students Say
        </h2>
        
        <div className="relative volumetric-glass rounded-2xl p-8 md:p-12 min-h-[200px] flex flex-col items-center justify-center">
          {/* Quote Icon */}
          <Quote className="w-12 h-12 text-[hsl(var(--accent))] opacity-50 mb-6" />
          
          {/* Testimonial Content */}
          <div className="text-center">
            {current.filled ? (
              <>
                <p className="text-xl md:text-2xl text-foreground/90 italic mb-6">
                  "{current.quote}"
                </p>
                <p className="text-[hsl(var(--accent))] font-semibold">
                  – {current.author}
                </p>
              </>
            ) : (
              <p className="text-muted-foreground italic">
                Your success story could be here...
              </p>
            )}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrev}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/20 hover:bg-background/40 transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/20 hover:bg-background/40 transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6 text-foreground" />
          </button>

          {/* Dots Indicator */}
          <div className="flex gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-[hsl(var(--accent))]' : 'bg-foreground/30'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-8">
          <a
            href="https://www.skool.com/bi-fintech-consultant-academy/about"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="volumetric-glass-button text-lg px-8 py-6">
              See More Success Stories
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
