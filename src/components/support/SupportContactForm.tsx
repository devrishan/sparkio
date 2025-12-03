"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";

const supportFormSchema = z.object({
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  category: z.enum(["task", "referral", "withdrawal", "account", "other"]),
  orderId: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type SupportFormData = z.infer<typeof supportFormSchema>;

export function SupportContactForm() {
  const [attachment, setAttachment] = useState<File | null>(null);
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SupportFormData>({
    resolver: zodResolver(supportFormSchema),
    defaultValues: {
      category: "task",
    },
  });

  const category = watch("category");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachment(file);
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
  };

  const onSubmit = async (data: SupportFormData) => {
    // Prevent default form submission
    // In demo mode, just show success toast
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call

    toast({
      title: "Ticket created",
      description: "Ticket created in demo mode. Backend will be wired later.",
    });

    // Reset form
    reset();
    setAttachment(null);
  };

  return (
    <Card className="border-border bg-card p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Open a ticket</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Describe your issue and we'll get back to you soon.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="e.g., Task submission rejected"
              {...register("subject")}
              className={errors.subject ? "border-destructive" : ""}
            />
            {errors.subject && (
              <p className="text-sm text-destructive">{errors.subject.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={category}
              onValueChange={(value) => setValue("category", value as SupportFormData["category"])}
            >
              <SelectTrigger id="category" className={errors.category ? "border-destructive" : ""}>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="task">Task issue</SelectItem>
                <SelectItem value="referral">Referral issue</SelectItem>
                <SelectItem value="withdrawal">Withdrawal issue</SelectItem>
                <SelectItem value="account">Account & login</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-destructive">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="orderId">Order/Task ID (optional)</Label>
            <Input
              id="orderId"
              placeholder="e.g., TASK-12345"
              {...register("orderId")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Describe your issue in detail..."
              rows={6}
              {...register("message")}
              className={errors.message ? "border-destructive" : ""}
            />
            {errors.message && (
              <p className="text-sm text-destructive">{errors.message.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="attachment">Attachment (optional)</Label>
            <div className="space-y-2">
              <Input
                id="attachment"
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("attachment")?.click()}
                className="w-full"
              >
                <Upload className="mr-2 h-4 w-4" />
                {attachment ? "Change file" : "Upload file"}
              </Button>
              {attachment && (
                <div className="flex items-center justify-between rounded-md border border-border bg-muted/50 p-2 text-sm">
                  <span className="truncate text-foreground">{attachment.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={removeAttachment}
                    className="h-6 w-6"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send to support"}
          </Button>
        </form>
      </div>
    </Card>
  );
}

