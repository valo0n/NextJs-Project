// pages/contact.tsx
import Layout from "@/components/Layout";
import Head from "next/head";
import { NextPage } from "next";
import { useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import Button from "@/components/Button";

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const Contact: NextPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>();

  const onSubmit: SubmitHandler<ContactForm> = async (data) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      toast.success(json.message || "Mesazhi u dërgua");
      reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gabim");
    }
  };

  const inputCls =
    "w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#cf35d2] transition placeholder:text-gray-500";

  return (
    <>
      <Head>
        <title>Kontakti - Paradox Tech</title>
      </Head>

      <Layout>
        <section className="min-h-screen bg-paradox-bg pt-32 pb-20 px-6 text-[#ececec]">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">
              Na kontaktoni
            </h1>
            <p className="text-gray-400 mb-10">
              Ke pyetje? Dërgona një mesazh dhe të kthehemi sa më shpejt.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <input
                  placeholder="Emri *"
                  className={inputCls}
                  {...register("name", {
                    required: "Emri është i detyrueshëm",
                  })}
                />
                {errors.name && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <input
                  placeholder="Email *"
                  className={inputCls}
                  {...register("email", {
                    required: "Email-i është i detyrueshëm",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Email-i nuk është i vlefshëm",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <input
                  placeholder="Subjekti"
                  className={inputCls}
                  {...register("subject")}
                />
              </div>

              <div>
                <textarea
                  placeholder="Mesazhi *"
                  rows={6}
                  className={inputCls}
                  {...register("message", {
                    required: "Mesazhi është i detyrueshëm",
                    minLength: {
                      value: 10,
                      message: "Mesazhi duhet të jetë së paku 10 karaktere",
                    },
                  })}
                />
                {errors.message && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Duke dërguar..." : "Dërgo mesazhin"}
              </Button>
            </form>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Contact;
