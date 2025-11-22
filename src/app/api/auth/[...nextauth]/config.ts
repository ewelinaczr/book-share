import { AuthOptions, JWT } from "next-auth";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "@/utils/db";
import { Session } from "next-auth";
import User, { IUser } from "../../../../../server/models/userModel";

const AUTH_SECRET = process.env.AUTH_SECRET!;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

export const authConfig: AuthOptions = {
  providers: [
    // Google OAuth provider
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
    // Custom credentials-based login
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // When a user attempts to log in with email/password
      authorize: async (credentials) => {
        await connectToDatabase(); //Ensure DB is connected
        if (!credentials?.email || !credentials?.password) return null;

        // Find user in MongoDB and include password field
        const userDoc = (await User.findOne({
          email: credentials.email,
        }).select("+password")) as IUser;

        // If user not found or password missing, reject login
        if (!userDoc || !userDoc.password) return null;

        // Compare provided password with hashed password in DB
        const isValid = await bcrypt.compare(
          credentials.password,
          userDoc.password
        );
        if (!isValid) return null;

        // Return a plain object with required fields for NextAuth
        return {
          id: (userDoc._id as mongoose.Types.ObjectId).toString(),
          name: userDoc.name,
          email: userDoc.email,
          image: userDoc.photo || undefined,
        };
      },
    }),
  ],
  // Use JWT-based session strategy
  session: { strategy: "jwt" },
  jwt: {
    secret: AUTH_SECRET,
  },
  // Customize how JWT and session objects are built
  callbacks: {
    // Called when a JWT is created or updated
    async jwt({ token, user }) {
      if (user) {
        const { sign } = await import("jsonwebtoken");
        token.id = user.id;
        token.accessToken = sign({ id: user.id }, AUTH_SECRET, {
          expiresIn: "7d",
        });
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user && token?.id) {
        session.user.id = token.id;
        session.user.name = token.name ?? session.user.name;
        session.user.email = token.email ?? session.user.email;
        session.user.image = token.image;
      }
      session.token =
        typeof token.accessToken === "string" ? token.accessToken : undefined;
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectToDatabase();
        // Check if a user with this email already exists
        const existingUser = await User.findOne({ email: user.email });
        if (existingUser) {
          // If user exists but has no googleId, link it
          if (!existingUser.googleId) {
            existingUser.googleId = account.providerAccountId;
            await existingUser.save();
          }
        } else {
          // Create new user for first-time Google login
          await User.create({
            name: user.name,
            email: user.email,
            photo: user.image,
            googleId: account.providerAccountId,
          });
        }
      }
      return true;
    },
  },
};
