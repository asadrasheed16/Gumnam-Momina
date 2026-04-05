"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { placeOrder } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { FiCheckCircle } from "react-icons/fi";
import DuaCardGenerator from "@/components/DuaCardGenerator";

const PAYMENT_METHODS = [
  {
    value: "COD",
    label: "Cash on Delivery",
    desc: "Pay when you receive",
    icon: "💵",
  },
  {
    value: "EasyPaisa",
    label: "EasyPaisa",
    desc: "Mobile wallet payment",
    icon: "📱",
  },
  {
    value: "JazzCash",
    label: "JazzCash",
    desc: "Mobile wallet payment",
    icon: "📲",
  },
  {
    value: "Bank Transfer",
    label: "Bank Transfer",
    desc: "Direct bank transfer",
    icon: "🏦",
  },
];

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cart, cartTotal, emptyCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [duaCardOpen, setDuaCardOpen] = useState(false);
  const [isGift, setIsGift] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    province: "",
    postalCode: "",
    paymentMethod: "COD",
    notes: "",
  });

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (user)
      setForm((f) => ({ ...f, name: user.name, phone: user.phone || "" }));
  }, [user, router]);

  useEffect(() => {
    if (cart.length === 0 && !success) router.push("/cart");
  }, [cart, success, router]);

  const shipping = cartTotal >= 5000 ? 0 : 200;
  const total = cartTotal + shipping;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.street || !form.city || !form.province) {
      toast.error("Please fill all required fields");
      return;
    }
    setLoading(true);
    try {
      const res = await placeOrder({
        shippingAddress: {
          name: form.name,
          phone: form.phone,
          street: form.street,
          city: form.city,
          province: form.province,
          postalCode: form.postalCode,
        },
        paymentMethod: form.paymentMethod,
        notes: form.notes,
      });
      setOrderId(res.data._id);
      setSuccess(true);
      await emptyCart();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (success)
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{
          background: "linear-gradient(160deg,#FFF5EC,#FFF9F2,#FFF3E6)",
        }}
      >
        <div className="text-center max-w-md">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: "linear-gradient(135deg,#BDD8B0,#9ABF88)" }}
          >
            <FiCheckCircle size={40} className="text-white" />
          </div>
          <p
            className="text-3xl mb-2"
            style={{ fontFamily: "Amiri,serif", color: "rgba(212,160,48,0.8)" }}
          >
            بارك الله فيك
          </p>
          <h1
            className="font-playfair text-4xl text-[#2D1810] italic mb-3"
            style={{ fontFamily: "Playfair Display,serif" }}
          >
            Order Placed! 🌸
          </h1>
          <p
            className="font-dm text-sm mb-3"
            style={{ color: "rgba(61,43,53,0.5)" }}
          >
            JazakAllah Khair! We will process your order with love.
          </p>
          {orderId && (
            <p className="font-dm text-xs mb-6" style={{ color: "#B8862C" }}>
              Order ID:{" "}
              <span style={{ color: "#D4760A", fontWeight: 600 }}>
                {orderId}
              </span>
            </p>
          )}

          {/* Dua Card CTA */}
          <div
            className="rounded-3xl p-5 mb-7 border"
            style={{
              background: "linear-gradient(135deg,#FFFBF0,#FFF3E6)",
              borderColor: "rgba(212,118,10,0.18)",
            }}
          >
            <p className="text-2xl mb-2">🤲</p>
            <p
              className="font-playfair text-lg text-[#2D1810] italic mb-1"
              style={{ fontFamily: "Playfair Display,serif" }}
            >
              Is this a gift?
            </p>
            <p
              className="font-dm text-xs mb-4"
              style={{ color: "rgba(61,43,53,0.5)" }}
            >
              Add a personalized Dua card — printed & included in the package,
              free of charge.
            </p>
            <button
              onClick={() => setDuaCardOpen(true)}
              className="w-full py-3 rounded-2xl text-xs font-dm font-bold text-white transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg,#D4760A,#C68B2C)" }}
            >
              ✦ Generate Personalized Dua Card
            </button>
          </div>

          <div className="flex gap-3 justify-center">
            <Link
              href="/orders"
              className="btn-rose px-8 py-3 rounded-full text-xs"
            >
              View My Orders
            </Link>
            <Link
              href="/products"
              className="btn-outline-rose px-8 py-3 rounded-full text-xs"
            >
              Keep Shopping
            </Link>
          </div>
        </div>

        {/* Dua Card Generator Modal */}
        {duaCardOpen && (
          <DuaCardGenerator
            onClose={() => setDuaCardOpen(false)}
            onCardGenerated={() =>
              toast.success("Dua card added to your order! 🤲")
            }
          />
        )}
      </div>
    );

  return (
    <div className="min-h-screen pb-20" style={{ background: "#FFF9F2" }}>
      <div
        className="py-12 text-center"
        style={{ background: "linear-gradient(160deg,#FFF5EC,#FFF9F2)" }}
      >
        <h1
          className="font-playfair text-4xl text-[#2D1810] italic"
          style={{ fontFamily: "Playfair Display,serif" }}
        >
          Checkout 🌸
        </h1>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-10">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left */}
            <div className="lg:col-span-3 space-y-6">
              {/* Shipping */}
              <div className="panel-soft rounded-3xl p-6 border shadow-soft">
                <h2
                  className="font-playfair text-2xl text-[#2D1810] italic mb-6"
                  style={{ fontFamily: "Playfair Display,serif" }}
                >
                  Shipping Address
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      key: "name",
                      label: "Full Name *",
                      placeholder: "Aisha Fatima",
                      colSpan: 2,
                      required: true,
                    },
                    {
                      key: "phone",
                      label: "Phone",
                      placeholder: "+92 300 0000000",
                      required: false,
                    },
                    {
                      key: "street",
                      label: "Street Address *",
                      placeholder: "House #, Street, Area",
                      colSpan: 2,
                      required: true,
                    },
                    {
                      key: "city",
                      label: "City *",
                      placeholder: "Lahore",
                      required: true,
                    },
                    {
                      key: "province",
                      label: "Province *",
                      placeholder: "Punjab",
                      required: true,
                    },
                    {
                      key: "postalCode",
                      label: "Postal Code",
                      placeholder: "54000",
                      required: false,
                    },
                  ].map((field) => (
                    <div
                      key={field.key}
                      className={field.colSpan === 2 ? "sm:col-span-2" : ""}
                    >
                      <label
                        className="font-dm text-[10px] tracking-[0.25em] uppercase block mb-2 font-medium"
                        style={{ color: "#8A6A58" }}
                      >
                        {field.label}
                      </label>
                      <input
                        type="text"
                        placeholder={field.placeholder}
                        value={form[field.key]}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            [field.key]: e.target.value,
                          }))
                        }
                        className="input-soft w-full px-4 py-3 text-sm"
                        required={field.required}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment */}
              <div className="panel-soft rounded-3xl p-6 border shadow-soft">
                <h2
                  className="font-playfair text-2xl text-[#2D1810] italic mb-6"
                  style={{ fontFamily: "Playfair Display,serif" }}
                >
                  Payment Method
                </h2>
                <div className="space-y-3">
                  {PAYMENT_METHODS.map((pm) => (
                    <label
                      key={pm.value}
                      className={`flex items-center gap-4 rounded-2xl p-4 border cursor-pointer transition-all ${form.paymentMethod === pm.value ? "shadow-petal" : "hover:border-rose-200"}`}
                      style={
                        form.paymentMethod === pm.value
                          ? { background: "#FFF5EC", borderColor: "#F5C6D0" }
                          : { borderColor: "rgba(212,118,10,0.12)" }
                      }
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={pm.value}
                        checked={form.paymentMethod === pm.value}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            paymentMethod: e.target.value,
                          }))
                        }
                        className="hidden"
                      />
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0`}
                        style={
                          form.paymentMethod === pm.value
                            ? { borderColor: "#D4760A" }
                            : { borderColor: "rgba(212,118,10,0.12)" }
                        }
                      >
                        {form.paymentMethod === pm.value && (
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ background: "#D4760A" }}
                          />
                        )}
                      </div>
                      <span className="text-xl">{pm.icon}</span>
                      <div>
                        <p className="font-dm text-sm text-[#2D1810] font-semibold">
                          {pm.label}
                        </p>
                        <p
                          className="font-dm text-[10px] tracking-wider"
                          style={{ color: "#8A6A58" }}
                        >
                          {pm.desc}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="panel-soft rounded-3xl p-6 border shadow-soft">
                <label
                  className="font-dm text-[10px] tracking-[0.25em] uppercase block mb-3 font-medium"
                  style={{ color: "#8A6A58" }}
                >
                  Order Notes (Optional)
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, notes: e.target.value }))
                  }
                  placeholder="Any special instructions..."
                  rows={3}
                  className="input-soft w-full px-4 py-3 text-sm resize-none"
                />
              </div>
            </div>

            {/* Right - Summary */}
            <div className="lg:col-span-2">
              <div className="panel-soft rounded-3xl p-6 border shadow-soft sticky top-28">
                <h2
                  className="font-playfair text-2xl text-[#2D1810] italic mb-6"
                  style={{ fontFamily: "Playfair Display,serif" }}
                >
                  Order Summary
                </h2>
                <div className="space-y-3 mb-6">
                  {cart.map((item) => {
                    const p = item.product;
                    if (!p) return null;
                    return (
                      <div key={item._id} className="flex gap-3">
                        <div
                          className="w-12 h-14 relative rounded-2xl overflow-hidden flex-shrink-0 border"
                          style={{ borderColor: "rgba(212,118,10,0.12)" }}
                        >
                          <Image
                            src={p.images?.[0] || ""}
                            alt={p.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className="font-playfair text-sm text-[#2D1810] italic line-clamp-1"
                            style={{ fontFamily: "Playfair Display,serif" }}
                          >
                            {p.name}
                          </p>
                          {item.size && (
                            <p
                              className="font-dm text-[10px]"
                              style={{ color: "#8A6A58" }}
                            >
                              Size: {item.size} · ×{item.quantity}
                            </p>
                          )}
                        </div>
                        <p
                          className="font-dm text-xs font-semibold flex-shrink-0"
                          style={{ color: "#D4760A" }}
                        >
                          PKR {(p.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <div className="lace-divider mb-4" />
                <div className="space-y-2 text-xs font-dm mb-6">
                  <div className="flex justify-between">
                    <span
                      className="uppercase tracking-wider"
                      style={{ color: "#8A6A58" }}
                    >
                      Subtotal
                    </span>
                    <span className="text-[#2D1810] font-medium">
                      PKR {cartTotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span
                      className="uppercase tracking-wider"
                      style={{ color: "#8A6A58" }}
                    >
                      Shipping
                    </span>
                    <span
                      style={
                        shipping === 0
                          ? { color: "#7AA364", fontWeight: 600 }
                          : {}
                      }
                    >
                      {shipping === 0 ? "FREE" : `PKR ${shipping}`}
                    </span>
                  </div>
                  <div className="lace-divider" />
                  <div className="flex justify-between items-center">
                    <span className="font-semibold uppercase tracking-wider text-sm text-[#2D1810]">
                      Total
                    </span>
                    <span
                      className="font-playfair text-2xl font-semibold"
                      style={{
                        color: "#D4760A",
                        fontFamily: "Playfair Display,serif",
                      }}
                    >
                      PKR {total.toLocaleString()}
                    </span>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-rose w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-xs"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    `Place Order — PKR ${total.toLocaleString()} 🌸`
                  )}
                </button>
                <p
                  className="text-center font-dm text-[10px] mt-3 tracking-wider"
                  style={{ color: "rgba(155,123,132,0.5)" }}
                >
                  🔒 Secure & encrypted checkout
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

