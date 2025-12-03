"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Clock, Upload, XCircle, AlertCircle, Eye, FileText } from "lucide-react";
import { TaskSubmissionDialog } from "@/components/member/task-submission-dialog";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { getMockToken } from "@/lib/auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  rewardRange: {
    min: number;
    max: number;
  };
  rewardAmount: number;
  requirements: string;
  proofTypes: string[];
  difficulty: string;
  maxSubmissions: number | null;
  expiresAt: string | null;
}

interface TaskSubmission {
  id: string;
  taskId: string;
  taskTitle: string;
  status: "approved" | "pending" | "rejected";
  reward: number;
  proofUrl: string;
  proofType: string | null;
  notes: string | null;
  rejectionReason: string | null;
  submittedAt: string;
  reviewedAt: string | null;
}

interface TasksResponse {
  categories?: {
    "upi-purchase": { name: string; tasks: Task[] };
    "app-referrals": { name: string; tasks: Task[] };
    "social-tasks": { name: string; tasks: Task[] };
  };
  tasks?: Task[];
}

interface SubmissionsResponse {
  submissions: TaskSubmission[];
  stats: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
  };
}

async function fetchTasks(category?: string): Promise<TasksResponse> {
  const token = getMockToken();
  if (!token) {
    throw new Error("No authentication token found");
  }

  const url = category
    ? `/api/mocks/member/tasks?category=${category}`
    : "/api/mocks/member/tasks";

  const response = await fetch(url, {
    credentials: "include",
    headers: {
      "x-mock-token": token,
    },
  });

  if (response.status === 401) {
    // Redirect to login on 401
    if (typeof window !== "undefined") {
      window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`;
    }
    throw new Error("Unauthorized");
  }
  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }

  return response.json();
}

async function fetchSubmissions(status?: string): Promise<SubmissionsResponse> {
  const token = getMockToken();
  if (!token) {
    throw new Error("No authentication token found");
  }

  const url = status
    ? `/api/mocks/member/tasks/submissions?status=${status}`
    : "/api/mocks/member/tasks/submissions";

  const response = await fetch(url, {
    credentials: "include",
    headers: {
      "x-mock-token": token,
    },
  });

  if (response.status === 401) {
    // Redirect to login on 401
    if (typeof window !== "undefined") {
      window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`;
    }
    throw new Error("Unauthorized");
  }
  if (!response.ok) {
    throw new Error("Failed to fetch submissions");
  }

  return response.json();
}

