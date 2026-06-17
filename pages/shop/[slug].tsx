// pages/shop/[slug].tsx

import Layout from "@/components/Layout";
import Head from "next/head";
import Link from "next/link";
import { NextPage } from "next";
import { FIGMA } from "@/lib/figmaAssets";

const thumbnails = [
  FIGMA.productHeadsetPink,
  FIGMA.productHeadsetPinkSide,
  FIGMA.productHeadsetPinkBox,
  FIGMA.productHeadsetPinkModel,
];

const relatedProducts = [
  {
    name: "Logitech Pro X Wireless Gaming Headset",
    price: "$223.00",
    image: FIGMA.productHeadset,
  },
  {
    name: "Logitech G203 LIGHTSYNC",
    price: "$39.00",
    image: FIGMA.productMouse,
  },
  {
    name: "Logitech G PRO Mechanical Gaming Keyboard",
    price: "$149.00",
    image: FIGMA.keyboardRgb,
  },
  {
    name: "Logitech PRO X TKL Wireless Mechanical Keyboard Pink",
    price: "$199.00",
    image: FIGMA.keyboardPink,
  },
];

const ProductDetails: NextPage = () => {
  return (
    <>
      <Head>
        <title>Wireless Gaming Headset - Paradox Tech</title>
        <meta name="description" content="Product details page" />
      </Head>

      <Layout>
        <section className="min-h-screen bg-paradox-bg pt-32 pb-20 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <p className="text-xs text-[#ececec]/60 mb-10">
              shop / wireless / G733
            </p>

            {/* Product area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
              {/* Left images */}
              <div className="grid grid-cols-[90px_1fr] sm:grid-cols-[120px_1fr] gap-4">
                <div className="flex flex-col gap-4">
                  {thumbnails.map((image, index) => (
                    <button
                      key={index}
                      className="bg-white aspect-square overflow-hidden border border-transparent hover:border-[#cf35d2] transition"
                    >
                      <img
                        loading="lazy"
                        decoding="async"
                        src={image}
                        alt={`Product thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>

                <div className="bg-white aspect-square flex items-center justify-center overflow-hidden">
                  <img
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    src={FIGMA.productHeadsetPink}
                    alt="Logitech G Pro X Lightspeed Pink Headset"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Right details */}
              <div className="text-[#ececec]">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold leading-tight mb-4">
                  Headset Gamer Sem Fio Logitech G Pro X 2 Lightspeed
                </h1>

                <div className="flex items-center gap-3 mb-4">
                  <div className="text-yellow-400 text-sm">★★★★★</div>
                  <span className="text-xs text-[#ececec]/60">(1 review)</span>
                </div>

                <p className="text-xl font-semibold mb-6">$223.00</p>

                <p className="text-sm leading-relaxed text-[#ececec]/75 max-w-md mb-8">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras
                  eu volutpat lectus. In hac massa, egestas nibh, consectetur ac
                  condimentum aliquam imperdiet elit.
                </p>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center border border-[#ececec]/30">
                    <button className="w-10 h-10 hover:bg-white hover:text-black transition">
                      -
                    </button>
                    <span className="w-12 h-10 flex items-center justify-center text-sm">
                      1
                    </span>
                    <button className="w-10 h-10 hover:bg-white hover:text-black transition">
                      +
                    </button>
                  </div>

                  <button className="bg-[#ececec] text-black px-8 h-10 text-sm font-semibold hover:bg-[#cf35d2] hover:text-white transition">
                    Add to cart
                  </button>
                </div>

                <label className="flex items-center gap-3 text-sm text-[#ececec]/70 mb-8">
                  <input type="checkbox" className="accent-[#cf35d2]" />
                  Add to wishlist
                </label>

                <div className="space-y-2 text-sm text-[#ececec]/70 mb-10">
                  <p>
                    <span className="text-[#ececec]">Sku:</span> CT
                  </p>
                  <p>
                    <span className="text-[#ececec]">Category:</span> Headset
                  </p>
                </div>

                {/* Tabs */}
                <div>
                  <div className="flex flex-wrap gap-6 border-b border-[#ececec]/20 mb-5 text-sm">
                    <button className="pb-3 border-b border-[#ececec] text-[#ececec]">
                      Description
                    </button>
                    <button className="pb-3 text-[#ececec]/60 hover:text-white">
                      Additional information
                    </button>
                    <button className="pb-3 text-[#ececec]/60 hover:text-white">
                      Reviews
                    </button>
                  </div>

                  <p className="text-sm leading-relaxed text-[#ececec]/70 max-w-xl">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Suspendisse pellentesque sem tellus adipiscing elit.
                    Consequat dolor odio odio malesuada at condimentum.
                  </p>
                </div>
              </div>
            </div>

            {/* Related products */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-[#ececec] text-lg font-semibold">
                  Related products
                </h2>

                <div className="flex gap-2">
                  <button className="w-5 h-5 border border-[#ececec]/40 text-xs text-[#ececec]">
                    ‹
                  </button>
                  <button className="w-5 h-5 border border-[#ececec]/40 text-xs text-[#ececec]">
                    ›
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((product, index) => (
                  <Link
                    href="/shop/product"
                    key={index}
                    className="group text-center"
                  >
                    <div className="bg-white aspect-square overflow-hidden mb-4">
                      <img
                        loading="lazy"
                        decoding="async"
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <h3 className="text-[#ececec] text-sm font-semibold leading-snug mb-2">
                      {product.name}
                    </h3>

                    <div className="text-yellow-400 text-xs mb-2">★★★★★</div>

                    <p className="text-[#ececec] text-sm">{product.price}</p>
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
