import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  console.log("📥 GET /api/questions викликано");
  try {
    const client = await clientPromise;
    const db = client.db("danku");

    const { searchParams } = new URL(request.url);
    const rawClass = searchParams.get("class");

    let query = {};
    if (rawClass !== null) {
      const classNumber = Number(rawClass);
      if (Number.isNaN(classNumber) || classNumber < 1 || classNumber > 11) {
        console.log(`❌ Невалідний клас: ${rawClass}`);
        return NextResponse.json({ error: "Invalid class" }, { status: 400 });
      }
      query = { class: classNumber };
      console.log(`📂 Отримуємо питання для класу ${classNumber}`);
    } else {
      console.log("📂 Отримуємо всі питання (без фільтра класу)");
    }

    const questions = await db.collection("questions").find(query).toArray();

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

    // Валідація функція
    const isValidClass = (cls: any) =>
      typeof cls === "number" && cls >= 1 && cls <= 11;

    // Якщо масив питань
    if (Array.isArray(data)) {
      const invalidItems = data.filter((q) => !isValidClass(q.class));
      if (invalidItems.length > 0) {
        console.log(`❌ Невалідні класи у деяких питань`, invalidItems);
        return NextResponse.json(
          {
            error: "One or more questions have invalid class field",
            details: invalidItems,
          },
          { status: 400 }
        );
      }

      const result = await db.collection("questions").insertMany(data);
      console.log(`✅ Додано ${result.insertedCount} питань`);
      return NextResponse.json({
        message: "Questions added",
        insertedCount: result.insertedCount,
        insertedIds: result.insertedIds,
      });
    }

    // Якщо одне питання
    if (!isValidClass(data.class)) {
      console.log(`❌ Невалідний клас: ${data.class}`);
      return NextResponse.json(
        { error: "Invalid class in question", value: data.class },
        { status: 400 }
      );
    }

    const result = await db.collection("questions").insertOne(data);
    console.log(`✅ Додано питання з ID: ${result.insertedId}`);
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
      {
        error: "Failed to add question",
        details: error.message || error.toString(),
      },
      { status: 500 }
    );
  }
}
