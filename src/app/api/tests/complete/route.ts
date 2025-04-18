import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import axios from "axios";

const HUGGINGFACE_API_KEY = process.env.ANTHROPIC_API_KEY;

async function evaluateAnswers(
  questions: any[],
  answers: string[],
  subject: string,
  level: string
) {
  const prompt = `
    I have a ${subject} test at ${level} level with the following questions and user answers.
    Evaluate the answers and provide feedback for each answer (explain why it's correct or incorrect).
    Also suggest topics to study based on the performance. Format the response as a JSON string like this:
    {
      "feedback": [
        {
          "question_text": "Question text here",
          "user_answer": "User's answer",
          "correct_answer": "Correct answer",
          "is_correct": true,
          "explanation": "Explanation of why the answer is correct or incorrect"
        }
      ],
      "topics_to_study": ["Topic 1", "Topic 2"]
    }

    Questions and answers:
    ${questions
      .map((q, idx) => {
        return `Question ${idx + 1}: ${q.question_text}
        Options: ${q.options.join(", ")}
        Correct Answer: ${q.correct_answer}
        User's Answer: ${answers[idx]}`;
      })
      .join("\n\n")}
  `;

  try {
    const response = await axios.post(
      HUGGINGFACE_API_URL,
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const generatedText = response.data[0]?.generated_text;
    if (!generatedText) {
      throw new Error("Не вдалося оцінити відповіді");
    }

    const evaluation = JSON.parse(generatedText);
    return evaluation;
  } catch (error) {
    console.error("Error evaluating answers with Hugging Face:", error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const { email, answers, score, total } = await request.json();

    const db = await getDb();
    const user = await db.collection("users").findOne({ email });
    if (!user || !user.current_test) {
      return NextResponse.json(
        { error: "Немає активного тесту для завершення" },
        { status: 400 }
      );
    }

    const { subject, level } = user.current_test;

    // Отримуємо згенеровані питання з MongoDB
    const questions = await db
      .collection("questions")
      .find({ subject, level })
      .toArray();

    // Оцінюємо відповіді через Hugging Face API
    const evaluation = await evaluateAnswers(
      questions,
      answers,
      subject,
      level
    );

    if (!evaluation || !evaluation.feedback || !evaluation.topics_to_study) {
      return NextResponse.json(
        { error: "Не вдалося оцінити відповіді" },
        { status: 500 }
      );
    }

    const result = {
      subject,
      level,
      score,
      total,
      answers,
      feedback: evaluation.feedback,
      completed_at: new Date().toISOString(),
    };

    // Оновлюємо користувача
    await db.collection("users").updateOne(
      { email },
      {
        $push: { test_results: result },
        $set: {
          current_test: null,
          learning_plan: {
            subject,
            level,
            topics_to_study: evaluation.topics_to_study,
          },
        },
      }
    );

    return NextResponse.json({ message: "Тест завершено", result });
  } catch (error) {
    console.error("Error in /api/tests/complete:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Failed to complete test", details: errorMessage },
      { status: 500 }
    );
  }
}
