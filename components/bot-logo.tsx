import React from "react";
import { cn } from "@/lib/utils";

// Bot ka falcon logo. File public/falcon.png mein honi chahiye.
export function BotLogo({ className }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/falcon.png" alt="Bot logo" className={cn("object-contain", className)} />;
}
