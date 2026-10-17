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

import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/components/auth-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || "Nexus";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#020617",
};

function getMetadataBase() {
  try {
    return new URL(process.env.NEXTAUTH_URL || "http://localhost:3000");
  } catch {
    return undefined;
  }
}

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: `${brandName} - Ultimate Discord Bot`,
  description: "Advanced Discord community management and security.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="font-sans antialiased text-slate-200">
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
