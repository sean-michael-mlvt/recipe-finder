import mongoose, { Schema, Document, models, Model } from "mongoose";

// Schema for the Saved-recipes collection in MongoDB

interface ISavedRecipeItem {
  recipeId: number | string; 
  title: string;
  image: string;

}

interface ISavedRecipes extends Document {
  owner: mongoose.Schema.Types.ObjectId;
  recipes: ISavedRecipeItem[]; // Array of saved recipe details
}

const SavedRecipeItemSchema: Schema = new Schema({
  recipeId: { type: Schema.Types.Mixed, required: true },
  title: { type: String, required: true },
  image: { type: String, required: true },

}, { _id: false });

const SavedRecipesSchema: Schema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
    unique: true 
  },
  recipes: [SavedRecipeItemSchema] // Array of saved recipes
}, { timestamps: true });

// Create the Mongoose model
const SavedRecipes: Model<ISavedRecipes> = models.SavedRecipes || mongoose.model<ISavedRecipes>("SavedRecipes", SavedRecipesSchema);

export default SavedRecipes;
export type { ISavedRecipeItem };  