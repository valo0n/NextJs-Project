import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";

type Data =
  | {
      message: string;
      user?: { id: string; name: string; email: string; role: string };
    }
  | { message: string; error?: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, password, role } = req.body as {
    name?: string;
    email?: string;
    password?: string;
    role?: string;
  };

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Të gjitha fushat janë të detyrueshme" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Fjalëkalimi duhet të ketë së paku 6 karaktere" });
  }

  // Vetem 'user' ose 'seller' lejohen ne register
  // 'admin' krijohet vetem manualisht ne MongoDB
  const validRole = role === "seller" ? "seller" : "user";

  try {
    await dbConnect();

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Ky email ekziston tashmë" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashed,
      role: validRole,
    });

    return res.status(201).json({
      message: "Përdoruesi u krijua me sukses",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gabim i panjohur";
    return res.status(500).json({ message: "Gabim në server", error: message });
  }
}
