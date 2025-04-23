// app/api/saved-recipes/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "../../../../config/mongodb"; 
import User from "@/models/UserSchema"; 
import SavedRecipes, { ISavedRecipeItem } from "@/models/SavedRecipesSchema";


 // @description Add a recipe to the user's saved recipes list.
export async function POST(request: NextRequest) {
  try {
    const { email, recipe } = await request.json() as { email: string, recipe: ISavedRecipeItem };

    if (!email || !recipe || !recipe.recipeId || !recipe.title || !recipe.image) {
      return NextResponse.json({ message: "Missing required fields: email and recipe details (recipeId, title, image)" }, { status: 400 });
    }

    await connectMongoDB();

    // 1. Find the user by email
    const user = await User.findOne({ email }).lean(); 
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const result = await SavedRecipes.findOneAndUpdate(
      { owner: user._id },
      { $addToSet: { recipes: recipe } }, // Add the recipe object to the array if it's not already present
      {
        upsert: true,
        new: true
      }
    );

    // Check if the recipe was actually added (it wouldn't be if it was a duplicate)
    return NextResponse.json({ message: "Recipe saved successfully" }, { status: 200 });

  } catch (error) {
    console.error("POST saved-recipes error:", error);
    return NextResponse.json({ message: "Error saving recipe" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ message: "Missing email query parameter" }, { status: 400 });
  }

  try {
    await connectMongoDB();

    // 1. Find the user by email
    const user = await User.findOne({ email }).lean();
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // 2. Find the saved recipes document for this user
    const savedRecipesDoc = await SavedRecipes.findOne({ owner: user._id }).lean();

    // If no document found, return empty array.
    if (!savedRecipesDoc) {
      return NextResponse.json({ recipes: [] }, { status: 200 });
    }

    // Return the array of saved recipes
    return NextResponse.json({ recipes: savedRecipesDoc.recipes }, { status: 200 });

  } catch (error) {
    console.error("GET saved-recipes error:", error);
    return NextResponse.json({ message: "Error retrieving saved recipes" }, { status: 500 });
  }
}


 //Remove a recipe from the user's saved recipes list.

export async function DELETE(request: NextRequest) {
    try {
      const { email, recipeId } = await request.json() as { email: string, recipeId: string|number };

      if (!email || !recipeId) {
        return NextResponse.json({ message: "Missing required fields: email and recipeId" }, { status: 400 });
      }

      await connectMongoDB();

      // 1. Find the user by email
      const user = await User.findOne({ email }).lean();
      if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }

      // 2. Find the user's saved recipes document and remove the specific recipe

      const result = await SavedRecipes.updateOne(
        { owner: user._id },
        { $pull: { recipes: { recipeId: recipeId } } } // Remove the item from the array where recipeId matches
      );

      // Check if any document was modified
      if (result.modifiedCount === 0) {

         const docExists = await SavedRecipes.countDocuments({ owner: user._id });
         if (!docExists) {
            return NextResponse.json({ message: "Saved recipes document not found for user" }, { status: 404 });
         }

         return NextResponse.json({ message: "Recipe not found in saved list or already removed" }, { status: 404 });
      }

      return NextResponse.json({ message: "Recipe removed successfully" }, { status: 200 });

    } catch (error) {
      console.error("DELETE saved-recipes error:", error);
      return NextResponse.json({ message: "Error removing recipe" }, { status: 500 });
    }
  }