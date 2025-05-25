"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, UserPlus, Shield, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black" />
        <div className="relative container mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-zinc-50 mb-6">
              True Feedback
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-8">
              Get real, anonymous feedback from real people. Share your thoughts and receive honest messages from others.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!session ? (
                <>
                  <Button
                    onClick={() => router.push("/signup")}
                    className={cn(
                      "bg-zinc-50 text-zinc-950 hover:bg-zinc-200",
                      "transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                    )}
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => router.push("/signin")}
                    className={cn(
                      "bg-zinc-50 text-zinc-950 hover:bg-zinc-200",
                      "transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                    )}
                  >
                    Sign In
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => router.push("/dashboard")}
                  className={cn(
                    "bg-zinc-50 text-zinc-950 hover:bg-zinc-200",
                    "transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                  )}
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-zinc-800 bg-zinc-950/50 backdrop-blur-xl">
            <CardContent className="pt-6">
              <MessageSquare className="h-12 w-12 text-zinc-50 mb-4" />
              <h3 className="text-xl font-semibold text-zinc-50 mb-2">Anonymous Messages</h3>
              <p className="text-zinc-400">
                Send and receive honest feedback while maintaining complete anonymity.
              </p>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-950/50 backdrop-blur-xl">
            <CardContent className="pt-6">
              <UserPlus className="h-12 w-12 text-zinc-50 mb-4" />
              <h3 className="text-xl font-semibold text-zinc-50 mb-2">Create Your Profile</h3>
              <p className="text-zinc-400">
                Set up your profile and start receiving anonymous messages from others.
              </p>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-950/50 backdrop-blur-xl">
            <CardContent className="pt-6">
              <Shield className="h-12 w-12 text-zinc-50 mb-4" />
              <h3 className="text-xl font-semibold text-zinc-50 mb-2">Safe & Secure</h3>
              <p className="text-zinc-400">
                Your privacy is our priority. All messages are completely anonymous and secure.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-zinc-50 mb-4">How It Works</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Sending anonymous messages is simple and secure. Here's how to get started:
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="border-zinc-800 bg-zinc-950/50 backdrop-blur-xl">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold text-zinc-50 mb-4">For Message Senders</h3>
              <ol className="space-y-4 text-zinc-400">
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-50">1</span>
                  <span>Get the profile link of the person you want to message</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-50">2</span>
                  <span>Visit their profile page at <code className="px-2 py-1 rounded bg-zinc-800 text-zinc-50">/u/username</code></span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-50">3</span>
                  <span>Write your message and click send - it's that simple!</span>
                </li>
              </ol>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-950/50 backdrop-blur-xl">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold text-zinc-50 mb-4">For Message Receivers</h3>
              <ol className="space-y-4 text-zinc-400">
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-50">1</span>
                  <span>Create your account and set up your profile</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-50">2</span>
                  <span>Share your profile link: <code className="px-2 py-1 rounded bg-zinc-800 text-zinc-50">/u/your-username</code></span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-50">3</span>
                  <span>Receive and manage anonymous messages in your dashboard</span>
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-zinc-50 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-zinc-400 mb-8 max-w-2xl mx-auto">
            Join True Feedback today and start your journey of anonymous communication.
          </p>
          {!session && (
            <Button
              onClick={() => router.push("/signup")}
              className={cn(
                "bg-zinc-50 text-zinc-950 hover:bg-zinc-200",
                "transition-all duration-200 hover:scale-[1.02] cursor-pointer"
              )}
            >
              Create Your Account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-800">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center text-zinc-400 text-sm">
            <p>© {new Date().getFullYear()} True Feedback. All rights reserved.</p>
            <div className="mt-4 space-x-4">
              Made by Siddhant Jain
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
