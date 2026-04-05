"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", phone: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toast.error("Passwords do not match ✦"); return; }
    if (form.password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      const user = await register(form.name, form.email, form.password, form.phone);
      toast.success(`Welcome to Gumnam Momina, ${user.name}! ✦`);
      router.push("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally { setLoading(false); }
  };

  const fields = [
    { key: "name", label: "Full Name", type: "text", placeholder: "Aisha Fatima", icon: FiUser, required: true },
    { key: "email", label: "Email", type: "email", placeholder: "your@email.com", icon: FiMail, required: true },
    { key: "phone", label: "Phone (Optional)", type: "tel", placeholder: "+92 300 0000000", icon: FiPhone, required: false },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 petal-bg relative">
      <div className="absolute top-20 right-10 text-6xl float-anim" style={{ color: 'rgba(212,118,10,0.18)' }}>✦</div>
      <div className="absolute bottom-20 left-12 text-5xl float-anim" style={{ animationDelay: "3s", color: 'rgba(26,122,109,0.14)' }}>☽</div>

      <div className="relative w-full max-w-md">
        <div className="fancy-border panel-soft rounded-3xl p-8 md:p-10">
          <div className="text-center mb-8">
            <Link href="/">
              <p className="text-2xl mb-1" style={{ fontFamily: "Amiri,serif", color: "#D4760A" }}>
                گمنام مومنہ
              </p>
            </Link>
            <div className="text-xl my-3" style={{ color: 'rgba(212,118,10,0.28)' }}>✦ ☽ ✦</div>
            <h1 className="font-playfair text-3xl italic font-semibold" style={{ color: '#2D1810' }}>
              Join Our Family
            </h1>
            <p className="text-xs font-dm mt-1" style={{ color: '#6B4A3A' }}>
              Create your account ✦
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((field) => (
              <div key={field.key}>
                <label className="font-dm text-[10px] tracking-widest uppercase font-bold block mb-2"
                  style={{ color: '#D4760A' }}>
                  {field.label}
                </label>
                <div className="relative">
                  <field.icon size={14} className="absolute left-4 top-1/2 -translate-y-1/2"
                    style={{ color: '#B8862C' }} />
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={form[field.key]}
                    onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                    className="input-soft w-full pl-11 pr-4 py-3.5 text-sm rounded-2xl"
                    required={field.required}
                  />
                </div>
              </div>
            ))}
            {[
              { key: "password", label: "Password", placeholder: "Min. 6 characters" },
              { key: "confirmPassword", label: "Confirm Password", placeholder: "Repeat password" },
            ].map((f) => (
              <div key={f.key}>
                <label className="font-dm text-[10px] tracking-widest uppercase font-bold block mb-2"
                  style={{ color: '#D4760A' }}>
                  {f.label}
                </label>
                <div className="relative">
                  <FiLock size={14} className="absolute left-4 top-1/2 -translate-y-1/2"
                    style={{ color: '#B8862C' }} />
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder={f.placeholder}
                    value={form[f.key]}
                    onChange={(e) => setForm((ff) => ({ ...ff, [f.key]: e.target.value }))}
                    className="input-soft w-full pl-11 pr-11 py-3.5 text-sm rounded-2xl"
                    required
                  />
                  {f.key === "password" && (
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                      style={{ color: '#A8907E' }}>
                      {showPass ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button type="submit" disabled={loading}
              className="btn-primary w-full py-4 text-xs rounded-2xl mt-2 flex items-center justify-center gap-2 font-bold tracking-wider">
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Create Account ✦"
              )}
            </button>
          </form>
          <p className="text-center text-xs font-dm mt-6" style={{ color: '#6B4A3A' }}>
            Already have an account?{" "}
            <Link href="/login" className="font-bold transition-colors" style={{ color: '#D4760A' }}>
              Sign in ✦
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
