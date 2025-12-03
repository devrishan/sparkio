import { NextResponse } from "next/server";
import supportTicketsData from "@/lib/mocks/supportTickets.json";

export async function GET() {
  return NextResponse.json(supportTicketsData);
}

