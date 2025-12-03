"use client";

import Link from "next/link";
import { useSession } from "@/components/providers/session-provider";
import { EarniqLogo } from "@/components/auth/EarniqLogo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Wallet, CheckCircle2, Clock, Users, Loader2 } from "lucide-react";

const navTabs = [
  { label: "Dashboard", href: "/member/dashboard", active: true },
  { label: "Tasks", href: "/member/tasks", active: false },
  { label: "Referrals", href: "/member/referrals", active: false },
  { label: "Wallet", href: "/member/withdraw", active: false },
];

const dummyTasks = [
  { name: "Complete Profile Setup", status: "Completed", reward: "₹50.00" },
  { name: "Verify Email Address", status: "Pending", reward: "₹25.00" },
  { name: "Share Referral Link", status: "In Progress", reward: "₹100.00" },
];

const dummyActivity = [
  { type: "Task Reward", amount: "+₹50.00", date: "2 hours ago", status: "Completed" },
  { type: "Referral Bonus", amount: "+₹200.00", date: "1 day ago", status: "Completed" },
  { type: "Withdrawal", amount: "-₹500.00", date: "3 days ago", status: "Processed" },
];

export function MemberDashboardPlaceholder() {
  const { user, status, signOut } = useSession();
  const isLoading = status === "loading";
  const username = user?.username || "Member";
  const userInitials = username
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "M";

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
          <EarniqLogo href="/member/dashboard" />

          {/* Navigation Tabs */}
          <div className="hidden items-center gap-1 md:flex">
            {navTabs.map((tab) => (
              <Button
                key={tab.label}
                asChild
                variant={tab.active ? "default" : "ghost"}
                size="sm"
                className={tab.active ? "bg-primary text-primary-foreground" : ""}
              >
                <Link href={tab.href}>{tab.label}</Link>
              </Button>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/20 text-primary">{userInitials}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{username}</p>
                    <p className="text-xs text-muted-foreground">{user?.email || "user@example.com"}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/member/dashboard">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="border-t border-border px-4 py-2 md:hidden">
          <div className="flex items-center gap-1 overflow-x-auto">
            {navTabs.map((tab) => (
              <Button
                key={tab.label}
                asChild
                variant={tab.active ? "default" : "ghost"}
                size="sm"
                className={tab.active ? "bg-primary text-primary-foreground" : ""}
              >
                <Link href={tab.href}>{tab.label}</Link>
              </Button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 lg:px-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight">
                Hi, {username}! Here's your Earniq snapshot.
              </h1>
              <p className="text-muted-foreground">Track your earnings, tasks, and referrals in one place.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹0.00</div>
                  <p className="text-xs text-muted-foreground">Available for withdrawal</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Earnings</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹125.00</div>
                  <p className="text-xs text-muted-foreground">Awaiting verification</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1</div>
                  <p className="text-xs text-muted-foreground">Out of 3 tasks</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Referrals</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">Total referrals</p>
                </CardContent>
              </Card>
            </div>

            {/* Tasks and Activity Section */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Your Tasks */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Tasks</CardTitle>
                  <CardDescription>Complete tasks to earn rewards</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Task Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Reward</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dummyTasks.map((task, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{task.name}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                task.status === "Completed"
                                  ? "bg-green-500/10 text-green-500"
                                  : task.status === "Pending"
                                    ? "bg-yellow-500/10 text-yellow-500"
                                    : "bg-blue-500/10 text-blue-500"
                              }`}
                            >
                              {task.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right font-medium">{task.reward}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest transactions and earnings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dummyActivity.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{activity.type}</p>
                          <p className="text-xs text-muted-foreground">{activity.date}</p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-sm font-semibold ${
                              activity.amount.startsWith("+") ? "text-green-500" : "text-red-500"
                            }`}
                          >
                            {activity.amount}
                          </p>
                          <p className="text-xs text-muted-foreground">{activity.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

