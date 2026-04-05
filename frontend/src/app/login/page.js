"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name} ✦`);
      router.push("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 petal-bg relative">
      <div className="absolute top-20 left-10 text-6xl float-anim" style={{ color: 'rgba(212,118,10,0.18)' }}>✦</div>
      <div className="absolute bottom-20 right-12 text-5xl float-anim" style={{ animationDelay: "2s", color: 'rgba(26,122,109,0.15)' }}>☽</div>
      <div className="absolute top-1/3 right-8 text-4xl float-anim" style={{ animationDelay: "4s", color: 'rgba(212,118,10,0.12)' }}>✦</div>

      <div className="relative w-full max-w-md">
        <div className="fancy-border panel-soft rounded-3xl p-8 md:p-10">
          <div className="text-center mb-8">
            <Link href="/">
              <p className="text-2xl mb-1 transition-colors"
                style={{ fontFamily: "Amiri,serif", color: "#D4760A" }}>
                گمنام مومنہ
              </p>
            </Link>
            <div className="text-xl my-3" style={{ color: 'rgba(212,118,10,0.28)' }}>✦ ☽ ✦</div>
            <h1 className="font-playfair text-3xl italic font-semibold" style={{ color: '#2D1810' }}>
              Welcome Back
            </h1>
            <p className="text-xs font-dm mt-1 tracking-wide" style={{ color: '#6B4A3A' }}>
              Sign in to your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-dm text-[10px] tracking-widest uppercase font-bold block mb-2"
                style={{ color: '#D4760A' }}>Email</label>
              <div className="relative">
                <FiMail size={14} className="absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: '#B8862C' }} />
                <input
                  type="email" placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="input-soft w-full pl-11 pr-4 py-3.5 text-sm rounded-2xl"
                  required
                />
              </div>
            </div>
            <div>
              <label className="font-dm text-[10px] tracking-widest uppercase font-bold block mb-2"
                style={{ color: '#D4760A' }}>Password</label>
              <div className="relative">
                <FiLock size={14} className="absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: '#B8862C' }} />
                <input
                  type={showPass ? "text" : "password"} placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className="input-soft w-full pl-11 pr-11 py-3.5 text-sm rounded-2xl"
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: '#A8907E' }}>
                  {showPass ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="btn-primary w-full py-4 text-xs rounded-2xl mt-4 flex items-center justify-center gap-2 font-bold tracking-wider">
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Sign In ✦"
              )}
            </button>
          </form>

          <p className="text-center text-xs font-dm mt-6" style={{ color: '#6B4A3A' }}>
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-bold transition-colors" style={{ color: '#D4760A' }}>
              Create one ✦
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
