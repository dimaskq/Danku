"use client";

import { Suspense } from "react";
import ClientProfileTests from "./ClientProfileTests";
import type { UserType } from "@/models/user";
import "./profile.css";
type Props = {
  user: UserType;
};

export default function ClientProfile({ user }: Props) {
  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
    });
    window.location.href = "/";
  };

  return (
    <main className="profile">
      <h1 className="profile__title">👤 Профіль</h1>
      <div className="profile__info-block">
        <p>
          <strong>Ім’я:</strong> {user.username}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
      </div>

      <Suspense fallback={<p>Завантаження тестів...</p>}>
        <ClientProfileTests />
      </Suspense>

      <button onClick={handleLogout} className="profile__logout-button">
        Вийти
      </button>
    </main>
  );
}
