// pages/shop.tsx

import Layout from "@/components/Layout";
import Head from "next/head";
import Link from "next/link";
import { GetStaticProps, NextPage } from "next";
import { useUserProducts } from "@/context/UserProductsContext";
import Card from "@/components/Card";
import { dbConnect } from "@/lib/dbConnect";
import Product from "@/models/Product";

interface ShopProduct {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface ShopProps {
  products: ShopProduct[];
  categories: string[];
}

const FALLBACK_CATEGORIES = [
  "Acer",
  "Keyboard",
  "Logitech",
  "Headsets",
  "Mouse-Pad",
  "Mouse",
];

const Shop: NextPage<ShopProps> = ({ products, categories }) => {
  const { products: userProducts } = useUserProducts();
  const cats = categories.length > 0 ? categories : FALLBACK_CATEGORIES;

  return (
    <>
      <Head>
        <title>Shop - Paradox Tech</title>
        <meta name="description" content="Shop premium tech products" />
      </Head>

      <Layout>
        <section className="min-h-screen bg-paradox-bg pt-32 pb-20 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <p className="text-sm text-[#ececec]/70 mb-12">
              Shopping / Tech / Products
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12">
              {/* Left - products */}
              <div>
                {/* USER PRODUCTS SECTION (nese ka) */}
                {userProducts.length > 0 && (
                  <div className="mb-16">
                    <div className="flex items-center gap-3 mb-8">
                      <h2 className="text-xl font-bold text-white">
                        Produkte nga komuniteti
                      </h2>
                      <span
                        className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                        style={{
                          background:
                            "linear-gradient(65deg, rgb(63, 50, 220) 0%, rgb(207, 53, 210) 100%)",
                        }}
                      >
                        {userProducts.length}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                      {userProducts.map((product) => (
                        <div key={product.id} className="group text-center">
                          <div className="relative">
                            {/* Badge */}
                            <span
                              className="absolute top-2 right-2 z-10 px-2 py-1 rounded text-xs font-bold text-white"
                              style={{
                                background:
                                  "linear-gradient(65deg, rgb(63, 50, 220) 0%, rgb(207, 53, 210) 100%)",
                              }}
                            >
                              I RI
                            </span>
                            <div className="bg-white aspect-square overflow-hidden mb-4 flex items-center justify-center">
                              <img
                                loading="lazy"
                                decoding="async"
                                src={product.image}
                                alt={product.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    "https://placehold.co/400x400/1a1a3a/cf35d2?text=No+Image";
                                }}
                              />
                            </div>
                          </div>

                          <h3 className="text-[#ececec] text-sm font-semibold leading-snug mb-2">
                            {product.title}
                          </h3>

                          <p className="text-xs text-[#ececec]/60 mb-2">
                            {product.category}
                          </p>

                          <div className="flex justify-center gap-1 mb-2 text-yellow-400 text-xs">
                            ★★★★★
                          </div>

                          <p className="text-[#ececec] text-sm font-bold">
                            ${product.price.toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="my-12 border-t border-white/10" />
                  </div>
                )}

                {/* DEFAULT PRODUCTS - nga databaza */}
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-bold text-white">
                    Të gjitha produktet
                  </h2>
                  <p className="text-sm text-[#ececec]/70">
                    Sort by popularity
                  </p>
                </div>

                {products.length === 0 ? (
                  <div className="text-center py-20 border border-white/10 rounded-lg">
                    <p className="text-gray-400 mb-4">
                      S'ka produkte në databazë.
                    </p>
                    <a
                      href="/api/seed"
                      className="text-paradox-purple underline"
                    >
                      Kliko këtu për t'i mbjellë produktet (/api/seed)
                    </a>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                    {products.map((product) => (
                      <Card key={product._id} product={product} />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                <div className="flex justify-center mt-12">
                  <div className="flex items-center gap-2 bg-[#3a3a46] rounded-full px-4 py-2 text-xs text-white">
                    <button className="w-6 h-6 rounded-full bg-[#ececec] text-black">
                      1
                    </button>
                    <button>2</button>
                    <button>3</button>
                    <button>4</button>
                    <button>5</button>
                    <button>›</button>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <aside className="text-[#ececec]">
                {/* Sell your product CTA */}
                <div className="mb-10 border border-[#cf35d2]/40 rounded-2xl p-6 bg-paradox-purple/10">
                  <h3 className="font-bold mb-2">Shit produktin tënd</h3>
                  <p className="text-xs text-[#ececec]/70 mb-4">
                    Bëhu shitës dhe shto produktet e tua këtu
                  </p>
                  <Link
                    href="/profile"
                    className="block text-center px-4 py-2 rounded-lg text-white font-semibold text-sm transition-all hover:shadow-[0_0_15px_rgba(207,53,210,0.4)]"
                    style={{
                      background:
                        "linear-gradient(65deg, rgb(63, 50, 220) 0%, rgb(207, 53, 210) 100%)",
                    }}
                  >
                    Shko te Profili
                  </Link>
                </div>

                <div className="mb-10">
                  <h2 className="font-semibold mb-5">Category</h2>

                  <ul className="space-y-3 text-sm text-[#ececec]/80">
                    {cats.map((category) => (
                      <li key={category}>
                        <Link
                          href="/shop"
                          className="hover:text-white transition"
                        >
                          {category}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-10">
                  <h2 className="font-semibold mb-5">Color</h2>

                  <ul className="space-y-3 text-sm text-[#ececec]/80">
                    <li>Black</li>
                    <li>Blue</li>
                    <li>Red</li>
                    <li>Green</li>
                    <li>Yellow</li>
                    <li>Grey</li>
                  </ul>
                </div>

                <div>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    className="w-full accent-[#cf35d2]"
                  />

                  <div className="flex justify-between items-center mt-4">
                    <p className="text-sm text-[#ececec]/80">
                      Price: $0 - $1000
                    </p>

                    <button className="border border-[#ececec]/40 px-4 py-2 text-xs hover:bg-white hover:text-black transition">
                      Filter
                    </button>
                  </div>
                </div>
              </aside>
            </div>

            <div className="text-right mt-12">
              <Link
                href="/shop"
                className="text-sm text-[#ececec]/70 hover:text-white"
              >
                view all
              </Link>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export const getStaticProps: GetStaticProps<ShopProps> = async () => {
  let products: ShopProduct[] = [];
  let categories: string[] = [];

  try {
    if (process.env.MONGODB_URI) {
      await dbConnect();
      const docs = await Product.find({}).sort({ createdAt: -1 }).lean();

      products = docs.map((p) => ({
        _id: p._id.toString(),
        name: p.title,
        price: p.price,
        image: p.image || "",
        category: p.category || "",
      }));

      categories = Array.from(
        new Set(products.map((p) => p.category).filter(Boolean)),
      );
    }
  } catch (error) {
    console.error("Gabim ne getStaticProps (shop):", error);
  }

  return { props: { products, categories }, revalidate: 60 };
};

export default Shop;
