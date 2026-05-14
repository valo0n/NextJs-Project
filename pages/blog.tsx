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
    image: "https://resource.logitechg.com/w_692,c_lpad,ar_16:9,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/pro-keyboard/pro-clicky-keyboard-gallery-1.png?v=1",
    },
    {
      id: 2,
      title: "New Logitech keyboard out now!",
      date: "Sep 20, 2022",
      category: "Keyboard",
      author: "Admin-art",
      comments: 0,
image: "https://resource.logitechg.com/w_692,c_lpad,ar_16:9,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/pro-x-tkl/gallery/pro-x-tkl-black-gallery-1.png?v=1",    },
    {
      id: 3,
      title: "New Logitech keyboard released!",
      date: "Sep 20, 2022",
      category: "Keyboard",
      author: "Admin-art",
      comments: 0,
image: "https://resource.logitechg.com/w_692,c_lpad,ar_16:9,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/pro-x-tkl/gallery/pro-x-tkl-pink-gallery-1.png?v=1",    },
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
              <Link href="/" className="hover:text-white">Shop</Link> / 
              <span className="ml-1">Blog</span> / 
              <span className="text-paradox-purple ml-1">New modern tech devices</span>
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
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                      <span>{post.date}</span>
                      <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                      <span>Modern, House, {post.category}</span>
                      <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                      <span>By {post.author}</span>
                      <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                      <span>💬 {post.comments}</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-4 group-hover:text-paradox-purple transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-gray-400 leading-relaxed mb-6 max-w-3xl">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla.
                    </p>
                    <Link href={`/blog/${post.id}`} className="text-sm font-bold uppercase tracking-widest border-b-2 border-paradox-purple pb-1 hover:text-paradox-purple transition-all">
                      Read more
                    </Link>
                  </article>
                ))}

                {/* Pagination Placeholder */}
                <div className="flex items-center gap-4 pt-10">
                  <button className="w-10 h-10 border border-white/20 flex items-center justify-center hover:bg-paradox-purple">1</button>
                  <button className="w-10 h-10 border border-white/20 flex items-center justify-center hover:bg-paradox-purple transition-all">2</button>
                  <button className="px-4 h-10 border border-white/20 flex items-center justify-center hover:bg-paradox-purple transition-all">Next</button>
                </div>
              </div>

              {/* SIDEBAR */}
              <aside className="w-full lg:w-[350px] space-y-12">
                {/* Search Sidebar Widget */}
                <div>
                  <h3 className="text-xl font-bold mb-6 border-l-4 border-paradox-purple pl-4">Sidebar widget</h3>
                  <div className="relative">
                    <img src={FIGMA.productKeyboard1} className="w-full h-40 object-cover rounded opacity-50" />
                    <div className="absolute inset-0 p-4 flex flex-col justify-end bg-gradient-to-t from-black/80">
                      <p className="text-xs">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </div>
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <h3 className="text-xl font-bold mb-6 border-l-4 border-paradox-purple pl-4">Category</h3>
                  <ul className="space-y-4">
                    {categories.map((cat) => (
                      <li key={cat.name} className="flex justify-between items-center text-gray-400 hover:text-white cursor-pointer transition-colors">
                        <span>{cat.name}</span>
                        <span>({cat.count})</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recent Posts */}
                <div>
                  <h3 className="text-xl font-bold mb-6 border-l-4 border-paradox-purple pl-4">Recent post</h3>
                  <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                      <p key={i} className="text-gray-400 hover:text-paradox-purple cursor-pointer text-sm leading-relaxed">
                        Lorem ipsum dolor sit amet, consectetur
                      </p>
                    ))}
                  </div>
                </div>
              </aside>
            </div>

            {/* COMMENT SECTION */}
            <section className="mt-24 max-w-4xl">
              <h3 className="text-2xl font-bold mb-8">Post a comment</h3>
              <form className="grid grid-cols-1 gap-6">
                <textarea 
                  placeholder="Your comment" 
                  rows={6} 
                  className="bg-transparent border border-white/20 p-4 focus:border-paradox-purple outline-none transition-colors"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <input type="text" placeholder="Your name" className="bg-transparent border border-white/20 p-4 focus:border-paradox-purple outline-none" />
                  <input type="email" placeholder="Your email" className="bg-transparent border border-white/20 p-4 focus:border-paradox-purple outline-none" />
                  <input type="text" placeholder="Website" className="bg-transparent border border-white/20 p-4 focus:border-paradox-purple outline-none" />
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <input type="checkbox" id="save-info" className="accent-paradox-purple" />
                  <label htmlFor="save-info">Save my name, email and website in this browser for the next time I comment.</label>
                </div>
                <button 
                  type="submit"
                  className="bg-[#2a2a2a] hover:bg-paradox-purple text-white px-10 py-4 w-fit transition-colors uppercase font-bold tracking-widest"
                >
                  Submit
                </button>
              </form>
            </section>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Blog;