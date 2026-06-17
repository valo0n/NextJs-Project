import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";
import Head from "next/head";
import toast from "react-hot-toast";
import { NextPage } from "next";
import { FIGMA } from "@/lib/figmaAssets";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

type AccountType = "user" | "seller";

const Register: NextPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [accountType, setAccountType] = useState<AccountType>("user");

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, role: accountType }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      const successMsg =
        accountType === "seller"
          ? "Llogaria e biznesit u krijua! Kyçu tani."
          : "Llogaria u krijua! Kyçu tani.";
      toast.success(successMsg);
      router.push("/login");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Gabim";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Register - Paradox Tech</title>
      </Head>

      <div className="min-h-screen bg-paradox-bg relative overflow-hidden flex items-center justify-center px-4 py-12">
        {/* Glow effects */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] sm:w-[800px] sm:h-[800px] rounded-full bg-paradox-purple/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] sm:w-[800px] sm:h-[800px] rounded-full bg-[#cf35d2]/15 blur-[120px] pointer-events-none" />

        {/* Logo */}
        <Link
          href="/"
          className="absolute top-6 left-6 lg:top-8 lg:left-12 z-20"
        >
          <img
            loading="eager"
            decoding="async"
            src={FIGMA.logo}
            alt="Paradox Tech"
            className="w-14 h-14 lg:w-16 lg:h-16 object-contain"
          />
        </Link>

        {/* Register Card */}
        <div className="relative z-10 w-full max-w-md">
          <div
            className="border-[3px] border-[#cf35d2] rounded-tl-[40px] rounded-tr-[40px] rounded-bl-[40px] p-8 sm:p-10 bg-paradox-bg/40 backdrop-blur-md"
            style={{
              boxShadow: "0 0 40px rgba(207, 53, 210, 0.2)",
            }}
          >
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-3xl sm:text-4xl font-bold mb-3 uppercase tracking-wider">
                Krijo{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(65deg, rgb(63, 50, 220) 0%, rgb(207, 53, 210) 100%)",
                  }}
                >
                  Llogari
                </span>
              </h1>
              <p className="text-gray-300 text-sm sm:text-base">
                Bëhu pjesë e Paradox Tech
              </p>
            </div>

            {/* Account Type Selector */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-300 mb-3 text-center">
                Lloji i llogarisë
              </p>
              <div className="grid grid-cols-2 gap-3">
                {/* Klient */}
                <button
                  type="button"
                  onClick={() => setAccountType("user")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    accountType === "user"
                      ? "border-[#cf35d2] bg-paradox-purple/10"
                      : "border-white/10 bg-white/5 hover:border-white/30"
                  }`}
                >
                  <div className="text-3xl mb-2">🛍️</div>
                  <p className="text-sm font-bold text-white">Klient</p>
                  <p className="text-xs text-gray-400 mt-1">Blej produkte</p>
                </button>

                {/* Biznes/Shites */}
                <button
                  type="button"
                  onClick={() => setAccountType("seller")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    accountType === "seller"
                      ? "border-[#cf35d2] bg-paradox-purple/10"
                      : "border-white/10 bg-white/5 hover:border-white/30"
                  }`}
                >
                  <div className="text-3xl mb-2">🏪</div>
                  <p className="text-sm font-bold text-white">Biznes</p>
                  <p className="text-xs text-gray-400 mt-1">Shes produkte</p>
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  {accountType === "seller" ? "Emri i biznesit" : "Emri"}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {accountType === "seller" ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      )}
                    </svg>
                  </div>
                  <input
                    id="name"
                    type="text"
                    placeholder={
                      accountType === "seller" ? "P.sh. Tech Store" : "Emri yt"
                    }
                    {...register("name", {
                      required: "Emri është i detyrueshëm",
                      minLength: { value: 2, message: "Së paku 2 karaktere" },
                    })}
                    className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:border-[#cf35d2] focus:bg-white/10 transition placeholder:text-gray-500"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    {...register("email", {
                      required: "Email është i detyrueshëm",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Email i pavlefshëm",
                      },
                    })}
                    className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:border-[#cf35d2] focus:bg-white/10 transition placeholder:text-gray-500"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Fjalëkalimi
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Së paku 6 karaktere"
                    {...register("password", {
                      required: "Fjalëkalimi është i detyrueshëm",
                      minLength: { value: 6, message: "Së paku 6 karaktere" },
                    })}
                    className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-10 py-3 rounded-lg focus:outline-none focus:border-[#cf35d2] focus:bg-white/10 transition placeholder:text-gray-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition"
                  >
                    {showPassword ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 rounded-lg font-semibold text-white uppercase tracking-wider transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_25px_rgba(207,53,210,0.5)]"
                style={{
                  background:
                    "linear-gradient(65deg, rgb(63, 50, 220) 0%, rgb(207, 53, 210) 100%)",
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Duke u krijuar...
                  </span>
                ) : accountType === "seller" ? (
                  "Regjistro Biznesin"
                ) : (
                  "Regjistrohu"
                )}
              </button>
            </form>

            {/* Login link */}
            <p className="text-center mt-6 text-gray-300 text-sm">
              Ke llogari tashmë?{" "}
              <Link
                href="/login"
                className="text-[#cf35d2] hover:text-[#e84cea] font-semibold transition"
              >
                Kyçu
              </Link>
            </p>
          </div>

          {/* Back to home */}
          <div className="text-center mt-6">
            <Link
              href="/"
              className="text-gray-400 hover:text-white text-sm transition inline-flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Kthehu te Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
