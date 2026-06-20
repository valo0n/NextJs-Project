import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { dbConnect } from "@/lib/dbConnect";
import Order from "@/models/Order";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: "Vetëm GET lejohet" });
  }

  const session = await getServerSession(req, res, authOptions);
  const userId = (session?.user as { id?: string })?.id;
  const email = session?.user?.email;
  if (!userId) {
    return res.status(401).json({ message: "Duhet të jeni i kyçur" });
  }

  await dbConnect();

  // Lidh porositë me userId OSE me email-in e llogarisë (fallback)
  const orMatch: Record<string, unknown>[] = [{ userId }];
  if (email) orMatch.push({ email });

  const orders = await Order.find({
    $and: [{ status: { $ne: "pending" } }, { $or: orMatch }],
  })
    .sort({ createdAt: -1 })
    .lean();

  return res.status(200).json(orders);
}