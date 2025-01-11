import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import User from "@/lib/user";
import {sendMail} from "@/utils/sendmail"; // Utility function to send emails

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { email } = await req.json();
    console.log("My email:", email)

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "User with this email does not exist" },
        { status: 404 }
      );
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set OTP and expiration time (5 minutes)
    user.resetPasswordOtp = otp;
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
    console.log(user)

    await user.save();

    // Send OTP via email
    const message = `
      Your password reset OTP is: ${otp}.
      It will expire in 30 minutes.
    `;

    await sendMail(email, "Password Reset Request", message);


    return NextResponse.json(
      { message: "Password reset email sent successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in forgot password:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}


export async function PUT(req: NextRequest) {
    await dbConnect();
  
    try {
      const { email, otp, newPassword } = await req.json();
  
      if (!email || !otp || !newPassword) {
        return NextResponse.json(
          { error: "Email, OTP, and new password are required" },
          { status: 400 }
        );
      }
  
      // Find the user by email
      const user = await User.findOne({ email });
  
      if (!user) {
        return NextResponse.json(
          { error: "User with this email does not exist" },
          { status: 404 }
        );
      }
  
      // Verify OTP and check expiration
      if (user.resetPasswordOtp !== otp || user.resetPasswordExpire < Date.now()) {
        return NextResponse.json(
          { error: "Invalid or expired OTP" },
          { status: 400 }
        );
      }
  
      // Hash the new password and update the user's record
      user.password = await bcrypt.hash(newPassword,10);
  
      // Clear OTP fields
      user.resetPasswordOtp = undefined;
      user.resetPasswordExpire = undefined;
  
      await user.save();
  
      return NextResponse.json(
        { message: "Password reset successfully" },
        { status: 200 }
      );
    } catch (error: any) {
      console.error("Error in reset password:", error);
      return NextResponse.json(
        { error: "Internal server error", details: error.message },
        { status: 500 }
      );
    }
  }
