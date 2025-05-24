import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("testdb");
    const questions = await db.collection("questions").find({}).toArray();

    return NextResponse.json(questions);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const client = await clientPromise;
    const db = client.db("testdb");
    const result = await db.collection("questions").insertOne(data);

    return NextResponse.json({
      message: "Question added",
      id: result.insertedId,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add question" },
      { status: 500 }
    );
  }
}
