import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface EmailCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmailCaptureModal = ({ isOpen, onClose }: EmailCaptureModalProps) => {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [mounted, setMounted] = useState(false);

  // Ensure we're mounted before using portal
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      style={{
        zIndex: 99999,
        background: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <div
        className="volumetric-glass relative max-w-md w-full animate-in fade-in zoom-in duration-200 rounded-2xl p-8"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "rgba(40, 40, 40, 0.65)",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors z-10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal content */}
        <div className="text-center mb-8 relative z-10">
          {/* Logo */}
          <img 
            src="/favicon.ico" 
            alt="The Deadly Consultant Logo" 
            className="mx-auto mb-4 w-16 h-16 opacity-90" 
          />
          {/* Slogan */}
          <h2 className="text-2xl font-bold text-white tracking-wide">
            The Deadly Consultant
          </h2>
        </div>

        <div className="space-y-4 relative z-10">
          {/* Name input */}
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-3.5 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all bg-white/5 border border-white/10"
            style={{
              boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.2)",
            }}
            aria-label="Name"
          />

          {/* Email input */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-3.5 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all bg-white/5 border border-white/10"
            style={{
              boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.2)",
            }}
            aria-label="Email"
          />

          {/* Submit button */}
          <button
            type="button"
            className="w-full py-3.5 rounded-xl font-semibold text-white transition-all hover:scale-[1.02] volumetric-glass-button"
          >
            <span className="relative z-10">Subscribe</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Render modal to document.body using portal
  return createPortal(modalContent, document.body);
};

export default EmailCaptureModal;
