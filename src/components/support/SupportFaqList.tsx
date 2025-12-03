"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "How long do withdrawals take?",
    answer:
      "Withdrawals are typically processed within 24-48 hours. Once approved, funds are transferred to your UPI-linked bank account instantly. You'll receive a confirmation email when the withdrawal is processed.",
  },
  {
    question: "What if my task gets rejected?",
    answer:
      "If your task submission is rejected, you'll see the exact reason in your task history. Common reasons include incomplete proof, incorrect order ID, or task requirements not met. You can resubmit with corrected information or contact support for manual review.",
  },
  {
    question: "Why is my referral still pending?",
    answer:
      "Referrals remain pending until the referred user completes their first task or makes a purchase. This usually takes 1-7 days depending on the user's activity. Once verified, your referral reward will be credited to your wallet automatically.",
  },
  {
    question: "Is Earniq safe and legal?",
    answer:
      "Yes, Earniq is completely safe and legal. We partner only with verified apps and brands, use secure UPI transfers for payouts, and maintain full KYC compliance. All transactions are transparent and auditable through your wallet history.",
  },
  {
    question: "How do I track my earnings?",
    answer:
      "You can view all your earnings, referrals, and withdrawals in your dashboard. The wallet section shows your current balance, total earned, and a complete transaction history with downloadable receipts for each transaction.",
  },
  {
    question: "Can I withdraw any amount?",
    answer:
      "The minimum withdrawal amount is ₹100. You can withdraw any amount above this threshold. There's no maximum limit, and you can make multiple withdrawal requests as needed.",
  },
];

export function SupportFaqList() {
  if (faqs.length === 0) {
    return (
      <Card className="border-border bg-card p-6">
        <p className="text-sm text-muted-foreground">No FAQs available yet.</p>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card p-6">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Quick help</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Common questions and answers to get you started.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`faq-${index}`} className="border-b border-border">
              <AccordionTrigger className="text-left text-sm font-medium text-foreground">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Card>
  );
}

