import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/lib/user";

export async function PUT(req: NextRequest) {
  await dbConnect();

  try {
    const { userId, oldPassword, newPassword } = await req.json();

    // Validate input
    if (!userId || !oldPassword || !newPassword) {
      return NextResponse.json(
        { error: "User ID, old password, and new password are required" },
        { status: 400 }
      );
    }

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if the old password matches the stored hash
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Old password is incorrect" },
        { status: 400 }
      );
    }

    // Hash the new password
    user.password = await bcrypt.hash(newPassword,10);

    await user.save();

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error changing password:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
