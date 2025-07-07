import { NextResponse } from "next/server";
import client from "@/lib/elasticsearchClient";
import { Index, Settings } from "@/types/types";

export async function POST() {
  try {
    const res = await client.get({
      index: "app-settings",
      id: "config",
    });

    const settings = res._source as Settings;

    const oldIndexesToKeep = settings.oldIndexesToKeep || 3;

    const allIndexes = await client.cat.indices({
      index: "product-*",
      format: "json",
      h: ["index"],
    });

    const productIndexes = (allIndexes as Index[])
      .map((i) => i.index)
      .filter((i) => i.startsWith("product-"))
      .sort((a, b) => (a > b ? -1 : 1));

    const toDelete = productIndexes.slice(oldIndexesToKeep);

    const deletePromises = toDelete.map((index) =>
      client.indices.delete({ index })
    );
    await Promise.all(deletePromises);

    return NextResponse.json({ deleted: toDelete });
  } catch (err) {
    console.error("Cleanup task failed:", err);
    return NextResponse.json({ error: "Cleanup failed" }, { status: 500 });
  }
}
