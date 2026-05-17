import Head from "next/head";
import { NextPage } from "next";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  useDashboard,
  DashUser,
  DashProduct,
  DashOrder,
} from "@/context/DashboardContext";
import { FIGMA } from "@/lib/figmaAssets";

type Tab = "overview" | "users" | "products" | "orders" | "settings";

interface ProductFormData {
  title: string;
  category: string;
  price: number;
  stock: number;
  status: "active" | "draft" | "out_of_stock";
}

const Dashboard: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Auth guard - vetem admin
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated" && session?.user?.role !== "admin") {
      toast.error("Vetëm adminët mund të kenë qasje në Dashboard");
      router.push("/");
    }
  }, [status, session, router]);

  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen bg-paradox-bg flex items-center justify-center text-white">
        <p>Duke u ngarkuar...</p>
      </div>
    );
  }

  if (session.user?.role !== "admin") return null;

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "overview", label: "Përmbledhje", icon: "📊" },
    { id: "users", label: "Përdoruesit", icon: "👥" },
    { id: "products", label: "Produktet", icon: "📦" },
    { id: "orders", label: "Porositë", icon: "🛒" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <>
      <Head>
        <title>Dashboard - Paradox Tech Admin</title>
      </Head>

      <div className="min-h-screen bg-paradox-bg text-white flex relative overflow-hidden">
        {/* Glow effects */}
        <div className="absolute top-[5%] left-[-10%] w-[600px] h-[600px] rounded-full bg-paradox-purple/15 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[5%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#cf35d2]/10 blur-[120px] pointer-events-none" />

        {/* SIDEBAR */}
        <aside
          className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-paradox-bg/95 backdrop-blur-md border-r border-white/10 z-50 transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b border-white/10">
              <Link href="/" className="flex items-center gap-3">
                <img
                  src={FIGMA.logo}
                  alt="Paradox"
                  className="w-10 h-10 object-contain"
                />
                <div>
                  <p className="font-bold text-sm">Paradox Tech</p>
                  <p className="text-xs text-paradox-glow">Admin Panel</p>
                </div>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 overflow-y-auto">
              <ul className="space-y-1">
                {tabs.map((tab) => (
                  <li key={tab.id}>
                    <button
                      onClick={() => {
                        setActiveTab(tab.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${
                        activeTab === tab.id
                          ? "text-white"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      }`}
                      style={
                        activeTab === tab.id
                          ? {
                              background:
                                "linear-gradient(65deg, rgba(63, 50, 220, 0.3) 0%, rgba(207, 53, 210, 0.3) 100%)",
                              border: "1px solid rgba(207, 53, 210, 0.4)",
                            }
                          : {}
                      }
                    >
                      <span className="text-xl">{tab.icon}</span>
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 space-y-2">
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition"
              >
                <span>🏠</span>
                <span>Kthehu te Faqja</span>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition"
              >
                <span>🚪</span>
                <span>Dil</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay per mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* MAIN CONTENT */}
        <main className="flex-1 min-w-0 relative z-10">
          {/* Top bar */}
          <header className="sticky top-0 z-30 bg-paradox-bg/95 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-white"
                aria-label="Menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-bold">
                  {tabs.find((t) => t.id === activeTab)?.label}
                </h1>
                <p className="text-xs text-gray-400">
                  Mirë se erdhe, {session.user?.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/40">
                👑 ADMIN
              </span>
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                style={{
                  background:
                    "linear-gradient(65deg, rgb(63, 50, 220) 0%, rgb(207, 53, 210) 100%)",
                }}
              >
                {session.user?.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="p-6">
            {activeTab === "overview" && <OverviewTab />}
            {activeTab === "users" && <UsersTab />}
            {activeTab === "products" && <ProductsTab />}
            {activeTab === "orders" && <OrdersTab />}
            {activeTab === "settings" && <SettingsTab />}
          </div>
        </main>
      </div>
    </>
  );
};

// ============= OVERVIEW TAB =============
function OverviewTab() {
  const { users, products, orders } = useDashboard();

  const totalRevenue = orders
    .filter((o) => o.status === "delivered")
    .reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const activeProducts = products.filter((p) => p.status === "active").length;
  const outOfStock = products.filter((p) => p.status === "out_of_stock").length;
  const activeUsers = users.filter((u) => u.status === "active").length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="💰"
          label="Të ardhura"
          value={`$${totalRevenue.toLocaleString()}`}
          change="+18%"
        />
        <StatCard
          icon="🛒"
          label="Porosi"
          value={orders.length.toString()}
          change="+24%"
        />
        <StatCard
          icon="📦"
          label="Produkte"
          value={products.length.toString()}
          change="+8%"
        />
        <StatCard
          icon="👥"
          label="Përdorues"
          value={users.length.toString()}
          change="+12%"
        />
      </div>

      {/* Quick insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-yellow-500/30 rounded-2xl p-4 bg-yellow-500/5">
          <p className="text-yellow-400 text-sm font-medium mb-1">
            ⏳ Porosi në pritje
          </p>
          <p className="text-2xl font-bold">{pendingOrders}</p>
        </div>
        <div className="border border-green-500/30 rounded-2xl p-4 bg-green-500/5">
          <p className="text-green-400 text-sm font-medium mb-1">
            ✅ Produkte aktive
          </p>
          <p className="text-2xl font-bold">{activeProducts}</p>
        </div>
        <div className="border border-red-500/30 rounded-2xl p-4 bg-red-500/5">
          <p className="text-red-400 text-sm font-medium mb-1">
            ⚠️ Out of stock
          </p>
          <p className="text-2xl font-bold">{outOfStock}</p>
        </div>
      </div>

      {/* Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border border-white/10 rounded-2xl p-6 bg-paradox-bg/40 backdrop-blur-sm">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <span>🆕</span> Përdorues të rinj
          </h3>
          <ul className="space-y-3">
            {users.slice(0, 5).map((user) => (
              <li key={user.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
                    style={{
                      background:
                        "linear-gradient(65deg, rgb(63, 50, 220) 0%, rgb(207, 53, 210) 100%)",
                    }}
                  >
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{user.joined}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border border-white/10 rounded-2xl p-6 bg-paradox-bg/40 backdrop-blur-sm">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <span>📈</span> Porosi të fundit
          </h3>
          <ul className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <li key={order.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{order.id}</p>
                  <p className="text-xs text-gray-500">{order.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-paradox-glow">
                    ${order.total}
                  </p>
                  <StatusBadge status={order.status} small />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ============= USERS TAB =============
function UsersTab() {
  const { users, updateUser, deleteUser } = useDashboard();
  const [search, setSearch] = useState("");

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  const toggleStatus = (user: DashUser) => {
    const newStatus = user.status === "active" ? "blocked" : "active";
    updateUser(user.id, { status: newStatus });
    toast.success(
      newStatus === "blocked"
        ? `${user.name} u bllokua`
        : `${user.name} u aktivizua`,
    );
  };

  const toggleRole = (user: DashUser) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    updateUser(user.id, { role: newRole });
    toast.success(`${user.name} → ${newRole}`);
  };

  const handleDelete = (user: DashUser) => {
    if (confirm(`Fshi user-in "${user.name}"?`)) {
      deleteUser(user.id);
      toast.success("User u fshi");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <h2 className="text-xl font-bold">Përdoruesit ({filtered.length})</h2>
        <input
          type="text"
          placeholder="Kërko emër ose email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-72 bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-[#cf35d2] transition placeholder:text-gray-500"
        />
      </div>

      <div className="border border-white/10 rounded-2xl overflow-hidden bg-paradox-bg/40 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 text-left text-sm text-gray-400">
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Roli</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">U lidh</th>
                <th className="px-6 py-4 font-medium text-right">Veprime</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-white/5 hover:bg-white/5 transition"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{
                          background:
                            "linear-gradient(65deg, rgb(63, 50, 220) 0%, rgb(207, 53, 210) 100%)",
                        }}
                      >
                        {user.name.charAt(0)}
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm">
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleRole(user)}
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold transition ${
                        user.role === "admin"
                          ? "bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30"
                          : "bg-blue-500/20 text-blue-400 border border-blue-500/40 hover:bg-blue-500/30"
                      }`}
                    >
                      {user.role === "admin" ? "👑 Admin" : "👤 User"}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => toggleStatus(user)}>
                      <StatusBadge status={user.status} />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm">
                    {user.joined}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(user)}
                      className="text-red-400 hover:text-red-300 text-sm font-medium"
                    >
                      Fshij
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============= PRODUCTS TAB =============
function ProductsTab() {
  const { products, addProduct, updateProduct, deleteProduct } = useDashboard();
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>();

  const filtered = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()),
  );

  const onSubmit: SubmitHandler<ProductFormData> = (data) => {
    if (editingId) {
      updateProduct(editingId, {
        ...data,
        price: Number(data.price),
        stock: Number(data.stock),
      });
      toast.success("Produkti u përditësua!");
    } else {
      addProduct({
        ...data,
        price: Number(data.price),
        stock: Number(data.stock),
      });
      toast.success("Produkti u shtua!");
    }
    reset();
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (p: DashProduct) => {
    setEditingId(p.id);
    setValue("title", p.title);
    setValue("category", p.category);
    setValue("price", p.price);
    setValue("stock", p.stock);
    setValue("status", p.status);
    setShowForm(true);
  };

  const handleDelete = (p: DashProduct) => {
    if (confirm(`Fshi "${p.title}"?`)) {
      deleteProduct(p.id);
      toast.success("Produkti u fshi");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <h2 className="text-xl font-bold">Produktet ({filtered.length})</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Kërko produkt..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 sm:w-60 bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-[#cf35d2] transition placeholder:text-gray-500"
          />
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              reset();
            }}
            className="px-4 py-2 rounded-lg text-white font-semibold whitespace-nowrap"
            style={{
              background:
                "linear-gradient(65deg, rgb(63, 50, 220) 0%, rgb(207, 53, 210) 100%)",
            }}
          >
            + Shto
          </button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="border border-[#cf35d2]/40 rounded-2xl p-6 bg-paradox-bg/40 backdrop-blur-sm">
          <h3 className="font-bold mb-4">
            {editingId ? "Përditëso produktin" : "Shto produkt të ri"}
          </h3>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Titulli
              </label>
              <input
                type="text"
                {...register("title", { required: "Detyrueshëm" })}
                className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-[#cf35d2]"
              />
              {errors.title && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Kategoria
              </label>
              <select
                {...register("category", { required: "Detyrueshëm" })}
                className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-[#cf35d2]"
              >
                <option value="" className="bg-paradox-bg">
                  Zgjedh...
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
                <option value="Laptop" className="bg-paradox-bg">
                  Laptop
                </option>
                <option value="Monitor" className="bg-paradox-bg">
                  Monitor
                </option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Çmimi ($)
              </label>
              <input
                type="number"
                step="0.01"
                {...register("price", { required: "Detyrueshëm", min: 0 })}
                className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-[#cf35d2]"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Stock</label>
              <input
                type="number"
                {...register("stock", { required: "Detyrueshëm", min: 0 })}
                className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-[#cf35d2]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-gray-300 mb-1">Status</label>
              <select
                {...register("status")}
                className="w-full bg-white/5 border border-white/10 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-[#cf35d2]"
              >
                <option value="active" className="bg-paradox-bg">
                  Aktiv
                </option>
                <option value="draft" className="bg-paradox-bg">
                  Draft
                </option>
                <option value="out_of_stock" className="bg-paradox-bg">
                  Pa stock
                </option>
              </select>
            </div>
            <div className="sm:col-span-2 flex gap-2">
              <button
                type="submit"
                className="px-6 py-2 rounded-lg text-white font-semibold"
                style={{
                  background:
                    "linear-gradient(65deg, rgb(63, 50, 220) 0%, rgb(207, 53, 210) 100%)",
                }}
              >
                {editingId ? "Përditëso" : "Shto"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  reset();
                }}
                className="px-6 py-2 rounded-lg border border-white/20 hover:bg-white/5"
              >
                Anulo
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="border border-white/10 rounded-2xl overflow-hidden bg-paradox-bg/40 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 text-left text-sm text-gray-400">
                <th className="px-6 py-4 font-medium">Titulli</th>
                <th className="px-6 py-4 font-medium">Kategoria</th>
                <th className="px-6 py-4 font-medium">Çmimi</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Veprime</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-white/5 hover:bg-white/5 transition"
                >
                  <td className="px-6 py-4 font-medium">{p.title}</td>
                  <td className="px-6 py-4 text-gray-400 text-sm">
                    {p.category}
                  </td>
                  <td className="px-6 py-4 text-paradox-glow font-bold">
                    ${p.price}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={
                        p.stock < 10 ? "text-red-400" : "text-gray-300"
                      }
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => handleEdit(p)}
                        className="text-paradox-purple hover:text-paradox-pink text-sm font-medium"
                      >
                        Edito
                      </button>
                      <button
                        onClick={() => handleDelete(p)}
                        className="text-red-400 hover:text-red-300 text-sm font-medium"
                      >
                        Fshij
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============= ORDERS TAB =============
function OrdersTab() {
  const { orders, updateOrder, deleteOrder } = useDashboard();
  const [search, setSearch] = useState("");

  const filtered = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()),
  );

  const handleStatusChange = (
    order: DashOrder,
    status: DashOrder["status"],
  ) => {
    updateOrder(order.id, { status });
    toast.success(`${order.id} → ${status}`);
  };

  const handleDelete = (order: DashOrder) => {
    if (confirm(`Fshi "${order.id}"?`)) {
      deleteOrder(order.id);
      toast.success("Porosia u fshi");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <h2 className="text-xl font-bold">Porositë ({filtered.length})</h2>
        <input
          type="text"
          placeholder="Kërko ID ose customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-72 bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-[#cf35d2] transition placeholder:text-gray-500"
        />
      </div>

      <div className="border border-white/10 rounded-2xl overflow-hidden bg-paradox-bg/40 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 text-left text-sm text-gray-400">
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium">Klienti</th>
                <th className="px-6 py-4 font-medium">Items</th>
                <th className="px-6 py-4 font-medium">Totali</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Data</th>
                <th className="px-6 py-4 font-medium text-right">Veprime</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-white/5 hover:bg-white/5 transition"
                >
                  <td className="px-6 py-4 font-medium">{order.id}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm">{order.customerName}</p>
                    <p className="text-xs text-gray-500">
                      {order.customerEmail}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {order.itemsCount}
                  </td>
                  <td className="px-6 py-4 text-paradox-glow font-bold">
                    ${order.total}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(
                          order,
                          e.target.value as DashOrder["status"],
                        )
                      }
                      className="bg-white/5 border border-white/10 text-white text-xs px-2 py-1 rounded focus:outline-none focus:border-[#cf35d2]"
                    >
                      <option value="pending" className="bg-paradox-bg">
                        Pending
                      </option>
                      <option value="shipped" className="bg-paradox-bg">
                        Shipped
                      </option>
                      <option value="delivered" className="bg-paradox-bg">
                        Delivered
                      </option>
                      <option value="cancelled" className="bg-paradox-bg">
                        Cancelled
                      </option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm">
                    {order.date}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(order)}
                      className="text-red-400 hover:text-red-300 text-sm font-medium"
                    >
                      Fshij
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============= SETTINGS TAB =============
function SettingsTab() {
  const [siteName, setSiteName] = useState("Paradox Tech");
  const [maintenance, setMaintenance] = useState(false);
  const [allowRegistration, setAllowRegistration] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-xl font-bold">Settings i Faqes</h2>

      <div className="border border-white/10 rounded-2xl p-6 bg-paradox-bg/40 backdrop-blur-sm space-y-6">
        <div>
          <label className="block text-sm text-gray-300 mb-2">
            Emri i Faqes
          </label>
          <input
            type="text"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#cf35d2] transition"
          />
        </div>

        <Toggle
          label="Maintenance Mode"
          description="Aktivizo për të bllokuar qasjen e përkohshme"
          checked={maintenance}
          onChange={setMaintenance}
        />
        <Toggle
          label="Lejo regjistrime të reja"
          description="User-ët mund të krijojnë llogari"
          checked={allowRegistration}
          onChange={setAllowRegistration}
        />
        <Toggle
          label="Njoftime Email"
          description="Dërgo email për porosi të reja"
          checked={emailNotifications}
          onChange={setEmailNotifications}
        />

        <button
          onClick={() => toast.success("Settings u ruajtën!")}
          className="px-6 py-3 rounded-lg text-white font-semibold"
          style={{
            background:
              "linear-gradient(65deg, rgb(63, 50, 220) 0%, rgb(207, 53, 210) 100%)",
          }}
        >
          Ruaj
        </button>
      </div>

      <div className="border border-red-500/30 rounded-2xl p-6 bg-red-500/5">
        <h3 className="font-bold text-red-400 mb-2">⚠️ Zona e rrezikut</h3>
        <p className="text-sm text-gray-400 mb-4">Veprime të pakthyeshme</p>
        <button
          onClick={() => {
            if (confirm("ALL data?")) toast.error("I bllokuar (mock)");
          }}
          className="px-4 py-2 rounded-lg border border-red-500/40 text-red-400 hover:bg-red-500/10 transition text-sm"
        >
          Reset i Plotë
        </button>
      </div>
    </div>
  );
}

// ============= HELPERS =============
function StatCard({
  icon,
  label,
  value,
  change,
}: {
  icon: string;
  label: string;
  value: string;
  change: string;
}) {
  return (
    <div className="border border-white/10 rounded-2xl p-6 bg-paradox-bg/40 backdrop-blur-sm hover:border-[#cf35d2]/50 transition">
      <div className="flex items-start justify-between mb-3">
        <span className="text-3xl">{icon}</span>
        <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">
          {change}
        </span>
      </div>
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function StatusBadge({ status, small }: { status: string; small?: boolean }) {
  const styles: Record<string, string> = {
    active: "bg-green-500/20 text-green-400 border-green-500/40",
    blocked: "bg-red-500/20 text-red-400 border-red-500/40",
    draft: "bg-gray-500/20 text-gray-400 border-gray-500/40",
    out_of_stock: "bg-red-500/20 text-red-400 border-red-500/40",
    delivered: "bg-green-500/20 text-green-400 border-green-500/40",
    shipped: "bg-blue-500/20 text-blue-400 border-blue-500/40",
    pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40",
    cancelled: "bg-red-500/20 text-red-400 border-red-500/40",
  };
  const labels: Record<string, string> = {
    active: "Aktiv",
    blocked: "Bllokuar",
    draft: "Draft",
    out_of_stock: "Pa stock",
    delivered: "Përfunduar",
    shipped: "Dërguar",
    pending: "Pritje",
    cancelled: "Anuluar",
  };
  return (
    <span
      className={`inline-block ${
        small ? "px-2 py-0.5 text-[10px]" : "px-2 py-1 text-xs"
      } rounded-full font-semibold border ${styles[status] || styles.draft}`}
    >
      {labels[status] || status}
    </span>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1">
        <p className="font-medium">{label}</p>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className="relative w-12 h-6 rounded-full transition shrink-0"
        style={
          checked
            ? {
                background:
                  "linear-gradient(65deg, rgb(63, 50, 220) 0%, rgb(207, 53, 210) 100%)",
              }
            : { background: "rgba(255,255,255,0.1)" }
        }
      >
        <div
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
            checked ? "translate-x-6" : ""
          }`}
        />
      </button>
    </div>
  );
}

export default Dashboard;
