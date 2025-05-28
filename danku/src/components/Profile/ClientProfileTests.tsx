// app/profile/ClientProfileTests.tsx
"use client";

import { useEffect, useState } from "react";

type CompletedTest = {
  testId: string;
  testTitle: string;
  bestScore: number;
};

export default function ClientProfileTests() {
  const [completedTests, setCompletedTests] = useState<CompletedTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCompletedTests = async () => {
      try {
        const res = await fetch("/api/user/completed-tests", {
          cache: "no-store",
        });
        if (!res.ok) {
          throw new Error("Не вдалось завантажити тести");
        }
        const data = await res.json();
        setCompletedTests(data);
      } catch (err: any) {
        setError(err.message || "Сталася помилка");
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedTests();
  }, []);

  if (loading) return <p>Завантаження пройдених тестів...</p>;
  if (error) return <p className="profile__error">{error}</p>;

  return (
    <section className="profile__tests">
      <h2>Пройдені тести:</h2>
      {completedTests.length === 0 ? (
        <p>Ви ще не проходили жодного тесту. Починайте навчання!</p>
      ) : (
        <ul className="profile__tests-list">
          {completedTests.map(({ testId, testTitle, bestScore }) => (
            <li key={testId} className="profile__test-item">
              <span className="profile__test-title">{testTitle}</span>
              <span className="profile__test-score">Бал: {bestScore}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
