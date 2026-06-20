import Layout from "@/components/Layout";
import Head from "next/head";
import Card from "@/components/Card";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useState } from "react";
import mongoose from "mongoose";
import { useCart } from "@/context/CartContext";
import { IProduct } from "@/types";
import { dbConnect } from "@/lib/dbConnect";
import Product from "@/models/Product";

interface PDProduct {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

interface RelatedProduct {
  _id: string;
  name: string;
  price: number;
  image: string;
}

interface ProductDetailsProps {
  product: PDProduct;
  related: RelatedProduct[];
}

const ProductDetails: NextPage<ProductDetailsProps> = ({
  product,
  related,
}) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart: addToCartCtx } = useCart();
  const [added, setAdded] = useState(false);

  const addToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCartCtx(product as unknown as IProduct);
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
            {related.length > 0 && (
              <div>
                <h2 className="text-[#ececec] text-lg font-semibold mb-6">
                  Related products
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {related.map((item) => (
                    <Card key={item._id} product={item} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </Layout>
    </>
  );
};

// Rrugët dinamike - getStaticPaths
export const getStaticPaths: GetStaticPaths = async () => {
  let paths: { params: { slug: string } }[] = [];
  try {
    if (process.env.MONGODB_URI) {
      await dbConnect();
      const docs = await Product.find({}).select("_id").lean();
      paths = docs.map((d) => ({ params: { slug: d._id.toString() } }));
    }
  } catch (error) {
    console.error("Gabim te getStaticPaths:", error);
  }
  // fallback: "blocking" -> produktet e reja gjenerohen sipas kërkesës
  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<ProductDetailsProps> = async (
  ctx,
) => {
  const slug = ctx.params?.slug as string;

  if (!slug || !mongoose.Types.ObjectId.isValid(slug)) {
    return { notFound: true };
  }

  try {
    await dbConnect();
    const doc = await Product.findById(slug).lean();
    if (!doc) {
      return { notFound: true };
    }

    const product: PDProduct = {
      _id: doc._id.toString(),
      title: doc.title,
      description: doc.description,
      price: doc.price,
      image: doc.image || "",
      category: doc.category || "",
      stock: doc.stock ?? 0,
    };

    // Related: produkte të të njëjtës kategori (përjashto vetë produktin)
    const relatedDocs = await Product.find({
      category: doc.category,
      _id: { $ne: doc._id },
    })
      .limit(4)
      .lean();

    const related: RelatedProduct[] = relatedDocs.map((r) => ({
      _id: r._id.toString(),
      name: r.title,
      price: r.price,
      image: r.image || "",
    }));

    return { props: { product, related }, revalidate: 60 };
  } catch (error) {
    console.error("Gabim te getStaticProps (product):", error);
    return { notFound: true };
  }
};

export default ProductDetails;
