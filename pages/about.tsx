
import Layout from "@/components/Layout";
import Head from "next/head";
import Link from "next/link";
import { NextPage } from "next";
import { FIGMA } from "@/lib/figmaAssets";

function ReadMoreButton({ href = "/" }: { href?: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-white hover:text-[#cf35d2] transition"
    >
      <span>Read more</span>
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M14 5l7 7m0 0l-7 7m7-7H3"
        />
      </svg>
    </Link>
  );
}

const About: NextPage = () => {
  return (
    <>
      <Head>
        <title>About Us - Paradox Tech</title>
        <meta
          name="description"
          content="Learn more about Paradox Tech"
        />
      </Head>

      <Layout>
        {/* HERO */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          {/* Glow Background */}
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/20 blur-[120px]" />
          <div className="absolute top-[10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-[#cf35d2]/20 blur-[120px]" />

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            {/* About Banner */}
            <div className="relative bg-gradient-to-r from-[#e7e4f5] to-[#d5d2e9] rounded-[35px] overflow-hidden min-h-[320px] flex items-center justify-center">
              {/* Left Image */}
              <img
                src={FIGMA.aboutLeft}
                alt="About illustration"
                className="absolute left-0 bottom-0 w-44 lg:w-64 object-contain"
              />

              {/* Right Image */}
              <img
                src={FIGMA.aboutRight}
                alt="Shopping illustration"
                className="absolute right-0 bottom-0 w-52 lg:w-72 object-contain"
              />

              <h1 className="text-4xl lg:text-6xl font-bold text-[#333] z-10">
                About us
              </h1>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="pb-20 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-white">
            {[
              {
                title: "Shop online",
                desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
              },
              {
                title: "Free shipping",
                desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
              },
              {
                title: "Return policy",
                desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
              },
              {
                title: "Payment",
                desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
              },
            ].map((item, index) => (
              <div key={index}>
                <h3 className="font-bold text-lg mb-3">{item.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* VIDEO SECTION */}
        <section className="relative h-[450px] overflow-hidden">
          <img
            src={FIGMA.videoBg}
            alt="Video section"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/30" />

          <div className="relative z-10 h-full flex items-center justify-center">
            <button className="w-20 h-20 rounded-full bg-[#cf35d2]/80 hover:bg-[#cf35d2] transition flex items-center justify-center shadow-2xl shadow-[#cf35d2]/50">
              <svg
                className="w-8 h-8 text-white ml-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        </section>

        {/* SKILLS SECTION */}
        <section className="py-24 px-6 bg-[#0c0f24]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left */}
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Functionality
                <br />
                meets perfection
              </h2>

              <p className="text-gray-300 leading-relaxed max-w-lg">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse massa libero, mattis volutpat id. Egestas
                adipiscing placerat eleifend a nascetur.
              </p>
            </div>

            {/* Right */}
            <div className="space-y-10">
              {[
                {
                  title: "Creativity",
                  percent: "94%",
                  width: "94%",
                },
                {
                  title: "Advertising",
                  percent: "72%",
                  width: "72%",
                },
                {
                  title: "Design",
                  percent: "84%",
                  width: "84%",
                },
              ].map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-3 text-white">
                    <span>{item.title}</span>
                    <span>{item.percent}</span>
                  </div>

                  <div className="w-full h-[3px] bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#cf35d2] to-blue-500"
                      style={{ width: item.width }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BLOG POSTS */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-14">
              Last blog post
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[
                {
                  image: FIGMA.blog1,
                  title: "Razer Blade 14 Gaming Laptop",
                },
                {
                  image: FIGMA.blog2,
                  title: "ASUS Zenbook 15 OLED",
                },
                {
                  image: FIGMA.blog3,
                  title: "Nitro 5 Gaming Laptop",
                },
              ].map((post, index) => (
                <div key={index} className="group text-center">
                  <div className="overflow-hidden mb-6 bg-white p-4">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-[250px] object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>

                  <h3 className="text-white text-lg font-semibold mb-3">
                    {post.title}
                  </h3>

                  <p className="text-gray-400 text-sm mb-6">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </p>

                  <ReadMoreButton />
                </div>
              ))}
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default About;
