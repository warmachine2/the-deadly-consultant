import React from "react";

interface SignupButtonProps {
  onClick?: () => void;
  formId?: string;
  fallbackHref?: string;
  children?: React.ReactNode;
}

const SignupButton: React.FC<SignupButtonProps> = ({
  onClick,
  formId = "fbd8fa5d1b",
  fallbackHref = "https://bifintechconsulting.com/roadmap-signup",
  children = "Get Your Free Case Study Now",
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) {
      onClick();
    } else if (typeof window !== "undefined") {
      const w = window as any;
      if (w.formkit && typeof w.formkit.show === "function") {
        w.formkit.show(formId);
      } else {
        window.location.href = fallbackHref;
      }
    }
  };

  return (
    <a
      data-formkit-toggle={formId}
      href={fallbackHref}
      onClick={handleClick}
      className="inline-block relative bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-500 ease-in-out hover:scale-105 shadow-lg hover:shadow-xl active:scale-95 cursor-pointer transform overflow-hidden group"
      style={{
        // Gradient outline via pseudo-element (Tailwind + inline for precision)
        border: "2px solid transparent",
        backgroundClip: "padding-box",
      }}
    >
      {/* Gradient border pseudo */}
      <div
        className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500 via-red-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ zIndex: -1 }}
      />
      <span className="relative z-10">{children}</span>

      {/* Glow on hover */}
      <style jsx>{`
        a:hover {
          box-shadow: 0 0 20px rgba(220, 38, 38, 0.6), 0 0 40px rgba(220, 38, 38, 0.3);
          animation: glow-pulse 1s ease-in-out infinite alternate;
        }
        @keyframes glow-pulse {
          from { box-shadow: 0 0 20px rgba(220, 38, 38, 0.6), 0 0 40px rgba(220, 38, 38, 0.3); }
          to { box-shadow: 0 0 30px rgba(220, 38, 38, 0.8), 0 0 50px rgba(220, 38, 38, 0.5); }
        }
      `}</style>
    </a>
  );
};

export default SignupButton;
