"use client";

import { useState } from "react";
import { CheckCircle2, ChevronDown, Mail, MessageCircle, Send, WhatsApp, X } from "lucide-react";

import { SectionCard, StatusPill } from "@/components/dashboard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

const faqSections = [
  {
    id: "general",
    title: "General Questions",
    items: [
      {
        question: "What is Sparkio?",
        answer:
          "Sparkio is a platform where you can earn money by completing tasks like app installs, UPI transactions, and social media shares. All earnings are tracked transparently in your dashboard, and you can withdraw via UPI once you reach the minimum threshold.",
      },
      {
        question: "Is Sparkio free to join?",
        answer:
          "Yes, Sparkio is completely free to join. There are no signup fees, subscription costs, or hidden charges. You only earn money—we never ask you to pay anything.",
      },
      {
        question: "How do I get started?",
        answer:
          "After signing up, browse available tasks in the Tasks section. Each task shows the reward amount, requirements, and approval time. Click 'Start Task' to begin, complete the requirements, upload proof, and wait for approval. Once approved, earnings are added to your withdrawable balance.",
      },
      {
        question: "Is my data safe?",
        answer:
          "Yes. We use OTP-based authentication, mask sensitive information (like phone numbers and UPI IDs) in your dashboard, and never share your personal data with third parties. All transactions are tracked securely.",
      },
      {
        question: "Can I use Sparkio on mobile?",
        answer:
          "Absolutely! Sparkio is fully responsive and works great on mobile browsers. You can complete tasks, track earnings, request withdrawals, and manage your account from any device.",
      },
    ],
  },
  {
    id: "tasks",
    title: "Tasks & Earnings",
    items: [
      {
        question: "How long does task approval take?",
        answer:
          "Approval times vary by task type. App installs typically take 30-60 minutes, UPI tasks take 60-90 minutes, and social media tasks take 30-45 minutes. You'll receive a notification once your submission is reviewed.",
      },
      {
        question: "What happens if my task is rejected?",
        answer:
          "If a task is rejected, you'll see the reason in your dashboard. Common reasons include incomplete proof, screenshots that don't meet requirements, or missing information. You can review the feedback and resubmit if the task allows it.",
      },
      {
        question: "Can I do the same task multiple times?",
        answer:
          "Most tasks are one-time only per user. However, some tasks (like referral bonuses) can be completed multiple times. Check the task details to see if it allows repeat submissions.",
      },
      {
        question: "Why is my reward amount a range (e.g., ₹80–₹160)?",
        answer:
          "Some tasks offer variable rewards based on factors like device type, completion quality, or campaign budget. You'll receive the exact amount after approval, which will be within the stated range.",
      },
      {
        question: "How do I track my earnings?",
        answer:
          "All earnings are visible in your Dashboard home page. You can see total earned, pending approvals, withdrawable balance, and a 7-day earnings chart. The Recent Activity section shows all task approvals, rejections, and withdrawals in real time.",
      },
    ],
  },
  {
    id: "withdrawals",
    title: "Withdrawals & Payments",
    items: [
      {
        question: "What is the minimum withdrawal amount?",
        answer:
          "The minimum withdrawal amount is ₹500. You can request withdrawals once your withdrawable balance reaches this threshold. There's also a maximum limit of ₹50,000 per withdrawal request.",
      },
      {
        question: "How long do withdrawals take?",
        answer:
          "Withdrawal processing times vary: Pending (awaiting review), Processing (approved, payment in progress), and Paid (completed, usually within 24-48 hours of approval). You'll receive a UTR number once the payment is processed.",
      },
      {
        question: "What UPI apps are supported?",
        answer:
          "We support all major UPI apps including PhonePe, Google Pay, Paytm, BHIM, and others. Just provide your UPI ID (format: yourname@upi) when requesting a withdrawal.",
      },
      {
        question: "Is there a withdrawal fee?",
        answer:
          "No, there are no withdrawal fees. The amount you see in your withdrawable balance is exactly what you'll receive (minus any applicable taxes as per Indian regulations).",
      },
      {
        question: "Can I cancel a withdrawal request?",
        answer:
          "You can only cancel withdrawal requests that are still in 'Pending' status. Once a withdrawal moves to 'Processing' or 'Paid', it cannot be cancelled. Contact support if you need assistance.",
      },
    ],
  },
  {
    id: "referrals",
    title: "Referrals & Bonuses",
    items: [
      {
        question: "How do referrals work?",
        answer:
          "Share your unique referral link with friends. When they sign up and complete their first earning task, you earn a percentage of their earnings. The more active referrers you have, the more you earn.",
      },
      {
        question: "How much do I earn from referrals?",
        answer:
          "Referral earnings vary by task type and campaign. You'll see the exact percentage in your Referrals dashboard. Typically, you earn 10-20% of your referral's earnings from each completed task.",
      },
      {
        question: "What's the difference between 'Joined', 'Active earner', and 'Dormant'?",
        answer:
          "'Joined' means your referral signed up but hasn't completed a task yet. 'Active earner' means they've completed at least one task in the last 30 days. 'Dormant' means they haven't earned in over 30 days.",
      },
      {
        question: "Are there referral bonuses?",
        answer:
          "Yes! We offer milestone bonuses. For example, when you refer 10 active users, you unlock a bonus reward. Check your Referrals page to see your progress toward the next bonus tier.",
      },
      {
        question: "Can I see my referral's earnings?",
        answer:
          "For privacy, we only show masked information. You can see how much each referral has contributed to your earnings, but not their full earnings or personal details.",
      },
    ],
  },
];

