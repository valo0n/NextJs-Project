import Layout from "@/components/Layout";
import Head from "next/head";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useForm, SubmitHandler } from "react-hook-form";
import { useUserProducts, UserProduct } from "@/context/UserProductsContext";

interface ProductFormData {
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
}

const Profile: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { products, addProduct, updateProduct, deleteProduct } =
    useUserProducts();

  const [activeTab, setActiveTab] = useState<"info" | "products">("info");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>();

  // Redirect te login nese nuk eshte kyqur
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    // Klient (user) nuk ka qasje ne profile - vetem seller dhe admin
    if (
      status === "authenticated" &&
      session?.user?.role !== "seller" &&
      session?.user?.role !== "admin"
    ) {
      toast.error("Vetëm shitësit kanë qasje në Profile");
      router.push("/");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center pt-32">
          <p className="text-gray-300">Duke u ngarkuar...</p>
        </div>
      </Layout>
    );
  }

  if (!session) return null;

  const onSubmit: SubmitHandler<ProductFormData> = (data) => {
    if (editingId) {
      updateProduct(editingId, {
        ...data,
        price: Number(data.price),
        stock: Number(data.stock),
      });
      toast.success("Produkti u përditësua!");
      setEditingId(null);
    } else {
      addProduct({
        ...data,
        price: Number(data.price),
        stock: Number(data.stock),
      });
      toast.success("Produkti u shtua me sukses!");
    }
    reset();
    setShowAddForm(false);
  };

  const handleEdit = (product: UserProduct) => {
    setEditingId(product.id);
    setValue("title", product.title);
    setValue("description", product.description);
    setValue("price", product.price);
    setValue("category", product.category);
    setValue("image", product.image);
    setValue("stock", product.stock);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`A je i sigurt që do të fshish "${title}"?`)) {
      deleteProduct(id);
      toast.success("Produkti u fshi");
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingId(null);
    reset();
  };

  return (
    <>
      <Head>
        <title>Profili Im - Paradox Tech</title>
      </Head>
      <Layout>
        <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-12 relative overflow-hidden">
          {/* Glow effects */}
          <div className="absolute top-[5%] left-[-10%] w-[600px] h-[600px] rounded-full bg-paradox-purple/20 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[5%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#cf35d2]/15 blur-[120px] pointer-events-none" />

          <div className="max-w-6xl mx-auto relative z-10">
            {/* Welcome header */}
            <div className="mb-10">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">
                Mirë se erdhe,{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(65deg, rgb(63, 50, 220) 0%, rgb(207, 53, 210) 100%)",
                  }}
                >
                  {session.user?.name}
                </span>
              </h1>
              <p className="text-gray-400">
                Menaxho profilin dhe produktet e tua për shitje
              </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 sm:gap-6 mb-8 border-b border-white/10">
              <button
                onClick={() => setActiveTab("info")}
                className={`px-4 sm:px-6 py-3 font-semibold transition relative ${
                  activeTab === "info"
                    ? "text-white"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                Të dhënat e mia
                {activeTab === "info" && (
                  <div
                    className="absolute bottom-[-1px] left-0 right-0 h-[3px]"
                    style={{
                      background:
                        "linear-gradient(65deg, rgb(63, 50, 220) 0%, rgb(207, 53, 210) 100%)",
                    }}
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab("products")}
                className={`px-4 sm:px-6 py-3 font-semibold transition relative ${
                  activeTab === "products"
                    ? "text-white"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                Produktet e mia ({products.length})
                {activeTab === "products" && (
                  <div
                    className="absolute bottom-[-1px] left-0 right-0 h-[3px]"
                    style={{
                      background:
                        "linear-gradient(65deg, rgb(63, 50, 220) 0%, rgb(207, 53, 210) 100%)",
                    }}
                  />
                )}
              </button>
            </div>

            {/* TAB: INFO */}
            {activeTab === "info" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* User card */}
                <div className="lg:col-span-1">
                  <div className="border-[3px] border-[#cf35d2] rounded-tl-[40px] rounded-tr-[40px] rounded-bl-[40px] p-8 bg-paradox-bg/40 backdrop-blur-sm text-center">
                    <div
                      className="w-24 h-24 mx-auto rounded-full mb-4 flex items-center justify-center text-3xl font-bold text-white"
                      style={{
                        background:
                          "linear-gradient(65deg, rgb(63, 50, 220) 0%, rgb(207, 53, 210) 100%)",
                      }}
                    >
                      {session.user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <h3 className="text-xl font-bold">{session.user?.name}</h3>
                    <p className="text-gray-400 text-sm mt-1">
                      {session.user?.email}
                    </p>
                    <div className="mt-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          session.user?.role === "admin"
                            ? "bg-red-500/20 text-red-400 border border-red-500/40"
                            : session.user?.role === "seller"
                              ? "bg-green-500/20 text-green-400 border border-green-500/40"
                              : "bg-blue-500/20 text-blue-400 border border-blue-500/40"
                        }`}
                      >
                        {session.user?.role === "admin"
                          ? "👑 Admin"
                          : session.user?.role === "seller"
                            ? "🏪 Shitës"
                            : "🛍️ Klient"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="border border-white/10 rounded-2xl p-6 bg-paradox-bg/40 backdrop-blur-sm">
                    <p className="text-gray-400 text-sm mb-2">
                      Produkte aktive
                    </p>
                    <p className="text-3xl font-bold text-paradox-glow">
                      {products.length}
                    </p>
                  </div>
                  <div className="border border-white/10 rounded-2xl p-6 bg-paradox-bg/40 backdrop-blur-sm">
                    <p className="text-gray-400 text-sm mb-2">Vlera totale</p>
                    <p className="text-3xl font-bold text-paradox-glow">
                      $
                      {products
                        .reduce((sum, p) => sum + p.price * p.stock, 0)
                        .toFixed(2)}
                    </p>
                  </div>
                  <div className="border border-white/10 rounded-2xl p-6 bg-paradox-bg/40 backdrop-blur-sm">
                    <p className="text-gray-400 text-sm mb-2">Stock total</p>
                    <p className="text-3xl font-bold text-paradox-glow">
                      {products.reduce((sum, p) => sum + p.stock, 0)}
                    </p>
                  </div>

                  {/* Quick actions */}
                  <div className="sm:col-span-3 border border-white/10 rounded-2xl p-6 bg-paradox-bg/40 backdrop-blur-sm">
                    <h3 className="font-bold text-lg mb-4">
                      Veprime të shpejta
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => {
                          setActiveTab("products");
                          setShowAddForm(true);
                        }}
                        className="px-6 py-3 rounded-lg text-white font-semibold transition-all hover:shadow-[0_0_20px_rgba(207,53,210,0.4)]"
                        style={{
                          background:
                            "linear-gradient(65deg, rgb(63, 50, 220) 0%, rgb(207, 53, 210) 100%)",
                        }}
                      >
                        + Shto produkt të ri
                      </button>
                      <Link
                        href="/shop"
                        className="px-6 py-3 rounded-lg text-white font-semibold border border-white/20 hover:bg-white/5 transition"
                      >
                        Shko te Shop
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: PRODUCTS */}
            {activeTab === "products" && (
              <div>
                {/* Add button */}
                {!showAddForm && (
                  <div className="mb-6">
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="px-6 py-3 rounded-lg text-white font-semibold transition-all hover:shadow-[0_0_20px_rgba(207,53,210,0.4)] inline-flex items-center gap-2"
                      style={{
                        background:
                          "linear-gradient(65deg, rgb(63, 50, 220) 0%, rgb(207, 53, 210) 100%)",
                      }}
                    >
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
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Shto produkt të ri
                    </button>
                  </div>
                )}

                {/* Add/Edit Form */}
                {showAddForm && (
                  <div className="border-[3px] border-[#cf35d2] rounded-tl-[40px] rounded-tr-[40px] rounded-bl-[40px] p-6 sm:p-8 bg-paradox-bg/40 backdrop-blur-sm mb-8">
                    <h2 className="text-2xl font-bold mb-6">
                      {editingId ? "Përditëso produktin" : "Shto produkt të ri"}
                    </h2>

                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Titulli *
                          </label>
                          <input
                            type="text"
                            placeholder="P.sh. Logitech MX Master"
                            {...register("title", {
                              required: "Titulli është i detyrueshëm",
                            })}
                            className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#cf35d2] transition placeholder:text-gray-500"
                          />
                          {errors.title && (
                            <p className="text-red-400 text-xs mt-1">
                              {errors.title.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Kategoria *
                          </label>
                          <select
                            {...register("category", {
                              required: "Kategoria është e detyrueshme",
                            })}
                            className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#cf35d2] transition"
                          >
                            <option value="" className="bg-paradox-bg">
                              Zgjedh kategorinë
                            </option>
                            <option value="Mouse" className="bg-paradox-bg">
                              Mouse
                            </option>
                            <option value="Keyboard" className="bg-paradox-bg">
                              Keyboard
                            </option>
                            <option value="Headset" className="bg-paradox-bg">
                              Headset
                            </option>
                            <option value="Monitor" className="bg-paradox-bg">
                              Monitor
                            </option>
                            <option value="Laptop" className="bg-paradox-bg">
                              Laptop
                            </option>
                            <option
                              value="Controller"
                              className="bg-paradox-bg"
                            >
                              Controller
                            </option>
                            <option value="Other" className="bg-paradox-bg">
                              Other
                            </option>
                          </select>
                          {errors.category && (
                            <p className="text-red-400 text-xs mt-1">
                              {errors.category.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Përshkrimi *
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Përshkruaj produktin tënd..."
                          {...register("description", {
                            required: "Përshkrimi është i detyrueshëm",
                            minLength: {
                              value: 10,
                              message: "Së paku 10 karaktere",
                            },
                          })}
                          className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#cf35d2] transition placeholder:text-gray-500 resize-none"
                        />
                        {errors.description && (
                          <p className="text-red-400 text-xs mt-1">
                            {errors.description.message}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Çmimi ($) *
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            {...register("price", {
                              required: "Çmimi është i detyrueshëm",
                              min: { value: 0, message: "Çmimi duhet >= 0" },
                            })}
                            className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#cf35d2] transition placeholder:text-gray-500"
                          />
                          {errors.price && (
                            <p className="text-red-400 text-xs mt-1">
                              {errors.price.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Stock *
                          </label>
                          <input
                            type="number"
                            min="0"
                            placeholder="0"
                            {...register("stock", {
                              required: "Stock është i detyrueshëm",
                              min: { value: 0, message: "Stock duhet >= 0" },
                            })}
                            className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#cf35d2] transition placeholder:text-gray-500"
                          />
                          {errors.stock && (
                            <p className="text-red-400 text-xs mt-1">
                              {errors.stock.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          URL e imazhit *
                        </label>
                        <input
                          type="url"
                          placeholder="https://images.unsplash.com/..."
                          {...register("image", {
                            required: "URL e imazhit është e detyrueshme",
                          })}
                          className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#cf35d2] transition placeholder:text-gray-500"
                        />
                        {errors.image && (
                          <p className="text-red-400 text-xs mt-1">
                            {errors.image.message}
                          </p>
                        )}
                        <p className="text-gray-500 text-xs mt-1">
                          Tip: Përdor URL nga Unsplash ose CDN tjetër publik
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-3 pt-4">
                        <button
                          type="submit"
                          className="px-6 py-3 rounded-lg text-white font-semibold transition-all hover:shadow-[0_0_20px_rgba(207,53,210,0.4)]"
                          style={{
                            background:
                              "linear-gradient(65deg, rgb(63, 50, 220) 0%, rgb(207, 53, 210) 100%)",
                          }}
                        >
                          {editingId ? "Përditëso" : "Shto produktin"}
                        </button>
                        <button
                          type="button"
                          onClick={handleCancel}
                          className="px-6 py-3 rounded-lg text-white font-semibold border border-white/20 hover:bg-white/5 transition"
                        >
                          Anulo
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Products list */}
                {products.length === 0 ? (
                  <div className="text-center py-16 border border-white/10 rounded-2xl bg-paradox-bg/30">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-paradox-purple/20 flex items-center justify-center">
                      <svg
                        className="w-10 h-10 text-paradox-purple"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-2">
                      Nuk ke produkte ende
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Fillo duke shtuar produktin tënd të parë për shitje
                    </p>
                    {!showAddForm && (
                      <button
                        onClick={() => setShowAddForm(true)}
                        className="px-6 py-3 rounded-lg text-white font-semibold transition-all hover:shadow-[0_0_20px_rgba(207,53,210,0.4)]"
                        style={{
                          background:
                            "linear-gradient(65deg, rgb(63, 50, 220) 0%, rgb(207, 53, 210) 100%)",
                        }}
                      >
                        + Shto produktin e parë
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="border border-white/10 hover:border-[#cf35d2]/50 rounded-2xl overflow-hidden bg-paradox-bg/40 backdrop-blur-sm transition-all hover:shadow-[0_0_20px_rgba(207,53,210,0.3)]"
                      >
                        <div className="aspect-square bg-white/5 overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://placehold.co/400x400/1a1a3a/cf35d2?text=Image+Error";
                            }}
                          />
                        </div>
                        <div className="p-5">
                          <div className="flex items-start justify-between mb-2">
                            <span className="text-xs px-2 py-1 rounded-full bg-paradox-purple/20 text-paradox-purple">
                              {product.category}
                            </span>
                            <span className="text-xs text-gray-500">
                              Stock: {product.stock}
                            </span>
                          </div>
                          <h3 className="font-bold text-lg mb-2 line-clamp-2 min-h-[3.5rem]">
                            {product.title}
                          </h3>
                          <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-2xl font-bold text-paradox-glow">
                              ${product.price.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="flex-1 px-3 py-2 text-sm rounded-lg border border-paradox-purple text-paradox-purple hover:bg-paradox-purple/10 transition"
                            >
                              Edito
                            </button>
                            <button
                              onClick={() =>
                                handleDelete(product.id, product.title)
                              }
                              className="flex-1 px-3 py-2 text-sm rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/10 transition"
                            >
                              Fshij
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Profile;
