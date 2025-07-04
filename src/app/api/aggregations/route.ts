import { NextRequest, NextResponse } from "next/server";
import client from "@/lib/elasticsearchClient";
import { estypes } from "@elastic/elasticsearch";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const aggType = searchParams.get("aggType") || "avg";
  const field = searchParams.get("field") || "price";
  const interval = searchParams.get("interval");
  const size = searchParams.get("size");

  try {
    const aliasRes = await client.indices.getAlias({ name: "products" });
    const indexName = Object.keys(aliasRes)[0];

    const aggs: Record<string, estypes.AggregationsAggregationContainer> = {};

    switch (aggType) {
      case "avg":
      case "sum":
      case "min":
      case "max":
        aggs.result = { [aggType]: { field } };
        break;
      case "terms":
        aggs.result = {
          terms: {
            field,
            size: size ? parseInt(size) : 5,
          } as estypes.AggregationsTermsAggregation,
        };
        break;
      case "histogram":
        aggs.result = {
          histogram: {
            field,
            interval: interval ? parseInt(interval) : 10,
          } as estypes.AggregationsHistogramAggregation,
        };
        break;
      case "date_histogram":
        aggs.result = {
          date_histogram: {
            field,
            calendar_interval:
              interval || ("day" as estypes.AggregationsCalendarInterval),
            format: "yyyy-MM-dd",
          } as estypes.AggregationsDateHistogramAggregation,
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
      aggs,
    });

    const result = response.aggregations?.result;
    return NextResponse.json(result ?? {});
  } catch (error) {
    console.error("Aggregation fetch error", error);
    return NextResponse.json(
      {
        error: "Failed to fetch aggregation",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
