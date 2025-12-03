import { NextResponse } from "next/server";
import financeData from "@/lib/mocks/financeOverview.json";

export async function GET() {
  return NextResponse.json(financeData);
}

