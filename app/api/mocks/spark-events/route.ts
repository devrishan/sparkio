import { NextResponse } from "next/server";
import sparkEventsData from "@/lib/mocks/sparkEvents.json";

export async function GET() {
  return NextResponse.json(sparkEventsData);
}

