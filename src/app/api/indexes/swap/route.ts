import { NextResponse, NextRequest } from "next/server";
import client from "@/lib/elasticsearchClient";

export async function POST(req: NextRequest) {
  try {
    const { newIndex } = await req.json();

    if (!newIndex) {
      return NextResponse.json({ error: "Missing newIndex" }, { status: 400 });
    }

    const aliasRes = await client.indices.getAlias({ name: "products" });
    const currentActiveIndex = Object.keys(aliasRes)[0];

    if (!currentActiveIndex) {
      return NextResponse.json(
        { error: "No active index found" },
        { status: 400 }
      );
    }

    const actions = [
      { remove: { index: currentActiveIndex, alias: "products" } },
      { add: { index: newIndex, alias: "products" } },
    ];

    const response = await client.indices.updateAliases({ actions });

    return NextResponse.json(
      { message: "Alias swapped successfully", response },
      { status: 200 }
    );
  } catch (error) {
    console.error("Swap alias error:", error);
    return NextResponse.json({ error: "Swap failed" }, { status: 500 });
  }
}
