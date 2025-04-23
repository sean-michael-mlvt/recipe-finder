// app/api/saved-recipes/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "../../../../config/mongodb"; // Adjust path as needed
import User from "@/models/UserSchema"; // Adjust path as needed
import SavedRecipes, { ISavedRecipeItem } from "@/models/SavedRecipesSchema"; // Adjust path as needed

/**
 * @description Add a recipe to the user's saved recipes list.
 * Expects JSON body: { email: string, recipe: ISavedRecipeItem }
 * ISavedRecipeItem requires at least { recipeId: string|number, title: string, image: string }
 */
export async function POST(request: NextRequest) {
  try {
    const { email, recipe } = await request.json() as { email: string, recipe: ISavedRecipeItem };

    // Basic validation
    if (!email || !recipe || !recipe.recipeId || !recipe.title || !recipe.image) {
      return NextResponse.json({ message: "Missing required fields: email and recipe details (recipeId, title, image)" }, { status: 400 });
    }

    await connectMongoDB();

    // 1. Find the user by email
    const user = await User.findOne({ email }).lean(); // Use lean for efficiency if only _id is needed
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // 2. Find the user's saved recipes document or create it if it doesn't exist.
    //    Add the new recipe to the 'recipes' array, preventing duplicates.
    //    Using $addToSet checks the entire object for duplication.
    const result = await SavedRecipes.findOneAndUpdate(
      { owner: user._id }, // Find the document belonging to this user
      { $addToSet: { recipes: recipe } }, // Add the recipe object to the array if it's not already present
      {
        upsert: true, // Create the document if it doesn't exist for this user
        new: true     // Return the updated document (optional, useful for debugging)
      }
    );

    // Check if the recipe was actually added (it wouldn't be if it was a duplicate)
    // This check is a bit tricky with findOneAndUpdate + $addToSet alone,
    // as it returns the document regardless. A more robust check might involve
    // comparing the array size before and after, but for simplicity,
    // we assume success if the operation didn't error out.
    // A 200 OK status implies the operation succeeded (either added or already existed).

    return NextResponse.json({ message: "Recipe saved successfully" }, { status: 200 });

  } catch (error) {
    console.error("POST saved-recipes error:", error);
    return NextResponse.json({ message: "Error saving recipe" }, { status: 500 });
  }
}

/**
 * @description Get all saved recipes for a specific user.
 * Expects query parameter: ?email=user@example.com
 */
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
    const savedRecipesDoc = await SavedRecipes.findOne({ owner: user._id }).lean(); // Use lean() for performance

    // If no document found, the user hasn't saved any recipes yet. Return empty array.
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

/**
 * @description Remove a recipe from the user's saved recipes list.
 * Expects JSON body: { email: string, recipeId: string|number }
 */
export async function DELETE(request: NextRequest) {
    try {
      const { email, recipeId } = await request.json() as { email: string, recipeId: string|number };

      // Basic validation
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
      //    using $pull based on the recipeId.
      const result = await SavedRecipes.updateOne(
        { owner: user._id }, // Find the document belonging to this user
        { $pull: { recipes: { recipeId: recipeId } } } // Remove the item from the array where recipeId matches
      );

      // Check if any document was modified
      if (result.modifiedCount === 0) {
         // Could mean user/pantry not found, or recipe wasn't in the list
         // Check if the document exists at all first
         const docExists = await SavedRecipes.countDocuments({ owner: user._id });
         if (!docExists) {
            return NextResponse.json({ message: "Saved recipes document not found for user" }, { status: 404 });
         }
         // If doc exists but nothing removed, the recipe wasn't saved
         return NextResponse.json({ message: "Recipe not found in saved list or already removed" }, { status: 404 }); // Or 200 OK with specific message
      }

      return NextResponse.json({ message: "Recipe removed successfully" }, { status: 200 });

    } catch (error) {
      console.error("DELETE saved-recipes error:", error);
      return NextResponse.json({ message: "Error removing recipe" }, { status: 500 });
    }
  }