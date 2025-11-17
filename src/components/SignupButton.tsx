import { useState } from "react";
import EmailCaptureModal from "./EmailCaptureModal";
import { toast } from "@/hooks/use-toast";

interface SignupButtonProps {
  formId?: string;
  fallbackHref?: string;
  className?: string;
}

const SignupButton = ({ formId, fallbackHref, className = "" }: SignupButtonProps) => {
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

    // If formId is provided, trigger FormKit popup
    if (formId && window.formkit?.show) {
      window.formkit.show(formId);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`relative inline-flex items-center justify-center whitespace-nowrap transition-all duration-300 ease-in-out cursor-pointer rounded-xl volumetric-glass-button text-white border-2 border-white/20 hover:border-blue-400/50 hover:shadow-[0_0_25px_rgba(59,130,246,0.4)] ${className}`}
      >
        <span className="relative z-10 font-semibold">Sign Up</span>
      </button>

      <EmailCaptureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSubmit} />
    </>
  );
};

export default SignupButton;
