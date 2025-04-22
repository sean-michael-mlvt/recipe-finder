import mongoose, {Document, Schema, Model} from "mongoose";

// interface IngredientInterface {
//     _id: string, 
//     name: string
// }

export interface UserInterface extends Document {
    username: string,
    email: string,
    password: string,
    // pantry: IngredientInterface[]
};

// const ingredientSchema = new Schema<IngredientInterface>({
//     _id: { type: String, required: true },
//     name: { type: String, required: true }
// });

const userSchema = new Schema<UserInterface>({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // pantry: { type: [ingredientSchema], required: true }
});

const User: Model<UserInterface> = mongoose.models.User || mongoose.model<UserInterface>("User", userSchema);
export default User;