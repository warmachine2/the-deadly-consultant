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
      className="relative px-4 py-2 md:px-6 md:py-2.5 rounded-xl font-semibold text-sm md:text-base whitespace-nowrap transition-all hover-glow group"
      style={{
        background: "linear-gradient(135deg, rgba(4, 195, 252, 0.1) 0%, rgba(8, 145, 212, 0.1) 100%)",
        border: "2px solid transparent",
        backgroundImage: "linear-gradient(hsl(var(--background)), hsl(var(--background))), linear-gradient(135deg, #04c3fc 0%, #0891d4 100%)",
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box, border-box",
        boxShadow: "0 0 15px rgba(4, 195, 252, 0.3)",
      }}
    >
      <span
        className="relative z-10"
        style={{
          background: "linear-gradient(135deg, #04c3fc 0%, #ffffff 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {children}
      </span>
    </a>
  );
};

export default SignupButton;
