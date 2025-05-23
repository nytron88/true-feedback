import UserModel from "@/models/user.model";
import mongoose from "mongoose";

export async function toggleAcceptMessage(
  acceptMessage: boolean,
  userId: string
) {
  const updatedUser = await UserModel.findByIdAndUpdate(
    userId,
    {
      isAcceptingMessage: acceptMessage,
    },
    { new: true }
  );

  if (!updatedUser) {
    return {
      success: false,
      message: "Failed to update user status to accept messages",
    };
  }

  return {
    success: true,
    message: "Messaged acceptance status updated successfully",
    updatedUser,
  };
}

export async function getAcceptMessage(userId: string) {
  const user = await UserModel.findById(userId);

  if (!user) {
    return { success: false, message: "User not found" };
  }

  return {
    success: true,
    message: "User message acceptance status fetched successfully",
    isAcceptingMessage: user.isAcceptingMessage,
  };
}

export async function getMessages(userId: string) {
  const user = await UserModel.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $unwind: "$messages",
    },
    {
      $sort: {
        "messages.createdAt": -1,
      },
    },
    {
      $group: {
        _id: "$_id",
        messages: { $push: "$messages" },
      },
    },
  ]);

  if (!user || user.length === 0) {
    return { success: false, message: "User not found" };
  }

  return {
    success: true,
    message: "Messages fetched successfully",
    messages: user[0].messages,
  };
}
