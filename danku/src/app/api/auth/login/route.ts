import { connectToDB } from "@/lib/db";
import { User } from "@/models/user";
import bcrypt from "bcrypt";
import { generateToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  await connectToDB();

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return new Response(JSON.stringify({ message: "Invalid credentials" }), {
      status: 401,
    });
  }

  const token = generateToken({ id: user._id });

  const cookieStore = cookies(); // ← Зберігаємо результат у змінну
  (await cookieStore).set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/", // ← обов’язково вказуй path
  });

  return new Response(JSON.stringify({ message: "Logged in" }), {
    status: 200,
  });
}
