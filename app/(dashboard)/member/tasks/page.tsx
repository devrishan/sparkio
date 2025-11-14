import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, Upload } from "lucide-react";

// Mock tasks data - will be replaced with API call
const tasks = [
  {
    id: "1",
    title: "Like our Facebook Post",
    description: "Like and share our latest Facebook post about Earniq",
    reward: 5,
    status: "available",
    category: "Social Media",
  },
  {
    id: "2",
    title: "Follow us on Instagram",
    description: "Follow @earniq.official on Instagram and share to your story",
    reward: 10,
    status: "available",
    category: "Social Media",
  },
  {
    id: "3",
    title: "Complete Survey",
    description: "Fill out a 5-minute survey about your online shopping habits",
    reward: 15,
    status: "pending",
    category: "Survey",
  },
  {
    id: "4",
    title: "Watch Video Ad",
    description: "Watch a 30-second promotional video",
    reward: 3,
    status: "completed",
    category: "Advertisement",
  },
];

export default function MemberTasksPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">Available Tasks</h1>
        <p className="text-sm text-muted-foreground">
          Complete tasks and earn rewards. Upload proof to get verified.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <Card key={task.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <Badge variant="outline">{task.category}</Badge>
                <div className="text-lg font-bold text-primary">₹{task.reward}</div>
              </div>
              <CardTitle className="text-xl">{task.title}</CardTitle>
              <CardDescription>{task.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              {task.status === "pending" && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Pending verification
                </div>
              )}
              {task.status === "completed" && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle2 className="h-4 w-4" />
                  Completed
                </div>
              )}
            </CardContent>
            <CardFooter>
              {task.status === "available" && (
                <Button className="w-full gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Proof
                </Button>
              )}
              {task.status === "pending" && (
                <Button variant="outline" className="w-full" disabled>
                  Awaiting Review
                </Button>
              )}
              {task.status === "completed" && (
                <Button variant="secondary" className="w-full" disabled>
                  Completed
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
