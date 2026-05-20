import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { dbConnect } from "@/lib/dbConnect";
import Product from "@/models/Product";
import mongoose from "mongoose";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query;

  if (!mongoose.Types.ObjectId.isValid(id as string)) {
    return res.status(400).json({ message: "ID e pavlefshme" });
  }

  await dbConnect();

  // GET nje produkt (publik)
  if (req.method === "GET") {
    try {
      const product = await Product.findById(id).lean();
      if (!product) {
        return res.status(404).json({ message: "Produkti nuk u gjet" });
      }
      return res.status(200).json(product);
    } catch {
      return res.status(500).json({ message: "Gabim ne server" });
    }
  }

  // PUT dhe DELETE kerkojne autorizim
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Pa autorizim" });
  }

  // Verifiko qe useri eshte pronar i produktit ose admin
  const product = await Product.findById(id);
  if (!product) {
    return res.status(404).json({ message: "Produkti nuk u gjet" });
  }

  const isOwner = product.createdBy?.toString() === session.user.id;
  const isAdmin = session.user.role === "admin";

  if (!isOwner && !isAdmin) {
    return res
      .status(403)
      .json({ message: "Nuk ke leje të ndryshosh këtë produkt" });
  }

  // PUT - update
  if (req.method === "PUT") {
    try {
      const updated = await Product.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
      return res.status(200).json(updated);
    } catch {
      return res.status(500).json({ message: "Gabim ne update" });
    }
  }

  // DELETE
  if (req.method === "DELETE") {
    try {
      await Product.findByIdAndDelete(id);
      return res.status(200).json({ message: "Produkti u fshi" });
    } catch {
      return res.status(500).json({ message: "Gabim ne fshirje" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
