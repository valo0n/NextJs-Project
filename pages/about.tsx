import Layout from "@/components/Layout";
import Head from "next/head";
import Link from "next/link";
import { GetStaticProps, NextPage } from "next";
import { FIGMA } from "@/lib/figmaAssets";
import { dbConnect } from "@/lib/dbConnect";
import BlogPost from "@/models/BlogPost";

interface LastPost {
  _id: string;
  image: string;
  title: string;
  desc: string;
}

interface AboutProps {
  lastPosts: LastPost[];
}

function ReadMoreButton({ href = "/" }: { href?: string }) {
  return (
    <Link
      href={href}
      className="text-white underline-offset-4 underline hover:text-[#cf35d2] transition text-sm"
    >
      Read more
    </Link>
  );
}

const About: NextPage<AboutProps> = ({ lastPosts }) => {
  return (
    <>
      <Head>
        <title>About Us - Paradox Tech</title>
        <meta name="description" content="Learn more about Paradox Tech" />
      </Head>

      <Layout>
        {/* HERO BANNER - "About us" me 2 ilustrime */}
        <section className="relative pt-32 pb-16 px-6 overflow-hidden">
          {/* Glow blue ne sfond lart */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-blue-500/25 blur-[150px] pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10">
            {/* Banner me sfond te qelte gradient */}
            <div
              className="relative rounded-[35px] overflow-hidden min-h-[280px] sm:min-h-[340px] flex items-center justify-center px-6 py-8"
              style={{
                background:
                  "linear-gradient(135deg, #d8d4e8 0%, #c9c5dc 50%, #b9b5d0 100%)",
              }}
            >
              {/* Left illustration - 3D laptop */}
              <img
                loading="eager"
                decoding="async"
                src={FIGMA.aboutLeft}
                alt="Laptop illustration"
                className="absolute left-2 sm:left-6 bottom-2 sm:bottom-6 w-32 sm:w-48 lg:w-64 object-contain z-10 pointer-events-none"
              />

              {/* Right illustration - 3D shopping cart */}
              <img
                loading="eager"
                decoding="async"
                src={FIGMA.aboutRight}
                alt="Shopping illustration"
                className="absolute right-2 sm:right-6 bottom-2 sm:bottom-6 w-32 sm:w-48 lg:w-72 object-contain z-10 pointer-events-none"
              />

              {/* Centered title */}
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-[#3a3a3a] z-20 relative">
                About us
              </h1>
            </div>
          </div>
        </section>

        {/* FEATURES - 4 columns */}
        <section className="py-12 sm:py-16 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 text-white text-center">
            {[
              {
                title: "Shope online",
                desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Consequat dolor odio odio",
              },
              {
                title: "Free shipping",
                desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Consequat dolor odio odio",
              },
              {
                title: "Return policy",
                desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Consequat dolor odio odio",
              },
              {
                title: "PAYMENT",
                desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Consequat dolor odio odio",
              },
            ].map((item, index) => (
              <div key={index}>
                <h3 className="font-bold text-xl lg:text-2xl mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-300 text-sm lg:text-base leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* VIDEO SECTION - 3D app icons background */}
        <section className="relative h-64 sm:h-96 lg:h-[450px] overflow-hidden">
          <img
            loading="lazy"
            decoding="async"
            src={FIGMA.aboutVideoBg}
            alt="Video section"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />

          <div className="relative z-10 h-full flex items-center justify-center">
            <button
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition shadow-2xl backdrop-blur-md hover:scale-110"
              style={{
                background:
                  "linear-gradient(135deg, rgba(207, 53, 210, 0.7), rgba(63, 50, 220, 0.7))",
                boxShadow: "0 0 40px rgba(207, 53, 210, 0.5)",
              }}
              aria-label="Play video"
            >
              <svg
                className="w-7 h-7 sm:w-9 sm:h-9 text-white ml-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        </section>

        {/* FUNCTIONALITY MEETS PERFECTION - text + skill bars */}
        <section className="py-16 sm:py-24 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Left - title + paragraph */}
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                Functionality
                <br />
                meets perfection
              </h2>

              <p className="text-gray-300 leading-relaxed max-w-lg text-base lg:text-lg">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse massa libero, mattis volutpat id. Egestas adipiscing
                placerat eleifend a nascetur. Mattis proin enim, nam porttitor
                vitae.
              </p>
            </div>

            {/* Right - skill bars */}
            <div className="space-y-10">
              {[
                { title: "Creativity", percent: 94 },
                { title: "Advertising", percent: 72 },
                { title: "Design", percent: 84 },
              ].map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-3 text-white text-lg">
                    <span>{item.title}</span>
                    <span>{item.percent} %</span>
                  </div>

                  {/* Progress bar - gradient yellow → red → green */}
                  <div className="relative w-full h-[3px] bg-gray-700/40 overflow-hidden rounded-full">
                    <div
                      className="absolute top-0 left-0 h-full rounded-full"
                      style={{
                        width: `${item.percent}%`,
                        background:
                          "linear-gradient(90deg, #facc15 0%, #ef4444 50%, #22c55e 100%)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* LAST BLOG POST - 3 laptopa */}
        <section className="py-16 sm:py-20 px-6 pb-32">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-12 lg:mb-16">
              Last blog post
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              {lastPosts.length === 0 ? (
                <p className="text-gray-400 col-span-full">
                  S'ka ende poste blogu.{" "}
                  <a
                    href="/api/blog/seed"
                    className="text-paradox-purple underline"
                  >
                    Mbilli te /api/blog/seed
                  </a>
                  .
                </p>
              ) : (
                lastPosts.map((post) => (
                  <div key={post._id} className="text-center group">
                    {/* Image me sfond te bardhe si ne Figma */}
                    <div className="bg-white overflow-hidden mb-6">
                      <img
                        loading="lazy"
                        decoding="async"
                        src={post.image}
                        alt={post.title}
                        className="w-full h-[200px] sm:h-[250px] object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <h3 className="text-white text-base lg:text-lg font-medium mb-3 px-2">
                      {post.title}
                    </h3>

                    <p className="text-gray-400 text-sm mb-4 px-4 leading-relaxed">
                      {post.desc}
                    </p>

                    <ReadMoreButton />
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export const getStaticProps: GetStaticProps<AboutProps> = async () => {
  let lastPosts: LastPost[] = [];

  try {
    if (process.env.MONGODB_URI) {
      await dbConnect();
      const docs = await BlogPost.find({})
        .sort({ createdAt: -1 })
        .limit(3)
        .lean();

      lastPosts = docs.map((p) => ({
        _id: p._id.toString(),
        image: p.image || "",
        title: p.title,
        desc: p.excerpt,
      }));
    }
  } catch (error) {
    console.error("Gabim ne getStaticProps (about):", error);
  }

  return { props: { lastPosts }, revalidate: 60 };
};

export default About;
