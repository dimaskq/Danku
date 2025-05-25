import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  console.log("📥 GET /api/questions викликано");
  try {
    const client = await clientPromise;
    const db = client.db("testdb");

    const { searchParams } = new URL(request.url);
    const classNumber = parseInt(searchParams.get("class") || "0", 10);

    if (!classNumber || classNumber < 1 || classNumber > 11) {
      console.log(`❌ Невалідний клас: ${classNumber}`);
      return NextResponse.json({ error: "Invalid class" }, { status: 400 });
    }

    console.log(`📂 Отримуємо питання для класу ${classNumber}`);
    const questions = await db
      .collection("questions")
      .find({ class: classNumber })
      .toArray();

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
  try {
    const data = await request.json();
    const client = await clientPromise;
    const db = client.db("testdb");

    console.log("📥 POST /api/questions викликано");
    if (Array.isArray(data)) {
      const result = await db.collection("questions").insertMany(data);
      console.log(`✅ Додано ${result.insertedCount} питань`);
      return NextResponse.json({
        message: "Questions added",
        insertedCount: result.insertedCount,
        insertedIds: result.insertedIds,
      });
    } else {
      const result = await db.collection("questions").insertOne(data);
      console.log(`✅ Додано питання з ID: ${result.insertedId}`);
      return NextResponse.json({
        message: "Question added",
        id: result.insertedId,
      });
    }
  } catch (error: any) {
    console.error(
      "❌ Помилка в POST /api/questions:",
      error.message,
      error.stack
    );
    return NextResponse.json(
      {
        error: "Failed to add question",
        details: error.message || error.toString(),
      },
      { status: 500 }
    );
  }
}
