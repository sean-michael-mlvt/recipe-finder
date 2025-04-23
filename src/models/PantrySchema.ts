import mongoose, { Schema, Document, Model } from "mongoose";

// Schema for the Pantry collection in MongoDB

interface Ingredient {
  _id: string;
  name: string;
}

export interface IPantry extends Document {
  owner: mongoose.Types.ObjectId; 
  ingredients: Ingredient[]; // array of Pantry details
}

const pantrySchema = new Schema<IPantry>({
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  ingredients: [
    {
      _id: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
  ],
});

// Create the Mongoose Model
const Pantry: Model<IPantry> = mongoose.models.Pantry || mongoose.model<IPantry>("Pantry", pantrySchema);
export default Pantry;
