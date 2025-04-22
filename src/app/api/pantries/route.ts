import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "../../../../config/mongodb";
import Pantry from "@/models/PantrySchema";
import User from "@/models/UserSchema";

export async function POST(request: NextRequest) {
    const { email, ingredients } = await request.json();

    await connectMongoDB();

    const user = await User.findOne({ email });

    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    await Pantry.create({
        owner: user._id,
        ingredients: ingredients,
    });

    return NextResponse.json({ message: "Pantry saved" }, { status: 201 });
}   

