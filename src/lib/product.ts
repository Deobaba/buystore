import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    sellerInfo: { type: String, required: true },
    externalLink: { type: String, required: true },
    images: [{ type: String }], // Array of image URLs
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  sellerInfo: string;
  externalLink: string;
  images: string[]; // Array of image URLs
  createdAt?: Date; // Optional, since it will be auto-generated
  updatedAt?: Date; // Optional, since it will be auto-generated
}

// Export the model or retrieve the existing model
export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
