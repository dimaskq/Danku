"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./tests.css";
import GradeTestHeader from "./GradeTestHeader";
import TestCard from "./TestCard";
import ErrorMessage from "./ErrorMessage";
import EmptyTestsMessage from "./EmptyTestsMessage";
import { Test } from "@/types/test";

interface GradeTestContainerProps {
  grade: string; // "1" to "11" or "A1" to "C2"
}

export default function GradeTestContainer({ grade }: GradeTestContainerProps) {
  const [tests, setTests] = useState<Test[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: string]: number | null;
  }>({});
  const router = useRouter();

  const allAnswered = tests
    ? tests.every(
        (test) =>
          selectedAnswers[test._id] !== null &&
          selectedAnswers[test._id] !== undefined
      )
    : false;

  useEffect(() => {
    const fetchTests = async () => {
      try {
        console.log(`Fetching tests for grade: ${grade}`); // Debug log
        const res = await fetch(
          `http://localhost:3000/api/questions?class=${grade}`,
          {
            cache: "no-store",
          }
        );

        if (!res.ok) {
          throw new Error(`Помилка: ${res.status} ${res.statusText}`);
        }

        const data: Test[] = await res.json();
        console.log(`Тести для class=${grade}:`, data); // Debug log
        setTests(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTests();
  }, [grade]);

  const handleAnswerSelect = (testId: string, answerIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [testId]: answerIndex,
    }));
  };

  const handleSubmit = async () => {
    if (!tests) return;

    setSubmissionLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    let correct = 0;
    const wrongTopics: string[] = [];

    tests.forEach((test) => {
      const selectedIndex = selectedAnswers[test._id];
      if (selectedIndex !== null && test.answers[selectedIndex]?.isCorrect) {
        correct += 1;
      } else if (selectedIndex !== null) {
        if (!wrongTopics.includes(test.topic)) {
          wrongTopics.push(test.topic);
        }
      }
    });

    const encodedTopics = encodeURIComponent(wrongTopics.join(","));
    const query = new URLSearchParams({
      correctCount: correct.toString(),
      total: tests.length.toString(),
      topics: encodedTopics,
      grade,
    }).toString();

    const subject = isNaN(parseInt(grade)) ? "english" : "math";
    router.push(`/tests/${subject}/${grade}/results?${query}`);

    await fetch("/api/user/completed-tests", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        testId: grade,
        testTitle: `Тести для ${grade} класу`,
        bestScore: correct,
      }),
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <p className="loading__message">⏳ Завантаження тестів...</p>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        title="Помилка завантаження"
        message={`Не вдалося завантажити тести: ${error}`}
      />
    );
  }

  if (!tests || tests.length === 0) {
    const subject = isNaN(parseInt(grade)) ? "англійської" : "математики";
    const gradeDisplay = isNaN(parseInt(grade))
      ? `рівня ${grade}`
      : `${grade} класу`;
    return (
      <EmptyTestsMessage
        title={`Тести з ${subject} для ${gradeDisplay}`}
        message={`Тести для ${gradeDisplay} відсутні.`}
      />
    );
  }

  return (
    <main className="test-container">
      <GradeTestHeader grade={grade} />
      <div className="test-container__list">
        {tests.map((test) => (
          <TestCard
            key={test._id}
            test={test}
            selectedAnswer={selectedAnswers[test._id] ?? null}
            onAnswerSelect={(answerIndex) =>
              handleAnswerSelect(test._id, answerIndex)
            }
            isSubmitted={submissionLoading}
          />
        ))}
      </div>
      <div className="test-container__actions">
        <button
          onClick={handleSubmit}
          disabled={submissionLoading || !allAnswered}
          className={`test-container__submit-button ${
            submissionLoading || !allAnswered
              ? "test-container__submit-button--disabled"
              : ""
          }`}
        >
          {submissionLoading ? "⏳ Обробка..." : "ЗДАТИ"}
        </button>
      </div>
    </main>
  );
}
