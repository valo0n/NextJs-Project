import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// === TIPAT ===
export interface DashUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  status: "active" | "blocked";
  joined: string;
}

export interface DashProduct {
  id: string;
  title: string;
  category: string;
  price: number;
  stock: number;
  status: "active" | "draft" | "out_of_stock";
  createdAt: string;
}

export interface DashOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  total: number;
  itemsCount: number;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  date: string;
}

interface DashboardContextType {
  users: DashUser[];
  updateUser: (id: string, updates: Partial<DashUser>) => void;
  deleteUser: (id: string) => void;

  products: DashProduct[];
  addProduct: (product: Omit<DashProduct, "id" | "createdAt">) => void;
  updateProduct: (id: string, updates: Partial<DashProduct>) => void;
  deleteProduct: (id: string) => void;

  orders: DashOrder[];
  updateOrder: (id: string, updates: Partial<DashOrder>) => void;
  deleteOrder: (id: string) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined,
);

// === MOCK DATA ===
const INITIAL_USERS: DashUser[] = [
  {
    id: "u1",
    name: "Valon Hoxha",
    email: "valon@paradox.com",
    role: "admin",
    status: "active",
    joined: "2026-01-15",
  },
  {
    id: "u2",
    name: "Albina Krasniqi",
    email: "albina@example.com",
    role: "user",
    status: "active",
    joined: "2026-02-20",
  },
  {
    id: "u3",
    name: "Driton Berisha",
    email: "driton@example.com",
    role: "user",
    status: "active",
    joined: "2025-12-01",
  },
  {
    id: "u4",
    name: "Erëzë Gashi",
    email: "ereze@example.com",
    role: "user",
    status: "blocked",
    joined: "2026-03-10",
  },
  {
    id: "u5",
    name: "Ardian Hyseni",
    email: "ardian@example.com",
    role: "user",
    status: "active",
    joined: "2026-04-05",
  },
];

const INITIAL_PRODUCTS: DashProduct[] = [
  {
    id: "p1",
    title: "Logitech PRO X Superlight",
    category: "Mouse",
    price: 160,
    stock: 25,
    status: "active",
    createdAt: "2026-01-10",
  },
  {
    id: "p2",
    title: "Logitech G Pro X Headset",
    category: "Headset",
    price: 223,
    stock: 12,
    status: "active",
    createdAt: "2026-01-15",
  },
  {
    id: "p3",
    title: "Logitech G PRO Mechanical Keyboard",
    category: "Keyboard",
    price: 149,
    stock: 8,
    status: "active",
    createdAt: "2026-02-01",
  },
  {
    id: "p4",
    title: "Razer Blade 14 Gaming Laptop",
    category: "Laptop",
    price: 1899,
    stock: 3,
    status: "active",
    createdAt: "2026-02-15",
  },
  {
    id: "p5",
    title: "ASUS Zenbook 15 OLED",
    category: "Laptop",
    price: 1299,
    stock: 0,
    status: "out_of_stock",
    createdAt: "2026-03-05",
  },
  {
    id: "p6",
    title: "HyperX Cloud Alpha Headset",
    category: "Headset",
    price: 89,
    stock: 15,
    status: "draft",
    createdAt: "2026-03-20",
  },
];

const INITIAL_ORDERS: DashOrder[] = [
  {
    id: "ORD-1001",
    customerName: "Valon Hoxha",
    customerEmail: "valon@paradox.com",
    total: 532,
    itemsCount: 3,
    status: "delivered",
    date: "2026-05-10",
  },
  {
    id: "ORD-1002",
    customerName: "Albina Krasniqi",
    customerEmail: "albina@example.com",
    total: 149,
    itemsCount: 1,
    status: "shipped",
    date: "2026-05-12",
  },
  {
    id: "ORD-1003",
    customerName: "Driton Berisha",
    customerEmail: "driton@example.com",
    total: 383,
    itemsCount: 2,
    status: "pending",
    date: "2026-05-14",
  },
  {
    id: "ORD-1004",
    customerName: "Erëzë Gashi",
    customerEmail: "ereze@example.com",
    total: 1245,
    itemsCount: 5,
    status: "delivered",
    date: "2026-05-15",
  },
  {
    id: "ORD-1005",
    customerName: "Ardian Hyseni",
    customerEmail: "ardian@example.com",
    total: 1899,
    itemsCount: 1,
    status: "cancelled",
    date: "2026-05-16",
  },
];

interface DashboardProviderProps {
  children: ReactNode;
}

export function DashboardProvider({ children }: DashboardProviderProps) {
  const [users, setUsers] = useState<DashUser[]>(INITIAL_USERS);
  const [products, setProducts] = useState<DashProduct[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<DashOrder[]>(INITIAL_ORDERS);

  // Ngarko nga localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const u = localStorage.getItem("dash_users");
      const p = localStorage.getItem("dash_products");
      const o = localStorage.getItem("dash_orders");
      if (u) setUsers(JSON.parse(u));
      if (p) setProducts(JSON.parse(p));
      if (o) setOrders(JSON.parse(o));
    } catch {}
  }, []);

  // Ruaj ne localStorage
  useEffect(() => {
    if (typeof window !== "undefined")
      localStorage.setItem("dash_users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (typeof window !== "undefined")
      localStorage.setItem("dash_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    if (typeof window !== "undefined")
      localStorage.setItem("dash_orders", JSON.stringify(orders));
  }, [orders]);

  // USERS
  const updateUser = (id: string, updates: Partial<DashUser>) =>
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...updates } : u)),
    );
  const deleteUser = (id: string) =>
    setUsers((prev) => prev.filter((u) => u.id !== id));

  // PRODUCTS
  const addProduct = (product: Omit<DashProduct, "id" | "createdAt">) => {
    const newProduct: DashProduct = {
      ...product,
      id: `p${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setProducts((prev) => [newProduct, ...prev]);
  };
  const updateProduct = (id: string, updates: Partial<DashProduct>) =>
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    );
  const deleteProduct = (id: string) =>
    setProducts((prev) => prev.filter((p) => p.id !== id));

  // ORDERS
  const updateOrder = (id: string, updates: Partial<DashOrder>) =>
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, ...updates } : o)),
    );
  const deleteOrder = (id: string) =>
    setOrders((prev) => prev.filter((o) => o.id !== id));

  return (
    <DashboardContext.Provider
      value={{
        users,
        updateUser,
        deleteUser,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        orders,
        updateOrder,
        deleteOrder,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export const useDashboard = (): DashboardContextType => {
  const ctx = useContext(DashboardContext);
  if (!ctx)
    throw new Error("useDashboard duhet të përdoret brenda DashboardProvider");
  return ctx;
};
