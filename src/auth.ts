import { authConfig } from "./auth.config";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "./models/UserSchema";
import connectMongoDB from "../config/mongodb";

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    ...authConfig,
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials) return null;

        await connectMongoDB();

        try {
          const user = await User.findOne({ email: credentials.email }).lean();

          if (!user) {
            console.log("User not found");
            return null;
          }

          //Await password comparison to properly verify authentication
          const isMatch = await bcrypt.compare(credentials.password, user.password);


          // checking to make sure authentication is right
          if (isMatch) {
            return {
              id: user._id.toString(),
              email: user.email,
              name: user.username,
            };
          } else {
            console.log("Email or Password is not correct");
            return null;
          }
        } catch (error: any) {
          console.log("An error occurred: ", error);
          return null;
        }
      },
    }),
  ],
});
