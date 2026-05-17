import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { FIGMA } from "@/lib/figmaAssets";

export default function Header() {
  const [open, setOpen] = useState<boolean>(false);
  const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false);
  const { data: session } = useSession();

  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <nav className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-4 sm:py-6 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <img
            src={FIGMA.logo}
            alt="Paradox Tech"
            className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 object-contain"
          />
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex items-center gap-12 text-white font-bold">
          <li>
            <Link href="/" className="hover:text-paradox-glow transition">
              Home
            </Link>
          </li>
          <li>
            <Link href="/shop" className="hover:text-paradox-glow transition">
              E-shop
            </Link>
          </li>
          <li>
            <Link href="/about" className="hover:text-paradox-glow transition">
              About us
            </Link>
          </li>
          <li>
            <Link href="/blog" className="hover:text-paradox-glow transition">
              Blog
            </Link>
          </li>
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Search */}
          <button
            className="text-white hover:text-paradox-glow transition"
            aria-label="Search"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>

          {/* Account: Login OSE Profile dropdown */}
          {session ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 text-white hover:text-paradox-glow transition"
                aria-label="User menu"
              >
                {/* Avatar */}
                <div
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{
                    background:
                      "linear-gradient(65deg, rgb(63, 50, 220) 0%, rgb(207, 53, 210) 100%)",
                  }}
                >
                  {session.user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
              </button>

              {/* Dropdown */}
              {userMenuOpen && (
                <>
                  {/* Overlay per close */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-paradox-bg/95 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                    <div className="p-4 border-b border-white/10">
                      <p className="text-white font-semibold text-sm">
                        {session.user?.name}
                      </p>
                      <p className="text-gray-400 text-xs mt-1 truncate">
                        {session.user?.email}
                      </p>
                    </div>
                    <ul className="py-2">
                      <li>
                        <Link
                          href="/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-white hover:bg-white/10 transition"
                        >
                          👤 Profili Im
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-white hover:bg-white/10 transition"
                        >
                          📦 Produktet e mia
                        </Link>
                      </li>
                      {session.user?.role === "admin" && (
                        <li>
                          <Link
                            href="/dashboard"
                            onClick={() => setUserMenuOpen(false)}
                            className="block px-4 py-2 text-sm font-semibold transition hover:bg-paradox-purple/10"
                            style={{ color: "#cf35d2" }}
                          >
                            👑 Admin Dashboard
                          </Link>
                        </li>
                      )}
                      <li>
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            signOut({ callbackUrl: "/" });
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition"
                        >
                          🚪 Dil
                        </button>
                      </li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="text-white hover:text-paradox-glow transition"
              aria-label="Login"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </Link>
          )}

          {/* Cart */}
          <Link
            href="/cart"
            className="text-white hover:text-paradox-glow transition"
            aria-label="Cart"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden text-white hover:text-paradox-glow transition"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile/Tablet Menu */}
      {open && (
        <div className="lg:hidden bg-paradox-dark/95 backdrop-blur-md border-t border-paradox-purple/20 animate-fadeIn">
          <ul className="flex flex-col p-6 gap-4 text-white font-bold">
            <li>
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="block py-2 hover:text-paradox-glow"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/shop"
                onClick={() => setOpen(false)}
                className="block py-2 hover:text-paradox-glow"
              >
                E-shop
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                onClick={() => setOpen(false)}
                className="block py-2 hover:text-paradox-glow"
              >
                About us
              </Link>
            </li>
            <li>
              <Link
                href="/blog"
                onClick={() => setOpen(false)}
                className="block py-2 hover:text-paradox-glow"
              >
                Blog
              </Link>
            </li>
            <li className="pt-2 border-t border-paradox-purple/20">
              {session ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setOpen(false)}
                    className="block py-2 text-paradox-glow"
                  >
                    👤 Profili Im
                  </Link>
                  {session.user?.role === "admin" && (
                    <Link
                      href="/dashboard"
                      onClick={() => setOpen(false)}
                      className="block py-2 font-semibold"
                      style={{ color: "#cf35d2" }}
                    >
                      👑 Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="block py-2 text-red-400 w-full text-left"
                  >
                    🚪 Dil
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="block py-2 text-paradox-glow"
                >
                  Login / Account
                </Link>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
