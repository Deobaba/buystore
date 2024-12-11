import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import dbConnect from "@/lib/mongoose";
import User from "@/lib/user";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const data = await req.json();

    // Validate request body
    const { firstName, lastName, email, password } = data;
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const userData = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
    };

    const newUser = await User.create(userData);

    // Omit sensitive data (like the password) from the response
    const { password: _, ...userResponse } = newUser.toObject();

    return NextResponse.json(userResponse, { status: 201 });
  } catch (error: any) {
    console.error("Error processing signup:", error);

    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
