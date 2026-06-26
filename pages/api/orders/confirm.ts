import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { dbConnect } from "@/lib/dbConnect";
import Order from "@/models/Order";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Vetëm POST lejohet" });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ message: "Mungon STRIPE_SECRET_KEY" });
  }

  const { paymentIntentId, email } = req.body as {
    paymentIntentId?: string;
    email?: string;
  };
  if (!paymentIntentId) {
    return res.status(400).json({ message: "Mungon paymentIntentId" });
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const pi = await stripe.paymentIntents.retrieve(paymentIntentId);

    await dbConnect();
    const order = await Order.findOne({ stripeSessionId: paymentIntentId });
    if (!order) {
      return res.status(404).json({ message: "Porosia s'u gjet" });
    }

    // Verifiko te Stripe që pagesa u krye vërtet
    if (pi.status === "succeeded") {
      // mos e ul statusin nëse admini e ka çuar më tej
      if (order.status === "pending") {
        order.status = "paid";
      }
      if (email) {
        order.email = email;
      }
      await order.save();
      return res.status(200).json({ status: order.status, paid: true });
    }

    return res.status(200).json({ status: order.status, paid: false });
  } catch (error) {
    console.error("Gabim te confirm:", error);
    return res.status(500).json({
      message: "Gabim te konfirmimi",
      error: (error as Error).message,
    });
  }
}
