"use client";

/**
 * Admin Finance Dashboard
 * 
 * TO REPLACE MOCKS WITH REAL API:
 * 1. Replace useMockData hook with your API call:
 *    const { data: financeData } = useQuery({
 *      queryKey: ['finance'],
 *      queryFn: () => fetch('/api/admin/finance').then(r => r.json())
 *    });
 * 
 * 2. Update API endpoint: /api/admin/finance
 * 3. Expected response: { revenue, payouts, profit, byCategory[], monthly[], transactions[] }
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3 } from "lucide-react";
import { DemoBanner } from "@/components/dashboard/DemoBanner";
import { useMockData, loadMockJson } from "@/hooks/useMockData";
import { formatAmount } from "@/lib/utils";

interface FinanceData {
  revenue: { total: number; thisMonth: number; lastMonth: number; growth: number };
  payouts: { total: number; thisMonth: number; lastMonth: number; growth: number };
  profit: { total: number; thisMonth: number; margin: number };
  byCategory: Array<{ category: string; revenue: number; payouts: number; profit: number }>;
  monthly: Array<{ month: string; revenue: number; payouts: number; profit: number }>;
  transactions: Array<{ id: string; type: string; amount: number; description: string; timestamp: string }>;
}

export default function AdminFinancePage() {
  const { data: financeData, isLoading } = useMockData<FinanceData>(
    () => loadMockJson("finance")
  );

  if (isLoading || !financeData) {
    return (
      <div className="space-y-8">
        <DemoBanner />
        <header className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </header>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
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
        <p className="text-xs uppercase tracking-[0.3em] text-orange-200/80">Finance</p>
        <h1 className="text-3xl font-semibold text-white">Profit & Loss Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Track revenue, payouts, and profitability across all categories.
        </p>
      </header>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-blue-500/40 bg-gradient-to-br from-blue-500/20 via-blue-500/10 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-blue-300" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{formatAmount(financeData.revenue.total)}</div>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-500">
                {financeData.revenue.growth > 0 ? "+" : ""}{financeData.revenue.growth}%
              </span>
              <span className="text-xs text-white/70">vs last month</span>
            </div>
            <p className="text-xs text-white/70 mt-1">
              This month: {formatAmount(financeData.revenue.thisMonth)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-red-500/40 bg-gradient-to-br from-red-500/20 via-red-500/10 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Payouts</CardTitle>
            <TrendingDown className="h-5 w-5 text-red-300" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{formatAmount(financeData.payouts.total)}</div>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp className="h-4 w-4 text-red-500" />
              <span className="text-sm text-red-500">
                {financeData.payouts.growth > 0 ? "+" : ""}{financeData.payouts.growth}%
              </span>
              <span className="text-xs text-white/70">vs last month</span>
            </div>
            <p className="text-xs text-white/70 mt-1">
              This month: {formatAmount(financeData.payouts.thisMonth)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-emerald-500/40 bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Net Profit</CardTitle>
            <PieChart className="h-5 w-5 text-emerald-300" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{formatAmount(financeData.profit.total)}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="border-emerald-500/40 text-emerald-300">
                {financeData.profit.margin}% margin
              </Badge>
            </div>
            <p className="text-xs text-white/70 mt-1">
              This month: {formatAmount(financeData.profit.thisMonth)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue by Category */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-orange-300" />
            Revenue by Category
          </CardTitle>
          <CardDescription>Breakdown of revenue, payouts, and profit by task category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {financeData.byCategory.map((cat) => (
              <div key={cat.category} className="rounded-lg border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-white">{cat.category}</h3>
                  <Badge variant="outline">
                    {((cat.profit / cat.revenue) * 100).toFixed(1)}% margin
                  </Badge>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="text-lg font-bold text-white">{formatAmount(cat.revenue)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payouts</p>
                    <p className="text-lg font-bold text-red-300">{formatAmount(cat.payouts)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Profit</p>
                    <p className="text-lg font-bold text-emerald-300">{formatAmount(cat.profit)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Comparison</CardTitle>
          <CardDescription>Revenue, payouts, and profit trends over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-muted-foreground">Month</th>
                  <th className="text-right py-3 px-4 text-muted-foreground">Revenue</th>
                  <th className="text-right py-3 px-4 text-muted-foreground">Payouts</th>
                  <th className="text-right py-3 px-4 text-muted-foreground">Profit</th>
                  <th className="text-right py-3 px-4 text-muted-foreground">Margin</th>
                </tr>
              </thead>
              <tbody>
                {financeData.monthly.map((month) => {
                  const margin = (month.profit / month.revenue) * 100;
                  return (
                    <tr key={month.month} className="border-b border-white/5">
                      <td className="py-3 px-4 font-medium text-white">{month.month}</td>
                      <td className="py-3 px-4 text-right text-white">{formatAmount(month.revenue)}</td>
                      <td className="py-3 px-4 text-right text-red-300">{formatAmount(month.payouts)}</td>
                      <td className="py-3 px-4 text-right text-emerald-300">{formatAmount(month.profit)}</td>
                      <td className="py-3 px-4 text-right">
                        <Badge variant="outline">{margin.toFixed(1)}%</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

