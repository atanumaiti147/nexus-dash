"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Menu, X, Settings2, Music, ShieldCheck, LifeBuoy, LayoutDashboard, Bot } from "lucide-react";

const INVITE_URL =
  "https://discord.com/oauth2/authorize?client_id=1496506004169560217&permissions=8&integration_type=0&scope=bot";
const SUPPORT_URL = "https://discord.gg/UgezfCusdj";
const VOTE_URL = "https://top.gg/bot/1496506004169560217/vote";
const SHOWCASE_IMG = "https://i.postimg.cc/jSRd0PfW/Screenshot-2026-04-23-145653.png";

const FEATURES = [
  { title: "Optimization", icon: Settings2, text: "With fast and customizable settings specific to your server, NexusBot gives you a musical pleasure to the fullest." },
  { title: "Universal", icon: Music, text: "A bot that supports multi-platform music playback (Spotify, SoundCloud, YouTube). It complies with all copyrights and licenses." },
  { title: "Security", icon: ShieldCheck, text: "An open source safe bot that you can browse and help us develop." },
  { title: "Support", icon: LifeBuoy, text: "With our best teammates, we provide the fastest response to anyone who needs help." },
];

const NAV = [
  { name: "Home", href: "#home" },
  { name: "Commands", href: "/docs" },
  { name: "Support", href: SUPPORT_URL, external: true },
  { name: "Add Bot", href: INVITE_URL, external: true },
];

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.74 19.74 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.009c.12.099.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

const loginDashboard = () => signIn("discord", { callbackUrl: "/dashboard" });

export default function Index() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#020617] text-slate-200 overflow-x-hidden">
      {/* Top glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-gradient-to-b from-blue-600/25 to-transparent" />

      {/* Header */}
      <header className="relative z-20 border-b border-white/5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6 min-w-0">
            <Link href="/" className="flex items-center gap-3 shrink-0">
              <img src="/img/logo2.png" alt="NexusBot" width={44} height={44} className="rounded-full" />
              <span className="text-xl font-semibold text-white">
                <span className="text-blue-400">Nexus</span>Bot
              </span>
            </Link>
            <nav className="hidden lg:flex items-center gap-6">
              {NAV.map((item) =>
                item.external ? (
                  <a key={item.name} href={item.href} target="_blank" rel="noopener noreferrer" className="text-white/75 hover:text-white font-medium transition-colors">
                    {item.name}
                  </a>
                ) : (
                  <Link key={item.name} href={item.href} className="text-white/75 hover:text-white font-medium transition-colors">
                    {item.name}
                  </Link>
                )
              )}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loginDashboard}
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg shadow-blue-600/20 hover:opacity-80 transition"
            >
              <LayoutDashboard className="h-4 w-4" /> Login Dashboard
            </button>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              className="lg:hidden p-2.5 rounded-lg text-white hover:bg-white/10"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-white/10 bg-[#020617]/95 px-5 py-4 space-y-1">
            {NAV.map((item) =>
              item.external ? (
                <a key={item.name} href={item.href} target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)} className="block py-3 text-white/80 hover:text-white">
                  {item.name}
                </a>
              ) : (
                <Link key={item.name} href={item.href} onClick={() => setMenuOpen(false)} className="block py-3 text-white/80 hover:text-white">
                  {item.name}
                </Link>
              )
            )}
            <button onClick={loginDashboard} className="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500">
              <LayoutDashboard className="h-4 w-4" /> Login Dashboard
            </button>
          </div>
        )}
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-5">
        {/* Hero */}
        <section id="home" className="py-16 sm:py-24 text-center">
          <div className="flex justify-center">
            <img src="/img/bck.png" alt="" className="w-full max-w-md h-auto opacity-90" />
          </div>
          <h1 className="mt-6 text-2xl sm:text-4xl sm:text-6xl font-extrabold text-white tracking-tight">NexusBot</h1>
          <p className="mt-5 max-w-2xl mx-auto text-white/60 text-base sm:text-lg leading-relaxed">
            How about moderating your own server with NexusBot? Create your own free world and create your own playlist, experience this pleasure with the best sounds.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={loginDashboard}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 rounded-xl font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg shadow-blue-600/20 hover:opacity-80 transition"
            >
              <LayoutDashboard className="h-5 w-5" /> Login Dashboard
            </button>
            <Link
              href="/docs"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 rounded-xl font-medium text-white border border-white/15 bg-white/5 hover:bg-white/10 transition"
            >
              <Bot className="h-5 w-5" /> View Commands
            </Link>
          </div>
        </section>

        {/* Features + invite */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 py-16 lg:py-24">
          <div className="lg:col-span-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">NexusBot</h2>
            <p className="mt-3 text-white/50 leading-relaxed">
              How about creating the best environment to relax yourself with your own emotions?
            </p>
            <a
              href={INVITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg shadow-blue-600/20 hover:opacity-80 transition"
            >
              <DiscordIcon className="h-5 w-5" /> Invite NexusBot
            </a>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 hover:border-blue-500/30 transition">
                <div className="flex items-center gap-3">
                  <f.icon className="h-6 w-6 text-blue-400 shrink-0" />
                  <h3 className="text-xl font-semibold text-white">{f.title}</h3>
                </div>
                <p className="mt-3 text-white/50 leading-relaxed">{f.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Showcase */}
        <section className="my-14 lg:my-24 flex flex-col lg:flex-row items-center gap-8 rounded-3xl border border-white/5 bg-gradient-to-br from-slate-900/90 to-slate-900/40 p-6 sm:p-10 shadow-xl">
          <div className="text-center lg:text-left flex-1 min-w-0">
            <h2 className="text-3xl font-semibold text-white">Best Your Bot</h2>
            <p className="mt-4 text-white/60 leading-relaxed">
              Are you ready to throw the best parties with NexusBot, the best and most up-to-date bot?
            </p>
            <button
              onClick={loginDashboard}
              className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:opacity-80 transition"
            >
              <LayoutDashboard className="h-4 w-4" /> Open Dashboard
            </button>
          </div>
          <img src={SHOWCASE_IMG} alt="NexusBot dashboard preview" className="w-full max-w-md rounded-xl shadow-2xl shadow-black" />
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 mt-10">
        <div className="max-w-7xl mx-auto px-5 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-3">
              <img src="/img/logo2.png" alt="" width={40} height={40} className="rounded-full" />
              <span className="font-semibold text-xl text-white">NexusBot</span>
            </div>
            <p className="mt-4 text-white/40 text-sm">Powered by Nexus Development</p>
          </div>

          <div>
            <p className="text-white font-medium mb-3">Important</p>
            <ul className="space-y-2 text-white/50">
              <li><Link href="/terms" className="hover:text-white hover:underline">Terms Of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-white hover:underline">Privacy Policy</Link></li>
              <li><a href={VOTE_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline">Vote Bot</a></li>
            </ul>
          </div>

          <div>
            <p className="text-white font-medium mb-3">Links</p>
            <ul className="space-y-2 text-white/50">
              <li><Link href="/docs" className="hover:text-white hover:underline">Commands</Link></li>
              <li><a href={SUPPORT_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline">Support Server</a></li>
              <li><button onClick={loginDashboard} className="hover:text-white hover:underline">Dashboard</button></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 py-5 text-center text-white/40 text-sm">
          {new Date().getFullYear()} &copy; NexusBot · Bot Online
        </div>
      </footer>
    </div>
  );
}
