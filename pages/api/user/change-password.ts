import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import bcrypt from "bcryptjs";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Vetëm POST lejohet" });
  }

  const session = await getServerSession(req, res, authOptions);
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) {
    return res.status(401).json({ message: "Duhet të jeni i kyçur" });
  }

  const { currentPassword, newPassword } = req.body as {
    currentPassword?: string;
    newPassword?: string;
  };

  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "Plotësoni fjalëkalimin aktual dhe atë të ri" });
  }
  if (newPassword.length < 6) {
    return res
      .status(400)
      .json({ message: "Fjalëkalimi i ri duhet të jetë së paku 6 karaktere" });
  }

  await dbConnect();
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "Përdoruesi s'u gjet" });
  }

  // Llogaritë me Google/Facebook s'kanë fjalëkalim lokal
  if (!user.password) {
    return res.status(400).json({
      message:
        "Kjo llogari përdor login social (Google/Facebook) - s'ka fjalëkalim për të ndryshuar.",
    });
  }

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) {
    return res
      .status(400)
      .json({ message: "Fjalëkalimi aktual s'është i saktë" });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  return res.status(200).json({ message: "Fjalëkalimi u ndryshua me sukses" });
}
