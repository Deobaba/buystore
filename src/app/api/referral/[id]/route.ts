import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Product, { IProduct } from "@/lib/product";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  await dbConnect();

  try {
    const { referralCode } = await req.json();

    // Validate input
    if (!id || !referralCode) {
      return NextResponse.json(
        { error: "Product ID and referral code are required" },
        { status: 400 }
      );
    }

    // Find the product and increment the clicks
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: id, referralCode }, // Match both id and referralCode
      { $inc: { clicks: 1 } }, // Increment clicks by 1
      { new: true, runValidators: true } // Return the updated document
    ).lean();

    if (!updatedProduct) {
      return NextResponse.json(
        { error: "Product not found or invalid referral code" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Click count updated successfully", product: updatedProduct },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating product clicks:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
