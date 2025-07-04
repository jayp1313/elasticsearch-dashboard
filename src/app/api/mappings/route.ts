import client from "@/lib/elasticsearchClient";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const aliasData = await client.indices.getAlias({ name: "products" });
    const activeIndexName = Object.keys(aliasData)[0];
    const data = await client.indices.getMapping({
      index: activeIndexName,
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
