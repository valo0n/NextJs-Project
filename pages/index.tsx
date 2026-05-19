import Layout from "@/components/Layout";
import Head from "next/head";
import Link from "next/link";
import { NextPage, GetStaticProps } from "next";
import { FIGMA } from "@/lib/figmaAssets";
import { dbConnect } from "@/lib/dbConnect";
import Product from "@/models/Product";

// Tipi i produktit per Home
interface HomeProduct {
  _id: string;
  title: string;
  description: string;
  price: number;
  image?: string;
  category?: string;
}

interface HomeProps {
  products: HomeProduct[];
}

// Buton "View more" sipas dizajnit (border simple)
function ViewMoreButton({ href = "/shop" }: { href?: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center gap-3 border border-[#ececec] text-[#ececec] px-12 py-5 text-lg hover:bg-white hover:text-paradox-bg transition-all duration-300"
    >
      <span>View more</span>
      <svg
        className="w-5 h-5"
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

const Home: NextPage<HomeProps> = ({ products }) => {
  return (
    <>
      <Head>
        <title>Paradox Tech - Empowering Your Digital Lifestyle</title>
        <meta name="description" content="Premium tech and gaming gear" />
      </Head>
      <Layout>
        {/* HERO SECTION */}
        <section className="relative min-h-screen overflow-hidden flex items-center">
          {/* Glow effects ne sfond - si ne Figma */}
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] sm:w-[800px] sm:h-[800px] rounded-full bg-paradox-purple/20 blur-[120px] pointer-events-none" />
          <div className="absolute top-[20%] right-[-15%] w-[400px] h-[400px] sm:w-[700px] sm:h-[700px] rounded-full bg-blue-500/15 blur-[120px] pointer-events-none" />

          <div className="w-full max-w-[1440px] mx-auto pt-32 pb-20 relative z-10">
            <div className="relative px-6 lg:px-0">
              {/* Shopping bag illustration - majtas, overlapping me tekstin (si ne Figma) */}
              <img
                src={FIGMA.giveShop}
                alt="Shopping Bag"
                className="
                  hidden lg:block
                  absolute left-0 top-1/2 -translate-y-1/2
                  w-[400px] xl:w-[500px] object-contain pointer-events-none z-0
                "
              />

              {/* Mobile: bag-i lart si fillim */}
              <div className="lg:hidden flex justify-center mb-8">
                <img
                  src={FIGMA.giveShop}
                  alt="Shopping Bag"
                  className="w-56 sm:w-72 object-contain"
                />
              </div>

              {/* Tekstet - centered ne hero, me z-index me te larte */}
              <div className="relative z-10 text-center max-w-3xl mx-auto px-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light mb-6 tracking-wide uppercase">
                  Empowering Your Digital Lifestyle
                </h1>
                <p className="text-gray-300 max-w-xl mx-auto mb-10 text-base sm:text-lg leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Consequat dolor odio odio malesuada at condimentum adipiscing
                  iaculis semper.
                </p>

                <ViewMoreButton href="/shop" />
              </div>
            </div>
          </div>
        </section>

        {/* PRODUCTS OF THE WEEK */}
        <section className="py-16 sm:py-20 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 tracking-wider uppercase">
                Products of the Week
              </h2>
              <p className="text-[#ddd] max-w-3xl mx-auto text-base lg:text-lg">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Consequat dolor odio odio malesuada at condimentum adipiscing
                iaculis semper.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10 mb-12">
              {products.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-400 text-lg mb-4">
                    Nuk ka produkte në databazë.
                  </p>
                  <p className="text-gray-500 text-sm">
                    Vizito{" "}
                    <Link
                      href="/api/seed"
                      className="text-paradox-glow hover:underline"
                    >
                      /api/seed
                    </Link>{" "}
                    për të mbushur DB me produkte fillestare.
                  </p>
                </div>
              ) : (
                products.slice(0, 3).map((product) => (
                  <Link
                    href={`/shop/${product._id}`}
                    key={product._id}
                    className="group"
                  >
                    <div className="relative border-[3px] border-[#cf35d2] rounded-lg overflow-hidden aspect-[4/5] mb-6 group-hover:shadow-[0_0_30px_rgba(207,53,210,0.5)] transition-shadow">
                      <img
                        src={product.image || FIGMA.productMouse}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-center">
                      <h3 className="font-bold text-base lg:text-lg mb-2 capitalize line-clamp-2 min-h-[3rem]">
                        {product.title}
                      </h3>
                      <p className="text-[#ececec] text-xl">
                        $ {product.price.toFixed(2)}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>

            <div className="text-center">
              <p className="text-[#ececec] max-w-2xl mx-auto mb-8 text-base lg:text-lg">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Consequat dolor odio odio malesuada at condimentum adipiscing
                iaculis semper.
              </p>
              <ViewMoreButton />
            </div>
          </div>
        </section>

        {/* VIDEO SECTION - sound waves background */}
        <section className="relative h-64 sm:h-80 lg:h-[523px] overflow-hidden">
          <img
            src={FIGMA.videoBg}
            alt="Studio Setup"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 h-full flex items-center justify-center">
            <button
              className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-paradox-purple/80 hover:bg-paradox-purple flex items-center justify-center transition shadow-2xl shadow-paradox-purple/50"
              aria-label="Play video"
            >
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8 text-white ml-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        </section>

        {/* STYLISH CHAIRS SECTION */}
        <section className="py-16 sm:py-20 lg:py-24 px-6 relative overflow-hidden">
          <div className="absolute top-1/2 right-[10%] w-[400px] h-[400px] rounded-full bg-paradox-purple/15 blur-[100px] pointer-events-none" />

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center relative z-10">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 tracking-wider uppercase">
                stylish chairs
              </h2>
              <p className="text-[#ececec] mb-8 leading-relaxed text-base lg:text-lg max-w-md">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Consequat dolor odio odio malesuada at condimentum adipiscing
                iaculis semper.
              </p>
              <ViewMoreButton />
            </div>
            <div className="relative">
              {/* Border me kornize asimetrike si ne Figma (3 corners rounded) */}
              <div className="border-[3px] border-[#cf35d2] rounded-tl-[80px] rounded-tr-[80px] rounded-bl-[80px] overflow-hidden aspect-square">
                <img
                  src={FIGMA.chair}
                  alt="Gaming Chair"
                  className="w-full h-full object-cover rounded-tl-[80px] rounded-tr-[80px] rounded-bl-[80px]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* TABLE SECTION */}
        <section className="py-16 sm:py-20 lg:py-24 px-6 relative overflow-hidden">
          <div className="absolute top-1/2 left-[5%] w-[400px] h-[400px] rounded-full bg-paradox-purple/15 blur-[100px] pointer-events-none" />

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center relative z-10">
            <div className="relative order-2 lg:order-1">
              <div className="border-[3px] border-[#cf35d2] rounded-tr-[80px] rounded-bl-[80px] rounded-br-[80px] overflow-hidden aspect-square">
                <img
                  src={FIGMA.table}
                  alt="Gaming Desk"
                  className="w-full h-full object-cover rounded-tr-[80px] rounded-bl-[80px] rounded-br-[80px]"
                />
              </div>
            </div>
            <div className="order-1 lg:order-2 text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 tracking-wider uppercase">
                Table
              </h2>
              <p className="text-[#ececec] mb-8 leading-relaxed text-base lg:text-lg max-w-md mx-auto lg:mx-0">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Consequat dolor odio odio malesuada at condimentum adipiscing
                iaculis semper.
              </p>
              <ViewMoreButton />
            </div>
          </div>
        </section>

        {/* CONTEMPORARY LAMPS SECTION */}
        <section className="py-16 sm:py-20 lg:py-24 px-6 relative overflow-hidden">
          <div className="absolute top-1/2 right-[10%] w-[400px] h-[400px] rounded-full bg-paradox-purple/15 blur-[100px] pointer-events-none" />

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center relative z-10">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 tracking-wider uppercase">
                contemporary lamps
              </h2>
              <p className="text-[#ececec] mb-8 leading-relaxed text-base lg:text-lg max-w-md">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Consequat dolor odio odio malesuada at condimentum adipiscing
                iaculis semper.
              </p>
              <ViewMoreButton />
            </div>
            <div className="relative">
              <div className="border-[3px] border-[#cf35d2] rounded-tl-[80px] rounded-tr-[80px] rounded-bl-[80px] overflow-hidden aspect-square">
                <img
                  src={FIGMA.lamp}
                  alt="Studio Setup with Lamps"
                  className="w-full h-full object-cover rounded-tl-[80px] rounded-tr-[80px] rounded-bl-[80px]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* DELIVERY BANNER */}
        <section className="py-12 lg:py-16 bg-[#0f0f0f]">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-xl sm:text-2xl lg:text-3xl text-[#ececec]">
              Order now for an{" "}
              <span className="font-bold">express delivery in 24h !</span>
            </p>
          </div>
        </section>

        {/* CTA - ANOTHER LEVEL */}
        <section className="py-16 lg:py-24 px-6 relative overflow-hidden">
          {/* Background "ParadoxX-" repeated text */}
          <div className="absolute inset-0 flex flex-col justify-center pointer-events-none select-none overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="text-[80px] sm:text-[120px] lg:text-[180px] font-bold text-[#4c4c4c]/30 uppercase whitespace-nowrap leading-none"
              >
                ParadoxX-ParadoxX-
              </div>
            ))}
          </div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center relative z-10">
            {/* Left - text card */}
            <div className="border-[3px] border-[#cf35d2] rounded-tl-[60px] rounded-tr-[60px] rounded-bl-[60px] p-8 sm:p-10 lg:p-14 bg-paradox-bg/40 backdrop-blur-sm">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-[#ececec]">
                Take your results to
              </h2>
              <h2
                className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 uppercase bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(65deg, rgb(63, 50, 220) 0%, rgb(207, 53, 210) 100%)",
                }}
              >
                Another Level!
              </h2>
              <p className="text-[#ececec] text-base sm:text-lg lg:text-2xl leading-relaxed">
                Enter here an impactful phrase that describes who you are, what
                you do, and the results you bring
              </p>
            </div>

            {/* Right - dy fotot e personave */}
            <div className="grid grid-cols-2 gap-4 lg:gap-6">
              <div
                className="relative rounded-tl-[60px] rounded-tr-[60px] rounded-bl-[60px] overflow-hidden aspect-[3/4]"
                style={{
                  background:
                    "linear-gradient(259deg, rgb(207, 53, 210) 3.788%, rgb(63, 50, 220) 165.84%)",
                }}
              >
                <img
                  src={FIGMA.person1}
                  alt="Team member 1"
                  className="w-full h-full object-cover mix-blend-luminosity opacity-90"
                />
              </div>
              <div
                className="relative rounded-tl-[60px] rounded-tr-[60px] rounded-bl-[60px] overflow-hidden aspect-[3/4] mt-12"
                style={{
                  background:
                    "linear-gradient(259deg, rgb(207, 53, 210) 3.788%, rgb(63, 50, 220) 165.84%)",
                }}
              >
                <img
                  src={FIGMA.person2}
                  alt="Team member 2"
                  className="w-full h-full object-cover mix-blend-luminosity opacity-90"
                />
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Home;

// SSG + ISR - faqja generohet ne build dhe rifreskohet automatikisht cdo 60s
export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  let products: HomeProduct[] = [];

  try {
    if (process.env.MONGODB_URI) {
      await dbConnect();
      const docs = await Product.find({}).sort({ createdAt: -1 }).lean();
      products = docs.map((p) => ({
        _id: p._id.toString(),
        title: p.title,
        description: p.description,
        price: p.price,
        image: p.image,
        category: p.category,
      }));
    }
  } catch (error) {
    console.error("Gabim ne getStaticProps:", error);
    // Lej build te vazhdoje me lloje bosh
  }

  return {
    props: { products },
    // ISR - rifresko faqen cdo 60 sekonda
    revalidate: 60,
  };
};
