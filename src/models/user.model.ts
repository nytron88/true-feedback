import mongoose, { Schema, Document, Types } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export interface User extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  username: string;
  verifyCode?: string;
  verifyCodeExpiry?: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters long"],
  },
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
  },
  verifyCode: {
    type: String,
  },
  verifyCodeExpiry: {
    type: Date,
  },
  isVerified: {
    type: Boolean,
    required: [true, "Verified status required"],
    default: false,
  },
  isAcceptingMessage: {
    type: Boolean,
    default: false,
  },
  messages: {
    type: [MessageSchema],
    default: [],
  },
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
