import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import mongoose from "mongoose";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { dbConnect } from "@/lib/dbConnect";
import Product from "@/models/Product";
import Order, { IOrderItem } from "@/models/Order";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Vetëm POST lejohet" });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res
      .status(500)
      .json({ message: "Mungon STRIPE_SECRET_KEY në .env.local" });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const { items } = req.body as {
      items: { _id: string; qty: number }[];
    };

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Shporta është bosh" });
    }

    await dbConnect();

    // Merr vetem id-te valide dhe lexo produktet nga DB (cmimi nga serveri = siguri)
    const validIds = items
      .map((i) => i._id)
      .filter((id) => mongoose.Types.ObjectId.isValid(id));

    const products = await Product.find({ _id: { $in: validIds } }).lean();

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    const orderItems: IOrderItem[] = [];
    let total = 0;
    for (const item of items) {
      const p = products.find((pp) => pp._id.toString() === item._id);
      if (!p) continue;

      const qty = item.qty > 0 ? item.qty : 1;

      line_items.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: p.title,
            ...(p.image && p.image.startsWith("http")
              ? { images: [p.image] }
              : {}),
          },
          unit_amount: Math.round(p.price * 100), // ne cent
        },
        quantity: qty,
      });

      orderItems.push({
        productId: p._id.toString(),
        title: p.title,
        price: p.price,
        qty,
        image: p.image,
      });
      total += p.price * qty;
    }

    if (line_items.length === 0) {
      return res
        .status(400)
        .json({ message: "Asnjë produkt i vlefshëm në shportë" });
    }

    // Origjina per success/cancel (punon ne localhost dhe ne prod)
    const origin =
      req.headers.origin || `http://${req.headers.host || "localhost:3000"}`;

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded_page",
      mode: "payment",
      line_items,
      return_url: `${origin}/cart?success=true&session_id={CHECKOUT_SESSION_ID}`,
    });

    // Ruaj porosinë si "pending" - statusi kalon në "paid" pas konfirmimit
    const session2 = await getServerSession(req, res, authOptions);
    const userId = (session2?.user as { id?: string })?.id || null;

    await Order.create({
      userId,
      items: orderItems,
      total,
      status: "pending",
      stripeSessionId: session.id,
    });

    return res.status(200).json({ clientSecret: session.client_secret });
  } catch (error) {
    console.error("Gabim te checkout:", error);
    return res
      .status(500)
      .json({
        message: "Gabim te krijimi i pagesës",
        error: (error as Error).message,
      });
  }
}
