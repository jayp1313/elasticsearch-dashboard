import { NextResponse } from "next/server";
import client from "@/lib/elasticsearchClient";

export async function GET() {
  try {
    const aliasName = "products";
    const aliasData = await client.indices.getAlias({ name: aliasName });

    const activeIndexName = Object.keys(aliasData)[0];

    return NextResponse.json({
      activeIndex: activeIndexName,
      alias: aliasName,
    });
  } catch (error) {
    console.error("Failed to fetch active index:", error);
    return NextResponse.json(
      { error: "Failed to fetch active index" },
      { status: 500 }
    );
  }
}
