import Layout from "@/components/Layout";
import Head from "next/head";
import Link from "next/link";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { IProduct } from "@/types";

const ProductDetails: NextPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart: addToCartCtx } = useCart();
  const [added, setAdded] = useState(false);

  // ----------------------------
  // FETCH SINGLE PRODUCT
  // ----------------------------
  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${slug}`);
        if (!res.ok) {
          setProduct(null);
          return;
        }
        const data = await res.json();

        setProduct(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  // ----------------------------
  // FETCH RELATED PRODUCTS
  // ----------------------------
  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();

        setRelated(data.slice(0, 4));
      } catch (err) {
        console.log(err);
      }
    };

    fetchRelated();
  }, []);

  // ----------------------------
  // LOADING STATE
  // ----------------------------
  if (loading) {
    return (
      <Layout>
        <div className="pt-40 text-center text-white">Loading product...</div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="pt-40 text-center text-white">Product not found</div>
      </Layout>
    );
  }

  // ----------------------------
  // ADD TO CART (përmes CartContext)
  // ----------------------------
  const addToCart = () => {
    // shto produktin 'quantity' herë në shportën globale
    for (let i = 0; i < quantity; i++) {
      addToCartCtx(product as IProduct);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <>
      <Head>
        <title>{product.title}</title>
        <meta name="description" content={product.description} />
      </Head>

      <Layout>
        <section className="min-h-screen bg-paradox-bg pt-32 pb-20 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <p className="text-xs text-[#ececec]/60 mb-10">
              shop / {product.category}
            </p>

            {/* PRODUCT SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
              {/* IMAGE */}
              <div className="bg-white aspect-square flex items-center justify-center overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* DETAILS */}
              <div className="text-[#ececec]">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-4">
                  {product.title}
                </h1>

                <div className="flex items-center gap-3 mb-4">
                  <div className="text-yellow-400 text-sm">★★★★★</div>
                  <span className="text-xs text-[#ececec]/60">(1 review)</span>
                </div>

                <p className="text-xl font-semibold mb-6">${product.price}</p>

                <p className="text-sm text-[#ececec]/75 mb-8">
                  {product.description}
                </p>

                {/* QUANTITY */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center border border-[#ececec]/30">
                    <button
                      className="w-10 h-10 hover:bg-white hover:text-black"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    >
                      -
                    </button>

                    <span className="w-12 h-10 flex items-center justify-center">
                      {quantity}
                    </span>

                    <button
                      className="w-10 h-10 hover:bg-white hover:text-black"
                      onClick={() => setQuantity((q) => q + 1)}
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={addToCart}
                    className={`px-8 h-10 text-sm font-semibold transition ${
                      added
                        ? "bg-green-500 text-white"
                        : "bg-[#ececec] text-black hover:bg-[#cf35d2] hover:text-white"
                    }`}
                  >
                    {added ? "Shtuar ✓" : "Add to cart"}
                  </button>
                </div>

                {/* INFO */}
                <div className="space-y-2 text-sm text-[#ececec]/70">
                  <p>
                    <span className="text-[#ececec]">SKU:</span> {product._id}
                  </p>
                  <p>
                    <span className="text-[#ececec]">Category:</span>{" "}
                    {product.category}
                  </p>
                </div>
              </div>
            </div>

            {/* RELATED PRODUCTS */}
            <div>
              <h2 className="text-[#ececec] text-lg font-semibold mb-6">
                Related products
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {related.map((item) => (
                  <Link
                    key={item._id}
                    href={`/shop/${item._id}`}
                    className="text-center"
                  >
                    <div className="bg-white aspect-square mb-4 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <h3 className="text-[#ececec] text-sm font-semibold mb-2">
                      {item.title}
                    </h3>

                    <p className="text-[#ececec] text-sm">${item.price}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default ProductDetails;
