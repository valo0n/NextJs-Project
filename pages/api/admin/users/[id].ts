import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import mongoose from "mongoose";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== "admin") {
    return res.status(403).json({ message: "Vetëm admin" });
  }

  const { id } = req.query;
  if (!mongoose.Types.ObjectId.isValid(id as string)) {
    return res.status(400).json({ message: "ID e pavlefshme" });
  }

  await dbConnect();

  // PUT - update user (role, status)
  if (req.method === "PUT") {
    try {
      const { role, status } = req.body;
      const updateData: Record<string, string> = {};
      if (role) updateData.role = role;
      if (status) updateData.status = status;

      const updated = await User.findByIdAndUpdate(id, updateData, {
        new: true,
      }).select("-password");
      if (!updated) {
        return res.status(404).json({ message: "User nuk u gjet" });
      }
      return res.status(200).json(updated);
    } catch {
      return res.status(500).json({ message: "Gabim ne update" });
    }
  }

  // DELETE
  if (req.method === "DELETE") {
    try {
      // Mos lej fshirjen e vetes
      if (id === session.user.id) {
        return res.status(400).json({ message: "Nuk mund të fshish veten" });
      }
      await User.findByIdAndDelete(id);
      return res.status(200).json({ message: "User u fshi" });
    } catch {
      return res.status(500).json({ message: "Gabim ne fshirje" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
