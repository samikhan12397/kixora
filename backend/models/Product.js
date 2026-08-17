import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    sku: { type: String, required: true, unique: true },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    gender: { type: String, enum: ["men", "women", "unisex", "kids"], default: "unisex" },
    sizes: [{ type: Number }],
    colors: [{ type: String }],
    material: String,
    condition: { type: String, enum: ["new", "like-new", "good", "fair"], default: "good" },
    price: { type: Number, required: true },
    discountPercent: { type: Number, default: 0 },
    stock: { type: Number, required: true, default: 0 },
    description: String,
    features: [String],
    images: [String],
    images360: [String], // optional turntable photo sequence for the 360° viewer
    video: String,
    tags: [String],
    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isLimitedEdition: { type: Boolean, default: false },
    ratingAverage: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", tags: "text", description: "text" });

productSchema.virtual("finalPrice").get(function () {
  return +(this.price - (this.price * this.discountPercent) / 100).toFixed(2);
});
productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

export default mongoose.model("Product", productSchema);
