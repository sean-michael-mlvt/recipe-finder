import { NextRequest, NextResponse } from "next/server";
import User from "@/models/UserSchema";
import bcrypt from "bcryptjs";
import connectMongoDB from "../../../../config/mongodb";

export const POST = async (request: NextRequest) => {
  try {
    const { username, email, password } = await request.json();
    console.log(username, email, password);

    await connectMongoDB();
    const hashedPassword = await bcrypt.hash(password, 5);

    // ✅ Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email has already been registered." },
        { status: 409 } // Use 409 Conflict status for duplicate entries
      );
    }

    // ✅ Create a new user
    await User.create({
      username,
      password: hashedPassword,
      email,
    });

    return NextResponse.json(
      { message: "User has been created." },
      { status: 201 }
    );

  } catch (e: any) {
    console.error("Signup error:", e);
    return NextResponse.json(
      { message: "An internal error occurred." },
      { status: 500 }
    );
  }
};
