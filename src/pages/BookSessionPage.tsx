import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import TopNav from "@/components/TopNav";

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address").max(255),
  current_role: z.string().min(1, "Current role is required").max(200),
  years_experience: z.coerce.number().min(0, "Must be 0 or greater"),
  education_certifications: z.string().max(1000).optional(),
  biggest_pain_point: z.string().min(1, "This field is required").max(1000),
  pivot_timeline: z.string().max(200).optional(),
  whatsapp_number: z.string().max(20).optional(),
});

type FormData = z.infer<typeof formSchema>;

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxIYg4H3bPtonZVSMxp-5xCKOfaFCWt4VlOjgXoUZjtuiaXcr8dLcX0UUGsp3YIAPgz/exec";

const BookSessionPage = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      current_role: "",
      years_experience: 0,
      education_certifications: "",
      biggest_pain_point: "",
      pivot_timeline: "",
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
      const params = new URLSearchParams();
      Object.entries(data).forEach(([key, value]) => {
        params.append(key, String(value ?? ""));
      });

      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
        mode: "no-cors",
      });

      // With no-cors mode, we can't read the response, so we assume success
      if (data.years_experience >= 3) {
        toast({
          title: "Qualified!",
          description: "Redirecting you to book your strategy session...",
        });
        setTimeout(() => {
          window.location.href = "https://calendly.com/hassankhalidkhan/30min";
        }, 1500);
      } else {
        toast({
          title: "Thanks!",
          description: "I'll review your submission and get back to you.",
        });
        form.reset();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-2xl mx-auto">
          <div className="volumetric-glass rounded-2xl p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">
              Quick Qualifier: Unlock Your Free Strategy Session
            </h1>
            <p className="text-muted-foreground text-center mb-8">
              Tell me about your grind—I'll vet if you're a fit for the AI-Proof Pivot (spots limited).
            </p>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your full name"
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
                      <FormLabel>Email *</FormLabel>
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
                  name="current_role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What's your current role? *</FormLabel>
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
                      <FormLabel>Years of Experience *</FormLabel>
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
                  name="education_certifications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Education & Certifications (optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., BS Computer Science, PMP, AWS Certified..."
                          className="bg-input border-border min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="biggest_pain_point"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What's your #1 challenge right now? *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your biggest pain point..."
                          className="bg-input border-border min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pivot_timeline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>When do you want to land your first $10k+/mo contract? (optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Next 90 days, 6 months"
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
                      <FormLabel>WhatsApp Number (optional)</FormLabel>
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
                  className="w-full volumetric-glass-button text-foreground font-semibold py-6 text-lg"
                >
                  {isSubmitting ? "Submitting..." : "Submit & See If You Qualify"}
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
