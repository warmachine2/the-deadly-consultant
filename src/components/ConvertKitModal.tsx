import { useEffect, useState, useCallback, useRef } from "react";
import { X } from "lucide-react";

const STORAGE_KEY = "convertkit_modal_shown";
const TRIGGER_DELAY = 20000; // 20 seconds

export default function ConvertKitModal() {
  const [isOpen, setIsOpen] = useState(false);
  const formContainerRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    sessionStorage.setItem(STORAGE_KEY, "true");
  }, []);

  // Load ConvertKit script when modal opens
  useEffect(() => {
    if (isOpen && formContainerRef.current && !scriptLoaded.current) {
      scriptLoaded.current = true;
      const script = document.createElement("script");
      script.async = true;
      script.setAttribute("data-uid", "9f6802bbd1");
      script.src = "https://bi-fintech-consultant-academy.kit.com/9f6802bbd1/index.js";
      formContainerRef.current.appendChild(script);
    }
  }, [isOpen]);

  useEffect(() => {
    // Don't show if already shown this session
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    // Auto-trigger after 20 seconds
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, TRIGGER_DELAY);

    // Mobile exit-intent: detect scroll up toward top (intent to leave)
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // If user scrolls up quickly near the top, show modal
      if (currentScrollY < 100 && lastScrollY - currentScrollY > 50) {
        if (!sessionStorage.getItem(STORAGE_KEY)) {
          setIsOpen(true);
          clearTimeout(timer);
        }
      }
      lastScrollY = currentScrollY;
    };

    // Desktop exit-intent: mouse leaving viewport at top
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !sessionStorage.getItem(STORAGE_KEY)) {
        setIsOpen(true);
        clearTimeout(timer);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Close on escape key and manage body scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeModal]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeModal}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg animate-scale-in">
        {/* Close button */}
        <button
          onClick={closeModal}
          className="absolute -top-3 -right-3 z-20 p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-100 text-gray-800 transition-colors shadow-lg"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ConvertKit Form Container - let ConvertKit handle styling */}
        <div 
          ref={formContainerRef}
          className="min-h-[100px]"
        />
      </div>
    </div>
  );
}
