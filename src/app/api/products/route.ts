import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary, uploadToS3 } from "@/utils/upload";

import dbConnect from "@/lib/mongoose";
import Product from "@/lib/product";


export async function POST(req: Request, res: NextResponse) {
  await dbConnect();
  try {
    const data = await req.json();

    if (!data) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { productName, description, price, category, sellerInfo, externalLink, images } = data;

    // Validate required fields
    if (!productName || !description || !price || !category || !sellerInfo || !externalLink || !images?.length) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const uploadService = "cloudinary";

    const uploadedImageUrls = await Promise.all(
      images.map(async (image: { name: string; data: string; type: string }) => {
        if (uploadService === "cloudinary") {
          return await uploadToCloudinary(image);
        } else if (uploadService === "s3") {
          return await uploadToS3(image);
        } else {
          throw new Error("Invalid upload service");
        }
      })
    );

    const productData = {
      name: productName,
      description,
      price: parseFloat(price),
      category,
      sellerInfo,
      externalLink,
      images: uploadedImageUrls,
    };
    console.log("Product Data:", productData);

let product;
try {
  product = await Product.create(productData);
  
  console.log("Database Inserted Product:", product);
} catch (dbError:any) {
  console.error("Error inserting product into database:", dbError);
  return NextResponse.json(
    { error: "Database error", details: dbError.message },
    { status: 500 }
  );
}  
const plainProduct = product.toObject();

return NextResponse.json(plainProduct, { status: 201 });
  } catch (error : any) {
    console.error("Error processing request:", error);

    if (error.name === "ValidationError") {
      return NextResponse.json(
        { error: "Validation error", details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get all products or filter by parameters
export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const filters: { [key: string]: any } = {};

    // Add filtering parameters
    const category = searchParams.get("category");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sellerInfo = searchParams.get("sellerInfo");

    if (category) filters.category = category;
    if (minPrice) filters.price = { ...filters.price, $gte: parseFloat(minPrice) };
    if (maxPrice) filters.price = { ...filters.price, $lte: parseFloat(maxPrice) };
    if (sellerInfo) filters.sellerInfo = sellerInfo;

    const products = await Product.find(filters).lean();

    // console.log(products)
    return NextResponse.json(products, { status: 200 });
  } catch (error:any) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}


