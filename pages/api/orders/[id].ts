import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import mongoose from "mongoose";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { dbConnect } from "@/lib/dbConnect";
import Order, { OrderStatus } from "@/models/Order";

const ALLOWED: OrderStatus[] = [
  "pending",
  "paid",
  "shipped",
  "delivered",
  "cancelled",
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || (session.user as { role?: string })?.role !== "admin") {
    return res.status(403).json({ message: "Vetëm admini" });
  }

  const { id } = req.query;
  if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "ID e pavlefshme" });
  }

  await dbConnect();

  if (req.method === "PATCH") {
    const { status } = req.body as { status?: OrderStatus };
    if (!status || !ALLOWED.includes(status)) {
      return res.status(400).json({ message: "Status i pavlefshëm" });
    }

    const updated = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    ).lean();

    if (!updated) {
      return res.status(404).json({ message: "Porosia s'u gjet" });
    }
    return res.status(200).json(updated);
  }

  res.setHeader("Allow", ["PATCH"]);
  return res.status(405).json({ message: `Metoda ${req.method} s'lejohet` });
}
