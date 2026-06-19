import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { dbConnect } from "@/lib/dbConnect";
import BlogPost from "@/models/BlogPost";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await dbConnect();

  // GET /api/blog -> lista e posteve (me e reja para)
  if (req.method === "GET") {
    const posts = await BlogPost.find({}).sort({ createdAt: -1 }).lean();
    return res.status(200).json(posts);
  }

  // POST /api/blog -> krijo post te ri (vetem admin)
  if (req.method === "POST") {
    const session = await getServerSession(req, res, authOptions);
    if (!session || (session.user as { role?: string })?.role !== "admin") {
      return res.status(403).json({ message: "Vetëm admini mund të postojë." });
    }

    const { title, excerpt, content, image, category, author } = req.body || {};
    if (!title || !excerpt) {
      return res
        .status(400)
        .json({ message: "title dhe excerpt janë të detyrueshme." });
    }

    const created = await BlogPost.create({
      title,
      excerpt,
      content,
      image,
      category,
      author,
    });
    return res.status(201).json(created);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ message: `Metoda ${req.method} s'lejohet` });
}
