"use client";

import React, { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { signinSchema } from "@/schemas/signinSchema";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import { cn } from "@/lib/utils";

export default function SignIn() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof signinSchema>>({
        resolver: zodResolver(signinSchema),
        defaultValues: {
            identifier: "",
            password: "",
        },
    });

    useEffect(() => {
        if (session) {
            router.push("/dashboard");
        }
    }, [session, router]);

    async function onSubmit(values: z.infer<typeof signinSchema>) {
        try {
            setIsLoading(true);
            const result = await signIn("credentials", {
                identifier: values.identifier,
                password: values.password,
                redirect: false,
            });

            if (result?.error) {
                toast.error(result.error);
                return;
            }

            toast.success("Signed in successfully!");
            router.push("/dashboard");
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    if (status === "loading") {
        return <Loader size="lg" fullScreen />;
    }

    if (session) {
        return null;
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-black">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black" />
            <Card className="relative w-full max-w-md border-none bg-zinc-950/50 backdrop-blur-xl shadow-2xl">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center text-zinc-50">
                        Welcome back
                    </CardTitle>
                    <CardDescription className="text-center text-zinc-400">
                        Enter your credentials to access your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-4 rounded-lg border border-zinc-800/50 bg-zinc-900/50 p-4">
                                <FormField
                                    control={form.control}
                                    name="identifier"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-zinc-200">Email or Username</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter your email or username"
                                                    {...field}
                                                    disabled={isLoading}
                                                    className="bg-zinc-900/50 border-zinc-800 text-zinc-50 placeholder:text-zinc-500 focus:border-zinc-700 focus:ring-zinc-700"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-red-400" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-zinc-200">Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    placeholder="Enter your password"
                                                    {...field}
                                                    disabled={isLoading}
                                                    className="bg-zinc-900/50 border-zinc-800 text-zinc-50 placeholder:text-zinc-500 focus:border-zinc-700 focus:ring-zinc-700"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-red-400" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button
                                type="submit"
                                className={cn(
                                    "w-full bg-zinc-50 text-zinc-950 hover:bg-zinc-200",
                                    "transition-all duration-200 hover:scale-[1.02]"
                                )}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader size="sm" className="mr-2" />
                                        Signing in...
                                    </>
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <div className="text-sm text-center text-zinc-400">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/signup"
                            className="text-zinc-50 hover:text-zinc-200 transition-colors duration-200"
                        >
                            Sign up
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
