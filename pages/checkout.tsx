// pages/checkout.tsx

import Layout from "@/components/Layout";
import Head from "next/head";
import Link from "next/link";
import { NextPage } from "next";
import { useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { useCart } from "@/context/CartContext";

// Çelësi publik (pk_test_...) - i sigurt të jetë në klient
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
);

const Checkout: NextPage = () => {
  const { cart } = useCart();

  // Merr clientSecret nga API-ja jonë (që krijon Checkout Session-in embedded)
  const fetchClientSecret = useCallback(async () => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cart.map((item) => ({ _id: item._id, qty: item.qty })),
      }),
    });
    const data = await res.json();
    return data.clientSecret as string;
  }, [cart]);

  return (
    <>
      <Head>
        <title>Pagesa - Paradox Tech</title>
      </Head>

      <Layout>
        <section className="min-h-screen bg-paradox-bg pt-32 pb-20 px-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#ececec] mb-8">
              Pagesa
            </h1>

            {cart.length === 0 ? (
              <div className="text-center py-20 border border-white/10 rounded-lg text-[#ececec]">
                <p className="text-gray-400 mb-6">Shporta është bosh.</p>
                <Link href="/shop" className="text-paradox-purple underline">
                  Shko te dyqani
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-lg p-2">
                <EmbeddedCheckoutProvider
                  stripe={stripePromise}
                  options={{ fetchClientSecret }}
                >
                  <EmbeddedCheckout />
                </EmbeddedCheckoutProvider>
              </div>
            )}
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Checkout;
