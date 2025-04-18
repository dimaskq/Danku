"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import { Question } from "@/types/question";
import { Feedback } from "@/types/userStatus";

interface TestResult {
  score: number;
  total: number;
  feedback: Feedback[];
}

export default function SubjectTest() {
  const { subject } = useParams();
  const searchParams = useSearchParams();
  const level = searchParams.get("level");
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [result, setResult] = useState<TestResult | null>(null);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!level) {
      setError("Рівень не обрано");
      setLoading(false);
      return;
    }

    async function fetchQuestions() {
      const token = localStorage.getItem("token");
      const user = token ? JSON.parse(atob(token.split(".")[1])) : {};
      const res = await fetch(`/api/user/status?email=${user.email}`);
      const data = await res.json();
      if (
        !data.current_test ||
        data.current_test.subject !== subject ||
        data.current_test.level !== level
      ) {
        setError("Немає активного тесту для цього предмета та рівня");
        setLoading(false);
        return; // Припиняємо виконання, якщо немає активного тесту
      }

      // Якщо тест активний, робимо запит до /api/tests/start
      const questionsRes = await fetch(`/api/tests/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, subject, level }),
      });

      const questionsData = await questionsRes.json();
      if (questionsData.error) {
        setError(questionsData.error);
        setLoading(false);
        return;
      }

      setQuestions(questionsData.questions || []);
      setLoading(false);
    }

    fetchQuestions();
  }, [isAuthenticated, isLoading, router, subject, level]);

  const handleAnswer = async (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const token = localStorage.getItem("token");
      const user = token ? JSON.parse(atob(token.split(".")[1])) : {};
      const score = newAnswers.reduce((acc, ans, idx) => {
        return ans === questions[idx].correct_answer ? acc + 1 : acc;
      }, 0);

      const res = await fetch("/api/tests/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          answers: newAnswers,
          score,
          total: questions.length,
        }),
      });
      const data = await res.json();
      setResult(data.result);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Завантаження...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Помилка</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/test"
            className="bg-lime-500 hover:bg-lime-600 text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            Повернутися назад
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      {currentQuestion < questions.length ? (
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
            Тест з {subject} (рівень {level}) — Питання {currentQuestion + 1} з{" "}
            {questions.length}
          </h2>
          <p className="text-lg text-gray-700 mb-6 text-center">
            {questions[currentQuestion].question_text}
          </p>
          <div className="grid grid-cols-2 gap-4">
            {questions[currentQuestion].options.map(
              (option: string, index: number) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className="bg-lime-100 hover:bg-lime-200 text-gray-800 font-medium py-3 rounded-lg transition"
                >
                  {option}
                </button>
              )
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Тест завершено!
          </h2>
          <p className="text-gray-600 mb-6">
            Ваш результат: {result?.score}/{result?.total}
          </p>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Фідбек від AI
          </h3>
          <div className="text-left mb-6">
            {result?.feedback?.map((fb: Feedback, idx: number) => (
              <div key={idx} className="mb-4">
                <p className="text-gray-700 font-medium">
                  Питання {idx + 1}: {fb.question_text}
                </p>
                <p className="text-gray-600">
                  Ваша відповідь: {fb.user_answer} (
                  {fb.is_correct ? "Правильно" : "Неправильно"})
                </p>
                <p className="text-gray-600">
                  Правильна відповідь: {fb.correct_answer}
                </p>
                <p className="text-gray-600 italic">{fb.explanation}</p>
              </div>
            ))}
          </div>
          <Link
            href="/dashboard"
            className="bg-lime-500 hover:bg-lime-600 text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            Перейти до дашборду
          </Link>
        </div>
      )}
    </div>
  );
}
