import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Pa autorizim" });
  }

  if (session.user.role !== "seller" && session.user.role !== "admin") {
    return res.status(403).json({
      message: "Vetëm shitësit mund të ngarkojnë imazhe",
    });
  }

  // Static placeholder images (nuk ndërrohen me refresh)
  const placeholders = [
    "https://via.placeholder.com/400x300/6B46C1/FFFFFF?text=Product+1",
    "https://via.placeholder.com/400x300/EC4899/FFFFFF?text=Product+2",
    "https://via.placeholder.com/400x300/F59E0B/FFFFFF?text=Product+3",
    "https://via.placeholder.com/400x300/10B981/FFFFFF?text=Product+4",
    "https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=Product+5",
  ];

  // Zgjidh placeholder-in bazuar në timestamp (i njëjtë për të njëjtën sekondë)
  const timeBasedIndex = Math.floor(Date.now() / 1000) % placeholders.length;
  const imageUrl = placeholders[timeBasedIndex];

  res.status(200).json({ url: imageUrl });
}
