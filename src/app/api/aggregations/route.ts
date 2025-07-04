import { NextRequest, NextResponse } from "next/server";
import client from "@/lib/elasticsearchClient";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const aggType = searchParams.get("aggType") || "avg";
  const field = searchParams.get("field") || "price";
  const interval = searchParams.get("interval");
  const size = searchParams.get("size");

  try {
    const aliasRes = await client.indices.getAlias({ name: "products" });
    const indexName = Object.keys(aliasRes)[0];

    const aggs: any = {};

    switch (aggType) {
      case "avg":
      case "sum":
      case "min":
      case "max":
        aggs["result"] = { [aggType]: { field } };
        break;
      case "terms":
        aggs["result"] = {
          terms: { field, size: size ? parseInt(size) : 5 },
        };
        break;
      case "histogram":
        aggs["result"] = {
          histogram: { field, interval: interval ? parseInt(interval) : 10 },
        };
        break;
      case "date_histogram":
        aggs["result"] = {
          date_histogram: {
            field,
            calendar_interval: interval || "day",
          },
        };
        break;
      default:
        return NextResponse.json(
          { error: "Unsupported aggregation type" },
          { status: 400 }
        );
    }

    const response = await client.search({
      index: indexName,
      size: 0,
      body: { aggs },
    });

    return NextResponse.json(response.aggregations?.result || {});
  } catch (error) {
    console.error("Aggregation fetch error", error);
    return NextResponse.json(
      { error: "Failed to fetch aggregation" },
      { status: 500 }
    );
  }
}
