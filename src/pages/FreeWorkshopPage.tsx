import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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

const QUALIFIER_OPTIONS = [
  "Professional with 3+ years experience, currently under-earning, want $10k/mo+ PM contracts",
  "Already in PM / consulting and looking for better contracts",
  "Less than 3 years of professional experience",
  "Just researching / not sure yet",
] as const;

const formSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().min(1, "Phone/WhatsApp is required").max(30),
  qualifier: z.enum(QUALIFIER_OPTIONS, {
    required_error: "Please select the option that best describes you",
  }),
});

type FormData = z.infer<typeof formSchema>;

const FreeWorkshopPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const rawSource = searchParams.get("source");
      const source = rawSource && rawSource.trim().length > 0 ? rawSource.trim() : "direct";

      const { error } = await supabase.functions.invoke("send-webinar-registrant", {
        body: {
          firstName: data.firstName,
          email: data.email,
          phone: data.phone,
          qualifier: data.qualifier,
          source,
        },
      });

      if (error) {
        throw new Error(error.message || "Submission failed");
      }

      navigate("/free-workshop/thank-you");
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Something went wrong. Please try again.",
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
            <h1
              className="text-3xl md:text-4xl font-bold mb-4 text-center"
              style={{ color: "#FFE361" }}
            >
              Free Live Workshop: How to Land $10k–$18k/mo Data and AI orchestration PM Consulting
              Contracts
            </h1>
            <p className="text-white text-center mb-8 text-base md:text-lg">
              I&rsquo;ll show you the exact roadmap + the hidden job board I used to go from
              $3.5k/mo to $18k/mo take-home.
            </p>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-base font-medium mb-1">
                        First Name (required)
                      </FormLabel>
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
                      <FormLabel className="text-white text-base font-medium mb-1">
                        Email (required)
                      </FormLabel>
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
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-base font-medium mb-1">
                        Phone/WhatsApp (required)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+1 555 123 4567"
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
                  name="qualifier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white text-base font-medium mb-1">
                        Which best describes you?
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="space-y-3 mt-2"
                        >
                          {QUALIFIER_OPTIONS.map((option) => (
                            <label
                              key={option}
                              htmlFor={option}
                              className="flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors hover:bg-white/5 has-[:checked]:bg-white/10"
                            >
                              <RadioGroupItem
                                value={option}
                                id={option}
                                className="mt-0.5 h-5 w-5 border-white/60 text-white data-[state=checked]:border-[#F4C903] data-[state=checked]:text-[#F4C903] data-[state=checked]:bg-[#F4C903]/10 [&>span>svg]:h-3.5 [&>span>svg]:w-3.5 [&>span>svg]:fill-[#F4C903]"
                              />
                              <span className="text-white text-sm leading-snug">
                                {option}
                              </span>
                            </label>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="gold-glow-border w-full px-4 py-3 font-bold text-white hover:text-[#F4C903] text-base md:text-lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Reserving...
                    </>
                  ) : (
                    "Reserve My Free Spot"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FreeWorkshopPage;
