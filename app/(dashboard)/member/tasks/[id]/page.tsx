"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader, ErrorScreen, EmptyState } from "@/components/shared";
import { getTask, submitTask } from "@/api/tasks";
import { CheckCircle2, ArrowLeft, Upload, FileText } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import Link from "next/link";

export default function TaskDetailPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.id as string;

  const [proofFile, setProofFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { data: task, isLoading, error } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => getTask(taskId),
  });

  const submitMutation = useMutation({
    mutationFn: () => {
      if (!proofFile) {
        throw new Error("Proof file is required");
      }
      return submitTask(taskId, {
        proof_file: proofFile,
        notes: notes || undefined,
      });
    },
    onSuccess: (data) => {
      if (data.success) {
        setShowSuccessModal(true);
        setProofFile(null);
        setNotes("");
      } else {
        toast.error("Submission failed", {
          description: data.error || "Please try again",
        });
      }
    },
    onError: (error: Error) => {
      toast.error("Submission failed", {
        description: error.message,
      });
    },
  });

  const handleSubmit = () => {
    if (!proofFile) {
      toast.error("Proof required", {
        description: "Please upload a proof file",
      });
      return;
    }
    submitMutation.mutate();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProofFile(file);
    }
  };

  if (isLoading) {
    return <Loader text="Loading task details..." />;
  }

  if (error || !task) {
    return (
      <ErrorScreen
        title="Task not found"
        message="The task you're looking for doesn't exist or has been removed."
        onRetry={() => router.refresh()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/member/tasks">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{task.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">Task Details</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Main Content */}
        <div className="space-y-6">
          {/* Task Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">{task.description}</p>
            </CardContent>
          </Card>

          {/* Submission Form */}
          <Card>
            <CardHeader>
              <CardTitle>Submit Task</CardTitle>
              <CardDescription>Upload proof and submit your task completion</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="proof">Proof File *</Label>
                <div className="relative">
                  <Input
                    id="proof"
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                    disabled={submitMutation.isPending}
                  />
                </div>
                {proofFile && (
                  <p className="text-xs text-muted-foreground">
                    Selected: {proofFile.name} ({(proofFile.size / 1024).toFixed(2)} KB)
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Upload a screenshot, image, or video as proof of task completion
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional notes about your submission..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </div>

              <Button
                onClick={handleSubmit}
                disabled={submitMutation.isPending || !proofFile}
                className="w-full"
              >
                {submitMutation.isPending ? (
                  <>
                    <Loader size="sm" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Submit Task
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rewards</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {task.reward_amount > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground">Cash Reward</p>
                  <p className="text-2xl font-bold text-primary">₹{task.reward_amount.toFixed(2)}</p>
                </div>
              )}
              {task.reward_coins > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground">Coins</p>
                  <p className="text-2xl font-bold text-amber-600">{task.reward_coins}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Task Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                <Badge variant="secondary" className="mt-1">
                  {task.type}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant="outline" className="mt-1">
                  {task.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <DialogTitle className="text-center">Task Submitted Successfully!</DialogTitle>
            <DialogDescription className="text-center">
              Your task submission has been received. We'll review it and update you soon.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowSuccessModal(false)}
            >
              Close
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                setShowSuccessModal(false);
                router.push("/member/tasks");
              }}
            >
              View All Tasks
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

