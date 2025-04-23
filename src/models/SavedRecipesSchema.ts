// models/SavedRecipesSchema.ts
import mongoose, { Schema, Document, models, Model } from "mongoose";

// Define the structure of a single saved recipe item within the array
interface ISavedRecipeItem {
  recipeId: number | string; // Use the type provided by Spoonacular (number or string)
  title: string;
  image: string;
  // Add any other recipe fields you want to save, e.g., sourceUrl, summary
}

// Define the main document structure holding the saved recipes for a user
interface ISavedRecipes extends Document {
  owner: mongoose.Schema.Types.ObjectId; // Link to the User document
  recipes: ISavedRecipeItem[]; // Array of saved recipe details
}

// Schema for the individual recipe item (no separate _id needed usually)
const SavedRecipeItemSchema: Schema = new Schema({
  recipeId: { type: Schema.Types.Mixed, required: true }, // Use Mixed if ID can be number or string
  title: { type: String, required: true },
  image: { type: String, required: true },
  // Add other fields here if needed
}, { _id: false }); // Prevent Mongoose from creating an _id for each item in the array


// Main schema for the collection
const SavedRecipesSchema: Schema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to your User model
    required: true,
    unique: true // Ensures one document per user
  },
  recipes: [SavedRecipeItemSchema] // Array of saved recipes
}, { timestamps: true }); // Automatically add createdAt and updatedAt fields

// Create the Mongoose model
// Check if the model already exists before defining it
const SavedRecipes: Model<ISavedRecipes> = models.SavedRecipes || mongoose.model<ISavedRecipes>("SavedRecipes", SavedRecipesSchema);

export default SavedRecipes;
// Export the interface if needed elsewhere
export type { ISavedRecipeItem };