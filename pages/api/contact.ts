import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/dbConnect";
import Contact from "@/models/Contact";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Vetëm POST lejohet" });
  }

  const { name, email, subject, message } = req.body || {};

  // Validim (para lidhjes me DB)
  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ message: "Emri, email-i dhe mesazhi janë të detyrueshëm" });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ message: "Email-i nuk është i vlefshëm" });
  }

  try {
    await dbConnect();
    await Contact.create({ name, email, subject, message });
    return res.status(201).json({ message: "Mesazhi u dërgua me sukses" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Gabim te ruajtja", error: (error as Error).message });
  }
}
