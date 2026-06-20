// components/Button.tsx
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "outline" | "ghost";
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  fullWidth = false,
  className = "",
  disabled,
  ...rest
}: ButtonProps) {
  const base =
    "px-6 py-3 rounded-lg font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed";
  const width = fullWidth ? "w-full" : "";

  const variants: Record<string, string> = {
    primary: "text-white hover:shadow-[0_0_15px_rgba(207,53,210,0.4)]",
    outline:
      "border border-white/30 text-white hover:bg-white hover:text-black",
    ghost: "text-[#ececec]/80 hover:text-white",
  };

  return (
    <button
      className={`${base} ${width} ${variants[variant]} ${className}`}
      disabled={disabled}
      style={
        variant === "primary"
          ? {
              background:
                "linear-gradient(65deg, rgb(63, 50, 220) 0%, rgb(207, 53, 210) 100%)",
            }
          : undefined
      }
      {...rest}
    >
      {children}
    </button>
  );
}
