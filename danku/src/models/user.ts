import mongoose from "mongoose";

export type CompletedTest = {
  testId: string;
  testTitle: string;
  bestScore: number;
};

export type UserType = {
  _id: string;
  username: string;
  email: string;
  completedTests: CompletedTest[];
};

const CompletedTestSchema = new mongoose.Schema({
  testId: { type: String, required: true },
  testTitle: { type: String, required: true },
  bestScore: { type: Number, required: true },
});

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  completedTests: { type: [CompletedTestSchema], default: [] },
});

export const User =
  mongoose.models.User || mongoose.model<UserType>("User", UserSchema);
