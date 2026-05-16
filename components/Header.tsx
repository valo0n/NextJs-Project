import Link from "next/link";
import { useState } from "react";
import { FIGMA } from "@/lib/figmaAssets";

export default function Header() {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <nav className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-4 sm:py-6 flex justify-between items-center">
        {/* Logo origjinale nga Figma */}
        <Link href="/" className="flex items-center shrink-0">
          <img
            src={FIGMA.logo}
            alt="Paradox Tech"
            className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 object-contain"
          />
        </Link>

        {/* Desktop Menu - centered */}
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

        {/* Right side: Search + Login + Cart + Mobile menu */}
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

          {/* Account / Login */}
          <Link
            href="/login"
            className="text-white hover:text-paradox-glow transition"
            aria-label="Login / Account"
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
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="block py-2 text-paradox-glow"
              >
                Login / Account
              </Link>
            </li>
            <li>
              <Link
                href="/cart"
                onClick={() => setOpen(false)}
                className="block py-2 hover:text-paradox-glow"
              >
                Cart
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
