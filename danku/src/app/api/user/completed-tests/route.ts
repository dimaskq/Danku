import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import { User } from "@/models/user";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

interface CompletedTest {
  testId: string;
  testTitle: string;
  bestScore: number;
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  let userId;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    userId = (decoded as any).id;
  } catch {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  await connectToDB();

  const user = await User.findById(userId).select("completedTests");
  if (!user)
    return NextResponse.json({ message: "User not found" }, { status: 404 });

  return NextResponse.json(user.completedTests);
}

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  let userId;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    userId = (decoded as any).id;
  } catch {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  const body = await req.json();
  const { testId, testTitle, bestScore } = body;

  if (!testId || !testTitle || typeof bestScore !== "number") {
    return NextResponse.json({ message: "Invalid data" }, { status: 400 });
  }

  await connectToDB();

  const user = await User.findById(userId);
  if (!user)
    return NextResponse.json({ message: "User not found" }, { status: 404 });

  // Типізація параметра t для уникнення implicit any
  const existingTestIndex = user.completedTests.findIndex(
    (t: CompletedTest) => t.testId === testId
  );

  if (existingTestIndex !== -1) {
    if (user.completedTests[existingTestIndex].bestScore < bestScore) {
      user.completedTests[existingTestIndex].bestScore = bestScore;
    }
  } else {
    user.completedTests.push({ testId, testTitle, bestScore });
  }

  await user.save();

  return NextResponse.json({ message: "Result saved" });
}
