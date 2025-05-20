import "next-auth";
import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Extended User type for our application
   * @extends DefaultUser
   */
  interface User extends DefaultUser {
    /** MongoDB document ID */
    _id: string;
    /** User's unique username */
    username: string;
    /** Whether the user's email is verified */
    isVerified: boolean;
    /** Whether the user is accepting messages */
    isAcceptingMessage: boolean;
    /** User's email address */
    email: string;
  }

  /**
   * Extended Session type for our application
   * @extends DefaultSession
   */
  interface Session {
    user: {
      /** MongoDB document ID */
      _id: string;
      /** User's unique username */
      username: string;
      /** Whether the user's email is verified */
      isVerified: boolean;
      /** Whether the user is accepting messages */
      isAcceptingMessage: boolean;
      /** User's email address */
      email: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  /**
   * Extended JWT type for our application
   * @extends DefaultJWT
   */
  interface JWT extends DefaultJWT {
    /** MongoDB document ID */
    _id: string;
    /** User's unique username */
    username: string;
    /** Whether the user's email is verified */
    isVerified: boolean;
    /** Whether the user is accepting messages */
    isAcceptingMessage: boolean;
    /** User's email address */
    email: string;
  }
}

// Export types for use in other files
export type { User, Session, JWT };
