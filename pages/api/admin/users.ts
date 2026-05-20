import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== "admin") {
    return res.status(403).json({ message: "Vetëm admin" });
  }

  await dbConnect();

  // GET - te gjithe user-at
  if (req.method === "GET") {
    try {
      const users = await User.find({})
        .select("-password")
        .sort({ createdAt: -1 })
        .lean();
      return res.status(200).json(users);
    } catch {
      return res.status(500).json({ message: "Gabim" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
