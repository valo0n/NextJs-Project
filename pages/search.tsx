// pages/search.tsx
import Layout from "@/components/Layout";
import Head from "next/head";
import Card from "@/components/Card";
import { GetServerSideProps, NextPage } from "next";
import { useState } from "react";
import { useRouter } from "next/router";
import { dbConnect } from "@/lib/dbConnect";
import Product from "@/models/Product";

interface SearchResult {
  _id: string;
  name: string;
  price: number;
  image: string;
}

interface SearchProps {
  query: string;
  results: SearchResult[];
}

const Search: NextPage<SearchProps> = ({ query, results }) => {
  const [q, setQ] = useState(query);
  const router = useRouter();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <>
      <Head>
        <title>Kërko - Paradox Tech</title>
      </Head>

      <Layout>
        <section className="min-h-screen bg-paradox-bg pt-32 pb-20 px-6 text-[#ececec]">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Kërko produkte</h1>

            <form onSubmit={submit} className="flex gap-3 mb-10 max-w-xl">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Shkruaj emrin e produktit..."
                className="flex-1 bg-white/5 border border-white/10 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#cf35d2] placeholder:text-gray-500"
              />
              <button
                type="submit"
                className="px-6 rounded-lg text-white font-semibold"
                style={{
                  background:
                    "linear-gradient(65deg, rgb(63, 50, 220) 0%, rgb(207, 53, 210) 100%)",
                }}
              >
                Kërko
              </button>
            </form>

            {query && (
              <p className="text-gray-400 mb-6">
                {results.length} rezultate për &quot;{query}&quot;
              </p>
            )}

            {query && results.length === 0 ? (
              <p className="text-gray-400">S&apos;u gjet asnjë produkt.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {results.map((p) => (
                  <Card key={p._id} product={p} />
                ))}
              </div>
            )}
          </div>
        </section>
      </Layout>
    </>
  );
};

// SSR - rezultate të freskëta sipas query-t
export const getServerSideProps: GetServerSideProps<SearchProps> = async (
  ctx,
) => {
  const query = (ctx.query.q as string) || "";
  let results: SearchResult[] = [];

  if (query.trim() && process.env.MONGODB_URI) {
    try {
      await dbConnect();
      const docs = await Product.find({
        $or: [
          { title: { $regex: query, $options: "i" } },
          { category: { $regex: query, $options: "i" } },
        ],
      })
        .limit(20)
        .lean();

      results = docs.map((d) => ({
        _id: d._id.toString(),
        name: d.title,
        price: d.price,
        image: d.image || "",
      }));
    } catch (error) {
      console.error("Gabim te search:", error);
    }
  }

  return { props: { query, results } };
};

export default Search;
