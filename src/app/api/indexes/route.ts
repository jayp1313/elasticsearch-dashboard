// import client from "@/lib/elasticsearchClient";
// import { NextResponse } from "next/server";

// export async function GET() {
//   try {
//     const indexData = await client.cat.indices({
//       index: "product*",
//       v: true,
//       s: "index",
//       format: "json",
//       h: "index,health,docs.count,store.size,uuid",
//     });

//     const aliasData = await client.indices.getAlias({
//       name: "products",
//     });

//     const activeIndexName = Object.keys(aliasData)[0];

//     const enhancedData = indexData.map((idx) => {
//       return {
//         ...idx,
//         alias: idx.index === activeIndexName ? "products" : null,
//       };
//     });

//     return NextResponse.json(enhancedData);
//   } catch (error) {
//     console.error("Error fetching index info:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch index data" },
//       { status: 500 }
//     );
//   }
// }

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

    const aliasData = await client.indices.getAlias({ name: "products" });
    const activeIndexName = Object.keys(aliasData)[0];

    const enhancedData = await Promise.all(
      indexData.map(async (idx) => {
        let lastModified: string | null = null;

        try {
          const latestDoc = await client.search({
            index: idx.index,
            size: 1,
            sort: [{ created_at: "desc" }],
            _source: ["created_at"],
          });

          lastModified = latestDoc.hits?.hits?.[0]?._source?.created_at ?? null;
        } catch (err) {
          console.warn(`Failed to fetch lastModified for ${idx.index}`, err);
        }

        return {
          ...idx,
          alias: idx.index === activeIndexName ? "products" : null,
          lastModified,
        };
      })
    );

    return NextResponse.json(enhancedData);
  } catch (error) {
    console.error("Error fetching index info:", error);
    return NextResponse.json(
      { error: "Failed to fetch index data" },
      { status: 500 }
    );
  }
}
