import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { IProduct } from "@/types";

interface CartItem extends IProduct {
  qty: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: IProduct) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Ngarko shportën nga localStorage NJË herë
  useEffect(() => {
    try {
      const stored = localStorage.getItem("cart");
      if (stored) setCart(JSON.parse(stored));
    } catch {
      // injoro JSON të prishur
    }
    setHydrated(true);
  }, []);

  // Ruaj VETËM pasi është ngarkuar (që mos ta fshijë me [] në mount)
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart, hydrated]);

  const addToCart = (product: IProduct) => {
    setCart((prev) => {
      const exists = prev.find((p) => p._id === product._id);
      if (exists) {
        return prev.map((p) =>
          p._id === product._id ? { ...p, qty: p.qty + 1 } : p,
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((p) => p._id !== id));
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((sum, p) => sum + p.price * p.qty, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = (): CartContextType => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart duhet të përdoret brenda CartProvider");
  return ctx;
};
