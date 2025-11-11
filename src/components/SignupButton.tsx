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
      className="relative inline-flex items-center justify-center px-8 py-3 font-bold text-lg whitespace-nowrap transition-all duration-300 ease-in-out hover:scale-105 hover:animate-glow-pulse active:scale-95 cursor-pointer overflow-hidden group"
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
    </a>
  );
};

export default SignupButton;