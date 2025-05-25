import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoaderProps {
    size?: "sm" | "md" | "lg";
    className?: string;
    fullScreen?: boolean;
}

export function Loader({ size = "md", className = "", fullScreen = false }: LoaderProps) {
    const sizeClasses = {
        sm: "h-4 w-4",
        md: "h-8 w-8",
        lg: "h-12 w-12",
    };

    return (
        <div className={cn(
            "flex items-center justify-center",
            fullScreen ? "min-h-screen" : "min-h-[200px]",
            className
        )}>
            <Loader2
                className={cn(
                    sizeClasses[size],
                    "animate-spin text-white"
                )}
            />
        </div>
    );
} 