import { NextRequest, NextResponse } from "next/server";
import client from "@/lib/elasticsearchClient";

export async function GET() {
  try {
    const res = await client.get({
      index: "app-settings",
      id: "config",
    });

    return NextResponse.json(res._source);
  } catch (err) {
    console.error("Failed to fetch config", err);
    return NextResponse.json(
      { error: "Failed to fetch config" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await client.index({
      index: "app-settings",
      id: "config",
      document: body,
    });

    return NextResponse.json({
      message: "Settings updated",
      result: res.result,
    });
  } catch (err) {
    console.error("PUT /api/settings error:", err);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
