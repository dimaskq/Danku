import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  console.log("📥 GET /api/questions викликано");
  try {
    const client = await clientPromise;
    const db = client.db("testdb");

    console.log("📂 Отримуємо колекцію 'questions'");
    const questions = await db.collection("questions").find({}).toArray();

    console.log(`✅ Знайдено питань: ${questions.length}`);
    return NextResponse.json(questions);
  } catch (error: any) {
    console.error(
      "❌ Помилка в GET /api/questions:",
      error.message,
      error.stack
    );
    return NextResponse.json(
      { error: "Failed to fetch questions", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  console.log("📥 POST /api/questions викликано");
  try {
    const data = await request.json();
    console.log("📦 Отримано дані з запиту:", data);

    const client = await clientPromise;
    const db = client.db("testdb");

    console.log("📝 Вставляємо питання у базу...");
    const result = await db.collection("questions").insertOne(data);

    console.log("✅ Питання додано з ID:", result.insertedId);
    return NextResponse.json({
      message: "Question added",
      id: result.insertedId,
    });
  } catch (error: any) {
    console.error(
      "❌ Помилка в POST /api/questions:",
      error.message,
      error.stack
    );
    return NextResponse.json(
      { error: "Failed to add question", details: error.message },
      { status: 500 }
    );
  }
}
