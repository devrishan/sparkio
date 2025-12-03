import type { Metadata } from "next";
import { Navbar } from "@/components/marketing/Navbar";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { FAQSection } from "@/components/marketing/FAQSection";
import { SupportCard } from "@/components/support/SupportCard";
import { CheckCircle, ClipboardList, MessageCircle, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { fadeInUp, stagger, viewport } from "@/components/marketing/animations";

export const metadata: Metadata = {
  title: "Support - Earniq",
  description: "Get help with tasks, referrals, withdrawals, and your Earniq account.",
};

const supportFeatures = [
  {
    title: "No joining fee",
    description: "Start earning with zero upfront charges or hidden fees.",
    icon: CheckCircle,
  },
  {
    title: "Verified tasks only",
    description: "We list trusted apps and brands—no fake or shady offers.",
    icon: ShieldCheck,
  },
  {
    title: "Transparent wallet history",
    description: "See every credit, debit, and withdrawal with downloadable receipts.",
    icon: ClipboardList,
  },
  {
    title: "Support that actually replies",
    description: "In-app help desk and chatbot with real people reviewing behind the scenes.",
    icon: MessageCircle,
  },
];

export default function SupportPage() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-col gap-0 bg-background text-foreground" suppressHydrationWarning>
        <section id="support" className="relative isolate overflow-hidden px-6 pt-24 pb-20 lg:px-12">
          {/* Aurora background effect */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-primary/25 to-transparent blur-3xl" />
            <div className="absolute left-[10%] top-20 h-48 w-48 rounded-full bg-primary/15 blur-3xl animate-pulse" />
            <div className="absolute right-[10%] top-40 h-56 w-56 rounded-full bg-secondary/10 blur-2xl animate-pulse" style={{ animationDelay: "1s" }} />
          </div>

          <div className="mx-auto max-w-6xl space-y-12">
            <motion.div
              className="space-y-3 text-center"
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              variants={fadeInUp}
            >
              <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">Why Earniq is different</h1>
              <p className="text-base text-muted-foreground md:text-lg">
                Built for trust, speed, and transparency—because every rupee deserves a clean record.
              </p>
            </motion.div>

            <motion.div
              className="grid gap-6 sm:grid-cols-2"
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              variants={stagger}
            >
              {supportFeatures.map((feature, index) => (
                <SupportCard
                  key={feature.title}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  index={index}
                />
              ))}
            </motion.div>

            <motion.div
              className="relative rounded-3xl border border-primary/20 bg-primary/5 backdrop-blur-sm p-8 text-center transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10"
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              variants={fadeInUp}
            >
              <p className="text-lg font-semibold text-foreground mb-4">
                Need help with a task, referral, or withdrawal?
              </p>
              <Button asChild size="lg" className="w-full sm:w-auto button-shine">
                <Link href="/support-center">Open support center</Link>
              </Button>
            </motion.div>
          </div>
        </section>
        <FAQSection />
      </main>
      <SiteFooter />
    </>
  );
}

