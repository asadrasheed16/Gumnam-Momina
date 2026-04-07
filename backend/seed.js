const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const products = require("./seed-products-full");

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/gumnam-momina";

// Keep schemas permissive for seed compatibility with all dataset variants.
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    role: { type: String, default: "user" },
    phone: String,
    cart: [],
  },
  { timestamps: true },
);

const productSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    price: Number,
    originalPrice: Number,
    category: {
      type: String,
      enum: [
        "Abaya",
        "Hijab",
        "Namaz Chadar",
        "Accessories",
        "Gift Sets",
        "Kids",
      ],
    },
    images: [String],
    sizes: [String],
    colors: [String],
    material: String,
    stock: Number,
    isAvailable: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    tags: [String],
    ratings: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    reviews: [],
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
const Product = mongoose.model("Product", productSchema);

async function seed() {
  console.log("\nGumnam Momina Database Seeder\n");

  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB:", MONGO_URI);

  await User.deleteOne({ email: "admin@gumnammomina.pk" });
  const hashedPassword = await bcrypt.hash("admin123456", 12);
  await User.create({
    name: "Admin",
    email: "admin@gumnammomina.pk",
    password: hashedPassword,
    role: "admin",
    phone: "+92 300 0000000",
    cart: [],
  });

  console.log("Admin user created");
  console.log("Email:    admin@gumnammomina.pk");
  console.log("Password: admin123456");

  await Product.deleteMany({});
  console.log("Old products cleared");

  const inserted = await Product.insertMany(products);
  console.log(`\n${inserted.length} products seeded successfully\n`);

  const categories = {};
  products.forEach((p) => {
    categories[p.category] = (categories[p.category] || 0) + 1;
  });

  Object.entries(categories).forEach(([category, count]) => {
    console.log(`${category.padEnd(16)} -> ${count} products`);
  });

  console.log("\nSummary:");
  console.log(
    `Featured products: ${products.filter((p) => p.isFeatured).length}`,
  );
  console.log(
    `New arrivals:      ${products.filter((p) => p.isNewArrival).length}`,
  );
  console.log(
    `Total stock units: ${products.reduce((acc, p) => acc + (p.stock || 0), 0)}`,
  );

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(async (err) => {
  console.error("\nSeed failed:", err.message);

  try {
    await mongoose.disconnect();
  } catch (_) {
    // ignore disconnect errors on failure path
  }

  process.exit(1);
});
