"use client";

import { useState } from "react";
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { MessageSquare, Send, User, UserCheck } from "lucide-react";
import type { Ticket } from "./types";

interface TicketDetailsDrawerProps {
  ticket: Ticket;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function TicketDetailsDrawer({
  ticket,
  open,
  onOpenChange,
  onTicketUpdate,
}: TicketDetailsDrawerProps) {
  const [reply, setReply] = useState("");
  const [localTicket, setLocalTicket] = useState<Ticket>(ticket);

  // Update local ticket when prop changes
  React.useEffect(() => {
    setLocalTicket(ticket);
  }, [ticket]);

  const handleReply = () => {
    if (!reply.trim()) return;

    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: "user" as const,
      message: reply,
      timestamp: new Date(),
    };

    const updatedTicket: Ticket = {
      ...localTicket,
      messages: [...localTicket.messages, newMessage],
      updatedAt: new Date(),
    };

    setLocalTicket(updatedTicket);
    setReply("");

    if (onTicketUpdate) {
      onTicketUpdate(ticket.id, updatedTicket);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[96vh] border-t border-white/10 bg-background/95 backdrop-blur-xl">
        <DrawerHeader className="border-b border-white/10">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge
              variant="outline"
              className={issueTypeColors[localTicket.issueType as keyof typeof issueTypeColors] || issueTypeColors.Other}
            >
              {localTicket.issueType}
            </Badge>
            <Badge variant="outline" className={statusColors[localTicket.status]}>
              {localTicket.status === "in_review" ? "In review" : localTicket.status.charAt(0).toUpperCase() + localTicket.status.slice(1)}
            </Badge>
          </div>
          <DrawerTitle className="text-xl font-semibold text-foreground">
            {localTicket.subject}
          </DrawerTitle>
          <DrawerDescription className="text-muted-foreground">
            Created {formatDateTime(localTicket.createdAt)}
          </DrawerDescription>
        </DrawerHeader>

        <div className="overflow-y-auto flex-1 px-4 py-6 space-y-6">
          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground">Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{localTicket.description}</p>
          </div>

          {/* Related ID */}
          {localTicket.relatedId && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">Related ID</h3>
              <p className="text-sm text-muted-foreground">{localTicket.relatedId}</p>
            </div>
          )}

          {/* Timeline */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              Timeline
            </h3>
            <div className="space-y-4">
              {/* Ticket created */}
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div className="w-px h-full bg-border mt-2" />
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-foreground">You</span>
                    <span className="text-xs text-muted-foreground">created this ticket</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{formatDateTime(localTicket.createdAt)}</p>
                </div>
              </div>

              {/* Messages */}
              {localTicket.messages.map((msg, index, arr) => (
                <div key={msg.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      msg.sender === "user" ? "bg-primary/10" : "bg-green-500/10"
                    }`}>
                      {msg.sender === "user" ? (
                        <User className="h-4 w-4 text-primary" />
                      ) : (
                        <UserCheck className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    {index < arr.length - 1 && <div className="w-px h-full bg-border mt-2" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-foreground">
                        {msg.sender === "user" ? "You" : "Support Agent"}
                      </span>
                      <span className="text-xs text-muted-foreground">{formatTime(msg.timestamp)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reply section */}
          {localTicket.status !== "resolved" && (
            <div className="space-y-3 pt-4 border-t border-white/10">
              <h3 className="text-sm font-semibold text-foreground">Add a reply</h3>
              <Textarea
                placeholder="Type your message..."
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows={4}
                className="bg-background/60 backdrop-blur-sm border-white/10 resize-none"
              />
              <Button
                onClick={handleReply}
                disabled={!reply.trim()}
                className="w-full button-shine"
              >
                <Send className="mr-2 h-4 w-4" />
                Send reply
              </Button>
            </div>
          )}
        </div>

        <DrawerFooter className="border-t border-white/10">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

