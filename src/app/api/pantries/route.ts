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


export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
  
    if (!email) {
      return NextResponse.json({ message: "Missing email query parameter" }, { status: 400 });
    }
  
    await connectMongoDB();
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }
  
      const pantry = await Pantry.findOne({ owner: user._id });
  
      if (!pantry) {
        return NextResponse.json({ message: "Pantry not found" }, { status: 404 });
      }
  
      return NextResponse.json({ ingredients: pantry.ingredients }, { status: 200 });
    } catch (error) {
      console.error("GET pantry error:", error);
      return NextResponse.json({ message: "Error retrieving pantry" }, { status: 500 });
    }
  }