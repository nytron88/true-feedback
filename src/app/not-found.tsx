"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NotFound() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-black">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black" />
            <Card className="relative w-full max-w-md border-none bg-zinc-950/50 backdrop-blur-xl shadow-2xl">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-4xl font-bold text-center text-zinc-50">404</CardTitle>
                    <CardDescription className="text-center text-zinc-400">
                        Oops! The page you&apos;re looking for doesn&apos;t exist.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <div className="text-center text-zinc-400">
                        <p>The page you requested could not be found.</p>
                        <p className="mt-2">Please check the URL or navigate back to home.</p>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button
                        variant="outline"
                        className={cn(
                            "group border-zinc-800 bg-zinc-900/50 text-zinc-50 hover:bg-zinc-800/50",
                            "transition-all duration-200 hover:scale-105"
                        )}
                        asChild
                    >
                        <Link href="/">
                            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            Back to Home
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
