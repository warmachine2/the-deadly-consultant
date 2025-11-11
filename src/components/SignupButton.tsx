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
      className="relative inline-flex items-center justify-center px-8 py-3 font-bold text-lg whitespace-nowrap transition-all duration-500 ease-in-out hover:scale-105 active:scale-95 cursor-pointer overflow-hidden group"
      style={{
        // Glassmorphism: Dark semi-transparent bg with frost blur
        background: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(20px) saturate(180%)", // Frosted glass effect
        border: "2px solid transparent",
        backgroundClip: "padding-box",
        borderRadius: "16px", // Rounded like photo
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.37)", // Inner depth
        color: "#FFFFFF", // White text
      }}
    >
      {/* Gradient stroke/outline: Purple-to-pink border (fades in on hover) */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-purple-500 via-purple-600 to-pink-500 opacity-0 group-hover:opacity-100 transition-all duration-500"
        style={{
          zIndex: -1,
          borderRadius: "16px",
          border: "2px solid transparent",
          backgroundClip: "border-box",
        }}
      />

      {/* Text layer (white bold, on top) */}
      <span className="relative z-10">{children}</span>

      {/* Glowing effect: Pulsing purple-pink glow on hover (video-style bloom) */}
      <style jsx>{`
        a:hover {
          box-shadow: 
            0 0 20px rgba(139, 92, 246, 0.6), 
            0 0 40px rgba(236, 72, 153, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.2); /* Inner light for glass shine */
          animation: glow-bloom 1.5s ease-in-out infinite alternate;
        }
        @keyframes glow-bloom {
          from { 
            box-shadow: 
              0 0 20px rgba(139, 92, 246, 0.6), 
              0 0 40px rgba(236, 72, 153, 0.4),
              inset 0 1px 0 rgba(255, 255, 255, 0.2);
          }
          to { 
            box-shadow: 
              0 0 30px rgba(139, 92, 246, 0.8), 
              0 0 60px rgba(236, 72, 153, 0.6),
              inset 0 1px 0 rgba(255, 255, 255, 0.3);
          }
        }
      `}</style>
    </a>
  );
};

export default SignupButton;
