import Layout from "@/components/Layout";
import Head from "next/head";
import Link from "next/link";
import { NextPage } from "next";
import { FIGMA } from "@/lib/figmaAssets";

const Blog: NextPage = () => {
  const categories = [
    { name: "Acer", count: 23 },
    { name: "Monitor", count: 18 },
    { name: "Led", count: 22 },
    { name: "Mouse", count: 21 },
    { name: "Mouse Pad", count: 25 },
    { name: "HDMI", count: 13 },
  ];

  const posts = [
    {
      id: 1,
      title: "Logitech's latest keyboard has arrived",
      date: "Sep 20, 2022",
      category: "Keyboard",
      author: "Admin-art",
      comments: 0,
      image: FIGMA.blog1,
    },
    {
      id: 2,
      title: "New Logitech keyboard out now!",
      date: "Sep 20, 2022",
      category: "Keyboard",
      author: "Admin-art",
      comments: 0,
      image: FIGMA.blog2,
    },
    {
      id: 3,
      title: "New Logitech keyboard released!",
      date: "Sep 20, 2022",
      category: "Keyboard",
      author: "Admin-art",
      comments: 0,
      image: FIGMA.blog3,
    },
  ];

  return (
    <>
      <Head>
        <title>Blog - Paradox Tech</title>
      </Head>
      <Layout>
        <div className="bg-paradox-bg text-[#ececec] pt-32 pb-20 px-6">
          <div className="max-w-[1440px] mx-auto">
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-400 mb-12">
              <Link href="/" className="hover:text-white">
                Shop
              </Link>{" "}
              /<span className="ml-1">Blog</span> /
              <span className="text-paradox-purple ml-1">
                New modern tech devices
              </span>
            </nav>

            <div className="flex flex-col lg:flex-row gap-12">
              {/* MAIN CONTENT - POSTS */}
              <div className="flex-1 space-y-16">
                {posts.map((post) => (
                  <article key={post.id} className="group">
                    <div className="mb-6 overflow-hidden rounded-lg border border-white/10">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-gray-400 mb-4">
                      <span>{post.date}</span>
                      <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                      <span>Modern, House, {post.category}</span>
                      <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                      <span>By {post.author}</span>
                      <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                      <span>💬 {post.comments}</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4 hover:text-paradox-purple transition cursor-pointer">
                      {post.title}
                    </h2>
                    <p className="text-gray-400 leading-relaxed mb-6">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Suspendisse massa libero, mattis volutpat id. Egestas
                      adipiscing placerat eleifend a nascetur.
                    </p>
                    <button className="text-paradox-purple hover:text-paradox-pink transition text-sm underline-offset-4 hover:underline">
                      Read more →
                    </button>
                  </article>
                ))}

                {/* Comment Form */}
                <div className="mt-20 border-t border-white/10 pt-12">
                  <h3 className="text-2xl font-bold mb-2">Leave a Reply</h3>
                  <p className="text-gray-400 text-sm mb-8">
                    Your email address will not be published. Required fields
                    are marked *
                  </p>
                  <form className="space-y-6">
                    <textarea
                      placeholder="Comment *"
                      rows={5}
                      className="w-full bg-white/5 border border-white/10 text-white p-4 rounded-lg focus:outline-none focus:border-paradox-purple transition placeholder:text-gray-500"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input
                        type="text"
                        placeholder="Name *"
                        className="bg-white/5 border border-white/10 text-white p-3 rounded-lg focus:outline-none focus:border-paradox-purple transition placeholder:text-gray-500"
                      />
                      <input
                        type="email"
                        placeholder="Email *"
                        className="bg-white/5 border border-white/10 text-white p-3 rounded-lg focus:outline-none focus:border-paradox-purple transition placeholder:text-gray-500"
                      />
                      <input
                        type="text"
                        placeholder="Website"
                        className="bg-white/5 border border-white/10 text-white p-3 rounded-lg focus:outline-none focus:border-paradox-purple transition placeholder:text-gray-500"
                      />
                    </div>
                    <button
                      type="button"
                      className="bg-paradox-purple hover:bg-paradox-pink text-white px-8 py-3 rounded-lg transition"
                    >
                      Post Comment
                    </button>
                  </form>
                </div>
              </div>

              {/* SIDEBAR */}
              <aside className="lg:w-80 space-y-10">
                {/* Search */}
                <div>
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full bg-white/5 border border-white/10 text-white p-3 rounded-lg focus:outline-none focus:border-paradox-purple transition placeholder:text-gray-500"
                  />
                </div>

                {/* Recent Post Widget */}
                <div>
                  <h3 className="font-bold text-lg mb-4">Recent post</h3>
                  <div className="flex gap-3 group cursor-pointer">
                    <img
                      src={FIGMA.productKeyboard1}
                      alt="Recent post"
                      className="w-20 h-20 object-cover rounded opacity-80 group-hover:opacity-100 transition"
                    />
                    <div>
                      <p className="text-sm font-medium group-hover:text-paradox-purple transition">
                        Logitech's latest keyboard
                      </p>
                      <p className="text-xs text-gray-400 mt-1">Sep 20, 2022</p>
                    </div>
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <h3 className="font-bold text-lg mb-4">Categories</h3>
                  <ul className="space-y-3">
                    {categories.map((cat) => (
                      <li key={cat.name}>
                        <Link
                          href="#"
                          className="flex justify-between items-center text-gray-300 hover:text-white transition"
                        >
                          <span>{cat.name}</span>
                          <span className="text-gray-500 text-sm">
                            ({cat.count})
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Blog;
