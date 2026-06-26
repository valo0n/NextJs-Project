import Head from "next/head";
import { NextPage } from "next";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { FIGMA } from "@/lib/figmaAssets";

type Tab = "overview" | "users" | "products" | "orders" | "settings";

interface DBUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  status?: string;
  createdAt: string;
}

interface DBProduct {
  _id: string;
  title: string;
  description: string;
  price: number;
  image?: string;
  category?: string;
  stock: number;
  createdAt: string;
}

interface Stats {
  totalUsers: number;
  totalProducts: number;
  totalSellers: number;
  totalAdmins: number;
  totalStock: number;
  totalValue: number;
  recentUsers: DBUser[];
  recentProducts: DBProduct[];
}

interface OrderRow {
  _id: string;
  items: { title: string; price: number; qty: number; image?: string }[];
  total: number;
  status: string;
  email?: string;
  createdAt: string;
}

const Dashboard: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated" && session?.user?.role !== "admin") {
      toast.error("Vetëm adminët kanë qasje në Dashboard");
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
    { id: "orders", label: "Porositë", icon: "🧾" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <>
      <Head>
        <title>Dashboard - Paradox Tech Admin</title>
      </Head>
      <div className="min-h-screen bg-paradox-bg text-white flex relative overflow-hidden">
        <div className="absolute top-[5%] left-[-10%] w-[600px] h-[600px] rounded-full bg-paradox-purple/15 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[5%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#cf35d2]/10 blur-[120px] pointer-events-none" />

        {/* SIDEBAR */}
        <aside
          className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-paradox-bg/95 backdrop-blur-md border-r border-white/10 z-50 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        >
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-white/10">
              <Link href="/" className="flex items-center gap-3">
                <img
                  loading="eager"
                  decoding="async"
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
            <nav className="flex-1 p-4 overflow-y-auto">
              <ul className="space-y-1">
                {tabs.map((tab) => (
                  <li key={tab.id}>
                    <button
                      onClick={() => {
                        setActiveTab(tab.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${activeTab === tab.id ? "text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
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

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* MAIN */}
        <main className="flex-1 min-w-0 relative z-10">
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

// ============= OVERVIEW TAB — MongoDB =============
function OverviewTab() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Gabim");
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-gray-400">Duke u ngarkuar...</p>;
  if (!stats) return <p className="text-red-400">Gabim</p>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="👥"
          label="Përdorues"
          value={stats.totalUsers.toString()}
        />
        <StatCard
          icon="📦"
          label="Produkte"
          value={stats.totalProducts.toString()}
        />
        <StatCard
          icon="🏪"
          label="Shitës"
          value={stats.totalSellers.toString()}
        />
        <StatCard
          icon="💰"
          label="Vlera totale"
          value={`$${stats.totalValue.toLocaleString()}`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border border-white/10 rounded-2xl p-6 bg-paradox-bg/40">
          <h3 className="font-bold text-lg mb-4">🆕 Përdorues të rinj</h3>
          <ul className="space-y-3">
            {stats.recentUsers.map((user) => (
              <li key={user._id} className="flex items-center justify-between">
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
                <RoleBadge role={user.role} />
              </li>
            ))}
          </ul>
        </div>

        <div className="border border-white/10 rounded-2xl p-6 bg-paradox-bg/40">
          <h3 className="font-bold text-lg mb-4">📈 Produkte të fundit</h3>
          <ul className="space-y-3">
            {stats.recentProducts.map((p) => (
              <li key={p._id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{p.title}</p>
                  <p className="text-xs text-gray-500">
                    {p.category || "Other"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-paradox-glow">
                    ${p.price}
                  </p>
                  <p className="text-xs text-gray-500">Stock: {p.stock}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ============= USERS TAB — MongoDB =============
function UsersTab() {
  const [users, setUsers] = useState<DBUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = useCallback(() => {
    setLoading(true);
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Gabim");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  const handleRoleChange = async (user: DBUser, newRole: string) => {
    try {
      const res = await fetch(`/api/admin/users/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error();
      toast.success(`${user.name} → ${newRole}`);
      fetchUsers();
    } catch {
      toast.error("Gabim");
    }
  };

  const handleDelete = async (user: DBUser) => {
    if (!confirm(`Fshi "${user.name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/users/${user._id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }
      toast.success("User u fshi");
      fetchUsers();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gabim");
    }
  };

  if (loading) return <p className="text-gray-400">Duke u ngarkuar...</p>;

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

      <div className="border border-white/10 rounded-2xl overflow-hidden bg-paradox-bg/40">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 text-left text-sm text-gray-400">
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Roli</th>
                <th className="px-6 py-4 font-medium">Data</th>
                <th className="px-6 py-4 font-medium text-right">Veprime</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr
                  key={user._id}
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
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user, e.target.value)}
                      className="bg-white/5 border border-white/10 text-white text-xs px-2 py-1 rounded focus:outline-none focus:border-[#cf35d2]"
                    >
                      <option value="user" className="bg-paradox-bg">
                        🛍️ Klient
                      </option>
                      <option value="seller" className="bg-paradox-bg">
                        🏪 Shitës
                      </option>
                      <option value="admin" className="bg-paradox-bg">
                        👑 Admin
                      </option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm">
                    {new Date(user.createdAt).toLocaleDateString("sq")}
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

// ============= PRODUCTS TAB — MongoDB =============
function ProductsTab() {
  const [products, setProducts] = useState<DBProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchProducts = useCallback(() => {
    setLoading(true);
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Gabim");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filtered = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = async (product: DBProduct) => {
    if (!confirm(`Fshi "${product.title}"?`)) return;
    try {
      const res = await fetch(`/api/products/${product._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      toast.success("Produkti u fshi");
      fetchProducts();
    } catch {
      toast.error("Gabim");
    }
  };

  if (loading) return <p className="text-gray-400">Duke u ngarkuar...</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <h2 className="text-xl font-bold">Produktet ({filtered.length})</h2>
        <input
          type="text"
          placeholder="Kërko produkt..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-72 bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-[#cf35d2] transition placeholder:text-gray-500"
        />
      </div>

      <div className="border border-white/10 rounded-2xl overflow-hidden bg-paradox-bg/40">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 text-left text-sm text-gray-400">
                <th className="px-6 py-4 font-medium">Foto</th>
                <th className="px-6 py-4 font-medium">Titulli</th>
                <th className="px-6 py-4 font-medium">Kategoria</th>
                <th className="px-6 py-4 font-medium">Çmimi</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium text-right">Veprime</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p._id}
                  className="border-b border-white/5 hover:bg-white/5 transition"
                >
                  <td className="px-6 py-4">
                    <img
                      loading="lazy"
                      decoding="async"
                      src={
                        p.image ||
                        "https://placehold.co/60x60/1a1a3a/cf35d2?text=?"
                      }
                      alt={p.title}
                      className="w-12 h-12 rounded-lg object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://placehold.co/60x60/1a1a3a/cf35d2?text=?";
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 font-medium">{p.title}</td>
                  <td className="px-6 py-4 text-gray-400 text-sm">
                    {p.category || "Other"}
                  </td>
                  <td className="px-6 py-4 text-paradox-glow font-bold">
                    ${p.price}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={p.stock < 5 ? "text-red-400" : "text-gray-300"}
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(p)}
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

  return (
    <div className="space-y-6 max-w-3xl">
      <h2 className="text-xl font-bold">Settings</h2>
      <div className="border border-white/10 rounded-2xl p-6 bg-paradox-bg/40 space-y-6">
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
          description="Blloko qasjen e përkohshme"
          checked={maintenance}
          onChange={setMaintenance}
        />
        <Toggle
          label="Lejo regjistrime"
          description="User-ët mund të krijojnë llogari"
          checked={allowRegistration}
          onChange={setAllowRegistration}
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
    </div>
  );
}

// ============= HELPERS =============
function StatCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="border border-white/10 rounded-2xl p-6 bg-paradox-bg/40 hover:border-[#cf35d2]/50 transition">
      <div className="flex items-start justify-between mb-3">
        <span className="text-3xl">{icon}</span>
      </div>
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    admin: "bg-red-500/20 text-red-400 border-red-500/40",
    seller: "bg-green-500/20 text-green-400 border-green-500/40",
    user: "bg-blue-500/20 text-blue-400 border-blue-500/40",
  };
  const labels: Record<string, string> = {
    admin: "👑 Admin",
    seller: "🏪 Shitës",
    user: "🛍️ Klient",
  };
  return (
    <span
      className={`inline-block px-2 py-1 text-xs rounded-full font-semibold border ${styles[role] || styles.user}`}
    >
      {labels[role] || role}
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
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${checked ? "translate-x-6" : ""}`}
        />
      </button>
    </div>
  );
}

// ============= ORDERS TAB — MongoDB =============
const ORDER_STATUSES = [
  { value: "pending", label: "⏳ Në pritje", color: "text-gray-300" },
  { value: "paid", label: "💳 Paguar", color: "text-blue-300" },
  { value: "shipped", label: "🚚 Dërguar", color: "text-purple-300" },
  { value: "delivered", label: "✅ Dorëzuar", color: "text-green-300" },
  { value: "cancelled", label: "❌ Anuluar", color: "text-red-300" },
];

function OrdersTab() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback((initial = false) => {
    if (initial) setLoading(true);
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => {
        if (initial) setLoading(false);
      });
  }, []);

  useEffect(() => {
    load(true); // ngarkimi i parë (me loading)
    const interval = setInterval(() => load(false), 5000); // live çdo 5s
    return () => clearInterval(interval);
  }, [load]);

  const handleStatusChange = async (order: OrderRow, status: string) => {
    try {
      const res = await fetch(`/api/orders/${order._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      toast.success(`Porosia → ${status}`);
      load();
    } catch {
      toast.error("Gabim");
    }
  };

  if (loading) return <p className="text-gray-400">Duke u ngarkuar...</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Porositë ({orders.length})</h2>

      {orders.length === 0 ? (
        <p className="text-gray-400">S'ka ende porosi.</p>
      ) : (
        <div className="border border-white/10 rounded-2xl overflow-hidden bg-paradox-bg/40">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 text-left text-sm text-gray-400">
                  <th className="px-6 py-4 font-medium">Porosia</th>
                  <th className="px-6 py-4 font-medium">Produktet</th>
                  <th className="px-6 py-4 font-medium">Totali</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Data</th>
                  <th className="px-6 py-4 font-medium">Statusi</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-white/5 hover:bg-white/5 transition align-top"
                  >
                    <td className="px-6 py-4 text-xs text-gray-400 font-mono">
                      #{order._id.slice(-6)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {order.items.map((it, i) => (
                        <div key={i} className="text-gray-300">
                          {it.title}{" "}
                          <span className="text-gray-500">× {it.qty}</span>
                        </div>
                      ))}
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {order.email || "—"}
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {new Date(order.createdAt).toLocaleDateString("sq")}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order, e.target.value)
                        }
                        className="bg-white/5 border border-white/10 text-white text-xs px-2 py-1 rounded focus:outline-none focus:border-[#cf35d2]"
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option
                            key={s.value}
                            value={s.value}
                            className="bg-paradox-bg"
                          >
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
