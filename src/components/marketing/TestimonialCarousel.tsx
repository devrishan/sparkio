"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeInUp, viewport } from "@/components/marketing/animations";

const testimonials = [
  {
    quote: "I've earned ₹12,000 in the last month just by sharing app links with friends. The UPI withdrawals are instant and the dashboard shows everything clearly.",
    name: "Priya M.",
    city: "Mumbai",
    earningType: "App referrals",
    rating: 5,
    avatar: "PM",
  },
  {
    quote: "As a student, I needed flexible earning options. Earniq lets me complete tasks between classes and withdraw whenever I need cash. No hassle, no hidden fees.",
    name: "Rahul K.",
    city: "Delhi",
    earningType: "UPI tasks",
    rating: 5,
    avatar: "RK",
  },
  {
    quote: "The transparency is what sold me. Every transaction is logged, I can download receipts, and support actually responds. This is how fintech should work.",
    name: "Anjali S.",
    city: "Bangalore",
    earningType: "Social tasks",
    rating: 5,
    avatar: "AS",
  },
  {
    quote: "Made ₹8,500 in my first week! The referral system is amazing and the proof upload process is so simple. Highly recommend to anyone looking for side income.",
    name: "Vikram P.",
    city: "Pune",
    earningType: "App referrals",
    rating: 5,
    avatar: "VP",
  },
  {
    quote: "Best part-time earning platform I've used. The gamification keeps me motivated and the level-up rewards are real. Already at Level 12!",
    name: "Sneha R.",
    city: "Hyderabad",
    earningType: "Mixed streams",
    rating: 5,
    avatar: "SR",
  },
];

export function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const next = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <motion.section
      className="px-6 pb-20 lg:px-12"
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={fadeInUp}
    >
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              What earners say about Earniq
            </h2>
            <p className="mt-2 text-base text-muted-foreground md:text-lg">
              Real feedback from people earning daily on the platform.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={prev}
              className="rounded-full border-white/10 glass-premium"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={next}
              className="rounded-full border-white/10 glass-premium"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="relative h-[400px] overflow-hidden rounded-3xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <div className="group relative flex h-full flex-col rounded-3xl border border-white/10 bg-background/40 backdrop-blur-xl p-8 shadow-lg shadow-black/5 glass-premium gradient-border">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative z-10 flex h-full flex-col justify-between">
                  <div className="space-y-6">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: testimonials[currentIndex].rating }).map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <blockquote className="text-xl leading-relaxed text-muted-foreground">
                      "{testimonials[currentIndex].quote}"
                    </blockquote>
                  </div>
                  <div className="border-t border-white/10 pt-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                        {testimonials[currentIndex].avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{testimonials[currentIndex].name}</p>
                        <p className="text-sm text-muted-foreground">{testimonials[currentIndex].city}</p>
                        <span className="mt-2 inline-block rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                          {testimonials[currentIndex].earningType}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "w-8 bg-primary"
                  : "w-2 bg-muted hover:bg-primary/50"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
}

