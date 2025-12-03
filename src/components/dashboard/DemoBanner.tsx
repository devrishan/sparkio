"use client";

import { AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

export function DemoBanner() {
  return (
    <Card className="mb-6 border-yellow-500/40 bg-yellow-500/10">
      <div className="flex items-center gap-3 px-4 py-3">
        <AlertCircle className="h-5 w-5 text-yellow-400" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-yellow-200">Demo Mode</p>
          <p className="text-xs text-yellow-200/70">
            This page is using mock data. Connect to real APIs to enable production features.
          </p>
        </div>
      </div>
    </Card>
  );
}

