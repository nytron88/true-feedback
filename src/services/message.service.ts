import UserModel, { Message } from "@/models/user.model";
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
      $unwind: {
        path: "$messages",
        preserveNullAndEmptyArrays: true,
      },
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

export async function sendMessage(content: string, username: string) {
  const user = await UserModel.findOne({ username });

  if (!user) {
    return { success: false, message: "User not found" };
  }

  if (!user.isAcceptingMessage) {
    return {
      success: false,
      message: "User is not accepting messages",
    };
  }

  const newMessage: Message = {
    content,
    createdAt: new Date(),
  } as Message;

  user.messages.push(newMessage);

  await user.save();

  return {
    success: true,
    message: "Message sent successfully",
  };
}

export async function deleteMessage(userId: string, messageId: string) {
  const updatedUserMessages = await UserModel.updateOne(
    { _id: userId },
    { $pull: { messages: { _id: messageId } } }
  );

  if (updatedUserMessages.matchedCount === 0) {
    return {
      success: false,
      message: "Message not found or already deleted",
    };
  }

  return { success: true, message: "Message deleted successfully" };
}
