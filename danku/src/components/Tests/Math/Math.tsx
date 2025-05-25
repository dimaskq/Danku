"use client";

import Link from "next/link";
import "../tests.css";

export default function Math() {
  const grades = Array.from({ length: 11 }, (_, i) => i + 1);

  return (
    <main className="math-container">
      <h1 className="math-title">Виберіть клас для тесту з математики</h1>
      <div className="math-grid">
        {grades.map((grade) => (
          <Link key={grade} href={`/tests/math/${grade}`}>
            <div className="grade-card">
              <h2 className="grade-card-title">{grade} клас</h2>
              <p className="grade-card-description">
                Тести з математики для {grade} класу
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
