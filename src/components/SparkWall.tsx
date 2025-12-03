"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { getMockToken } from "@/lib/auth";

interface SparkEvent {
  id: string;
  type: string;
  userId: string;
  message: string;
  amount?: number;
  timestamp: string;
}

export function SparkWall() {
  const [events, setEvents] = useState<SparkEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchEvents = async () => {
    try {
      const token = getMockToken();
      const response = await fetch("/api/mocks/spark-wall", {
        headers: token ? { "x-mock-token": token } : {},
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch spark wall events");
      }

      const data = await response.json();
      if (data.events) {
        setEvents(data.events);
        setError(null);
      }
    } catch (err) {
      console.error("Error fetching spark wall events:", err);
      setError("Failed to load events");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchEvents();

    // Poll every 20 seconds for live feed effect
    pollingIntervalRef.current = setInterval(() => {
      fetchEvents();
    }, 20000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Spark Wall
          </CardTitle>
          <CardDescription>Real-time feed of user achievements and activities</CardDescription>
        </CardHeader>
        <CardContent>
          <LoadingSkeleton className="h-64" />
        </CardContent>
      </Card>
    );
  }

  if (error && events.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Loader2 className="h-12 w-12 text-muted-foreground mb-4 animate-spin" />
          <h3 className="text-lg font-semibold mb-2">Failed to load Spark Wall</h3>
          <p className="text-sm text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle>Spark Wall</CardTitle>
          <span className="ml-auto text-xs text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400 px-2 py-1 rounded-full">
            Live
          </span>
        </div>
        <CardDescription>Real-time feed of user achievements and activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {events.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-sm text-muted-foreground">No events yet</p>
            </div>
          ) : (
            events.map((event) => (
              <div
                key={event.id}
                className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-3 transition-all hover:bg-muted/50"
              >
                <div className="rounded-full bg-primary/10 p-1.5 flex-shrink-0">
                  <Sparkles className="h-3 w-3 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{event.message}</p>
                  {event.amount && (
                    <p className="text-xs font-medium text-primary mt-1">₹{event.amount}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(event.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
