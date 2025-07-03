import client from "@/lib/elasticsearchClient";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const indexData = await client.cat.indices({
      index: "product*",
      v: true,
      s: "index",
      format: "json",
      h: "index,health,docs.count,store.size,uuid",
    });

    const aliasData = await client.indices.getAlias({
      name: "products",
    });

    const activeIndexName = Object.keys(aliasData)[0];

    const enhancedData = indexData.map((idx) => {
      return {
        ...idx,
        alias: idx.index === activeIndexName ? "products" : null,
      };
    });

    return NextResponse.json(enhancedData);
  } catch (error) {
    console.error("Error fetching index info:", error);
    return NextResponse.json(
      { error: "Failed to fetch index data" },
      { status: 500 }
    );
  }
}
