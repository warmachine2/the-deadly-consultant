import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import TopNav from "@/components/TopNav";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  role_current: z.string().trim().min(1, "Current role is required").max(200),
  years_experience: z.coerce.number().min(0, "Must be 0 or greater").max(100),
  whatsapp_number: z.string().trim().max(20).optional(),
});

type FormData = z.infer<typeof formSchema>;

const BookSessionPage = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      role_current: "",
      years_experience: 0,
      whatsapp_number: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    toast({
      title: "Submitting...",
      description: "Please wait while we process your request.",
    });

    try {
      // Insert into Supabase strategy_sessions table (protected by RLS)
      const { error } = await supabase.from("strategy_sessions").insert({
        name: data.name,
        email: data.email,
        role_current: data.role_current,
        years_experience: data.years_experience,
        biggest_pain_point: "N/A", // Required by DB but removed from form
        whatsapp_number: data.whatsapp_number || null,
      });

      if (error) {
        throw error;
      }

      // Check years experience for qualification
      const yearsExp = data.years_experience;

      if (yearsExp >= 3) {
        toast({
          title: "Qualified!",
          description: "Redirecting you to book your strategy session...",
        });
        // Redirect immediately after a short delay for toast visibility
        window.location.href = "https://calendly.com/hassan-hammer/30min";
      } else {
        toast({
          title: "Thanks!",
          description: "I'll review your info and follow up if it's a strong fit.",
        });
        form.reset();
        setIsSubmitting(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-2xl mx-auto">

          <div className="volumetric-glass rounded-2xl p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center" style={{ color: '#FFE361' }}>
              Book Free Pivot Strategy Session
            </h1>
            <p className="text-muted-foreground text-center mb-8">
              Share your grind - I'll personally vet if you're ready for the AI-Proof PM Pivot (limited spots; my $15k/mo system got me ocean-side Focus Zone freedom)
            </p>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-base font-medium mb-1">First Name (required)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="First Name"
                          className="bg-input border-border"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-base font-medium mb-1">Email Address (required)</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          className="bg-input border-border"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role_current"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-base font-medium mb-1">Current Role (e.g., Engineer, PM, Developer)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Software Engineer, Tactical PM, Business Analyst"
                          className="bg-input border-border"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="years_experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-base font-medium mb-1">Years of Professional Experience *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          placeholder="0"
                          className="bg-input border-border"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />


                <FormField
                  control={form.control}
                  name="whatsapp_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-base font-medium mb-1">WhatsApp Number (Enables Group Access)</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="+1234567890"
                          className="bg-input border-border"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full font-semibold py-6 text-lg text-white desktop-hover-scale-105 transition-transform"
                  style={{
                    background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                    boxShadow: '0 0 20px rgba(220, 38, 38, 0.5), 0 0 40px rgba(220, 38, 38, 0.3)',
                  }}
                >
                  {isSubmitting ? "Submitting..." : "Book Free 30-Min Pivot Strategy Session"}
                </Button>
              </form>
            </Form>
          </div>

        </div>
      </main>
    </div>
  );
};

export default BookSessionPage;
