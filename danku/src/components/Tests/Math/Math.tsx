"use client";

import Link from "next/link";
import "../tests.css";

export default function Math() {
  const grades = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"];

  return (
    <main className="tests-container">
      <h1 className="tests-title">Виберіть клас для тесту з математики</h1>
      <div className="tests-grid">
        {grades.map((grade) => (
          <Link key={grade} href={`/tests/math/${grade}`}>
            <div className="card">
              <h2 className="card-title">{grade} клас</h2>
              <p className="card-description">
                Тести з математики для {grade} класу
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
