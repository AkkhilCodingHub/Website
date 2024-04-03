import { connectToDb } from "./mongo";

export const login = async (name: string, pin: string) => {
  const db = await connectToDb();
  const admin = await db.collection("admins").findOne({ name, pin });
  // ... (check if admin exists and return appropriate response)
};
