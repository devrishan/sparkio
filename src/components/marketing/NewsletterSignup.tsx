"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fadeInUp, viewport } from "@/components/marketing/animations";
import { useToast } from "@/hooks/use-toast";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSuccess(true);
    setEmail("");

    toast({
      title: "Subscribed!",
      description: "You'll receive updates about new features and earning opportunities.",
    });

    setTimeout(() => setIsSuccess(false), 3000);
  };

  return (
    <motion.section
      className="px-6 pb-20 lg:px-12"
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={fadeInUp}
    >
      <div className="mx-auto max-w-4xl">
        <div className="relative rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background/90 to-background p-8 lg:p-12 shadow-2xl shadow-primary/10 glass-premium gradient-border">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 to-transparent opacity-50" />
          <div className="relative z-10 space-y-6 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                Stay updated with Earniq
              </h2>
              <p className="text-base text-muted-foreground md:text-lg max-w-2xl mx-auto">
                Get notified about new earning opportunities, feature updates, and exclusive tasks. No spam, just value.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting || isSuccess}
                className="flex-1 bg-background/60 backdrop-blur-sm border-white/10"
                required
              />
              <Button
                type="submit"
                disabled={isSubmitting || isSuccess}
                className="button-shine glow-primary-hover"
                size="lg"
              >
                {isSuccess ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Subscribed!
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Subscribe
                  </>
                )}
              </Button>
            </form>
            <p className="text-xs text-muted-foreground">
              Join 15,000+ earners getting weekly updates. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

