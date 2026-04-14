import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  // If already logged in, go straight to dashboard
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary-700/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-3xl" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-lg mx-auto">
        {/* Logo */}
        <div className="mb-8 animate-fade-in-up">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center mx-auto shadow-2xl shadow-primary-500/30">
            <span className="text-white font-bold text-3xl">A</span>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 animate-fade-in-up stagger-1">
          Absensi <span className="bg-gradient-to-r from-primary-300 to-primary-500 bg-clip-text text-transparent">Siswa</span>
        </h1>

        <p className="text-slate-400 text-lg mb-10 animate-fade-in-up stagger-2 leading-relaxed">
          Sistem manajemen kehadiran siswa yang modern dan mudah digunakan.
        </p>

        {/* Login Button */}
        <div className="animate-fade-in-up stagger-3">
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold text-lg rounded-2xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-xl shadow-primary-500/25 hover:shadow-2xl hover:shadow-primary-500/40 hover:-translate-y-0.5"
            id="home-login-btn"
          >
            Masuk ke Akun
          </Link>
        </div>

        {/* Register Link */}
        <p className="mt-6 text-sm text-slate-500 animate-fade-in-up stagger-4">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="text-primary-400 hover:text-primary-300 font-medium transition-colors underline underline-offset-4 decoration-primary-400/30 hover:decoration-primary-300/50"
            id="home-register-link"
          >
            Buat akun baru
          </Link>
        </p>
      </div>

      {/* Bottom decorative bar */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />
    </div>
  );
}
