import { NextResponse } from "next/server";
import leaderboardData from "@/lib/mocks/leaderboard.json";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") || "weekly";
  
  const data = leaderboardData[period as keyof typeof leaderboardData] || leaderboardData.weekly;
  return NextResponse.json(data);
}
