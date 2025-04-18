import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    const db = await getDb();
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Користувач із таким email уже існує" },
        { status: 400 }
      );
    }

    const password_hash = await bcrypt.hash(password, 10);
    const user = {
      email,
      name,
      password_hash,
      profile_data: { age: null },
      current_test: null,
      test_results: [],
      learning_plan: null,
      created_at: new Date().toISOString(),
    };
    await db.collection("users").insertOne(user);

    const token = jwt.sign({ email, name }, "your-secret-key", {
      expiresIn: "7d",
    });
    return NextResponse.json({ token });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}
