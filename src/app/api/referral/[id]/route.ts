import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Product from "@/lib/product";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  await dbConnect();

  try {
    const { referralCode, action } = await req.json();

    // Validate input
    if (!id || !referralCode || !action) {
      return NextResponse.json(
        { error: "Product ID, referral code, and action are required" },
        { status: 400 }
      );
    }

    if (!["click", "share"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Must be 'click' or 'share'" },
        { status: 400 }
      );
    }

    // Determine the field to update based on action
    const updateField = action === "click" ? { clicks: 1 } : { share: 1 };

    // Find the product and increment the respective field
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: id, referralCode }, // Match both id and referralCode
      { $inc: updateField }, // Increment clicks or shares
      { new: true, runValidators: true } // Return the updated document
    ).lean();

    if (!updatedProduct) {
      return NextResponse.json(
        { error: "Product not found or invalid referral code" },
        { status: 404 }
      );
    }

    console.log(updatedProduct);

    return NextResponse.json(
      { message: `${action} count updated successfully`, product: updatedProduct },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
