import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "../../../../config/mongodb";
import Pantry from "@/models/PantrySchema";
import User from "@/models/UserSchema";

export async function PUT(request: NextRequest) {
  const { email, ingredients } = await request.json();

  await connectMongoDB();

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const result = await Pantry.updateOne(
      { owner: user._id },
      { $set: { ingredients } },
      { upsert: true }
    );

    const existingPantryPresent = result.matchedCount > 0;

    return NextResponse.json(
      { message: existingPantryPresent ? "Pantry updated" : "Pantry created" },
      { status: existingPantryPresent ? 200 : 201 }
    );
  } catch (error) {
    console.error("Pantry error:", error);
    return NextResponse.json({ message: "Error saving pantry" }, { status: 500 });
  }
}
