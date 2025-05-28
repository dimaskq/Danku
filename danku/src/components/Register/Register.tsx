"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import "./register.css";

export default function Register() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
        username: formData.get("username"),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      router.push("/profile");
    } else {
      const data = await res.json();
      setError(data.message || "Сталася помилка");
    }
  };

  return (
    <section className="register">
      <form onSubmit={handleSubmit} className="register__form">
        <h1 className="register__title">Реєстрація</h1>

        <div className="register__field">
          <input
            name="username"
            placeholder="Username"
            required
            className="register__input"
          />
        </div>

        <div className="register__field">
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="register__input"
          />
        </div>

        <div className="register__field">
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="register__input"
          />
        </div>

        {error && <p className="register__error">{error}</p>}

        <button type="submit" className="register__submit">
          Зареєструватися
        </button>
      </form>

      <div className="register__login-redirect">
        <p>Вже маєте акаунт?</p>
        <button
          type="button"
          className="register__login-button"
          onClick={() => router.push("/login")}
        >
          Увійти
        </button>
      </div>
    </section>
  );
}
