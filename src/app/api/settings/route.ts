import client from "@/lib/elasticsearchClient";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await client.indices.getSettings({
      index: "*",
      expand_wildcards: "all",
      filter_path: "*.settings.index.*.slowlog",
    });

    return NextResponse.json(res);
  } catch (error) {
    console.error("Elasticsearch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings", details: error },
      { status: 500 }
    );
  }
}
