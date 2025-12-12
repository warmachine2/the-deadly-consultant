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
        className="relative max-w-md w-full animate-in fade-in zoom-in duration-200 rounded-2xl p-8"
        style={{
          background: "linear-gradient(145deg, rgba(60, 60, 60, 0.4), rgba(30, 30, 30, 0.6))",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: `
            0 8px 32px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            inset 0 -1px 0 rgba(0, 0, 0, 0.2)
          `,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal content */}
        <div className="text-center mb-8">
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

        <div className="space-y-4">
          {/* Name input */}
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-3.5 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
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
            className="w-full p-3.5 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.2)",
            }}
            aria-label="Email"
          />

          {/* Submit button */}
          <button
            type="button"
            className="w-full py-3.5 rounded-xl font-semibold text-white transition-all hover:scale-[1.02]"
            style={{
              background: "linear-gradient(145deg, rgba(80, 80, 80, 0.6), rgba(40, 40, 40, 0.8))",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              boxShadow: `
                0 4px 15px rgba(0, 0, 0, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.1)
              `,
            }}
          >
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );

  // Render modal to document.body using portal
  return createPortal(modalContent, document.body);
};

export default EmailCaptureModal;
