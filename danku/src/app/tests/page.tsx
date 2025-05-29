import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { connectToDB } from "@/lib/db";
import { User } from "@/models/user";
import Tests from "@/components/Tests/Tests";

export default async function TestsPage() {
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

  const user = await User.findById(userId).lean();

  if (!user) return redirect("/login");

  return <Tests />;
}
