"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Геройська секція */}
      <section className="flex flex-col items-center justify-center h-[80vh] bg-gradient-to-b from-lime-100 to-white text-center px-4">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Навчайся легко та ефективно!
        </h1>
        <p className="text-lg text-gray-600 mb-6 max-w-2xl">
          Пройди тест, отримай персоналізований план навчання та досягай своїх
          цілей у математиці, англійській чи інших предметах.
        </p>
        <Link
          href="/test"
          className="bg-lime-500 hover:bg-lime-600 text-white font-semibold px-6 py-3 rounded-lg transition text-lg"
        >
          Пройти тест
        </Link>
      </section>

      {/* Секція з можливостями */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Перевірка знань
            </h3>
            <p className="text-gray-600">
              Пройди тест, щоб дізнатися свій рівень у будь-якій дисципліні.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Персоналізований план
            </h3>
            <p className="text-gray-600">
              Отримай індивідуальну програму навчання від AI.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Додаткові ресурси
            </h3>
            <p className="text-gray-600">
              Отримуй доступ до відео, статей та вправ для ефективного навчання.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
