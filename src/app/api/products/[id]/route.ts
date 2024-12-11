import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Product from "@/lib/product";



// Get product by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    await dbConnect();
  
    try {
      const product = await Product.findById(id).lean();
  
      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
  
      return NextResponse.json(product, { status: 200 });
    } catch (error:any) {
      console.error("Error fetching product by ID:", error);
      return NextResponse.json(
        { error: "Internal server error", details: error.message },
        { status: 500 }
      );
    }
  }