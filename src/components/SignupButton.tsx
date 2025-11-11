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
        className={`relative inline-flex items-center justify-center whitespace-nowrap transition-all duration-300 ease-in-out cursor-pointer rounded-xl bg-background/10 backdrop-blur-md text-foreground border-2 border-accent/50 hover:border-accent hover:shadow-[0_0_25px_hsl(var(--accent)/0.6)] hover:bg-background/20 ${className}`}
      >
        <span className="relative z-10">Sign Up</span>
      </button>

      <EmailCaptureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSubmit} />
    </>
  );
};

export default SignupButton;
