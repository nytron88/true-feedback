"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { toast } from "sonner";
import { verifySchema } from "@/schemas/verifySchema";
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

export default function VerifyPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const params = useParams();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: "",
        },
    });

    useEffect(() => {
        if (session) {
            router.push("/dashboard");
        }
    }, [session, router]);

    async function onSubmit(values: z.infer<typeof verifySchema>) {
        try {
            setIsLoading(true);
            const response = await axios.post("/api/auth/verify", {
                username: params.username,
                code: values.code,
            });

            if (response.data.success) {
                toast.success("Email verified successfully!");
                router.push("/signin");
            } else {
                toast.error(response.data.message || "Verification failed");
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
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black" />
            <Card className="relative w-full max-w-md border-none bg-zinc-950/50 backdrop-blur-xl shadow-2xl">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center text-zinc-50">
                        Verify your email
                    </CardTitle>
                    <CardDescription className="text-center text-zinc-400">
                        Enter the 6-digit code sent to your email
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-4 rounded-lg border border-zinc-800/50 bg-zinc-900/50 p-4">
                                <FormField
                                    control={form.control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-zinc-200">Verification Code</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter 6-digit code"
                                                    maxLength={6}
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
                                    "transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                                )}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader size="sm" className="mr-2" />
                                        Verifying...
                                    </>
                                ) : (
                                    "Verify Email"
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <div className="text-sm text-center text-zinc-400">
                        Didn&apos;t receive the code?{" "}
                        <button
                            onClick={() => toast.info("Please check your spam folder or request a new code")}
                            className="text-zinc-50 hover:text-zinc-200 transition-colors duration-200 cursor-pointer"
                        >
                            Need help?
                        </button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
