import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/dbConnect";
import Product from "@/models/Product";
import { FIGMA } from "@/lib/figmaAssets";

// Produktet mock qe shtohen automatikisht ne fillim
const SEED_PRODUCTS = [
  {
    title: "Logitech PRO X Superlight Wireless Mouse",
    description:
      "Lightweight pro gaming mouse with HERO 25K sensor. Të lehtë dhe precize - ideale për gaming kompetitiv.",
    price: 160,
    image: FIGMA.productMouse,
    category: "Mouse",
    stock: 25,
  },
  {
    title: "Logitech G Pro X Gaming Headset",
    description:
      "Premium gaming headset me Blue VO!CE microphone dhe DTS Headphone:X 2.0 surround sound.",
    price: 223,
    image: FIGMA.productHeadset,
    category: "Headset",
    stock: 18,
  },
  {
    title: "PS4 Dualshock 4 Wireless Controller",
    description:
      "Kontrollues zyrtar Sony me touchpad, motion sensors dhe rumble. Bateri e gjatë dhe ergonomi e shkëlqyer.",
    price: 79,
    image: FIGMA.productController,
    category: "Controller",
    stock: 30,
  },
  {
    title: "Logitech G PRO X TKL Mechanical Keyboard",
    description:
      "Tastierë mekanike TKL e ndritshme me switches të ndërrueshme. RGB lights dhe shumë e qëndrueshme.",
    price: 199,
    image: FIGMA.keyboardRgb,
    category: "Keyboard",
    stock: 12,
  },
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await dbConnect();

    const count = await Product.countDocuments();

    // Nese ka tashme produkte, mos shto perserit
    if (count > 0) {
      return res.status(200).json({
        message: "Database tashmë ka produkte, seed u kapërcye",
        existing: count,
      });
    }

    const created = await Product.insertMany(SEED_PRODUCTS);

    return res.status(201).json({
      message: `${created.length} produkte u shtuan!`,
      products: created,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gabim";
    return res.status(500).json({ message: "Gabim ne seed", error: message });
  }
}
