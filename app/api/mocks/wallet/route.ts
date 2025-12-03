import { NextResponse } from "next/server";
import walletData from "@/lib/mocks/wallet.json";

export async function GET() {
  return NextResponse.json(walletData);
}

