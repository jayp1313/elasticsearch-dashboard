import { NextResponse } from "next/server";
import client from "@/lib/elasticsearchClient";
import { get } from "lodash";

export async function GET() {
  try {
    const aliasRes = await client.indices.getAlias({ name: "products" });
    const activeIndex = Object.keys(aliasRes)[0];

    if (!activeIndex) {
      return NextResponse.json(
        { error: "No active index found" },
        { status: 404 }
      );
    }

    const res = await client.indices.getSettings({
      index: activeIndex,
      name: "index.analysis.filter.my_stop_filter.stopwords",
    });

    const stopwords = get(
      res,
      [
        activeIndex,
        "settings",
        "index",
        "analysis",
        "filter",
        "my_stop_filter",
        "stopwords",
      ],
      []
    );

    return NextResponse.json({ stopwords });
  } catch (error) {
    console.error("Failed to fetch stopwords", error);
    return NextResponse.json(
      { error: "Failed to fetch stopwords" },
      { status: 500 }
    );
  }
}
