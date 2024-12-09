import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongoose";
import UserModel, { User } from "@/lib/user";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const data = await req.json();

    // Validate request body
    const { email, password } = data;
    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing required fields: email and password" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = (await UserModel.findOne({ email }).lean()) as User | null;
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET!, // Replace with your environment variable
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    // Return token and user data
    return NextResponse.json(
      {
        token
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error processing sign-in:", error);

    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
