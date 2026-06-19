import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/dbConnect";
import BlogPost from "@/models/BlogPost";
import { FIGMA } from "@/lib/figmaAssets";

// Postet mock fillestare (njejte me ato qe ishin hardcoded ne faqe)
const SEED_POSTS = [
  {
    title: "Logitech's latest keyboard has arrived",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse massa libero, mattis volutpat id. Egestas adipiscing placerat eleifend a nascetur.",
    image: FIGMA.blog1,
    category: "Keyboard",
    author: "Admin-art",
    comments: 0,
  },
  {
    title: "New Logitech keyboard out now!",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse massa libero, mattis volutpat id. Egestas adipiscing placerat eleifend a nascetur.",
    image: FIGMA.blog2,
    category: "Keyboard",
    author: "Admin-art",
    comments: 0,
  },
  {
    title: "New Logitech keyboard released!",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse massa libero, mattis volutpat id. Egestas adipiscing placerat eleifend a nascetur.",
    image: FIGMA.blog3,
    category: "Keyboard",
    author: "Admin-art",
    comments: 0,
  },
  {
    title: "Razer Blade 14 Gaming Laptop",
    excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: FIGMA.laptopRazer,
    category: "Laptop",
    author: "Admin-art",
    comments: 0,
  },
  {
    title: 'ASUS Zenbook 15 OLED 15.6" Laptop',
    excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: FIGMA.laptopAsus,
    category: "Laptop",
    author: "Admin-art",
    comments: 0,
  },
  {
    title: "Nitro 5 Gaming Laptop",
    excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: FIGMA.laptopAcer,
    category: "Laptop",
    author: "Admin-art",
    comments: 0,
  },
];

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    await dbConnect();

    const count = await BlogPost.countDocuments();
    if (count > 0) {
      return res
        .status(200)
        .json({ message: `Blogu ka tashmë ${count} poste. S'u shtua asgjë.` });
    }

    const inserted = await BlogPost.insertMany(SEED_POSTS);
    return res
      .status(201)
      .json({ message: `U shtuan ${inserted.length} poste blogu.` });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Gabim te seed", error: (error as Error).message });
  }
}
