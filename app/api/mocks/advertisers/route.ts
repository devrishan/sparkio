import { NextResponse } from "next/server";
import advertisersData from "@/lib/mocks/advertisers.json";

export async function GET() {
  return NextResponse.json(advertisersData);
}

