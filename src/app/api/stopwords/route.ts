import { NextRequest, NextResponse } from "next/server";
import client from "@/lib/elasticsearchClient";

export async function GET(req: NextRequest) {
  const index = req.nextUrl.searchParams.get("index");

  if (!index) {
    return NextResponse.json(
      { error: "Missing index parameter" },
      { status: 400 }
    );
  }

  try {
    const res = await client.indices.getSettings({
      index,
      name: "index.analysis.filter.my_stop_filter.stopwords",
    });

    const stopwords =
      res[index]?.settings?.index?.analysis?.filter?.my_stop_filter
        ?.stopwords || [];

    return NextResponse.json({ stopwords });
  } catch (error) {
    console.error("Failed to fetch stopwords", error);
    return NextResponse.json(
      { error: "Failed to fetch stopwords" },
      { status: 500 }
    );
  }
}
