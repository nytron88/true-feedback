import { Loader } from "@/components/ui/loader";

export default function Loading() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-black">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black" />
            <div className="relative flex flex-col items-center space-y-4">
                <Loader size="lg" />
                <p className="text-zinc-400 animate-pulse">Loading...</p>
            </div>
        </div>
    );
} 