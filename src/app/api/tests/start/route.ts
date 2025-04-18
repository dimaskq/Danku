import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { generateText } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";

const ANTHROPIC_MODEL = "claude-3-5-sonnet-20241022";
const apiKey = process.env.ANTHROPIC_API_KEY;

const anthropic = createAnthropic({
  apiKey: apiKey!,
});

async function generateQuestions(
  subject: string,
  level: string,
  maxRetries = 1
) {
  console.log("ANTHROPIC_API_KEY:", apiKey ? "Present" : "Missing");
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY is not defined in environment variables"
    );
  }

  const prompt = `Write 5 multiple-choice tests for ${subject} at ${level} level. Each test must have one question, 4 answer options, and one correct answer. Format each test as follows:
  Q1: [Question text]? | [Option1], [Option2], [Option3], [Option4] | [CorrectAnswer]
  Example:
  Q1: What is 2 + 2? | 2, 3, 4, 5 | 4
  Output only the 5 tests, one per line, with no extra text or instructions.`;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const { text } = await generateText({
        model: anthropic(ANTHROPIC_MODEL),
        prompt,
        maxTokens: 1000,
        temperature: 0.7,
      });

      const questions = [];
      const questionLines = text
        .split("\n")
        .filter((line) => line.trim() !== "");

      for (const line of questionLines) {
        if (!line.match(/^Q\d+: .+ \| .+ \| .+/)) continue;

        const parts = line.split(" | ");
        if (parts.length < 3) continue;

        const questionTextMatch = parts[0].match(/^Q\d+: (.+)/);
        if (!questionTextMatch) continue;

        const questionText = questionTextMatch[1];
        const options = parts[1].split(",").map((opt) => opt.trim());
        const correctAnswer = parts[2].trim().split(" ")[0];

        if (options.length !== 4 || !options.includes(correctAnswer)) continue;

        questions.push({
          question_text: questionText,
          options,
          correct_answer: correctAnswer,
        });
      }

      if (questions.length >= 5) return questions;
    } catch (error) {
      if (attempt === maxRetries) throw error;
    }
  }

  throw new Error("Не вдалося згенерувати питання після декількох спроб");
}

export async function POST(request: Request) {
  try {
    const { email, subject, level } = await request.json();
    const db = await getDb();
    const user = await db.collection("users").findOne({ email });

    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (user.current_test) {
      return NextResponse.json(
        { error: "Ви вже проходите тест. Завершіть його, щоб почати новий." },
        { status: 400 }
      );
    }

    const generatedQuestions = await generateQuestions(subject, level);
    const questionsWithIds = generatedQuestions.map((q, index) => ({
      ...q,
      _id: `${email}-${subject}-${level}-${Date.now()}-${index}`,
      subject,
      level,
    }));

    await db.collection("questions").insertMany(questionsWithIds);
    await db.collection("users").updateOne(
      { email },
      {
        $set: {
          current_test: {
            subject,
            level,
            started_at: new Date().toISOString(),
          },
        },
      }
    );

    return NextResponse.json({ questions: questionsWithIds });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const rawText = errorMessage.includes("Сирий текст")
      ? errorMessage.split("Сирий текст: ")[1]
      : null;
    return NextResponse.json(
      { error: "Failed to start test", details: errorMessage, rawText },
      { status: 500 }
    );
  }
}
