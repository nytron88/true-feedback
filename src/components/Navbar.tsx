"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOut, MessageSquare } from "lucide-react";

export default function Navbar() {
    const router = useRouter();

    const handleLogout = async () => {
        await signOut({ redirect: false });
        router.push("/");
    };

    return (
        <nav className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-xl">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo/Brand */}
                    <Link href="/" className="flex items-center space-x-2">
                        <MessageSquare className="h-6 w-6 text-zinc-50" />
                        <span className="text-xl font-semibold text-zinc-50">True Feedback</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center space-x-4">
                        <Button
                            onClick={() => router.push("/dashboard")}
                            variant="ghost"
                            className="text-zinc-50 hover:bg-zinc-900/50 hover:text-zinc-50 cursor-pointer"
                        >
                            Dashboard
                        </Button>
                        <Button
                            onClick={handleLogout}
                            variant="ghost"
                            className="text-zinc-50 hover:bg-zinc-900/50 hover:text-zinc-50 cursor-pointer"
                        >
                            <LogOut className="h-5 w-5 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
