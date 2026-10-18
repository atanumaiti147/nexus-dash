/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║                                                                  ║
 * ║   █▄░█░█▀▀░█░█░█░█░█▀▀                                           ║
 * ║   █░▀█░█▀▀░▄▀▄░█░█░▀▀█                                           ║
 * ║   ▀░░▀░▀▀▀░▀░▀░▀▀▀░▀▀▀                                           ║
 * ║                                                                  ║
 * ║                © 2026 Nexus — All Rights Reserved                ║
 * ║                                                                  ║
 * ║   discord  ──  https://discord.gg/JEqXrAurYz                     ║
 * ║   youtube  ──  https://youtube.com/@Nexus                        ║
 * ║   github   ──  https://github.com/RayExo                         ║
 * ║                                                                  ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

import React from "react";
import { SmilePlus } from "lucide-react";
import dynamic from "next/dynamic";
import { api } from "@/lib/api";

const WelcomeForm = dynamic(() => import("@/components/dashboard/welcome-form").then(mod => mod.WelcomeForm), {
  loading: () => <div className="h-96 w-full animate-pulse bg-slate-800/20 rounded-3xl" />
});

export default async function WelcomePage({ params }: { params: { guildId: string } }) {
  let welcomeData: any = null;
  let channelsData: any[] = [];
  let loadError: string | null = null;
  try {
    [welcomeData, channelsData] = await Promise.all([
      api.getWelcome(params.guildId),
      api.getChannels(params.guildId).catch(() => []),
    ]);
  } catch (err: any) {
    loadError = err?.message || "Welcome settings load nahi ho paaye.";
  }

  if (loadError || !welcomeData) {
    return (
      <div className="rounded-3xl border border-dashed border-blue-500/30 bg-blue-500/5 p-6 sm:p-10 text-center space-y-3">
        <p className="text-lg font-bold text-white">Welcomer load nahi ho paaya</p>
        <p className="text-sm text-slate-400 break-words">{loadError || "Bot API se data nahi aaya."}</p>
        <p className="text-xs text-slate-500">Bot API chal rahi hai ya nahi, aur /welcome endpoint bot mein bana hai ya nahi, check karein.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <SmilePlus className="h-6 w-6 text-primary" />
            Welcomer
          </h2>
          <p className="text-slate-400 mt-1">Greet new members to your server.</p>
        </div>
      </div>

      <WelcomeForm initialConfig={welcomeData} channels={channelsData} guildId={params.guildId} />
    </div>
  );
}
