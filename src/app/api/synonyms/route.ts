import client from "@/lib/elasticsearchClient";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await client.synonyms.getSynonym({
      id: "new-synonyms",
    });

    return NextResponse.json(res);
  } catch (error) {
    console.error("Error fetching synonyms:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch synonyms",
        message: error || "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { set_id, rule_id, synonyms } = body;

    if (!set_id || !rule_id || !synonyms) {
      return NextResponse.json(
        { error: "Missing required fields: set_id, rule_id, synonyms" },
        { status: 400 }
      );
    }

    const response = await client.synonyms.putSynonymRule({
      set_id,
      rule_id,
      synonyms,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error creating synonym rule:", error);

    return NextResponse.json(
      {
        error: "Failed to create synonym rule",
        message: error || "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { set_id, rule_id } = body;

    if (!set_id || !rule_id) {
      return NextResponse.json(
        { error: "Missing required fields: set_id, rule_id" },
        { status: 400 }
      );
    }

    const response = await client.synonyms.deleteSynonymRule({
      set_id,
      rule_id,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error deleting synonym rule:", error);
    return NextResponse.json(
      { error: "Failed to delete synonym rule", message: error },
      { status: 500 }
    );
  }
}
