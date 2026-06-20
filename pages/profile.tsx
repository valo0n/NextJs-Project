import Layout from "@/components/Layout";
import Head from "next/head";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useForm, SubmitHandler } from "react-hook-form";

interface ProductFormData {
  title: string;
  description: string;
  price: number;
  category: string;
  stock: number;
}

interface DBProduct {
  _id: string;
  title: string;
  description: string;
  price: number;
  image?: string;
  category?: string;
  stock: number;
  createdBy?: string;
  createdAt: string;
}

interface MyOrder {
  _id: string;
  items: { title: string; qty: number; price: number }[];
  total: number;
  status: string;
  createdAt: string;
}

const ORDER_STATUS_MAP: Record<string, { label: string; cls: string }> = {
  pending: { label: "Në pritje", cls: "bg-gray-500/20 text-gray-300" },
  paid: { label: "Paguar", cls: "bg-blue-500/20 text-blue-300" },
  shipped: { label: "Dërguar", cls: "bg-purple-500/20 text-purple-300" },
  delivered: { label: "Dorëzuar", cls: "bg-green-500/20 text-green-300" },
  cancelled: { label: "Anuluar", cls: "bg-red-500/20 text-red-300" },
};

const Profile: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<
    "info" | "products" | "orders" | "security"
  >("info");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Produktet nga MongoDB
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Porositë e mia
  const [myOrders, setMyOrders] = useState<MyOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Ndryshimi i fjalëkalimit
  const [curPw, setCurPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [pwSaving, setPwSaving] = useState(false);

  useEffect(() => {
    if (activeTab !== "orders") return;

    let active = true;
    const load = (initial = false) => {
      if (initial) setLoadingOrders(true);
      fetch("/api/orders/mine")
        .then((r) => r.json())
        .then((d) => {
          if (active) setMyOrders(Array.isArray(d) ? d : []);
        })
        .catch(() => {})
        .finally(() => {
          if (active && initial) setLoadingOrders(false);
        });
    };

    load(true); // ngarkim i parë (me loading)
    const interval = setInterval(() => load(false), 5000); // rifresko çdo 5s

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [activeTab]);

  useEffect(() => {
    const t = router.query.tab;
    const role = session?.user?.role;
    const canProducts = role === "seller" || role === "admin";
    if (t === "orders" || t === "security" || t === "info") {
      setActiveTab(t);
    } else if (t === "products" && canProducts) {
      setActiveTab("products");
    }
  }, [router.query.tab, session]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwSaving(true);
    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: curPw, newPassword: newPw }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success(data.message || "Fjalëkalimi u ndryshua");
      setCurPw("");
      setNewPw("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gabim");
    } finally {
      setPwSaving(false);
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>();

  // Auth guard - çdo përdorues i kyçur ka qasje në profil
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Merr produktet nga MongoDB
  const fetchProducts = useCallback(async () => {
    if (!session?.user?.id) return;
    setLoadingProducts(true);
    try {
      const res = await fetch(`/api/products?createdBy=${session.user.id}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch {
      toast.error("Gabim në ngarkimin e produkteve");
    } finally {
      setLoadingProducts(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      fetchProducts();
    }
  }, [status, session, fetchProducts]);

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

  const isSeller =
    session.user?.role === "seller" || session.user?.role === "admin";

  // Upload image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Vetëm imazhe lejohen (JPG, PNG, WebP)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Foto duhet të jetë deri 5MB");
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagePreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Submit produkt - ruan ne MongoDB
  const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
    let imageUrl = imagePreview || "";

    // Upload foto nese ka file te ri
    if (imageFile) {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("image", imageFile);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) {
          toast.error(uploadData.message || "Gabim në ngarkim");
          setUploading(false);
          return;
        }
        imageUrl = uploadData.url;
      } catch {
        toast.error("Gabim në ngarkim të fotos");
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    if (!imageUrl && !editingId) {
      toast.error("Zgjedh një foto për produktin");
      return;
    }

    try {
      if (editingId) {
        // PUT - update ne MongoDB
        const res = await fetch(`/api/products/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data,
            price: Number(data.price),
            stock: Number(data.stock),
            ...(imageUrl && !imageUrl.startsWith("data:")
              ? { image: imageUrl }
              : {}),
          }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message);
        }
        toast.success("Produkti u përditësua!");
      } else {
        // POST - krijon ne MongoDB
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data,
            price: Number(data.price),
            stock: Number(data.stock),
            image: imageUrl,
          }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message);
        }
        toast.success("Produkti u shtua me sukses!");
      }

      // Rifresko listen e produkteve nga MongoDB
      await fetchProducts();
      reset();
      setImageFile(null);
      setImagePreview(null);
      setShowAddForm(false);
      setEditingId(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Gabim";
      toast.error(message);
    }
  };

  const handleEdit = (product: DBProduct) => {
    setEditingId(product._id);
    setValue("title", product.title);
    setValue("description", product.description);
    setValue("price", product.price);
    setValue("category", product.category || "");
    setValue("stock", product.stock);
    setImagePreview(product.image || null);
    setImageFile(null);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (product: DBProduct) => {
    if (!confirm(`A je i sigurt që do të fshish "${product.title}"?`)) return;

    try {
      const res = await fetch(`/api/products/${product._id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }
      toast.success("Produkti u fshi");
      await fetchProducts();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Gabim";
      toast.error(message);
    }
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingId(null);
    setImageFile(null);
    setImagePreview(null);
    reset();
  };

  // Statistika
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);

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
              {isSeller && (
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
              )}
              <button
                onClick={() => setActiveTab("orders")}
                className={`px-4 sm:px-6 py-3 font-semibold transition relative ${
                  activeTab === "orders"
                    ? "text-white"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                Porositë e mia
                {activeTab === "orders" && (
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
                onClick={() => setActiveTab("security")}
                className={`px-4 sm:px-6 py-3 font-semibold transition relative ${
                  activeTab === "security"
                    ? "text-white"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                Siguria
                {activeTab === "security" && (
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

            {/* TAB: ORDERS */}
            {activeTab === "orders" && (
              <div>
                {loadingOrders ? (
                  <p className="text-gray-400">Duke u ngarkuar...</p>
                ) : myOrders.length === 0 ? (
                  <p className="text-gray-400">S&apos;ke ende porosi.</p>
                ) : (
                  <div className="space-y-4">
                    {myOrders.map((o) => {
                      const st =
                        ORDER_STATUS_MAP[o.status] || ORDER_STATUS_MAP.pending;
                      return (
                        <div
                          key={o._id}
                          className="border border-white/10 rounded-lg p-5 bg-paradox-bg/40"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="text-xs text-gray-500 font-mono">
                                #{o._id.slice(-6)}
                              </p>
                              <p className="text-xs text-gray-400">
                                {new Date(o.createdAt).toLocaleDateString("sq")}
                              </p>
                            </div>
                            <span
                              className={`text-xs px-3 py-1 rounded-full ${st.cls}`}
                            >
                              {st.label}
                            </span>
                          </div>
                          <div className="text-sm text-gray-300 space-y-1">
                            {o.items.map((it, i) => (
                              <div key={i}>
                                {it.title}{" "}
                                <span className="text-gray-500">
                                  × {it.qty}
                                </span>
                              </div>
                            ))}
                          </div>
                          <p className="text-right font-semibold mt-3">
                            Totali: ${o.total.toFixed(2)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB: SECURITY */}
            {activeTab === "security" && (
              <div className="max-w-md">
                <div className="border border-white/10 rounded-lg p-6 bg-paradox-bg/40">
                  <h2 className="text-xl font-bold mb-4">
                    Ndrysho fjalëkalimin
                  </h2>
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <input
                      type="password"
                      placeholder="Fjalëkalimi aktual"
                      value={curPw}
                      onChange={(e) => setCurPw(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-[#cf35d2] placeholder:text-gray-500"
                    />
                    <input
                      type="password"
                      placeholder="Fjalëkalimi i ri (min 6 karaktere)"
                      value={newPw}
                      onChange={(e) => setNewPw(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-[#cf35d2] placeholder:text-gray-500"
                    />
                    <button
                      type="submit"
                      disabled={pwSaving}
                      className="px-6 py-2 rounded-lg text-white font-semibold transition disabled:opacity-60"
                      style={{
                        background:
                          "linear-gradient(65deg, rgb(63, 50, 220) 0%, rgb(207, 53, 210) 100%)",
                      }}
                    >
                      {pwSaving ? "Duke ruajtur..." : "Ruaj fjalëkalimin"}
                    </button>
                  </form>
                </div>
              </div>
            )}

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
                      ${totalValue.toFixed(2)}
                    </p>
                  </div>
                  <div className="border border-white/10 rounded-2xl p-6 bg-paradox-bg/40 backdrop-blur-sm">
                    <p className="text-gray-400 text-sm mb-2">Stock total</p>
                    <p className="text-3xl font-bold text-paradox-glow">
                      {totalStock}
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
                      + Shto produkt të ri
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
                              min: {
                                value: 0,
                                message: "Çmimi duhet >= 0",
                              },
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
                              min: {
                                value: 0,
                                message: "Stock duhet >= 0",
                              },
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

                      {/* Image upload */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Foto e produktit *
                        </label>

                        {imagePreview && (
                          <div className="mb-3 relative inline-block">
                            <img
                              loading="lazy"
                              decoding="async"
                              src={imagePreview}
                              alt="Preview"
                              className="w-32 h-32 object-cover rounded-lg border-2 border-[#cf35d2]/50"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setImageFile(null);
                                setImagePreview(null);
                              }}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600 transition"
                            >
                              ✕
                            </button>
                          </div>
                        )}

                        <label className="block cursor-pointer">
                          <div className="flex items-center gap-3 bg-white/5 border-2 border-dashed border-white/20 hover:border-[#cf35d2]/50 rounded-lg p-4 transition group">
                            <div className="w-12 h-12 rounded-lg bg-paradox-purple/20 flex items-center justify-center group-hover:bg-paradox-purple/30 transition">
                              <svg
                                className="w-6 h-6 text-paradox-purple"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">
                                {imagePreview
                                  ? "Ndrysho foton"
                                  : "Zgjedh foto nga kompjuteri"}
                              </p>
                              <p className="text-xs text-gray-500">
                                JPG, PNG, WebP — Max 5MB
                              </p>
                            </div>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <div className="flex flex-wrap gap-3 pt-4">
                        <button
                          type="submit"
                          disabled={uploading}
                          className="px-6 py-3 rounded-lg text-white font-semibold transition-all hover:shadow-[0_0_20px_rgba(207,53,210,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{
                            background:
                              "linear-gradient(65deg, rgb(63, 50, 220) 0%, rgb(207, 53, 210) 100%)",
                          }}
                        >
                          {uploading
                            ? "Duke ngarkuar foton..."
                            : editingId
                              ? "Përditëso"
                              : "Shto produktin"}
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
                {loadingProducts ? (
                  <div className="text-center py-16">
                    <p className="text-gray-400">Duke ngarkuar produktet...</p>
                  </div>
                ) : products.length === 0 ? (
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
                        key={product._id}
                        className="border border-white/10 hover:border-[#cf35d2]/50 rounded-2xl overflow-hidden bg-paradox-bg/40 backdrop-blur-sm transition-all hover:shadow-[0_0_20px_rgba(207,53,210,0.3)]"
                      >
                        <div className="aspect-square bg-white/5 overflow-hidden">
                          <img
                            loading="lazy"
                            decoding="async"
                            src={product.image || "/images/placeholder.svg"}
                            alt={product.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://placehold.co/400x400/1a1a3a/cf35d2?text=No+Image";
                            }}
                          />
                        </div>
                        <div className="p-5">
                          <div className="flex items-start justify-between mb-2">
                            <span className="text-xs px-2 py-1 rounded-full bg-paradox-purple/20 text-paradox-purple">
                              {product.category || "Other"}
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
                              onClick={() => handleDelete(product)}
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
