import client from "@/lib/elasticsearchClient";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await client.indices.getMapping({
      index: "product-*",
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching mappings:", error);
    return NextResponse.json(
      { error: "Failed to fetch mappings" },
      { status: 500 }
    );
  }
}
