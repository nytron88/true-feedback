"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useDebounceValue } from "usehooks-ts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { signupSchema } from "@/schemas/signupSchema";
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
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SignUp() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState("");
    const [debouncedUsername] = useDebounceValue(username, 500);
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);

    const form = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    });

    useEffect(() => {
        if (session) {
            router.push("/dashboard");
        }
    }, [session, router]);

    useEffect(() => {
        const checkUsername = async () => {
            if (!debouncedUsername || debouncedUsername.length < 2) {
                setIsUsernameAvailable(null);
                return;
            }

            try {
                setIsCheckingUsername(true);
                const response = await axios.get(`/api/user/check-username?username=${debouncedUsername}`);
                setIsUsernameAvailable(response.data.success);
            } catch (error) {
                setIsUsernameAvailable(false);
            } finally {
                setIsCheckingUsername(false);
            }
        };

        checkUsername();
    }, [debouncedUsername]);

    async function onSubmit(values: z.infer<typeof signupSchema>) {
        try {
            setIsLoading(true);
            const response = await axios.post("/api/auth/signup", values);

            if (response.data.success) {
                toast.success("Account created successfully! Please verify your email.");
                router.push(`/verify/${values.username}`);
            } else {
                toast.error(response.data.message || "Something went wrong");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Something went wrong");
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
            <Card className="w-full max-w-md border-none bg-zinc-950 shadow-2xl">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center text-zinc-50">
                        Create an account
                    </CardTitle>
                    <CardDescription className="text-center text-zinc-400">
                        Enter your details to create your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-zinc-200">Username</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    placeholder="Choose a username"
                                                    {...field}
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        setUsername(e.target.value);
                                                    }}
                                                    disabled={isLoading}
                                                    className="bg-zinc-900 border-zinc-800 text-zinc-50 placeholder:text-zinc-500 focus:border-zinc-700 focus:ring-zinc-700"
                                                />
                                                {isCheckingUsername && (
                                                    <Loader size="sm" className="absolute right-3 top-2.5" />
                                                )}
                                                {!isCheckingUsername && isUsernameAvailable === true && (
                                                    <CheckCircle2 className="absolute right-3 top-2.5 h-5 w-5 text-emerald-500" />
                                                )}
                                                {!isCheckingUsername && isUsernameAvailable === false && (
                                                    <XCircle className="absolute right-3 top-2.5 h-5 w-5 text-red-500" />
                                                )}
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-red-400" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-zinc-200">Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="Enter your email"
                                                {...field}
                                                disabled={isLoading}
                                                className="bg-zinc-900 border-zinc-800 text-zinc-50 placeholder:text-zinc-500 focus:border-zinc-700 focus:ring-zinc-700"
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
                                                placeholder="Create a password"
                                                {...field}
                                                disabled={isLoading}
                                                className="bg-zinc-900 border-zinc-800 text-zinc-50 placeholder:text-zinc-500 focus:border-zinc-700 focus:ring-zinc-700"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-400" />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                className={cn(
                                    "w-full bg-zinc-50 text-zinc-950 hover:bg-zinc-200",
                                    "transition-colors duration-200 cursor-pointer"
                                )}
                                disabled={isLoading || isUsernameAvailable === false}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader size="sm" className="mr-2" />
                                        Creating account...
                                    </>
                                ) : (
                                    "Create Account"
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <div className="text-sm text-center text-zinc-400">
                        Already have an account?{" "}
                        <Link
                            href="/signin"
                            className="text-zinc-50 hover:text-zinc-200 transition-colors duration-200"
                        >
                            Sign in
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
} 