// pages/cart.tsx

import Layout from "@/components/Layout";
import Head from "next/head";
import Link from "next/link";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useCart } from "@/context/CartContext";

const Cart: NextPage = () => {
  const { cart, removeFromCart, clearCart, total } = useCart();
  const router = useRouter();

  // Kthimi nga Stripe: konfirmo porosinë (paid) dhe pastro shportën
  useEffect(() => {
    if (router.query.success === "true") {
      const pid = router.query.payment_intent;
      if (typeof pid === "string") {
        fetch("/api/orders/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentIntentId: pid }),
        }).catch(() => {});
      }
      clearCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.success]);

  const showSuccess = router.query.success === "true";
  const showCanceled = router.query.canceled === "true";

  return (
    <>
      <Head>
        <title>Shporta - Paradox Tech</title>
      </Head>

      <Layout>
        <section className="min-h-screen bg-paradox-bg pt-32 pb-20 px-6 text-[#ececec]">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold mb-10">Shporta</h1>

            {showSuccess && (
              <div className="mb-8 rounded-lg border border-green-500/40 bg-green-500/10 px-6 py-4 text-green-300">
                ✓ Pagesa u krye me sukses! Faleminderit për porosinë.
              </div>
            )}
            {showCanceled && (
              <div className="mb-8 rounded-lg border border-yellow-500/40 bg-yellow-500/10 px-6 py-4 text-yellow-300">
                Pagesa u anulua. Produktet janë ende në shportë.
              </div>
            )}

            {cart.length === 0 ? (
              <div className="text-center py-20 border border-white/10 rounded-lg">
                <p className="text-gray-400 mb-6">Shporta është bosh.</p>
                <Link
                  href="/shop"
                  className="inline-block px-6 py-3 rounded-lg text-white font-semibold transition hover:shadow-[0_0_15px_rgba(207,53,210,0.4)]"
                  style={{
                    background:
                      "linear-gradient(65deg, rgb(63, 50, 220) 0%, rgb(207, 53, 210) 100%)",
                  }}
                >
                  Shko te dyqani
                </Link>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-4 border border-white/10 rounded-lg p-4"
                    >
                      <div className="w-20 h-20 bg-white rounded overflow-hidden flex-shrink-0">
                        <img
                          loading="lazy"
                          decoding="async"
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm sm:text-base truncate">
                          {item.title}
                        </h3>
                        <p className="text-xs text-[#ececec]/60">
                          {item.category}
                        </p>
                        <p className="text-sm mt-1">
                          ${item.price.toFixed(2)} × {item.qty} ={" "}
                          <span className="font-semibold">
                            ${(item.price * item.qty).toFixed(2)}
                          </span>
                        </p>
                      </div>

                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-sm text-red-400 hover:text-red-300 transition"
                      >
                        Hiq
                      </button>
                    </div>
                  ))}
                </div>

                {/* Totali + veprimet */}
                <div className="mt-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-t border-white/10 pt-6">
                  <button
                    onClick={clearCart}
                    className="text-sm text-[#ececec]/70 hover:text-white transition"
                  >
                    Zbraz shportën
                  </button>

                  <div className="text-right">
                    <p className="text-lg">
                      Totali:{" "}
                      <span className="font-bold text-xl">
                        ${total.toFixed(2)}
                      </span>
                    </p>
                    <button
                      onClick={() => router.push("/checkout")}
                      className="mt-4 px-8 py-3 rounded-lg text-white font-semibold transition hover:shadow-[0_0_15px_rgba(207,53,210,0.4)]"
                      style={{
                        background:
                          "linear-gradient(65deg, rgb(63, 50, 220) 0%, rgb(207, 53, 210) 100%)",
                      }}
                    >
                      Vazhdo te pagesa
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Cart;
