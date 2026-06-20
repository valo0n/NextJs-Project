import Layout from "@/components/Layout";
import Head from "next/head";
import Link from "next/link";
import { GetStaticProps, NextPage } from "next";
import { dbConnect } from "@/lib/dbConnect";
import BlogPost from "@/models/BlogPost";

interface BlogPostView {
  _id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  comments: number;
  date: string;
}

interface CategoryView {
  name: string;
  count: number;
}

interface BlogProps {
  posts: BlogPostView[];
  categories: CategoryView[];
  recent: BlogPostView | null;
}

const Blog: NextPage<BlogProps> = ({ posts, categories, recent }) => {
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
                {posts.length === 0 ? (
                  <div className="text-center py-20 border border-white/10 rounded-lg">
                    <p className="text-gray-400 mb-4">
                      S'ka ende poste blogu në databazë.
                    </p>
                    {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                    <a
                      href="/api/blog/seed"
                      className="text-paradox-purple underline"
                    >
                      Kliko këtu për t'i mbjellë postet fillestare
                      (/api/blog/seed)
                    </a>
                  </div>
                ) : (
                  posts.map((post) => (
                    <article key={post._id} className="group">
                      <div className="mb-6 overflow-hidden rounded-lg border border-white/10">
                        <img
                          loading="lazy"
                          decoding="async"
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
                        {post.excerpt}
                      </p>
                      <button className="text-paradox-purple hover:text-paradox-pink transition text-sm underline-offset-4 hover:underline">
                        Read more →
                      </button>
                    </article>
                  ))
                )}

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

                {/* Recent Post Widget - nga DB */}
                {recent && (
                  <div>
                    <h3 className="font-bold text-lg mb-4">Recent post</h3>
                    <div className="flex gap-3 group cursor-pointer">
                      <img
                        loading="lazy"
                        decoding="async"
                        src={recent.image}
                        alt={recent.title}
                        className="w-20 h-20 object-cover rounded opacity-80 group-hover:opacity-100 transition"
                      />
                      <div>
                        <p className="text-sm font-medium group-hover:text-paradox-purple transition">
                          {recent.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {recent.date}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Categories - nga DB */}
                {categories.length > 0 && (
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
                )}
              </aside>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

function fmtDate(d: Date): string {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export const getStaticProps: GetStaticProps<BlogProps> = async () => {
  let posts: BlogPostView[] = [];
  let categories: CategoryView[] = [];
  let recent: BlogPostView | null = null;

  try {
    if (process.env.MONGODB_URI) {
      await dbConnect();
      const docs = await BlogPost.find({}).sort({ createdAt: -1 }).lean();

      posts = docs.map((p) => ({
        _id: p._id.toString(),
        title: p.title,
        excerpt: p.excerpt,
        image: p.image || "",
        category: p.category,
        author: p.author,
        comments: p.comments ?? 0,
        date: fmtDate(p.createdAt),
      }));

      // Kategorite e grupuara me numra
      const map = new Map<string, number>();
      for (const p of posts) {
        map.set(p.category, (map.get(p.category) || 0) + 1);
      }
      categories = Array.from(map.entries()).map(([name, count]) => ({
        name,
        count,
      }));

      recent = posts[0] || null;
    }
  } catch (error) {
    console.error("Gabim ne getStaticProps (blog):", error);
  }

  return { props: { posts, categories, recent }, revalidate: 60 };
};

export default Blog;
