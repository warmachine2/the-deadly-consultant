import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
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

const formSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  role_current: z.string().trim().min(1, "Current role is required").max(200),
  years_experience: z.coerce.number().int().min(0, "Must be 0 or greater"),
  education_certifications: z.string().trim().max(1000).optional().or(z.literal("")),
  biggest_pain_point: z.string().trim().min(1, "Please share your #1 challenge").max(2000),
  pivot_timeline: z.string().trim().max(200).optional().or(z.literal("")),
  whatsapp_number: z.string().trim().max(20).optional().or(z.literal("")),
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
      const { error } = await supabase.from("strategy_sessions").insert({
        name: data.name,
        email: data.email,
        role_current: data.role_current,
        years_experience: data.years_experience,
        education_certifications: data.education_certifications || null,
        biggest_pain_point: data.biggest_pain_point,
        pivot_timeline: data.pivot_timeline || null,
        whatsapp_number: data.whatsapp_number || null,
      });

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already submitted",
            description: "You've already submitted—thanks for your interest!",
            variant: "default",
          });
        } else {
          throw error;
        }
        return;
      }

      if (data.years_experience >= 3) {
        toast({
          title: "Qualified! 🎉",
          description: "Redirecting you to book your strategy session...",
        });
        setTimeout(() => {
          window.location.href = "https://calendly.com/hassankhalidkhan/30min";
        }, 1500);
      } else {
        toast({
          title: "Thanks!",
          description: "I'll review your info and follow up if it's a strong fit.",
        });
        form.reset();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Quick Qualifier: Unlock Your Free Strategy Session
          </h1>
          <p className="text-lg text-muted-foreground">
            Tell me about your grind—I'll vet if you're a fit for the AI-Proof Pivot (spots limited).
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Your full name" {...field} />
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
                    <Input type="email" placeholder="you@example.com" {...field} />
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
                  <FormLabel>What's your current role? *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Software Engineer, Tactical PM, Business Analyst" {...field} />
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
                    <Input type="number" min={0} placeholder="0" {...field} />
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
                  <FormLabel>Education & Certifications</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="List any relevant degrees, certifications, or courses..."
                      className="min-h-[80px]"
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
                      placeholder="Be specific—what's keeping you stuck or stressed?"
                      className="min-h-[100px]"
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
                  <FormLabel>When do you want to land your first $10k+/mo contract?</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Next 90 days, 6 months" {...field} />
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
                  <FormLabel>WhatsApp Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="+1234567890 (for quick confirmations)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit My Application"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default BookSessionPage;
