"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, Paperclip } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const ticketFormSchema = z.object({
  issueType: z.enum(["Task issue", "Referral issue", "Withdrawal issue", "Account & login", "Other"], {
    required_error: "Please select an issue type",
  }),
  subject: z.string().min(1, "Subject is required").max(100, "Subject cannot exceed 100 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").max(1000, "Description cannot exceed 1000 characters"),
  relatedId: z.string().optional(),
});

export type TicketFormData = z.infer<typeof ticketFormSchema>;

interface NewTicketFormProps {
  onSubmit: (data: TicketFormData & { attachment?: File | null }) => void;
}

export function NewTicketForm({ onSubmit }: NewTicketFormProps) {
  const [attachment, setAttachment] = useState<File | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TicketFormData>({
    resolver: zodResolver(ticketFormSchema),
  });

  const issueType = watch("issueType");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Attachment size must be less than 5MB",
          variant: "destructive",
        });
        setAttachment(null);
        return;
      }
      setAttachment(file);
    }
  };

  const onFormSubmit = async (data: TicketFormData) => {
    onSubmit({ ...data, attachment });
    reset();
    setAttachment(null);
  };

  return (
    <Card className="border border-white/10 bg-background/40 backdrop-blur-xl p-6 shadow-lg shadow-black/5">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Open a ticket</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Describe your issue and we'll get back to you soon.
          </p>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="issueType">Issue type</Label>
            <Select
              value={issueType}
              onValueChange={(value) => setValue("issueType", value as TicketFormData["issueType"])}
              disabled={isSubmitting}
            >
              <SelectTrigger id="issueType" className="bg-background/60 backdrop-blur-sm border-white/10">
                <SelectValue placeholder="Select an issue type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Task issue">Task issue</SelectItem>
                <SelectItem value="Referral issue">Referral issue</SelectItem>
                <SelectItem value="Withdrawal issue">Withdrawal issue</SelectItem>
                <SelectItem value="Account & login">Account & login</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.issueType && <p className="text-sm text-destructive">{errors.issueType.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="e.g., My task proof was rejected"
              {...register("subject")}
              disabled={isSubmitting}
              className="bg-background/60 backdrop-blur-sm border-white/10"
            />
            {errors.subject && <p className="text-sm text-destructive">{errors.subject.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Describe the issue</Label>
            <Textarea
              id="description"
              placeholder="Please provide a detailed description of your issue..."
              rows={5}
              {...register("description")}
              disabled={isSubmitting}
              className="bg-background/60 backdrop-blur-sm border-white/10"
            />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="relatedId">Related Task ID / Referral ID (optional)</Label>
            <Input
              id="relatedId"
              placeholder="e.g., TASK12345 or ORDER67890"
              {...register("relatedId")}
              disabled={isSubmitting}
              className="bg-background/60 backdrop-blur-sm border-white/10"
            />
            {errors.relatedId && <p className="text-sm text-destructive">{errors.relatedId.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="attachment">Attach screenshot (optional)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="attachment"
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className="bg-background/60 backdrop-blur-sm border-white/10 h-10 text-sm"
                disabled={isSubmitting}
              />
              <Paperclip className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">
              Max file size: 5MB. Supported formats: Images, PDF
            </p>
            {attachment && (
              <div className="flex items-center gap-2 p-2 bg-muted/20 rounded-md border border-white/10">
                <span className="text-sm text-foreground flex-1 truncate">{attachment.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setAttachment(null)}
                  disabled={isSubmitting}
                >
                  <span className="sr-only">Remove</span>
                </Button>
              </div>
            )}
          </div>

          <Button type="submit" className="w-full button-shine" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit ticket"}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            You'll see your ticket and status in the list below.
          </p>
        </form>
      </div>
    </Card>
  );
}

