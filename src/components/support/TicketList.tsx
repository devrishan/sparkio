"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Inbox, MessageSquare } from "lucide-react";
import { TicketDetailsDrawer } from "./TicketDetailsDrawer";
import type { Ticket } from "./types";

interface TicketListProps {
  tickets: Ticket[];
  onTicketUpdate?: (ticketId: string, updates: Partial<Ticket>) => void;
}

const statusColors = {
  open: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  in_review: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  resolved: "bg-green-500/10 text-green-400 border-green-500/20",
};

const issueTypeColors = {
  "Task issue": "bg-orange-500/10 text-orange-400 border-orange-500/20",
  "Referral issue": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Withdrawal issue": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "Account & login": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Other: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function TicketList({ tickets, onTicketUpdate }: TicketListProps) {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
  };

  if (tickets.length === 0) {
    return (
      <Card className="border border-white/10 bg-background/40 backdrop-blur-xl p-12 shadow-lg shadow-black/5">
        <div className="text-center space-y-4">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted/20">
            <Inbox className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">No tickets yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Submit your first ticket and we'll help you from there.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="border border-white/10 bg-background/40 backdrop-blur-xl p-6 shadow-lg shadow-black/5">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Your tickets
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {tickets.length} {tickets.length === 1 ? "ticket" : "tickets"} total
            </p>
          </div>

          <div className="space-y-3">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => handleTicketClick(ticket)}
                className="group cursor-pointer rounded-xl border border-white/10 bg-background/60 backdrop-blur-sm p-4 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant="outline"
                        className={issueTypeColors[ticket.issueType as keyof typeof issueTypeColors] || issueTypeColors.Other}
                      >
                        {ticket.issueType}
                      </Badge>
                      <Badge variant="outline" className={statusColors[ticket.status]}>
                        {ticket.status === "in_review" ? "In review" : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {ticket.subject}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {ticket.description}
                    </p>
                  </div>
                  <div className="flex flex-col items-start gap-1 sm:items-end sm:text-right">
                    <span className="text-xs text-muted-foreground">
                      Created {formatDate(ticket.createdAt)}
                    </span>
                    {ticket.updatedAt.getTime() !== ticket.createdAt.getTime() && (
                      <span className="text-xs text-muted-foreground">
                        Updated {formatDate(ticket.updatedAt)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {selectedTicket && (
        <TicketDetailsDrawer
          ticket={selectedTicket}
          open={!!selectedTicket}
          onOpenChange={(open) => !open && setSelectedTicket(null)}
          onTicketUpdate={onTicketUpdate}
        />
      )}
    </>
  );
}

