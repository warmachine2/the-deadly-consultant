import { useState } from "react";
import EmailCaptureModal from "./EmailCaptureModal";

interface SignupButtonProps {
  className?: string;
  label?: string;
}

const SignupButton = ({ className = "", label = "Subscribe" }: SignupButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`relative inline-flex items-center justify-center whitespace-nowrap transition-all duration-300 ease-in-out cursor-pointer rounded-xl volumetric-glass-button border-2 border-[#F4C903] hover:shadow-[0_0_25px_rgba(244,201,3,0.4)] ${className}`}
      >
        <span className="relative z-10 font-semibold">{label}</span>
      </button>

      <EmailCaptureModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default SignupButton;
