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

  const randomId = Math.random().toString(36).substring(2, 15);
  const imageUrl = `https://picsum.photos/400/300?random=${randomId}`;

  res.status(200).json({ url: imageUrl });
}
