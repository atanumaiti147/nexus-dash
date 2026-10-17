/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║                                                                  ║
 * ║   █▄░█░█▀▀░█░█░█░█░█▀▀                                           ║
 * ║   █░▀█░█▀▀░▄▀▄░█░█░▀▀█                                           ║
 * ║   ▀░░▀░▀▀▀░▀░▀░▀▀▀░▀▀▀                                           ║
 * ║                                                                  ║
 * ║                © 2026 Nexus — All Rights Reserved                ║
 * ║                                                                  ║
 * ║   discord  ──  https://discord.gg/JEqXrAurYz                       ║
 * ║   youtube  ──  https://youtube.com/@Nexus                        ║
 * ║   github   ──  https://github.com/RayExo                         ║
 * ║                                                                  ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  icon?: React.ElementType;
  className?: string;
}

export const PageHeader = ({ 
  title, 
  description, 
  children, 
  icon: Icon,
  className 
}: PageHeaderProps) => {
  return (
    <div className={cn("flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8", className)}>
      <div className="min-w-0">
        <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3 tracking-tight">
          {Icon && <Icon className="h-8 w-8 text-primary shrink-0" />}
          {title}
        </h1>
        {description && (
          <p className="text-slate-400 mt-1 font-medium italic">
            {description}
          </p>
        )}
      </div>
      {children && (
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 [&>*]:max-w-full">
          {children}
        </div>
      )}
    </div>
  );
};
