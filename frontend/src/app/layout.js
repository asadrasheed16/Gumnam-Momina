import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import AIAgent from "@/components/AIAgent";

export const metadata = {
  title: "Gumnam Momina ✿ Luxury Islamic Fashion",
  description:
    "Handcrafted abayas, hijabs, prayer chadars and Islamic accessories for the modern Muslim woman.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Toaster
                position="top-center"
                toastOptions={{
                  style: {
                    background: "rgba(255,249,242,0.97)",
                    backdropFilter: "blur(20px)",
                    color: "#2D1810",
                    border: "1px solid rgba(212,118,10,0.18)",
                    fontFamily: "'DM Sans', sans-serif",
                    borderRadius: "14px",
                    boxShadow: "0 8px 30px rgba(212,118,10,0.12)",
                  },
                  success: {
                    iconTheme: { primary: "#D4760A", secondary: "#FFF9F2" },
                  },
                }}
              />
              <Navbar />
              <CartDrawer />
              <main>{children}</main>
              <Footer />
              <AIAgent />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
