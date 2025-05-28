"use client";

import Link from "next/link";
import "../tests.css";

export default function English() {
  const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];

  return (
    <main className="tests-container">
      <h1 className="tests-title">
        Виберіть рівень для тесту з англійської мови
      </h1>
      <div className="tests-grid">
        {levels.map((level) => (
          <Link key={level} href={`/tests/english/${level}`}>
            <div className="card">
              <h2 className="card-title">Рівень {level}</h2>
              <p className="card-description">
                Тест з англійської мови рівня {level}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
