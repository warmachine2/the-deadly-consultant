import { useState } from "react";
import EmailCaptureModal from "./EmailCaptureModal";
import { toast } from "@/hooks/use-toast";

interface SignupButtonProps {
  formId?: string;
  fallbackHref?: string;
  className?: string;
  label?: string;
}

const SignupButton = ({ formId, fallbackHref, className = "", label = "Sign Up" }: SignupButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (data: { name: string; email: string }) => {
    console.log("Form submitted:", data);

    // Close modal
    setIsModalOpen(false);

    // Show success message
    toast({
      title: "Success!",
      description: "Thank you for signing up. Check your email for confirmation.",
    });

    // If formId is provided, trigger Kit popup
    if (formId && (window as any).formkit?.show) {
      (window as any).formkit.show(formId);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`relative inline-flex items-center justify-center whitespace-nowrap transition-all duration-300 ease-in-out cursor-pointer rounded-xl volumetric-glass-button border-2 border-[#F4C903] hover:shadow-[0_0_25px_rgba(244,201,3,0.4)] ${className}`}
      >
        <span className="relative z-10 font-semibold">{label}</span>
      </button>

      <EmailCaptureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSubmit} />
    </>
  );
};

export default SignupButton;
