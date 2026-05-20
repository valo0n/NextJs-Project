import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { dbConnect } from "@/lib/dbConnect";
import Product from "@/models/Product";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await dbConnect();

  // GET - kthen produktet (me filter opsional)
  if (req.method === "GET") {
    try {
      const { createdBy } = req.query;

      // Nese ka createdBy, filtro vetem produktet e atij useri
      const filter = createdBy ? { createdBy: createdBy as string } : {};
      const products = await Product.find(filter)
        .sort({ createdAt: -1 })
        .lean();

      return res.status(200).json(products);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gabim";
      return res
        .status(500)
        .json({ message: "Gabim ne server", error: message });
    }
  }

  // POST - krijim i ri (seller + admin)
  if (req.method === "POST") {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ message: "Pa autorizim" });
    }
    if (session.user.role !== "seller" && session.user.role !== "admin") {
      return res
        .status(403)
        .json({
          message: "Vetëm shitësit dhe adminët mund të shtojnë produkte",
        });
    }

    try {
      const { title, description, price, image, category, stock } = req.body;

      if (!title || !description || price === undefined) {
        return res.status(400).json({
          message: "Title, description dhe price janë të detyrueshme",
        });
      }

      const product = await Product.create({
        title,
        description,
        price: Number(price),
        image,
        category,
        stock: Number(stock) || 0,
        createdBy: session.user.id,
      });

      return res.status(201).json(product);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gabim";
      return res
        .status(500)
        .json({ message: "Gabim ne krijim", error: message });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
