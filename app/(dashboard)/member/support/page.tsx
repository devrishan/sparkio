"use client";

/**
 * Member Support Page
 * 
 * TO REPLACE MOCKS WITH REAL API:
 * 1. Replace useMockData hook with your API call:
 *    const { data: tickets } = useQuery({
 *      queryKey: ['support-tickets'],
 *      queryFn: () => fetch('/api/member/support/tickets').then(r => r.json())
 *    });
 * 
 * 2. Update API endpoints:
 *    - GET /api/member/support/tickets - List tickets
 *    - POST /api/member/support/tickets - Create ticket
 *    - POST /api/member/support/tickets/:id/messages - Send message
 * 
 * 3. Expected response shape: Array of tickets with messages[]
 */

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, Plus, Send, Video, BookOpen, HelpCircle } from "lucide-react";
import { useMockData, loadMockJson } from "@/hooks/useMockData";
import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  messages: Array<{
    id: string;
    sender: string;
    content: string;
    timestamp: string;
  }>;
}

export default function MemberSupportPage() {
  const { data: tickets, isLoading } = useMockData<SupportTicket[]>(
    () => loadMockJson("support-tickets")
  );
  const [newTicket, setNewTicket] = useState({
    subject: "",
    category: "",
    message: "",
  });
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  const handleCreateTicket = () => {
    if (!newTicket.subject || !newTicket.category || !newTicket.message) {
      toast.error("Please fill all fields");
      return;
    }
    toast.success("Ticket created", {
      description: "Your support ticket has been submitted.",
    });
    setNewTicket({ subject: "", category: "", message: "" });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      open: "default",
      in_progress: "secondary",
      resolved: "outline",
      closed: "destructive",
    };
    return <Badge variant={variants[status] || "outline"}>{status.replace("_", " ")}</Badge>;
  };

  const selectedTicketData = tickets.find((t) => t.id === selectedTicket);

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-orange-200/80">Support</p>
        <h1 className="text-3xl font-semibold text-white">Support Center</h1>
        <p className="text-sm text-muted-foreground">
          Get help, submit tickets, and find answers to common questions.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Create New Ticket */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-orange-300" />
              Create Ticket
            </CardTitle>
            <CardDescription>Submit a new support request</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={newTicket.subject}
                onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                placeholder="What do you need help with?"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={newTicket.category}
                onValueChange={(value) => setNewTicket({ ...newTicket, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="payment">Payment & Withdrawal</SelectItem>
                  <SelectItem value="tasks">Tasks & Submissions</SelectItem>
                  <SelectItem value="referrals">Referrals</SelectItem>
                  <SelectItem value="account">Account Issues</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={newTicket.message}
                onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
                placeholder="Describe your issue in detail..."
                rows={5}
              />
            </div>
            <Button onClick={handleCreateTicket} className="w-full">
              <Send className="h-4 w-4 mr-2" />
              Submit Ticket
            </Button>
          </CardContent>
        </Card>

        {/* Tickets List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-orange-300" />
              Your Tickets
            </CardTitle>
            <CardDescription>View and manage your support tickets</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {!tickets || tickets.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 text-white/30" />
                  <p>No tickets yet</p>
                  <p className="text-sm">Create a ticket to get help</p>
                </div>
              ) : (
                tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className={cn(
                      "rounded-lg border p-4 cursor-pointer transition hover:bg-white/5",
                      selectedTicket === ticket.id && "border-orange-500/40 bg-orange-500/10"
                    )}
                    onClick={() => setSelectedTicket(ticket.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-white">{ticket.subject}</h3>
                          {getStatusBadge(ticket.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{ticket.category}</p>
                        <p className="text-xs text-muted-foreground">
                          Created {new Date(ticket.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Ticket Chat */}
      {selectedTicketData && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedTicketData.subject}</CardTitle>
            <CardDescription>
              {getStatusBadge(selectedTicketData.status)} • {selectedTicketData.category} • Priority: {selectedTicketData.priority}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {selectedTicketData.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-3",
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-lg p-3 max-w-[80%]",
                      msg.sender === "user"
                        ? "bg-orange-500/20 text-white"
                        : "bg-white/5 text-white/80"
                    )}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-xs text-white/50 mt-1">
                      {new Date(msg.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Input placeholder="Type your message..." />
              <Button>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Help */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Video className="h-5 w-5 text-orange-300" />
              Video Tutorials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Watch step-by-step guides
            </p>
            <Button variant="outline" className="w-full">
              Watch Videos
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-orange-300" />
              FAQ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Find answers to common questions
            </p>
            <Button variant="outline" className="w-full">
              Browse FAQ
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <HelpCircle className="h-5 w-5 text-orange-300" />
              Need Help?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Contact us directly
            </p>
            <Button variant="outline" className="w-full">
              Contact Support
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

