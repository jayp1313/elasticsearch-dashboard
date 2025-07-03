import { NextResponse, NextRequest } from "next/server";
import client from "@/lib/elasticsearchClient";

export async function POST(req: NextRequest) {
  try {
    const { actions } = await req.json();

    const response = await client.indices.updateAliases({ actions });

    return NextResponse.json(
      { message: "Alias swapped successfully", response },
      { status: 200 }
    );
  } catch (error) {
    console.error("Swap alias error:", error);
    return NextResponse.json(
      { error: error || "Swap failed" },
      { status: 500 }
    );
  }
}
