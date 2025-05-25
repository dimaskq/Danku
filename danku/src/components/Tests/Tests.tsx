"use client";

import Link from "next/link";
import "./tests.css";

export default function Tests() {
  return (
    <main className="tests-container">
      <h1 className="tests-title">Виберіть тест</h1>
      <div className="tests-grid">
        {/* Картка для Англійської */}
        <Link href="/tests/english">
          <div className="test-card">
            <h2 className="test-card-title">Англійська</h2>
            <p className="test-card-description">
              Пройдіть тест з англійської мови
            </p>
          </div>
        </Link>
        {/* Картка для Математики */}
        <Link href="/tests/math">
          <div className="test-card">
            <h2 className="test-card-title">Математика</h2>
            <p className="test-card-description">Пройдіть тест з математики</p>
          </div>
        </Link>
      </div>
    </main>
  );
}
