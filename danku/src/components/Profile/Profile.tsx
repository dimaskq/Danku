import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { connectToDB } from "@/lib/db";
import { User } from "@/models/user";
import ClientProfile from "./ClientProfile";
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

  const user = (await User.findById(userId).lean()) as UserType | null;

  if (!user) return redirect("/login");

  return <ClientProfile user={user} />;
}