const userEmail = "aditi@earniq.in";

export default function DashboardSupportPage() {
  const [formData, setFormData] = useState({
    subject: "",
    email: userEmail,
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Mock submission
    setTimeout(() => {
      alert("Message sent! (Demo only - no real message was sent)");
      setFormData({ subject: "", email: userEmail, message: "" });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-orange-200/80">Support center</p>
        <h1 className="text-3xl font-semibold text-white">Need Help?</h1>
        <p className="text-sm text-muted-foreground">Browse common questions or contact Sparkio support.</p>
      </header>

      {/* Status Banner */}
      <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm">
        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-300" />
        <div className="flex-1">
          <p className="font-semibold text-emerald-200">All systems operational</p>
          <p className="text-xs text-emerald-200/70">Support response time: Under 24 hours</p>
        </div>
        <StatusPill label="Live" tone="success" />
      </div>

      {/* FAQ Sections */}
      <SectionCard title="Frequently Asked Questions" subtitle="Find answers to common questions below.">
        <Accordion type="single" collapsible className="space-y-2">
          {faqSections.map((section) => (
            <div key={section.id} className="space-y-4">
              <h3 className="text-lg font-semibold text-white">{section.title}</h3>
              {section.items.map((item, index) => (
                <AccordionItem
                  key={`${section.id}-${index}`}
                  value={`${section.id}-${index}`}
                  className="rounded-2xl border border-white/5 bg-white/5 px-4"
                >
                  <AccordionTrigger className="text-left text-sm font-semibold text-white hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    <p className="pb-4">{item.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </div>
          ))}
        </Accordion>
      </SectionCard>

      {/* Contact Support */}
      <div className="grid gap-6 lg:grid-cols-2">
        <SectionCard title="Contact support" subtitle="Send us a message and we'll get back to you.">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="subject" className="mb-2 block text-xs text-white/70">
                Subject
              </label>
              <input
                id="subject"
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="What can we help you with?"
                className="w-full rounded-xl border border-white/10 bg-[#050712] px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-orange-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-2 block text-xs text-white/70">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-[#050712] px-4 py-3 text-sm text-white focus:border-orange-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="mb-2 block text-xs text-white/70">
                Message
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={5}
                placeholder="Describe your issue or question in detail..."
                className="w-full rounded-xl border border-white/10 bg-[#050712] px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-orange-500 focus:outline-none"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-orange-500/40 bg-orange-500/10 px-4 py-3 text-sm font-semibold text-orange-200 transition hover:border-orange-500 hover:bg-orange-500/20 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-orange-200 border-t-transparent" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send message
                </>
              )}
            </button>
            <p className="text-xs text-muted-foreground">
              This is a demo form. No real message will be sent. In production, you'll receive a confirmation email.
            </p>
          </form>
        </SectionCard>

        <SectionCard title="Other ways to reach us" subtitle="Choose your preferred support channel.">
          <div className="space-y-3">
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-2xl border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm text-green-200 transition hover:border-green-500 hover:bg-green-500/20"
            >
              <WhatsApp className="h-5 w-5" />
              <div className="flex-1">
                <p className="font-semibold">WhatsApp Support</p>
                <p className="text-xs text-green-200/70">Quick responses via chat</p>
              </div>
            </a>
            <a
              href="mailto:support@sparkio.in"
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70 transition hover:border-white/40 hover:text-white"
            >
              <Mail className="h-5 w-5" />
              <div className="flex-1">
                <p className="font-semibold">Email Support</p>
                <p className="text-xs text-muted-foreground">support@sparkio.in</p>
              </div>
            </a>
            <a
              href="https://t.me/sparkiosupport"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70 transition hover:border-white/40 hover:text-white"
            >
              <MessageCircle className="h-5 w-5" />
              <div className="flex-1">
                <p className="font-semibold">Telegram Support</p>
                <p className="text-xs text-muted-foreground">Join our support channel</p>
              </div>
            </a>
          </div>
          <div className="mt-6 rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-xs text-muted-foreground">
            <p className="font-semibold text-white">Response times</p>
            <ul className="mt-2 space-y-1">
              <li>• WhatsApp: Usually within 2-4 hours</li>
              <li>• Email: Within 24 hours</li>
              <li>• Telegram: Within 4-6 hours</li>
            </ul>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

