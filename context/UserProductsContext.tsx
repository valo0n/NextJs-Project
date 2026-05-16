import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface UserProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  createdAt: string;
}

interface UserProductsContextType {
  products: UserProduct[];
  addProduct: (product: Omit<UserProduct, "id" | "createdAt">) => void;
  updateProduct: (id: string, updates: Partial<UserProduct>) => void;
  deleteProduct: (id: string) => void;
}

const UserProductsContext = createContext<UserProductsContextType | undefined>(
  undefined,
);

interface UserProductsProviderProps {
  children: ReactNode;
}

export function UserProductsProvider({ children }: UserProductsProviderProps) {
  const [products, setProducts] = useState<UserProduct[]>([]);

  // Ngarko nga localStorage ne fillim
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("userProducts");
      if (stored) {
        try {
          setProducts(JSON.parse(stored));
        } catch {
          setProducts([]);
        }
      }
    }
  }, []);

  // Ruaj ne localStorage sa here qe ndryshojne
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("userProducts", JSON.stringify(products));
    }
  }, [products]);

  const addProduct = (product: Omit<UserProduct, "id" | "createdAt">) => {
    const newProduct: UserProduct = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<UserProduct>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <UserProductsContext.Provider
      value={{ products, addProduct, updateProduct, deleteProduct }}
    >
      {children}
    </UserProductsContext.Provider>
  );
}

export const useUserProducts = (): UserProductsContextType => {
  const ctx = useContext(UserProductsContext);
  if (!ctx)
    throw new Error(
      "useUserProducts duhet të përdoret brenda UserProductsProvider",
    );
  return ctx;
};
