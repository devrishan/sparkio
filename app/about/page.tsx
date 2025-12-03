import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, CreditCard, Share2, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "About Sparkio – Our Mission",
  description: "Learn about Sparkio's vision to make earning simple, transparent, and accessible for everyone in India.",
};

const steps = [
  {
    number: "1",
    title: "Join",
    description: "Sign up with your phone number. No complicated forms, no credit card required.",
    icon: <Users className="h-6 w-6 text-orange-400" />,
  },
  {
    number: "2",
    title: "Earn",
    description: "Complete simple tasks: app installs, UPI transactions, social shares. Track everything in real-time.",
    icon: <CreditCard className="h-6 w-6 text-orange-400" />,
  },
  {
    number: "3",
    title: "Withdraw",
    description: "Request instant UPI payouts. No waiting, no hidden fees. Your money, your timeline.",
    icon: <Share2 className="h-6 w-6 text-orange-400" />,
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#040507] text-white">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-[#040507]/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-orange-400">
              Sparkio
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/about" className="text-sm text-white font-medium">
                About
              </Link>
              <Link href="/member/dashboard" className="text-sm text-white/70 hover:text-white transition">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            About <span className="text-orange-400">Sparkio</span>
          </h1>
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="space-y-6 text-lg text-white/80">
          <p>
            Sparkio was built with a simple mission: make earning money online transparent, safe, and accessible for
            everyone in India. We believe that earning extra income shouldn't require guesswork, shady apps, or weeks of
            waiting for payouts.
          </p>
          <p>
            Our platform connects you with verified tasks from trusted partners. Every rupee you earn is tracked in
            real-time. Every withdrawal is processed via secure UPI. And every interaction is designed to be simple
            and mobile-friendly.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">How It Works</h2>
          <p className="mt-4 text-white/70">Three simple steps to start earning.</p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="relative">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/20 text-2xl font-bold text-orange-400">
                    {step.number}
                  </div>
                  <div className="text-orange-400">{step.icon}</div>
                </div>
                <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-white/70">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team Note */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-orange-500/20 bg-orange-500/10 p-8 text-center">
          <h3 className="text-2xl font-bold text-white">Built in India, for India</h3>
          <p className="mt-4 text-white/80">
            Sparkio is designed specifically for Indian users, with UPI integration, KYC compliance, and support for
            local payment methods. We understand the unique needs of Indian earners and built our platform accordingly.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <Link
            href="/member/dashboard"
            className="inline-flex items-center gap-2 rounded-2xl border border-orange-500/40 bg-orange-500/10 px-6 py-3 text-sm font-semibold text-orange-200 transition hover:border-orange-500 hover:bg-orange-500/20"
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#040507]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-lg font-bold text-orange-400">Sparkio</h3>
              <p className="mt-2 text-sm text-white/70">Earn daily. No guesswork.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white">Company</h4>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                <li>
                  <Link href="/about" className="hover:text-white transition">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white">Support</h4>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                <li>
                  <Link href="/member/support" className="hover:text-white transition">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/member/dashboard" className="hover:text-white transition">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white">Built in India</h4>
              <p className="mt-2 text-sm text-white/70">For India</p>
            </div>
          </div>
          <div className="mt-8 border-t border-white/10 pt-8 text-center text-sm text-white/70">
            <p>&copy; {new Date().getFullYear()} Sparkio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

