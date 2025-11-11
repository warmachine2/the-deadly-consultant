import { useState } from "react";
import EmailCaptureModal from "./EmailCaptureModal";
import { toast } from "@/hooks/use-toast";

interface SignupButtonProps {
  formId?: string;
  fallbackHref?: string;
}

const SignupButton = ({ formId, fallbackHref }: SignupButtonProps) => {
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
        className="relative inline-flex items-center justify-center px-4 py-2 md:px-6 md:py-2.5 font-semibold text-sm md:text-base whitespace-nowrap transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 cursor-pointer overflow-hidden group rounded-xl bg-accent text-accent-foreground border-2 border-border hover:animate-glow-pulse hover:shadow-[0_0_30px_hsla(0,0%,100%,0.4)]"
      >
        <span className="relative z-10">Sign Up</span>
      </button>

      <EmailCaptureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default SignupButton;
