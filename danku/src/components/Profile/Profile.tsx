"use client";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { connectToDB } from "@/lib/db";
import { User } from "@/models/user";
import "./profile.css";
import { Suspense } from "react";
import ClientProfileTests from "./ClientProfileTests";
import type { UserType } from "@/models/user";

export default async function Profile() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;

  if (!token) return redirect("/register");

  let userId: string;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    userId = decoded.id;
  } catch {
    return redirect("/login");
  }

  await connectToDB();

  const user = await User.findById<UserType>(userId).lean();

  if (!user) return redirect("/login");

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

      <form
        action="/api/auth/logout"
        method="POST"
        className="profile__logout-form"
      >
        <button
          type="button"
          onClick={async () => {
            await fetch("/api/auth/logout", {
              method: "POST",
            });
            window.location.href = "/";
          }}
          className="profile__logout-button"
        >
          Вийти
        </button>
      </form>
    </main>
  );
}
