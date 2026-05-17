import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/context/CartContext";
import { UserProductsProvider } from "@/context/UserProductsContext";
import { DashboardProvider } from "@/context/DashboardContext";
import { Toaster } from "react-hot-toast";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <CartProvider>
        <UserProductsProvider>
          <DashboardProvider>
            <Toaster position="top-right" />
            <Component {...pageProps} />
          </DashboardProvider>
        </UserProductsProvider>
      </CartProvider>
    </SessionProvider>
  );
}
