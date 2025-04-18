"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { logout } from "@/lib/useAuth";

export default function Header() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedUser = JSON.parse(atob(token.split(".")[1]));
        setUser(decodedUser);
      } catch (error) {
        console.error("Failed to decode token:", error);
        setUser({});
      }
    } else {
      setUser({});
    }
  }, []);

  return (
    <header className="flex justify-between items-center px-6 py-3 shadow-md bg-white">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/logo.png" alt="Logo" width={200} height={20} />
      </Link>

      {user?.name ? (
        <div className="flex items-center gap-4">
          <span className="text-gray-700">Привіт, {user.name}!</span>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition"
          >
            Вийти
          </button>
        </div>
      ) : (
        <Link
          href="/login"
          className="bg-lime-500 hover:bg-lime-600 text-white font-semibold px-4 py-2 rounded-lg transition"
        >
          Увійти
        </Link>
      )}
    </header>
  );
}
