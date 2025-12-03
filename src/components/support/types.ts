export interface Ticket {
  id: string;
  issueType: "Task issue" | "Referral issue" | "Withdrawal issue" | "Account & login" | "Other";
  subject: string;
  description: string;
  relatedId?: string;
  status: "open" | "in_review" | "resolved";
  createdAt: Date;
  updatedAt: Date;
  messages: Array<{
    id: string;
    sender: "user" | "agent";
    message: string;
    timestamp: Date;
  }>;
}

