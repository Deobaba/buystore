import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    sellerInfo: { type: String, required: true },
    externalLink: { type: String, required: true },
    referralCode:{type:String, required: true},
    additionalFeatures:{type:String, required: true},
    clicks: { type: Number, default: 0 },
    share: { type: Number, default: 0 },
    images: [{ type: String }], // Array of image URLs
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

export interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  referralCode:string
  additionalFeatures:string
  category: string;
  clicks: number;
  share: number;
  sellerInfo: string;
  externalLink: string;
  images: string[]; // Array of image URLs
  createdAt?: Date; // Optional, since it will be auto-generated
  updatedAt?: Date; // Optional, since it will be auto-generated
}

// Export the model or retrieve the existing model
export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
