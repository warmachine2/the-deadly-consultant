import { ReactNode } from "react";

interface SignupButtonProps {
  formId: string;
  fallbackHref: string;
  children: ReactNode;
}

const SignupButton = ({ formId, fallbackHref, children }: SignupButtonProps) => {
  return (
    <a
      data-formkit-toggle={formId}
      href={fallbackHref}
      className="relative inline-flex items-center justify-center px-8 py-3 font-bold text-lg whitespace-nowrap transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 cursor-pointer overflow-hidden group"
      style={{
        // Glassmorphism: Semi-transparent dark bg with blur
        background: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(10px)",
        border: "2px solid transparent",
        backgroundClip: "padding-box",
        borderRadius: "12px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)", // Subtle outer shadow for depth
      }}
    >
      {/* Gradient stroke/outline via pseudo-element (purple to magenta, like photo) */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-purple-500 via-purple-600 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ 
          zIndex: -1, 
          borderRadius: "12px",
          border: "2px solid transparent",
          backgroundClip: "border-box",
        }}
      />
      
      {/* Text layer (white, bold, on top) */}
      <span className="relative z-10 text-white">{children}</span>
      
      {/* Hover glow effect (matching gradient colors) */}
      <style jsx>{`
        a:hover {
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.6), 0 0 40px rgba(236, 72, 153, 0.3);
          animation: glow-pulse 1s ease-in-out infinite alternate;
        }
        @keyframes glow-pulse {
          from { box-shadow: 0 0 20px rgba(139, 92, 246, 0.6), 0 0 40px rgba(236, 72, 153, 0.3); }
          to { box-shadow: 0 0 30px rgba(139, 92, 246, 0.8), 0 0 50px rgba(236, 72, 153, 0.5); }
        }
      `}</style>
    </a>
  );
};

export default SignupButton;