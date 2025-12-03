"use client";

/**
 * Admin Advertisers Dashboard
 * 
 * TO REPLACE MOCKS WITH REAL API:
 * 1. Replace useMockData hook with your API call:
 *    const { data: campaigns } = useQuery({
 *      queryKey: ['advertisers'],
 *      queryFn: () => fetch('/api/admin/advertisers').then(r => r.json())
 *    });
 * 
 * 2. Update API endpoints:
 *    - GET /api/admin/advertisers - List campaigns
 *    - POST /api/admin/advertisers/campaigns - Create campaign
 *    - PUT /api/admin/advertisers/campaigns/:id - Update campaign
 *    - POST /api/admin/advertisers/campaigns/:id/pause - Pause campaign
 *    - POST /api/admin/advertisers/campaigns/:id/resume - Resume campaign
 * 
 * 3. Expected response: Array of campaigns with demographics
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Users, Target, DollarSign, BarChart3, Play, Pause, Square } from "lucide-react";
import { DemoBanner } from "@/components/dashboard/DemoBanner";
import { useMockData, loadMockJson } from "@/hooks/useMockData";
import { formatAmount } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface AdvertiserCampaign {
  id: string;
  name: string;
  advertiser: string;
  status: string;
  budget: number;
  spent: number;
  conversions: number;
  costPerConversion: number;
  startDate: string;
  endDate?: string | null;
  demographics: {
    ageGroups: Record<string, number>;
    locations: Record<string, number>;
    devices: Record<string, number>;
  };
}

export default function AdminAdvertisersPage() {
  const { data: campaigns, isLoading } = useMockData<AdvertiserCampaign[]>(
    () => loadMockJson("advertisers")
  );

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      active: "default",
      paused: "secondary",
      completed: "outline",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: "border-green-500/40 bg-green-500/10",
      paused: "border-yellow-500/40 bg-yellow-500/10",
      completed: "border-gray-500/40 bg-gray-500/10",
    };
    return colors[status] || "border-white/10 bg-white/5";
  };

  if (isLoading || !campaigns) {
    return (
      <div className="space-y-8">
        <DemoBanner />
        <header className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </header>
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <DemoBanner />
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-orange-200/80">Advertisers</p>
        <h1 className="text-3xl font-semibold text-white">Advertiser Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Manage campaigns, track performance, and analyze advertiser metrics.
        </p>
      </header>

      {/* Campaign Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-blue-500/40 bg-gradient-to-br from-blue-500/20 via-blue-500/10 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Campaigns</CardTitle>
            <Target className="h-5 w-5 text-blue-300" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{campaigns.length}</div>
            <p className="text-xs text-white/70 mt-1">
              {campaigns.filter((c) => c.status === "active").length} active
            </p>
          </CardContent>
        </Card>

        <Card className="border-emerald-500/40 bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Budget</CardTitle>
            <DollarSign className="h-5 w-5 text-emerald-300" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {formatAmount(campaigns.reduce((sum, c) => sum + c.budget, 0))}
            </div>
            <p className="text-xs text-white/70 mt-1">All campaigns</p>
          </CardContent>
        </Card>

        <Card className="border-purple-500/40 bg-gradient-to-br from-purple-500/20 via-purple-500/10 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Conversions</CardTitle>
            <Users className="h-5 w-5 text-purple-300" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {campaigns.reduce((sum, c) => sum + c.conversions, 0).toLocaleString()}
            </div>
            <p className="text-xs text-white/70 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card className="border-orange-500/40 bg-gradient-to-br from-orange-500/20 via-orange-500/10 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Avg Cost/Conversion</CardTitle>
            <TrendingUp className="h-5 w-5 text-orange-300" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {formatAmount(
                campaigns.reduce((sum, c) => sum + c.costPerConversion, 0) / campaigns.length
              )}
            </div>
            <p className="text-xs text-white/70 mt-1">Average</p>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-orange-300" />
            Campaigns
          </CardTitle>
          <CardDescription>View and manage all advertiser campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-64 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {campaigns.map((campaign) => {
              const spentPercentage = (campaign.spent / campaign.budget) * 100;
              return (
                <div
                  key={campaign.id}
                  className={cn(
                    "rounded-lg border p-4",
                    getStatusColor(campaign.status)
                  )}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-white">{campaign.name}</h3>
                        {getStatusBadge(campaign.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Advertiser: {campaign.advertiser}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(campaign.startDate).toLocaleDateString()} -{" "}
                        {campaign.endDate
                          ? new Date(campaign.endDate).toLocaleDateString()
                          : "Ongoing"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {campaign.status === "active" && (
                        <Button size="sm" variant="outline">
                          <Pause className="h-4 w-4 mr-1" />
                          Pause
                        </Button>
                      )}
                      {campaign.status === "paused" && (
                        <Button size="sm" variant="outline">
                          <Play className="h-4 w-4 mr-1" />
                          Resume
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Budget Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white/70">Budget Usage</span>
                      <span className="text-sm font-semibold text-white">
                        {formatAmount(campaign.spent)} / {formatAmount(campaign.budget)}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/10">
                      <div
                        className="h-2 rounded-full bg-orange-500 transition-all"
                        style={{ width: `${Math.min(100, spentPercentage)}%` }}
                      />
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Conversions</p>
                      <p className="text-2xl font-bold text-white">{campaign.conversions.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Cost per Conversion</p>
                      <p className="text-2xl font-bold text-white">
                        {formatAmount(campaign.costPerConversion)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Remaining Budget</p>
                      <p className="text-2xl font-bold text-white">
                        {formatAmount(campaign.budget - campaign.spent)}
                      </p>
                    </div>
                  </div>

                  {/* Demographics */}
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-sm font-semibold text-white mb-3">Demographics</p>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">Age Groups</p>
                        <div className="space-y-1">
                          {Object.entries(campaign.demographics.ageGroups).map(([age, pct]) => (
                            <div key={age} className="flex items-center justify-between text-xs">
                              <span className="text-white/70">{age}</span>
                              <span className="text-white">{pct}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">Top Locations</p>
                        <div className="space-y-1">
                          {Object.entries(campaign.demographics.locations)
                            .slice(0, 3)
                            .map(([loc, pct]) => (
                              <div key={loc} className="flex items-center justify-between text-xs">
                                <span className="text-white/70">{loc}</span>
                                <span className="text-white">{pct}%</span>
                              </div>
                            ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">Devices</p>
                        <div className="space-y-1">
                          {Object.entries(campaign.demographics.devices).map(([device, pct]) => (
                            <div key={device} className="flex items-center justify-between text-xs">
                              <span className="text-white/70">{device}</span>
                              <span className="text-white">{pct}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

