"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { NewTicketForm } from "@/components/support/NewTicketForm";
import { TicketList } from "@/components/support/TicketList";
import { useToast } from "@/hooks/use-toast";
import { fadeInUp, viewport } from "@/components/marketing/animations";
import type { Ticket } from "@/components/support/types";
import type { TicketFormData } from "@/components/support/NewTicketForm";

// Mock initial tickets
const mockTickets: Ticket[] = [
  {
    id: "ticket-1",
    issueType: "Task issue",
    subject: "My task proof was rejected",
    description: "I submitted proof for task #12345 but it was rejected without clear reason. Can you review this?",
    relatedId: "TASK12345",
    status: "in_review",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    messages: [
      {
        id: "msg-1",
        sender: "agent",
        message: "Thanks for reaching out. I've reviewed your submission and I can see the issue. Please resubmit with clearer screenshots showing all required elements.",
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      },
    ],
  },
  {
    id: "ticket-2",
    issueType: "Withdrawal issue",
    subject: "Withdrawal pending for 3 days",
    description: "I requested a withdrawal of ₹2,500 three days ago but it's still showing as pending. What's the delay?",
    status: "open",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    messages: [],
  },
  {
    id: "ticket-3",
    issueType: "Referral issue",
    subject: "Referral bonus not credited",
    description: "My friend signed up using my referral link last week but I haven't received the bonus yet.",
    relatedId: "REF789",
    status: "resolved",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    messages: [
      {
        id: "msg-2",
        sender: "agent",
        message: "I've reviewed your referral and processed the bonus. It should reflect in your wallet within the next hour.",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
    ],
  },
];

export default function SupportCenterPage() {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const { toast } = useToast();

  const handleTicketSubmit = (formData: TicketFormInput) => {
    const newTicket: Ticket = {
      id: `ticket-${Date.now()}`,
      issueType: formData.issueType,
      subject: formData.subject,
      description: formData.description,
      relatedId: formData.relatedId,
      status: "open",
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [],
    };

    setTickets([newTicket, ...tickets]);

    toast({
      title: "Ticket created",
      description: "Your ticket has been submitted successfully. We'll get back to you soon.",
    });
  };

  const handleTicketUpdate = (ticketId: string, updates: Partial<Ticket>) => {
    setTickets(
      tickets.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, ...updates } : ticket
      )
    );
  };

  return (
    <section className="relative isolate overflow-hidden space-y-6">
      {/* Aurora background effect */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-primary/25 to-transparent blur-3xl" />
        <div className="absolute left-[10%] top-20 h-48 w-48 rounded-full bg-primary/15 blur-3xl animate-pulse" />
        <div className="absolute right-[10%] top-40 h-56 w-56 rounded-full bg-secondary/10 blur-2xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <motion.header
        className="space-y-1"
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={fadeInUp}
      >
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Support Center</h1>
        <p className="text-sm text-muted-foreground">
          Raise a ticket for tasks, referrals, or withdrawals. Our team usually replies in under 15 minutes.
        </p>
      </motion.header>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={fadeInUp}
      >
        <Alert className="border-primary/20 bg-primary/5 backdrop-blur-sm text-primary">
          <Info className="h-4 w-4" />
          <AlertTitle>Demo Mode Active</AlertTitle>
          <AlertDescription>
            Support actions are not sending to a real backend yet. Your tickets are stored locally in your browser.
          </AlertDescription>
        </Alert>
      </motion.div>

      <motion.div
        className="space-y-6"
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        variants={fadeInUp}
      >
        <NewTicketForm onSubmit={handleTicketSubmit} />
        <TicketList tickets={tickets} onTicketUpdate={handleTicketUpdate} />
      </motion.div>
    </section>
  );
}

