"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { fadeInUp, stagger, viewport } from "@/components/marketing/animations";

const testimonials = [
  {
    quote: "I've earned ₹12,000 in the last month just by sharing app links with friends. The UPI withdrawals are instant and the dashboard shows everything clearly.",
    name: "Priya M.",
    city: "Mumbai",
    earningType: "App referrals",
    rating: 5,
  },
  {
    quote: "As a student, I needed flexible earning options. Earniq lets me complete tasks between classes and withdraw whenever I need cash. No hassle, no hidden fees.",
    name: "Rahul K.",
    city: "Delhi",
    earningType: "UPI tasks",
    rating: 5,
  },
  {
    quote: "The transparency is what sold me. Every transaction is logged, I can download receipts, and support actually responds. This is how fintech should work.",
    name: "Anjali S.",
    city: "Bangalore",
    earningType: "Social tasks",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <motion.section
      className="px-6 pb-20 lg:px-12"
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={stagger}
    >
      <div className="mx-auto max-w-6xl space-y-12">
        <motion.div className="space-y-3 text-center" variants={fadeInUp}>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            What earners say about Earniq
          </h2>
          <p className="text-base text-muted-foreground md:text-lg">
            Real feedback from people earning daily on the platform.
          </p>
        </motion.div>

        <motion.div className="grid gap-6 md:grid-cols-3" variants={stagger}>
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="group relative flex h-full flex-col rounded-3xl border border-white/10 bg-background/40 backdrop-blur-xl p-6 shadow-lg shadow-black/5 transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
              variants={fadeInUp}
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative space-y-4">
                <div className="flex items-center gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <div className="relative">
                  <Quote className="absolute -top-2 -left-2 h-8 w-8 text-primary/20" />
                  <p className="text-base leading-relaxed text-muted-foreground pl-4">
                    {testimonial.quote}
                  </p>
                </div>
                <div className="border-t border-white/10 pt-4">
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.city}</p>
                  <span className="mt-2 inline-block rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                    {testimonial.earningType}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

