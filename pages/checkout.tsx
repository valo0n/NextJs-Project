// pages/checkout.tsx
import Layout from "@/components/Layout";
import Head from "next/head";
import Link from "next/link";
import { GetServerSideProps, NextPage } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { loadStripe, Appearance } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  LinkAuthenticationElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import { useCart } from "@/context/CartContext";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
);

// Tema e Stripe-it përshtatet me ngjyrat e faqes (dark + vjollcë)
const appearance: Appearance = {
  theme: "night",
  variables: {
    colorPrimary: "#cf35d2",
    colorBackground: "#181826",
    colorText: "#ececec",
    colorTextSecondary: "#9ca3af",
    colorDanger: "#ef4444",
    borderRadius: "10px",
    fontSizeBase: "15px",
  },
  rules: {
    ".Input": {
      border: "1px solid rgba(255,255,255,0.1)",
      backgroundColor: "rgba(255,255,255,0.04)",
    },
    ".Input:focus": {
      border: "1px solid #cf35d2",
      boxShadow: "0 0 0 1px #cf35d2",
    },
    ".Tab": {
      border: "1px solid rgba(255,255,255,0.1)",
      backgroundColor: "rgba(255,255,255,0.04)",
    },
    ".Tab--selected": { borderColor: "#cf35d2" },
    ".Label": { color: "#9ca3af" },
  },
};

function CheckoutForm({ total }: { total: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const { clearCart } = useCart();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
      confirmParams: {
        return_url: `${window.location.origin}/cart?success=true`,
      },
    });

    if (error) {
      toast.error(error.message || "Pagesa dështoi");
      setLoading(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === "succeeded") {
      await fetch("/api/orders/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentIntentId: paymentIntent.id, email }),
      }).catch(() => {});
      clearCart();
      router.push("/cart?success=true");
    } else {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <LinkAuthenticationElement onChange={(ev) => setEmail(ev.value.email)} />
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full py-3 rounded-lg text-white font-semibold transition disabled:opacity-60 hover:shadow-[0_0_15px_rgba(207,53,210,0.4)]"
        style={{
          background:
            "linear-gradient(65deg, rgb(63, 50, 220) 0%, rgb(207, 53, 210) 100%)",
        }}
      >
        {loading ? "Duke procesuar..." : `Paguaj $${total.toFixed(2)}`}
      </button>
    </form>
  );
}

const Checkout: NextPage = () => {
  const { cart, total } = useCart();
  const [clientSecret, setClientSecret] = useState("");
  const [loadingCs, setLoadingCs] = useState(true);
  const createdRef = useRef(false); // pengon thirrjen e dyfishtë (Strict Mode)

  useEffect(() => {
    if (createdRef.current) return;
    if (cart.length === 0) {
      setLoadingCs(false);
      return;
    }
    createdRef.current = true;
    setLoadingCs(true);
    fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cart.map((item) => ({ _id: item._id, qty: item.qty })),
      }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret || ""))
      .catch(() => {})
      .finally(() => setLoadingCs(false));
  }, [cart]);

  return (
    <>
      <Head>
        <title>Pagesa - Paradox Tech</title>
      </Head>

      <Layout>
        <section className="min-h-screen bg-paradox-bg pt-32 pb-20 px-6">
          <div className="max-w-xl mx-auto">
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
              <div className="border border-white/10 rounded-2xl p-6 bg-white/5">
                <div className="flex justify-between items-center mb-6 text-[#ececec]">
                  <span className="text-gray-400">Totali</span>
                  <span className="text-2xl font-bold">
                    ${total.toFixed(2)}
                  </span>
                </div>

                {loadingCs ? (
                  <p className="text-gray-400">Duke ngarkuar pagesën...</p>
                ) : clientSecret ? (
                  <Elements
                    stripe={stripePromise}
                    options={{ clientSecret, appearance }}
                  >
                    <CheckoutForm total={total} />
                  </Elements>
                ) : (
                  <p className="text-red-400">
                    Gabim te ngarkimi i pagesës. Sigurohu që çelësat e Stripe
                    janë te .env.local.
                  </p>
                )}
              </div>
            )}
          </div>
        </section>
      </Layout>
    </>
  );
};

// Vetëm përdoruesit e kyçur mund të bëjnë porosi
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: "/login?callbackUrl=/checkout",
        permanent: false,
      },
    };
  }
  return { props: {} };
};

export default Checkout;
