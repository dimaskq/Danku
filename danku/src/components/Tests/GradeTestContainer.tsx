"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./tests.css";
import GradeTestHeader from "./GradeTestHeader";
import TestCard from "./TestCard";
import ErrorMessage from "./ErrorMessage";
import EmptyTestsMessage from "./EmptyTestsMessage";

interface Test {
  _id: string;
  text: string;
  class: number;
  topic: string;
  answers: { text: string; isCorrect: boolean }[];
}

interface GradeTestContainerProps {
  grade: string;
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

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await fetch(`/api/questions?class=${grade}`, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`Помилка: ${res.status} ${res.statusText}`);
        }

        const data: Test[] = await res.json();
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

    // Simulate processing delay (adjust or remove based on API response time)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    let correct = 0;
    const wrongTopics: string[] = [];

    tests.forEach((test) => {
      const selectedIndex = selectedAnswers[test._id];
      if (selectedIndex !== null && test.answers[selectedIndex]?.isCorrect) {
        correct += 1;
      } else if (selectedIndex !== null) {
        // Add topic of incorrect answer (ensure no duplicates)
        if (!wrongTopics.includes(test.topic)) {
          wrongTopics.push(test.topic);
        }
      }
    });

    // Encode topics to handle special characters
    const encodedTopics = encodeURIComponent(wrongTopics.join(","));

    // Navigate to results page with query parameters
    const query = new URLSearchParams({
      correctCount: correct.toString(),
      total: tests.length.toString(),
      topics: encodedTopics,
      grade,
    }).toString();

    router.push(`/tests/math/${grade}/results?${query}`);
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
    return (
      <EmptyTestsMessage
        title={`Тести з математики для ${grade} класу`}
        message={`Тести для ${grade} класу відсутні.`}
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
          disabled={submissionLoading}
          className={`test-container__submit-button ${
            submissionLoading ? "test-container__submit-button--disabled" : ""
          }`}
        >
          {submissionLoading ? "⏳ Обробка..." : "ЗДАТИ"}
        </button>
      </div>
    </main>
  );
}
