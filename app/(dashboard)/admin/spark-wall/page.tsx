"use client";

/**
 * Admin Spark Wall Management Page
 * 
 * TO REPLACE MOCKS WITH REAL API:
 * 1. Replace useMockData hook with your API call:
 *    const { data: events } = useQuery({
 *      queryKey: ['spark-events'],
 *      queryFn: () => fetch('/api/admin/spark-wall/events').then(r => r.json())
 *    });
 * 
 * 2. Update API endpoints:
 *    - GET /api/admin/spark-wall/events - List events
 *    - POST /api/admin/spark-wall/events/:id/approve - Approve event
 *    - POST /api/admin/spark-wall/events/:id/reject - Reject event
 *    - PUT /api/admin/spark-wall/settings - Update event type toggles
 * 
 * 3. Expected response: Array of events with isApproved flag
 */

import { useState } from "react";
import { DemoBanner } from "@/components/dashboard/DemoBanner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { CheckCircle2, XCircle, Zap, Settings } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useMockData, loadMockJson } from "@/hooks/useMockData";
import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

interface SparkEvent {
  id: string;
  type: string;
  message: string;
  userId: string;
  userName: string;
  timestamp: string;
  isApproved: boolean;
}

export default function AdminSparkWallPage() {
  const { data: events, isLoading } = useMockData<SparkEvent[]>(
    () => loadMockJson("spark-events")
  );
  const [eventTypes, setEventTypes] = useState({
    task_completed: true,
    referral: true,
    withdrawal: true,
    level_up: true,
    achievement: true,
  });

  const handleApproveEvent = (id: string) => {
    toast.success("Event approved", {
      description: "The event will now appear on the Spark Wall.",
    });
  };

  const handleRejectEvent = (id: string) => {
    toast.error("Event rejected", {
      description: "The event has been removed from the Spark Wall.",
    });
  };

  const getEventTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      task_completed: "Task Completed",
      referral: "Referral",
      withdrawal: "Withdrawal",
      level_up: "Level Up",
      achievement: "Achievement",
    };
    return labels[type] || type;
  };

  const getEventTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      task_completed: "bg-green-500/20 text-green-300 border-green-500/40",
      referral: "bg-blue-500/20 text-blue-300 border-blue-500/40",
      withdrawal: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      level_up: "bg-purple-500/20 text-purple-300 border-purple-500/40",
      achievement: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
    };
    return colors[type] || "bg-white/5 text-white/70 border-white/10";
  };

  return (
    <div className="space-y-8">
      <DemoBanner />
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-orange-200/80">Spark Wall</p>
        <h1 className="text-3xl font-semibold text-white">Spark Wall Management</h1>
        <p className="text-sm text-muted-foreground">
          Moderate and manage events displayed on the Spark Wall feed.
        </p>
      </header>

      {/* Event Type Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-orange-300" />
            <CardTitle>Event Type Settings</CardTitle>
          </div>
          <CardDescription>Enable or disable event types on the Spark Wall</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(eventTypes).map(([type, enabled]) => (
            <div key={type} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-white">{getEventTypeLabel(type)}</p>
                <p className="text-sm text-muted-foreground">
                  Show {type.replace("_", " ")} events on Spark Wall
                </p>
              </div>
              <Switch
                checked={enabled}
                onCheckedChange={(checked) =>
                  setEventTypes({ ...eventTypes, [type]: checked })
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Pending Events */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-300" />
            <CardTitle>Pending Events</CardTitle>
          </div>
          <CardDescription>Review and approve events before they appear on Spark Wall</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {!events || events.filter((e) => !e.isApproved).length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Zap className="h-12 w-12 mx-auto mb-3 text-white/30" />
                <p>No pending events</p>
              </div>
            ) : (
              events
                .filter((e) => !e.isApproved)
                .map((event) => (
                  <div
                    key={event.id}
                    className="rounded-lg border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getEventTypeColor(event.type)}>
                            {getEventTypeLabel(event.type)}
                          </Badge>
                        </div>
                        <p className="text-white mb-1">{event.message}</p>
                        <p className="text-sm text-muted-foreground">
                          {event.userName} • {new Date(event.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleApproveEvent(event.id)}
                          className="border-green-500/40 text-green-300 hover:bg-green-500/20"
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRejectEvent(event.id)}
                          className="border-red-500/40 text-red-300 hover:bg-red-500/20"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Approved Events */}
      <Card>
        <CardHeader>
          <CardTitle>Approved Events</CardTitle>
          <CardDescription>Events currently visible on the Spark Wall</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {!events || events.filter((e) => e.isApproved).length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No approved events</p>
              </div>
            ) : (
              events
                .filter((e) => e.isApproved)
                .map((event) => (
                  <div
                    key={event.id}
                    className="rounded-lg border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getEventTypeColor(event.type)}>
                            {getEventTypeLabel(event.type)}
                          </Badge>
                          <Badge variant="outline" className="border-green-500/40 text-green-300">
                            Approved
                          </Badge>
                        </div>
                        <p className="text-white mb-1">{event.message}</p>
                        <p className="text-sm text-muted-foreground">
                          {event.userName} • {new Date(event.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRejectEvent(event.id)}
                        className="border-red-500/40 text-red-300 hover:bg-red-500/20"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ))
            )}
          </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

