import { NextResponse } from "next/server";

export async function POST() {
  console.log("🔄 Delta update simulated (no real source)");
  return NextResponse.json({ message: "Delta update simulated" });
}
