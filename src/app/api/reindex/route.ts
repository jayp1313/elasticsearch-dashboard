import { NextResponse } from "next/server";
import client from "@/lib/elasticsearchClient";
import { fetchAllProducts } from "@/lib/dataSource";

export async function POST() {
  try {
    const newIndex = `product-${new Date()
      .toISOString()
      .replace(/[-:T.Z]/g, "")
      .slice(0, 12)}`;

    await client.indices.create({
      index: newIndex,
      body: {
        settings: {
          analysis: {
            filter: {
              my_stop_filter: {
                type: "stop",
                stopwords: ["the", "and", "is", "at", "which", "on"],
              },
            },
            analyzer: {
              custom_english: {
                type: "custom",
                tokenizer: "standard",
                filter: ["lowercase", "my_stop_filter"],
              },
            },
          },
        },
        mappings: {
          properties: {
            id: { type: "keyword" },
            name: { type: "text", analyzer: "custom_english" },
            category: { type: "keyword" },
            price: { type: "float" },
            stock: { type: "integer" },
            in_stock: { type: "boolean" },
            created_at: { type: "date" },
          },
        },
      },
    });

    const products = await fetchAllProducts();
    const body = products.flatMap((doc: any) => [{ index: {} }, doc]);

    const bulkResponse = await client.bulk({
      index: newIndex,
      body,
      refresh: true,
    });

    if (bulkResponse.errors) {
      console.error("Bulk insert had errors:", bulkResponse.items);
      return NextResponse.json(
        {
          error: "Partial failure in bulk insert",
          details: bulkResponse.items,
        },
        { status: 500 }
      );
    }

    const actions = [
      { remove: { index: "*", alias: "products" } },
      { add: { index: newIndex, alias: "products" } },
    ];

    await client.indices.updateAliases({ actions });

    return NextResponse.json({
      message: "Full reindex completed",
      index: newIndex,
    });
  } catch (error) {
    console.error("Full reindex failed:", error);
    return NextResponse.json(
      { error: "Reindexing failed", details: error },
      { status: 500 }
    );
  }
}
