import { NextRequest, NextResponse } from "next/server";
import client from "@/lib/elasticsearchClient";

export async function POST(req: NextRequest) {
  try {
    const { index } = await req.json();

    if (!index) {
      return NextResponse.json(
        { error: "Index name is required" },
        { status: 400 }
      );
    }

    const response = await client.indices.delete({
      index,
    });

    return NextResponse.json({
      message: `Index '${index}' deleted successfully`,
      response,
    });
  } catch (error) {
    console.error("Delete index error:", error);
    return NextResponse.json(
      { error: error || "Delete failed" },
      { status: 500 }
    );
  }
}
