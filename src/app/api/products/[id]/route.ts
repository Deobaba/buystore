import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Product from "@/lib/product";

export const dynamic = "force-dynamic"; // Prevent static optimization

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

// Edit product by ID
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  await dbConnect();

  try {
    const body = await req.json();

    // Validate input
    if (!id || Object.keys(body).length === 0) {
      return NextResponse.json(
        { error: "Product ID and update data are required" },
        { status: 400 }
      );
    }

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      body, // Fields to update
      { new: true, runValidators: true } // Return updated document and validate input
    ).lean();

    if (!updatedProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error: any) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}



// Delete product by ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  await dbConnect();

  try {
    // Validate product ID
    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Find and delete the product
    const deletedProduct = await Product.findByIdAndDelete(id).lean();

    if (!deletedProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Product deleted successfully", product: deletedProduct },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
