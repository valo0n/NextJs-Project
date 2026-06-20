import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { dbConnect } from "@/lib/dbConnect";
import Order from "@/models/Order";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || (session.user as { role?: string })?.role !== "admin") {
    return res.status(403).json({ message: "Vetëm admini" });
  }

  await dbConnect();

  if (req.method === "GET") {
    const orders = await Order.find({}).sort({ createdAt: -1 }).lean();
    return res.status(200).json(orders);
  }

  res.setHeader("Allow", ["GET"]);
  return res.status(405).json({ message: `Metoda ${req.method} s'lejohet` });
}
