"use client";

import React from "react";

import "@/ui/premium/styles.css";

import PremiumNavbar from "@/components/premium/Navbar";
import PremiumHero from "@/components/premium/Hero";
import HowItWorks from "@/components/premium/HowItWorks";
import Testimonials from "@/components/premium/Testimonials";
import Spotlight from "@/ui/premium/spotlight";
import Particles from "@/ui/premium/particles";

export default function PremiumHome() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-rose-50 via-rose-100 to-amber-50 dark:from-[#071018] dark:via-[#07121a] dark:to-[#0b1220]">
      <PremiumNavbar />
      <Spotlight />
      <Particles />
      <PremiumHero />
      <HowItWorks />
      <Testimonials />

      <footer className="mt-12 border-t py-8">
        <div className="mx-auto max-w-7xl px-6 text-sm text-slate-700 dark:text-slate-300">
          © {new Date().getFullYear()} Earniq. All rights reserved.
        </div>
      </footer>
    </main>
  );
}


