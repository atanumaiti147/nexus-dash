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

export interface BotInfo {
  name: string;
  id: number | null;
  guilds: number;
  users: number;
  commands: number;
  latency: string;
}

export interface BotStatus {
  user: string;
  id: number | null;
  latency: number;
  guild_count: number;
  user_count: number;
  shards: number;
}

export interface GuildSummary {
  id: string;
  name: string;
  icon_url: string | null;
  owner_id: string;
  member_count: number;
}

export interface PrefixConfig {
  guild_id: number;
  prefix: string;
}

export interface AutomodEventInfo {
  name: string;
  description: string;
  /** Enforced by a native Discord AutoMod rule created by the bot */
  native: boolean;
  /** Mute / Kick / Ban can be configured (otherwise the message is only blocked) */
  punishable: boolean;
  default_punishment: string;
}

/** Live state of a native rule in Discord */
export type AutomodNativeState = "active" | "off" | "no_permission" | "unavailable";

export interface AutomodConfig {
  guild_id: string;
  enabled: boolean;
  /** An event is enabled when it has an entry here */
  punishments: Record<string, string>;
  ignored_roles: string[];
  ignored_channels: string[];
  logging_channel: string | null;
  events: AutomodEventInfo[];
  punishment_options: string[];
  native_status: Record<string, AutomodNativeState>;
}

export interface AutomodUpdate {
  enabled?: boolean;
  punishments?: Record<string, string>;
  ignored_roles?: string[];
  ignored_channels?: string[];
  logging_channel?: string | null;
}

export interface AutomodSaveResult {
  status: string;
  guild_id: string;
  /** event -> created | updated | unchanged | removed | absent | no_permission | limit_reached | error */
  native_sync: Record<string, string>;
}

export interface TicketConfig {
  guild_id: number;
  panel_channel: number | null;
  panel_message: number | null;
  embed: {
    title: string | null;
    description: string | null;
  };
  categories: {
    name: string;
    emoji: string;
  }[];
  staff_roles: number[];
  open_ticket_count: number;
}

export interface LevelingConfig {
  guild_id: number;
  enabled: boolean;
  xp_per_message: number;
  cooldown: number;
  level_up_channel: number | null;
  embed_style: {
    color: string;
    thumbnail: boolean;
    image: string | null;
  };
}

export interface LoggingConfig {
  guild_id: number;
  log_enabled: Record<string, boolean>;
  log_channels: Record<string, number>;
  ignore_channels: number[];
  ignore_roles: number[];
  ignore_users: number[];
  auto_delete_duration: number | null;
}
