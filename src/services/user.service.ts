import UserModel from "@/models/user.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { SignupInput } from "@/schemas/signupSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { generateVerificationCode } from "@/utils/generateVerificationCode";

const VERIFICATION_CODE_EXPIRY_MS = 60 * 60 * 1000;

export async function registerUser(input: SignupInput): Promise<ApiResponse> {
  const { username, email, password } = input;

  const existingVerifiedUser = await UserModel.findOne({
    username,
    isVerified: true,
  });
  if (existingVerifiedUser) {
    return {
      success: false,
      message: "User with this username already exists",
    };
  }

  const existingUser = await UserModel.findOne({ email });
  const verifyCode = generateVerificationCode();
  const verifyCodeExpiry = new Date(Date.now() + VERIFICATION_CODE_EXPIRY_MS);

  if (existingUser) {
    if (existingUser?.isVerified) {
      return { success: false, message: "User already exists with this email" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    existingUser.password = hashedPassword;
    existingUser.verifyCode = verifyCode;
    existingUser.verifyCodeExpiry = verifyCodeExpiry;
    await existingUser.save();
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
      verifyCode,
      verifyCodeExpiry,
      isVerified: false,
      isAcceptingMessages: true,
      messages: [],
    });
    await newUser.save();
  }

  const emailResult = await sendVerificationEmail(email, username, verifyCode);
  if (!emailResult.success) {
    console.error("Failed to send verification email:", emailResult.message);
    return {
      success: false,
      message: emailResult?.message ?? "Failed to send email",
    };
  }

  return {
    success: true,
    message: "User registered successfully. Please verify your account.",
  };
}
