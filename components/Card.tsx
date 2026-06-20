// components/Card.tsx
import Link from "next/link";

export interface CardProduct {
  _id: string;
  name: string;
  price: number;
  image?: string;
}

export default function Card({ product }: { product: CardProduct }) {
  return (
    <div className="group text-center">
      <Link href={`/shop/${product._id}`}>
        <div className="bg-white aspect-square overflow-hidden mb-4 flex items-center justify-center">
          <img
            loading="lazy"
            decoding="async"
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <h3 className="text-[#ececec] text-sm font-semibold leading-snug mb-2">
          {product.name}
        </h3>

        <div className="flex justify-center gap-1 mb-2 text-yellow-400 text-xs">
          ★★★★★
        </div>

        <p className="text-[#ececec] text-sm">${product.price.toFixed(2)}</p>
      </Link>
    </div>
  );
}
