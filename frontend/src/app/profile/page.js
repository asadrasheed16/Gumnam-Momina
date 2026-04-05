"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/lib/api";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  FiUser,
  FiPackage,
  FiHeart,
  FiEdit2,
  FiSave,
  FiX,
  FiLogOut,
} from "react-icons/fi";

export default function ProfilePage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "" });

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
    if (user) setForm({ name: user.name || "", phone: user.phone || "" });
  }, [user, authLoading, router]);

  if (authLoading)
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#FFF9F2" }}
      >
        <div className="w-8 h-8 border-2 border-[rgba(212,118,10,0.15)] border-t-[#D4760A] rounded-full animate-spin" />
      </div>
    );
  if (!user) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    setSaving(true);
    try {
      await updateProfile({ name: form.name.trim(), phone: form.phone.trim() });
      toast.success("Profile updated 🌸");
      setEditing(false);
      // Refresh page data
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const quickLinks = [
    {
      href: "/orders",
      icon: FiPackage,
      label: "My Orders",
      desc: "Track and view past orders",
      color: "#D4760A",
      bg: "#FFF3E6",
    },
    {
      href: "/wishlist",
      icon: FiHeart,
      label: "My Wishlist",
      desc: "Products you have saved",
      color: "#C68B2C",
      bg: "#FFF5EC",
    },
  ];

  return (
    <div className="min-h-screen pb-20" style={{ background: "#FFF9F2" }}>
      {/* Header */}
      <div
        className="py-14 text-center relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg,#FFF5EC,#FFF9F2,#FFF3E6)",
        }}
      >
        <div className="absolute inset-0 dot-pattern opacity-40" />
        <div className="relative">
          <p
            className="font-dm text-[10px] tracking-[0.4em] uppercase mb-4"
            style={{ color: "#B8862C" }}
          >
            My Account
          </p>
          {/* Avatar */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold text-white shadow-lg"
            style={{ background: "linear-gradient(135deg,#D4760A,#C68B2C)" }}
          >
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <h1
            className="font-playfair text-3xl text-[#2D1810] italic"
            style={{ fontFamily: "Playfair Display,serif" }}
          >
            {user.name}
          </h1>
          <p className="font-dm text-xs mt-1" style={{ color: "#8A6A58" }}>
            {user.email}
          </p>
          {user.role === "admin" && (
            <span
              className="inline-block mt-2 text-[10px] font-bold px-3 py-1 rounded-full font-dm tracking-widest"
              style={{
                background: "linear-gradient(135deg,#D4760A,#C68B2C)",
                color: "#fff",
              }}
            >
              ADMIN ✦
            </span>
          )}
          <div className="lace-divider max-w-48 mx-auto mt-5" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 pt-10 space-y-6">
        {/* Profile Card */}
        <div className="panel-soft rounded-3xl border shadow-soft overflow-hidden">
          <div
            className="flex items-center justify-between px-6 py-4 border-b"
            style={{
              borderColor: "rgba(212,118,10,0.12)",
              background: "linear-gradient(135deg,#FFF5EC,#FFF9F2)",
            }}
          >
            <div className="flex items-center gap-2">
              <FiUser size={15} style={{ color: "#D4760A" }} />
              <p className="font-dm font-bold text-sm text-[#2D1810] tracking-wide">
                Personal Info
              </p>
            </div>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 text-xs font-dm font-semibold px-3 py-1.5 rounded-full border transition-colors hover:bg-[rgba(212,118,10,0.04)]"
                style={{ borderColor: "rgba(212,118,10,0.18)", color: "#D4760A" }}
              >
                <FiEdit2 size={11} /> Edit
              </button>
            )}
          </div>

          <div className="p-6">
            {!editing ? (
              <div className="space-y-4">
                {[
                  { label: "Full Name", value: user.name },
                  { label: "Email Address", value: user.email },
                  { label: "Phone", value: user.phone || "—" },
                  {
                    label: "Member Since",
                    value: new Date(user.createdAt).toLocaleDateString(
                      "en-PK",
                      { month: "long", year: "numeric" },
                    ),
                  },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex justify-between items-center py-2 border-b last:border-0"
                    style={{ borderColor: "#FFF5EC" }}
                  >
                    <span
                      className="font-dm text-[10px] tracking-[0.2em] uppercase font-medium"
                      style={{ color: "#8A6A58" }}
                    >
                      {row.label}
                    </span>
                    <span className="font-dm text-sm text-[#2D1810] font-medium">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label
                    className="font-dm text-[10px] tracking-[0.25em] uppercase block mb-2 font-medium"
                    style={{ color: "#8A6A58" }}
                  >
                    Full Name *
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    className="input-soft w-full px-4 py-3 text-sm"
                    required
                  />
                </div>
                <div>
                  <label
                    className="font-dm text-[10px] tracking-[0.25em] uppercase block mb-2 font-medium"
                    style={{ color: "#8A6A58" }}
                  >
                    Phone
                  </label>
                  <input
                    value={form.phone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phone: e.target.value }))
                    }
                    placeholder="+92 300 0000000"
                    className="input-soft w-full px-4 py-3 text-sm"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="btn-outline-rose flex-1 py-3 rounded-2xl text-xs flex items-center justify-center gap-1.5"
                  >
                    <FiX size={12} /> Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-rose flex-1 py-3 rounded-2xl text-xs flex items-center justify-center gap-1.5"
                  >
                    {saving ? (
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <FiSave size={12} /> Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-4">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="panel-soft rounded-3xl border p-5 flex flex-col gap-3 transition-all hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center"
                style={{ background: link.bg }}
              >
                <link.icon size={18} style={{ color: link.color }} />
              </div>
              <div>
                <p className="font-dm font-bold text-sm text-[#2D1810]">
                  {link.label}
                </p>
                <p
                  className="font-dm text-xs mt-0.5"
                  style={{ color: "#8A6A58" }}
                >
                  {link.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Admin shortcut */}
        {user.role === "admin" && (
          <Link
            href="/admin/products"
            className="block rounded-3xl border p-5 transition-all hover:shadow-md"
            style={{
              background: "linear-gradient(135deg,#FFF3E6,#FFF5EC)",
              borderColor: "rgba(212,118,10,0.18)",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-white text-lg"
                style={{
                  background: "linear-gradient(135deg,#D4760A,#C68B2C)",
                }}
              >
                ⚙️
              </div>
              <div>
                <p className="font-dm font-bold text-sm text-[#2D1810]">
                  Admin Dashboard
                </p>
                <p
                  className="font-dm text-xs mt-0.5"
                  style={{ color: "#8A6A58" }}
                >
                  Manage products, orders & users
                </p>
              </div>
              <span
                className="ml-auto font-dm text-xs font-bold"
                style={{ color: "#D4760A" }}
              >
                →
              </span>
            </div>
          </Link>
        )}

        {/* Sign out */}
        <button
          onClick={() => {
            logout();
            router.push("/");
          }}
          className="w-full py-3.5 rounded-2xl border text-xs font-dm font-semibold flex items-center justify-center gap-2 transition-colors hover:bg-red-50"
          style={{ borderColor: "rgba(212,118,10,0.12)", color: "#E89830" }}
        >
          <FiLogOut size={13} /> Sign Out
        </button>
      </div>
    </div>
  );
}

