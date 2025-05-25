"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageCardProps {
  title: string;
  createdAt: string;
  onDelete: () => void;
  className?: string;
}

export default function MessageCard({ title, createdAt, onDelete, className }: MessageCardProps) {
  return (
    <Card className={cn(
      "border-zinc-800 bg-zinc-950/50 backdrop-blur-xl hover:bg-zinc-950/70 transition-colors duration-200",
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-lg font-semibold text-zinc-50">
            {title}
          </CardTitle>
          <p className="text-sm text-zinc-400">
            {new Date(createdAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="h-8 w-8 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-colors duration-200"
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete message</span>
        </Button>
      </CardHeader>
      <CardContent>
        {/* Content will be added later */}
      </CardContent>
    </Card>
  );
}
