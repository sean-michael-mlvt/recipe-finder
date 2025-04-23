import mongoose, {Document, Schema, Model} from "mongoose";

// Schema for User in MongoDB

export interface UserInterface extends Document {
    username: string,
    email: string,
    password: string,
};


const userSchema = new Schema<UserInterface>({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Create the Mongoose Model
const User: Model<UserInterface> = mongoose.models.User || mongoose.model<UserInterface>("User", userSchema);
export default User;