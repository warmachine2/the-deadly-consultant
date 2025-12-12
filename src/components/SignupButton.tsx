interface SignupButtonProps {
  formId?: string;
  fallbackHref?: string;
  className?: string;
  label?: string;
}

const SignupButton = ({ formId = "fbd8fa5d1b", fallbackHref, className = "", label = "Sign Up" }: SignupButtonProps) => {
  const handleClick = () => {
    // Trigger Kit popup directly
    if ((window as any).formkit?.show) {
      (window as any).formkit.show(formId);
    } else if (fallbackHref) {
      window.open(fallbackHref, "_blank");
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`relative inline-flex items-center justify-center whitespace-nowrap transition-all duration-300 ease-in-out cursor-pointer rounded-xl volumetric-glass-button border-2 border-[#F4C903] hover:shadow-[0_0_25px_rgba(244,201,3,0.4)] ${className}`}
    >
      <span className="relative z-10 font-semibold">{label}</span>
    </button>
  );
};

export default SignupButton;
