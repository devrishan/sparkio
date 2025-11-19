"use client";

import { useEffect, useState } from "react";
import { Coins, TrendingUp, Award, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: number;
  title: string;
  description: string;
  reward_coins: number;
  reward_money: number;
  reward_xp: number;
  type: string;
  category_name: string;
  product_name: string | null;
  store_name: string | null;
  min_spend: number | null;
  min_user_level: number | null;
  is_eligible: boolean;
  is_completed: boolean;
  user_submission_count: number;
  total_approved_count: number;
  expires_at: string | null;
}

interface TasksResponse {
  success: boolean;
  tasks: Task[];
  user_level: number;
}

export function MemberTasksClient() {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLevel, setUserLevel] = useState(1);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/member/tasks.php");
      const data: TasksResponse = await response.json();
      
      if (data.success) {
        setTasks(data.tasks);
        setUserLevel(data.user_level);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load tasks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTaskTypeColor = (type: string) => {
    switch (type) {
      case "instant":
        return "bg-success/10 text-success border-success/20";
      case "auto_complete":
        return "bg-primary/10 text-primary border-primary/20";
      default:
        return "bg-muted/10 text-muted-foreground border-border";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Available Tasks</h1>
          <p className="text-muted-foreground">
            Complete tasks to earn coins, money, and XP. Your current level: {userLevel}
          </p>
        </div>
      </div>

      {tasks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Award className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-muted-foreground">No tasks available</p>
            <p className="text-sm text-muted-foreground">Check back later for new opportunities!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <Card key={task.id} className="spark-border">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="outline" className={getTaskTypeColor(task.type)}>
                    {task.type.replace("_", " ")}
                  </Badge>
                  {task.is_completed && (
                    <Badge variant="outline" className="bg-muted/20 text-muted-foreground">
                      Completed
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg">{task.title}</CardTitle>
                <CardDescription className="line-clamp-2">{task.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{task.category_name}</span>
                  {task.store_name && <span>• {task.store_name}</span>}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {task.reward_money > 0 && (
                    <div className="flex flex-col items-center gap-1 rounded-lg bg-success/10 p-2">
                      <span className="text-xs text-muted-foreground">Money</span>
                      <span className="text-sm font-bold text-success">₹{task.reward_money}</span>
                    </div>
                  )}
                  {task.reward_coins > 0 && (
                    <div className="flex flex-col items-center gap-1 rounded-lg bg-primary/10 p-2">
                      <Coins className="h-3 w-3 text-primary" />
                      <span className="text-sm font-bold text-primary">{task.reward_coins}</span>
                    </div>
                  )}
                  {task.reward_xp > 0 && (
                    <div className="flex flex-col items-center gap-1 rounded-lg bg-accent/10 p-2">
                      <TrendingUp className="h-3 w-3 text-accent" />
                      <span className="text-sm font-bold text-accent">{task.reward_xp} XP</span>
                    </div>
                  )}
                </div>

                {task.min_spend && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Min spend: ₹{task.min_spend}</span>
                  </div>
                )}

                {task.total_approved_count > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {task.total_approved_count} users completed
                  </p>
                )}

                <Button 
                  className="w-full" 
                  disabled={task.is_completed}
                  onClick={() => {
                    // TODO: Navigate to task details/submission page
                    toast({
                      title: "Coming soon",
                      description: "Task submission will be available shortly",
                    });
                  }}
                >
                  {task.is_completed ? "Completed" : "Start Task"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
