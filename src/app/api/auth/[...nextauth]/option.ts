import { NextAuthOptions, Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { JWT } from "next-auth/jwt";

/**
 * Custom error class for authentication errors
 */
class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

/**
 * NextAuth configuration options
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: {
          label: "Email or Username",
          type: "text",
          placeholder: "Enter your email or username",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      async authorize(credentials): Promise<User> {
        if (!credentials?.identifier || !credentials?.password) {
          throw new AuthError(
            "Please provide both email/username and password"
          );
        }

        try {
          await dbConnect();

          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier.toLowerCase() },
              { username: credentials.identifier.toLowerCase() },
            ],
          }).lean();

          if (!user) {
            throw new AuthError("No user found with this email or username");
          }

          if (!user.isVerified) {
            throw new AuthError("Please verify your account before logging in");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordCorrect) {
            throw new AuthError("Incorrect password");
          }

          const userId = user._id.toString();
          return {
            id: userId,
            _id: userId,
            username: user.username,
            email: user.email,
            isVerified: user.isVerified,
            isAcceptingMessage: user.isAcceptingMessage,
          };
        } catch (err) {
          if (err instanceof AuthError) {
            throw err;
          }
          console.error("Authentication error:", err);
          throw new AuthError("Authentication failed. Please try again later.");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }): Promise<JWT> {
      if (user) {
        token._id = user._id;
        token.username = user.username;
        token.isVerified = user.isVerified;
        token.isAcceptingMessage = user.isAcceptingMessage;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }): Promise<Session> {
      if (token && session.user) {
        session.user._id = token._id;
        session.user.username = token.username;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessage = token.isAcceptingMessage;
        session.user.email = token.email;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  logger: {
    error(code, metadata) {
      console.error(`[NextAuth] Error: ${code}`, metadata);
    },
    warn(code) {
      console.warn(`[NextAuth] Warning: ${code}`);
    },
    debug(code, metadata) {
      if (process.env.NODE_ENV === "development") {
        console.debug(`[NextAuth] Debug: ${code}`, metadata);
      }
    },
  },
};
