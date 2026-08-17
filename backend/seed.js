import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Brand from "./models/Brand.js";
import Category from "./models/Category.js";
import Product from "./models/Product.js";

dotenv.config();

const brands = [
  { name: "Nike", slug: "nike" },
  { name: "Adidas", slug: "adidas" },
  { name: "New Balance", slug: "new-balance" },
  { name: "Asics", slug: "asics" },
  { name: "Vans", slug: "vans" },
  { name: "Converse", slug: "converse" },
  { name: "Puma", slug: "puma" },
  { name: "Jordan", slug: "jordan" },
];

const categories = [
  { name: "Running", slug: "running" },
  { name: "Basketball", slug: "basketball" },
  { name: "Casual", slug: "casual" },
  { name: "Lifestyle", slug: "lifestyle" },
  { name: "High Tops", slug: "high-tops" },
  { name: "Low Tops", slug: "low-tops" },
];

const run = async () => {
  await connectDB();

  console.log("Clearing existing data...");
  await Promise.all([
    User.deleteMany({ email: "admin@kixora.com" }),
    Brand.deleteMany(),
    Category.deleteMany(),
    Product.deleteMany(),
  ]);

  console.log("Seeding admin user...");
  await User.create({
    name: "Kixora Admin",
    email: "admin@kixora.com",
    password: "admin12345",
    role: "admin",
    isVerified: true,
  });

  console.log("Seeding brands and categories...");
  const createdBrands = await Brand.insertMany(brands);
  const createdCategories = await Category.insertMany(categories);

  const findBrand = (name) => createdBrands.find((b) => b.name === name)._id;
  const findCategory = (name) => createdCategories.find((c) => c.name === name)._id;

  console.log("Seeding sample products...");
  await Product.insertMany([
    {
      name: "Kixora Trail Runner",
      slug: "kixora-trail-runner",
      sku: "KX-001",
      brand: findBrand("Nike"),
      category: findCategory("Running"),
      gender: "unisex",
      sizes: [7, 8, 9, 10, 11],
      colors: ["Volt", "Cobalt", "Bone"],
      material: "Recycled knit",
      condition: "good",
      price: 148,
      discountPercent: 0,
      stock: 24,
      description: "Zero-gravity foam midsole with an all-terrain grip outsole.",
      features: ["Zero-gravity foam", "Recycled knit upper", "All-terrain grip"],
      images: [],
      tags: ["new", "running"],
      isFeatured: true,
      isNewArrival: true,
    },
    {
      name: "Kixora Court High",
      slug: "kixora-court-high",
      sku: "KX-002",
      brand: findBrand("Jordan"),
      category: findCategory("Basketball"),
      gender: "men",
      sizes: [8, 9, 10, 11, 12],
      colors: ["Signal Orange", "Bone"],
      material: "Leather",
      condition: "like-new",
      price: 189,
      discountPercent: 15,
      stock: 4,
      description: "High-top basketball silhouette with reinforced ankle support.",
      features: ["Reinforced ankle collar", "Herringbone traction"],
      images: [],
      tags: ["best-seller"],
      isBestSeller: true,
    },
    {
      name: "Kixora Street Low",
      slug: "kixora-street-low",
      sku: "KX-003",
      brand: findBrand("Vans"),
      category: findCategory("Casual"),
      gender: "unisex",
      sizes: [6, 7, 8, 9, 10],
      colors: ["Bone", "Flux Pink"],
      material: "Canvas",
      condition: "good",
      price: 79,
      discountPercent: 30,
      stock: 2,
      description: "Everyday low-top for city walking, priced for a flash sale.",
      features: ["Vulcanized rubber sole", "Reinforced toe cap"],
      images: [],
      tags: ["limited", "sale"],
      isLimitedEdition: true,
    },
  ]);

  console.log("✅ Seed complete. Admin login: admin@kixora.com / admin12345");
  process.exit(0);
};

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
