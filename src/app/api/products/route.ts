import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary, uploadToS3 } from "@/utils/upload";
import UserModel, { User } from "@/lib/user";
import dbConnect from "@/lib/mongoose";
import Product from "@/lib/product";
import { authenticateUser } from "@/lib/auth";
import { cache } from "@/lib/cache";


export async function POST(req: Request, res: NextResponse) {
  await dbConnect();
  try {

    const user = await authenticateUser(req);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or missing token" },
        { status: 401 }
      );
    }
    const data = await req.json();

    if (!data) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { productName, description, price, category, sellerInfo, externalLink, images, referralCode, additionalFeatures } = data;

    // Validate required fields
    if (!productName || !description || !price || !category || !sellerInfo || !externalLink || !images?.length || !referralCode) {
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
      referralCode,
      additionalFeatures,
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

 cache.clear(); // Clear cache to reflect the new product

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

// Get all products or filter by parameters with pagination
export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const filters: { [key: string]: any } = {};

    // Extract query parameters
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sellerInfo = searchParams.get("sellerInfo");

    if (search) {
      const numericSearch = parseFloat(search);
      filters.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { sellerInfo: { $regex: search, $options: "i" } },
        ...(isNaN(numericSearch) ? [] : [{ price: numericSearch }]),
      ];
    }

    if (category) filters.category = category;
    if (minPrice) filters.price = { ...filters.price, $gte: parseFloat(minPrice) };
    if (maxPrice) filters.price = { ...filters.price, $lte: parseFloat(maxPrice) };
    if (sellerInfo) filters.sellerInfo = sellerInfo;

    // Pagination
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    // Create a unique cache key based on filters and pagination
    const cacheKey = `products:${JSON.stringify(filters)}:page:${page}:limit:${limit}`;

    // Check cache first
    if (cache.has(cacheKey)) {
      console.log("Returning cached data...");
      return NextResponse.json(cache.get(cacheKey), { status: 200 });
    }

    // Fetch products from DB
    const products = await Product.find(filters)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    const totalCount = await Product.countDocuments(filters);

    const pagination = {
      totalItems: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      pageSize: limit,
    };

    const responseData = { products, pagination };

    // Store in cache
    cache.set(cacheKey, responseData);

    return NextResponse.json(responseData, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}


