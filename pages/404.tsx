// pages/404.tsx
import Layout from "@/components/Layout";
import Head from "next/head";
import Link from "next/link";
import { NextPage } from "next";

const NotFound: NextPage = () => {
  return (
    <>
      <Head>
        <title>404 - Faqja s&apos;u gjet</title>
      </Head>
      <Layout>
        <section className="min-h-screen bg-paradox-bg flex flex-col items-center justify-center text-center px-6 text-[#ececec]">
          <h1
            className="text-7xl sm:text-9xl font-extrabold mb-4"
            style={{
              background:
                "linear-gradient(65deg, rgb(63, 50, 220) 0%, rgb(207, 53, 210) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            404
          </h1>
          <p className="text-lg text-gray-400 mb-8">
            Faqja që po kërkoni nuk ekziston.
          </p>
          <Link
            href="/"
            className="px-6 py-3 rounded-lg text-white font-semibold transition hover:shadow-[0_0_15px_rgba(207,53,210,0.4)]"
            style={{
              background:
                "linear-gradient(65deg, rgb(63, 50, 220) 0%, rgb(207, 53, 210) 100%)",
            }}
          >
            Kthehu në faqen kryesore
          </Link>
        </section>
      </Layout>
    </>
  );
};

export default NotFound;