function TaskDetailModal({ task }: { task: Task }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full">
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task.title}</DialogTitle>
          <DialogDescription>{task.description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Reward</h4>
            <p className="text-lg text-primary">
              ₹{task.rewardRange.min} - ₹{task.rewardRange.max}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Requirements</h4>
            <p className="text-sm text-muted-foreground">{task.requirements}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Proof Types Accepted</h4>
            <div className="flex flex-wrap gap-2">
              {task.proofTypes.map((type) => (
                <Badge key={type} variant="secondary">
                  {type.replace("_", " ")}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Difficulty</h4>
            <Badge variant="outline">{task.difficulty}</Badge>
          </div>
          {task.maxSubmissions && (
            <div>
              <h4 className="font-semibold mb-2">Submission Limit</h4>
              <p className="text-sm text-muted-foreground">
                Maximum {task.maxSubmissions} submission{task.maxSubmissions !== 1 ? "s" : ""}
              </p>
            </div>
          )}
          <TaskSubmissionDialog taskId={task.id} taskTitle={task.title}>
            <Button className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              Submit Proof
            </Button>
          </TaskSubmissionDialog>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function MemberTasksClient() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [submissionStatus, setSubmissionStatus] = useState<string>("all");

  const { data: tasksData, isLoading: tasksLoading, error: tasksError } = useQuery<TasksResponse>({
    queryKey: ["tasks", activeCategory],
    queryFn: () => fetchTasks(activeCategory === "all" ? undefined : activeCategory),
    retry: false,
  });

  const { data: submissionsData, isLoading: submissionsLoading } = useQuery<SubmissionsResponse>({
    queryKey: ["task-submissions", submissionStatus],
    queryFn: () => fetchSubmissions(submissionStatus === "all" ? undefined : submissionStatus),
    retry: false,
  });

  const allTasks: Task[] = tasksData?.categories
    ? [
        ...(tasksData.categories["upi-purchase"]?.tasks || []),
        ...(tasksData.categories["app-referrals"]?.tasks || []),
        ...(tasksData.categories["social-tasks"]?.tasks || []),
      ]
    : tasksData?.tasks || [];

  const currentCategoryTasks =
    activeCategory === "all"
      ? allTasks
      : tasksData?.categories?.[activeCategory as keyof typeof tasksData.categories]?.tasks || [];

  if (tasksLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <LoadingSkeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  if (tasksError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-semibold mb-2">Failed to load tasks</h3>
        <p className="text-sm text-muted-foreground">
          {tasksError instanceof Error ? tasksError.message : "An error occurred while loading tasks"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Tasks</TabsTrigger>
          <TabsTrigger value="upi-purchase">UPI & Purchase</TabsTrigger>
          <TabsTrigger value="app-referrals">App Referrals</TabsTrigger>
          <TabsTrigger value="social-tasks">Social Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value={activeCategory} className="mt-6">
          {currentCategoryTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No tasks available</h3>
              <p className="text-sm text-muted-foreground">
                Check back later for new tasks in this category.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {currentCategoryTasks.map((task) => (
                <Card key={task.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <Badge variant="outline">{task.category}</Badge>
                      <div className="flex flex-col items-end gap-1">
                        <div className="text-lg font-bold text-primary">
                          ₹{task.rewardRange.min} - ₹{task.rewardRange.max}
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-xl">{task.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{task.description}</CardDescription>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {task.difficulty}
                      </Badge>
                      {task.maxSubmissions && (
                        <span className="text-xs text-muted-foreground">
                          Max {task.maxSubmissions}
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {task.requirements}
                    </p>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-2">
                    <TaskDetailModal task={task} />
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Task Submissions Section */}
      <div className="mt-8 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Your Task Submissions</h2>
          {submissionsData && (
            <div className="flex gap-2">
              <Button
                variant={submissionStatus === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSubmissionStatus("all")}
              >
                All ({submissionsData.stats.total})
              </Button>
              <Button
                variant={submissionStatus === "approved" ? "default" : "outline"}
                size="sm"
                onClick={() => setSubmissionStatus("approved")}
              >
                Approved ({submissionsData.stats.approved})
              </Button>
              <Button
                variant={submissionStatus === "pending" ? "default" : "outline"}
                size="sm"
                onClick={() => setSubmissionStatus("pending")}
              >
                Pending ({submissionsData.stats.pending})
              </Button>
              <Button
                variant={submissionStatus === "rejected" ? "default" : "outline"}
                size="sm"
                onClick={() => setSubmissionStatus("rejected")}
              >
                Rejected ({submissionsData.stats.rejected})
              </Button>
            </div>
          )}
        </div>

        {submissionsLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <LoadingSkeleton key={i} className="h-48" />
            ))}
          </div>
        ) : submissionsData && submissionsData.submissions.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {submissionsData.submissions.map((submission) => {
              const statusColors = {
                approved: "bg-green-500/10 text-green-600 border-green-500/20",
                pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
                rejected: "bg-red-500/10 text-red-600 border-red-500/20",
              };

              return (
                <Card key={submission.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg">{submission.taskTitle}</CardTitle>
                      <Badge className={statusColors[submission.status]} variant="outline">
                        {submission.status}
                      </Badge>
                    </div>
                    <CardDescription>
                      Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-medium">Reward</p>
                      <p className="text-lg text-primary">₹{submission.reward}</p>
                    </div>
                    {submission.status === "approved" && submission.proofUrl && (
                      <div>
                        <p className="text-sm font-medium mb-2">Proof</p>
                        <img
                          src={submission.proofUrl}
                          alt="Proof"
                          className="w-full h-32 object-cover rounded-md"
                        />
                      </div>
                    )}
                    {submission.status === "rejected" && submission.rejectionReason && (
                      <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3">
                        <p className="text-sm font-medium text-red-600 mb-1">Rejection Reason</p>
                        <p className="text-xs text-muted-foreground">{submission.rejectionReason}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 w-full"
                          onClick={() => {
                            // Re-submit logic would go here
                            console.log("Re-submit task:", submission.taskId);
                          }}
                        >
                          Re-submit
                        </Button>
                      </div>
                    )}
                    {submission.status === "pending" && (
                      <div className="flex items-center gap-2 text-sm text-yellow-600">
                        <Clock className="h-4 w-4" />
                        Under review
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No submissions yet</h3>
            <p className="text-sm text-muted-foreground">
              Complete tasks above and submit proof to see your submissions here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
