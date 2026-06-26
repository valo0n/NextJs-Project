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

    // Çmimet lexohen nga DB (siguri) - jo nga klienti
    const validIds = items
      .map((i) => i._id)
      .filter((id) => mongoose.Types.ObjectId.isValid(id));

    const products = await Product.find({ _id: { $in: validIds } }).lean();

    const orderItems: IOrderItem[] = [];
    let total = 0;
    for (const item of items) {
      const p = products.find((pp) => pp._id.toString() === item._id);
      if (!p) continue;

      const qty = item.qty > 0 ? item.qty : 1;
      orderItems.push({
        productId: p._id.toString(),
        title: p.title,
        price: p.price,
        qty,
        image: p.image,
      });
      total += p.price * qty;
    }

    if (orderItems.length === 0) {
      return res
        .status(400)
        .json({ message: "Asnjë produkt i vlefshëm në shportë" });
    }

    const session2 = await getServerSession(req, res, authOptions);
    if (!session2?.user) {
      return res
        .status(401)
        .json({ message: "Duhet të jesh i kyçur për të bërë porosi" });
    }
    const userId = (session2.user as { id?: string }).id || null;

    // PaymentIntent (në vend të Checkout Session) - kjo lejon Payment Element me appearance custom
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // në cent
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: { userId: userId || "guest" },
    });

    // Porosia "pending" - kalon "paid" pas konfirmimit
    await Order.create({
      userId,
      items: orderItems,
      total,
      status: "pending",
      stripeSessionId: paymentIntent.id, // ruajmë id-në e PaymentIntent këtu
    });

    return res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Gabim te checkout:", error);
    return res.status(500).json({
      message: "Gabim te krijimi i pagesës",
      error: (error as Error).message,
    });
  }
}
