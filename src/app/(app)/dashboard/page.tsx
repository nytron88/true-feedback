"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { toast } from "sonner";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import MessageCard from "@/components/MessageCard";
import { User, Mail, Copy } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface Message {
  _id: string;
  content: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);

  const form = useForm<z.infer<typeof acceptMessageSchema>>({
    resolver: zodResolver(acceptMessageSchema),
    defaultValues: {
      acceptMessage: false,
    },
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [acceptMessageRes, messagesRes] = await Promise.all([
          axios.get("/api/message/accept-message"),
          axios.get("/api/message/get-messages"),
        ]);

        if (acceptMessageRes.data.success) {
          form.setValue("acceptMessage", acceptMessageRes.data.isAcceptingMessage);
        }

        if (messagesRes.data.success) {
          setMessages(messagesRes.data.messages);
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast.error("Failed to load your data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [form]);

  const handleAcceptMessageChange = async (checked: boolean) => {
    try {
      const response = await axios.post("/api/message/accept-message", {
        acceptMessage: checked,
      });

      if (response.data.success) {
        form.setValue("acceptMessage", checked);
        toast.success(
          checked
            ? "You are now accepting messages"
            : "You are no longer accepting messages"
        );
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Failed to update message acceptance status");
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    setMessageToDelete(messageId);
  };

  const confirmDelete = async () => {
    if (!messageToDelete) return;

    try {
      const response = await axios.delete(`/api/message/delete-message/${messageToDelete}`);

      if (response.data.success) {
        toast.success("Message deleted successfully");
        setMessages(messages.filter((msg) => msg._id !== messageToDelete));
      } else {
        toast.error(response.data.message || "Failed to delete message");
      }
    } catch (error) {
      toast.error("Failed to delete message");
    } finally {
      setMessageToDelete(null);
    }
  };

  const handleCopyProfileLink = () => {
    const profileUrl = `${window.location.origin}/u/${session?.user?.username}`;
    navigator.clipboard.writeText(profileUrl);
    toast.success("Profile link copied to clipboard!");
  };

  if (isLoading) {
    return <Loader size="lg" fullScreen />;
  }

  return (
    <div className="space-y-8">
      {/* User Profile Section */}
      <Card className="border-zinc-800 bg-zinc-950/50 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-zinc-50">
            Welcome, {session?.user?.name}
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Manage your messages and profile settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <User className="h-5 w-5 text-zinc-400" />
            <span className="text-zinc-50">@{session?.user?.username}</span>
          </div>
          <div className="flex items-center space-x-4">
            <Mail className="h-5 w-5 text-zinc-400" />
            <span className="text-zinc-50">{session?.user?.email}</span>
          </div>
          <div className="space-y-4 p-4 rounded-lg border border-zinc-800 bg-zinc-900/50">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-zinc-50 font-medium">Your Profile Link</p>
                <p className="text-sm text-zinc-400">
                  Share this link to receive anonymous messages
                </p>
              </div>
              <Button
                onClick={handleCopyProfileLink}
                variant="outline"
                size="sm"
                className="border-zinc-800 bg-zinc-900/50 text-zinc-50 hover:bg-zinc-800/50 hover:text-zinc-50 transition-all duration-200"
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Link
              </Button>
            </div>
            <div className="p-3 rounded bg-zinc-950/50 border border-zinc-800">
              <code className="text-zinc-400 text-sm break-all">
                {`${window.location.origin}/u/${session?.user?.username}`}
              </code>
            </div>
            <p className="text-sm text-zinc-500">
              Anyone with this link can send you anonymous messages. Make sure to share it only with people you trust.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Message Settings Section */}
      <Card className="border-zinc-800 bg-zinc-950/50 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-zinc-50">
            Message Settings
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Control whether you want to receive messages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg border border-zinc-800 bg-zinc-900/50">
            <div className="space-y-1">
              <p className="text-zinc-50 font-medium">Accept Messages</p>
              <p className="text-sm text-zinc-400">
                {form.watch("acceptMessage")
                  ? "You are currently accepting messages"
                  : "You are not accepting messages"}
              </p>
            </div>
            <Switch
              checked={form.watch("acceptMessage")}
              onCheckedChange={handleAcceptMessageChange}
              className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-zinc-700 transition-colors duration-200 ease-in-out cursor-pointer"
            />
          </div>
        </CardContent>
      </Card>

      {/* Messages Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-zinc-50">Your Messages</h2>
        {messages.length === 0 ? (
          <Card className="border-zinc-800 bg-zinc-950/50 backdrop-blur-xl">
            <CardContent className="flex items-center justify-center py-8">
              <p className="text-zinc-400 text-center">
                No messages yet. Share your profile to start receiving messages!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {messages.map((message) => (
              <MessageCard
                key={message._id}
                title={message.content}
                createdAt={message.createdAt}
                onDelete={() => handleDeleteMessage(message._id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete Message Confirmation Dialog */}
      <AlertDialog open={!!messageToDelete} onOpenChange={() => setMessageToDelete(null)}>
        <AlertDialogContent className="bg-zinc-950 border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-zinc-50">Delete Message</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Are you sure you want to delete this message? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-900 text-zinc-50 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-50 transition-colors cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 text-white hover:bg-red-700 hover:text-white transition-colors cursor-pointer"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
