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

import DiscordProvider from "next-auth/providers/discord";
import { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
      authorization: { params: { scope: "identify guilds" } },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // @ts-ignore
        session.user.id = token.sub;
        // @ts-ignore
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
};
