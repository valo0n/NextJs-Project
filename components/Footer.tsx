import Link from "next/link";
import { FIGMA } from "@/lib/figmaAssets";

export default function Footer() {
  return (
    <footer className="bg-[#2b2b2b] mt-0">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-16 py-12 lg:py-16">
        {/* Logo origjinale */}
        <div className="mb-8 lg:mb-12">
          <img
            loading="lazy"
            decoding="async"
            src={FIGMA.logo}
            alt="Paradox Tech"
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 text-white">
          {/* About Us */}
          <div>
            <h4 className="font-bold text-xl lg:text-2xl mb-4 text-[#e9e9e9]">
              About us
            </h4>
            <p className="text-[#ababab] text-base lg:text-lg leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tellus
              vitae congue id ipsum sed neque et dui accumsan. Nibh semper magna
              facilisi ridiculus luctus amet. Aliquam
            </p>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-bold text-xl lg:text-2xl mb-4 text-[#e9e9e9]">
              Info
            </h4>
            <ul className="space-y-3 text-[#ababab] text-base lg:text-lg">
              <li>
                <Link href="#" className="hover:text-white transition">
                  Delivery
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  Payment
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition">
                  For Partners
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-bold text-xl lg:text-2xl mb-4 text-[#e9e9e9]">
              Social Media
            </h4>
            <ul className="space-y-3 text-[#ababab] text-base lg:text-lg">
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 inline-flex items-center justify-center">
                  📷
                </span>
                <a href="#" className="hover:text-white transition">
                  instgram
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 inline-flex items-center justify-center">
                  📘
                </span>
                <a href="#" className="hover:text-white transition">
                  facebook
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 inline-flex items-center justify-center">
                  🐦
                </span>
                <a href="#" className="hover:text-white transition">
                  Twitter
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 inline-flex items-center justify-center">
                  💼
                </span>
                <a href="#" className="hover:text-white transition">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="font-bold text-xl lg:text-2xl mb-4 text-[#72716d] uppercase tracking-wider">
              Contact us
            </h4>
            <ul className="space-y-3 text-[#cac9c4] text-base lg:text-lg">
              <li>+1 891 989-11-91</li>
              <li>hello@paradox.com</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
