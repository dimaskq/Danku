"use client";

import { useAuth, logout } from "@/lib/useAuth";
import Link from "next/link";
import { useState, useEffect } from "react";
import { UserStatus } from "@/types/userStatus";

export default function Dashboard() {
  const { isAuthenticated, isLoading } = useAuth();
  const [status, setStatus] = useState<UserStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) return;

    async function fetchStatus() {
      const token = localStorage.getItem("token");
      const user = token ? JSON.parse(atob(token.split(".")[1])) : {};
      if (user.email) {
        const res = await fetch(`/api/user/status?email=${user.email}`);
        const data = await res.json();
        setStatus(data);
        setLoading(false);
      }
    }
    fetchStatus();
  }, [isAuthenticated, isLoading]);

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        Завантаження...
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Ваш навчальний план
        </h1>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition"
        >
          Вийти
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Поточний тест
          </h2>
          {status?.current_test ? (
            <>
              <p className="text-gray-600 mb-2">
                Предмет: {status.current_test.subject}
              </p>
              <p className="text-gray-600 mb-4">
                Рівень: {status.current_test.level}
              </p>
              <Link
                href={`/test/${status.current_test.subject}?level=${status.current_test.level}`}
                className="bg-lime-500 hover:bg-lime-600 text-white font-semibold px-4 py-2 rounded-lg transition"
              >
                Продовжити
              </Link>
            </>
          ) : (
            <p className="text-gray-600">Немає активного тесту.</p>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Останні результати
          </h2>
          {status?.test_results?.length ? (
            <ul className="list-disc list-inside text-gray-600">
              {status.test_results
                .slice(-3)
                .map((result: TestResult, index: number) => (
                  <li key={index}>
                    {result.subject} (рівень {result.level}): {result.score}/
                    {result.total}
                  </li>
                ))}
            </ul>
          ) : (
            <p className="text-gray-600">Ще немає результатів.</p>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            План навчання
          </h2>
          {status?.learning_plan ? (
            <>
              <p className="text-gray-600 mb-2">
                Предмет: {status.learning_plan.subject}
              </p>
              <p className="text-gray-600 mb-4">
                Рівень: {status.learning_plan.level}
              </p>
              <ul className="list-disc list-inside text-gray-600">
                {status.learning_plan.topics_to_study.map(
                  (topic: string, index: number) => (
                    <li key={index}>{topic}</li>
                  )
                )}
              </ul>
            </>
          ) : (
            <p className="text-gray-600">План навчання ще не створено.</p>
          )}
        </div>
      </div>
      <div className="mt-6">
        <Link
          href="/test"
          className="bg-lime-500 hover:bg-lime-600 text-white font-semibold px-6 py-3 rounded-lg transition"
        >
          Пройти тест
        </Link>
      </div>
    </div>
  );
}
