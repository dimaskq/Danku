"use client";

import Link from "next/link";
import { useAuth } from "@/lib/useAuth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Test() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [showMessage, setShowMessage] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [currentTest, setCurrentTest] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const subjects = [
    { name: "Mathematics", slug: "mathematics" },
    { name: "English", slug: "english" },
  ];

  const mathLevels = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"];
  const englishLevels = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const levels = selectedSubject === "mathematics" ? mathLevels : englishLevels;

  useEffect(() => {
    if (isLoading) return; // Чекаємо завершення автентифікації

    if (!isAuthenticated) {
      setShowMessage(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
      return;
    }

    async function fetchUserStatus() {
      const token = localStorage.getItem("token");
      const user = token ? JSON.parse(atob(token.split(".")[1])) : {};
      const res = await fetch(`/api/user/status?email=${user.email}`);
      const data = await res.json();
      setCurrentTest(data.current_test);
      setLoading(false);
    }
    fetchUserStatus();
  }, [isAuthenticated, isLoading, router]);

  const handleStartTest = async () => {
    const token = localStorage.getItem("token");
    const user = token ? JSON.parse(atob(token.split(".")[1])) : {};
    const res = await fetch("/api/tests/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.email,
        subject: selectedSubject,
        level: selectedLevel,
      }),
    });
    const data = await res.json();
    if (data.error) {
      alert(data.error);
    } else {
      router.push(`/test/${selectedSubject}?level=${selectedLevel}`);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        Завантаження...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            {showMessage
              ? "Будь ласка, увійдіть у систему"
              : "Перевіряємо авторизацію..."}
          </h2>
          {showMessage && (
            <p className="text-gray-600 mb-6">
              Ви будете перенаправлені на сторінку входу.
            </p>
          )}
        </div>
      </div>
    );
  }

  if (currentTest) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Ви вже проходите тест
          </h2>
          <p className="text-gray-600 mb-6">
            Предмет: {currentTest.subject}, Рівень: {currentTest.level}
          </p>
          <Link
            href={`/test/${currentTest.subject}?level=${currentTest.level}`}
            className="bg-lime-500 hover:bg-lime-600 text-white font-semibold px-6 py-3 rounded-lg transition"
          >
            Продовжити тест
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg text-center">
        {!selectedSubject ? (
          <>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Оберіть предмет для тестування
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {subjects.map((subject) => (
                <button
                  key={subject.slug}
                  onClick={() => setSelectedSubject(subject.slug)}
                  className="bg-lime-100 hover:bg-lime-200 text-gray-800 font-medium py-3 rounded-lg transition"
                >
                  {subject.name}
                </button>
              ))}
            </div>
          </>
        ) : !selectedLevel ? (
          <>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Оберіть рівень для {selectedSubject}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {levels.map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className="bg-lime-100 hover:bg-lime-200 text-gray-800 font-medium py-3 rounded-lg transition"
                >
                  {level}
                </button>
              ))}
            </div>
            <button
              onClick={() => setSelectedSubject(null)}
              className="mt-4 text-gray-600 hover:underline"
            >
              Назад
            </button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Готові до тесту з {selectedSubject} (рівень {selectedLevel})
            </h2>
            <button
              onClick={handleStartTest}
              className="bg-lime-500 hover:bg-lime-600 text-white font-semibold px-6 py-3 rounded-lg transition"
            >
              Почати тест
            </button>
            <button
              onClick={() => setSelectedLevel(null)}
              className="mt-4 text-gray-600 hover:underline"
            >
              Назад
            </button>
          </>
        )}
      </div>
    </div>
  );
}
