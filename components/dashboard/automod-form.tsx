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

"use client";

import React, { useState } from "react";
import {
  Zap,
  Type,
  Link as LinkIcon,
  MessageSquare,
  UserMinus,
  Smile,
  EyeOff,
  Ban,
  ShieldAlert,
  ShieldCheck,
  Gavel,
  Hash,
  Trash2,
  RefreshCcw,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  AutomodConfig,
  AutomodNativeState,
  DiscordChannel,
  DiscordRole,
} from "@/types/api";

const EVENT_ICONS: Record<string, React.ElementType> = {
  "Anti spam": Zap,
  "Anti caps": Type,
  "Anti link": LinkIcon,
  "Anti invites": MessageSquare,
  "Anti mass mention": UserMinus,
  "Anti emoji spam": Smile,
  "Anti NSFW link": EyeOff,
  "Anti profanity": Ban,
  "Anti scam": ShieldAlert,
};

const NATIVE_CHIP: Record<AutomodNativeState, { label: string; className: string }> = {
  active: { label: "Native rule active", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  off: { label: "Rule not created", className: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  no_permission: { label: "Needs Manage Server", className: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  unavailable: { label: "Status unavailable", className: "bg-slate-500/10 text-slate-400 border-slate-500/20" },
};

// Same limit as the `automod ignore` commands
const MAX_EXEMPTIONS = 10;
const TEXT_CHANNEL = "0";

// Statuses from the bot's native rule sync that need the admin's attention
const SYNC_PROBLEMS: Record<string, string> = {
  no_permission: "the bot needs the Manage Server permission",
  limit_reached: "Discord's rule limit for this rule type is reached",
  error: "Discord rejected the rule",
};

interface AutomodFormProps {
  initialConfig: AutomodConfig;
  channels: DiscordChannel[];
  roles: DiscordRole[];
  guildId: string;
}

export function AutomodForm({ initialConfig, channels, roles, guildId }: AutomodFormProps) {
  const [config, setConfig] = useState<AutomodConfig>(initialConfig);
  const [saving, setSaving] = useState(false);

  const textChannels = channels.filter((c) => c.type === TEXT_CHANNEL);
  const channelOptions = textChannels.map((c) => ({ value: c.id, label: `#${c.name}` }));

  const isEventEnabled = (name: string) => config.punishments?.[name] !== undefined;

  const toggleEvent = (name: string, defaultPunishment: string) => {
    const next = { ...config.punishments };
    if (next[name] !== undefined) delete next[name];
    else next[name] = defaultPunishment;
    setConfig({ ...config, punishments: next });
  };

  const setPunishment = (name: string, value: string) =>
    setConfig({ ...config, punishments: { ...config.punishments, [name]: value } });

  const addExempt = (key: "ignored_roles" | "ignored_channels", id: string) => {
    if (!id || config[key].includes(id)) return;
    if (config[key].length >= MAX_EXEMPTIONS) {
      toast.error(`You can only ignore up to ${MAX_EXEMPTIONS} ${key === "ignored_roles" ? "roles" : "channels"}.`);
      return;
    }
    setConfig({ ...config, [key]: [...config[key], id] });
  };

  const removeExempt = (key: "ignored_roles" | "ignored_channels", id: string) =>
    setConfig({ ...config, [key]: config[key].filter((x) => x !== id) });

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await api.updateAutomod(guildId, {
        enabled: config.enabled,
        punishments: config.punishments,
        ignored_roles: config.ignored_roles,
        ignored_channels: config.ignored_channels,
        ...(config.logging_channel ? { logging_channel: config.logging_channel } : {}),
      });

      // refresh the live state of the native rules
      const fresh = await api.getAutomod(guildId);
      if (fresh) setConfig(fresh);

      const problems = Object.entries(result.native_sync || {})
        .filter(([, status]) => status in SYNC_PROBLEMS)
        .map(([event, status]) => `${event}: ${SYNC_PROBLEMS[status]}`);

      if (problems.length) {
        toast.warning(`Saved, but some native rules could not be applied. ${problems.join("; ")}.`);
      } else {
        toast.success("Configuration saved successfully!");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  const nativeEvents = config.events.filter((e) => e.native);
  const nativeActive = nativeEvents.filter((e) => config.native_status?.[e.name] === "active").length;

  const renderExemptions = (
    key: "ignored_roles" | "ignored_channels",
    label: string,
    options: { value: string; label: string }[],
    nameOf: (id: string) => string,
  ) => (
    <div className="space-y-3">
      <p className="text-[10px] font-black uppercase text-slate-600 tracking-widest pl-1">
        {label} ({config[key].length}/{MAX_EXEMPTIONS})
      </p>
      <Select
        value=""
        onValueChange={(val) => addExempt(key, val)}
        options={options.filter((o) => !config[key].includes(o.value))}
        placeholder={`Add ${label.toLowerCase()}...`}
        className="bg-black/20 border-slate-800 rounded-xl"
      />
      <div className="flex flex-wrap gap-2">
        {config[key].length === 0 && <span className="text-xs text-slate-600 italic pl-1">None</span>}
        {config[key].map((id) => (
          <div
            key={id}
            className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/50 px-3 py-1.5 rounded-lg text-xs"
          >
            <span className="text-slate-200 font-medium">{nameOf(id)}</span>
            <button
              type="button"
              onClick={() => removeExempt(key, id)}
              className="text-slate-500 hover:text-blue-400 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-[#141B2D] border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-5 sm:p-8 space-y-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h3 className="text-sm font-black uppercase text-slate-500 tracking-widest">Master Control</h3>
              <Switch
                checked={config.enabled}
                onCheckedChange={() => setConfig({ ...config, enabled: !config.enabled })}
              />
            </div>

            <div className="space-y-4">
              {config.events.map((event) => {
                const Icon = EVENT_ICONS[event.name] || ShieldAlert;
                const enabled = isEventEnabled(event.name);
                const live = enabled && config.enabled;
                const state = config.native_status?.[event.name] ?? "unavailable";
                const chip = NATIVE_CHIP[state] ?? NATIVE_CHIP.unavailable;

                return (
                  <div
                    key={event.name}
                    className={cn(
                      "p-6 rounded-2xl border transition-all duration-300",
                      config.enabled ? "bg-slate-900/40 border-slate-800" : "bg-slate-900/10 border-slate-900 opacity-40 grayscale"
                    )}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "h-12 w-12 shrink-0 rounded-xl flex items-center justify-center transition-colors",
                            enabled ? "bg-primary/20 text-primary" : "bg-slate-800 text-slate-500"
                          )}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-white">{event.name}</h3>
                            {event.native && (
                              <span
                                className={cn(
                                  "text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border",
                                  live ? chip.className : "bg-slate-800/60 text-slate-500 border-slate-700/50"
                                )}
                              >
                                {live ? chip.label : "Discord AutoMod"}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 max-w-md">{event.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {enabled &&
                          (event.punishable ? (
                            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-300">
                              <Gavel className="h-4 w-4 text-primary" />
                              <Select
                                value={config.punishments[event.name] || event.default_punishment}
                                onValueChange={(val) => setPunishment(event.name, val)}
                                options={config.punishment_options.map((p) => ({ value: p, label: p }))}
                                className="w-32"
                              />
                            </div>
                          ) : (
                            <span className="text-xs font-bold text-slate-400 whitespace-nowrap">Block message</span>
                          ))}
                        <div className="h-8 w-[1px] bg-slate-800 hidden sm:block" />
                        <Switch
                          disabled={!config.enabled}
                          checked={enabled}
                          onCheckedChange={() => toggleEvent(event.name, event.default_punishment)}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <Button onClick={handleSave} disabled={saving} className="w-full h-14 text-base font-bold gap-2">
              {saving ? <RefreshCcw className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
              Save Moderation Rules
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-[#141B2D] border border-slate-800 rounded-3xl p-6 space-y-3">
          <h3 className="text-sm font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
            <Hash className="h-4 w-4 text-primary" />
            Log Channel
          </h3>
          <Select
            value={config.logging_channel || ""}
            onValueChange={(val) => setConfig({ ...config, logging_channel: val })}
            options={channelOptions}
            placeholder="Select channel..."
            className="bg-black/20 border-slate-800 rounded-xl"
          />
          <p className="text-[10px] text-slate-500 italic">
            Blocked messages and punishments are posted here.
          </p>
        </div>

        <div className="bg-[#141B2D] border border-slate-800 rounded-3xl p-6 space-y-6">
          <h3 className="text-sm font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Ignored
          </h3>
          {renderExemptions(
            "ignored_roles",
            "Roles",
            roles.map((r) => ({ value: r.id, label: r.name })),
            (id) => roles.find((r) => r.id === id)?.name ?? `Unknown (${id})`,
          )}
          {renderExemptions(
            "ignored_channels",
            "Channels",
            channelOptions,
            (id) => {
              const c = channels.find((ch) => ch.id === id);
              return c ? `#${c.name}` : `Unknown (${id})`;
            },
          )}
        </div>

        <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:scale-110 transition-transform">
            <ShieldAlert className="h-32 w-32 text-white" />
          </div>
          <h3 className="text-sm font-bold text-white mb-2">Native Discord AutoMod</h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            Spam, mass mention, NSFW, profanity and scam filters run as real AutoMod rules inside Discord, so
            messages are blocked before anyone sees them. Saving here keeps those rules in sync.
          </p>
          <div className="flex items-center gap-2">
            <div className={cn("h-2 w-2 rounded-full", nativeActive > 0 ? "bg-emerald-500" : "bg-slate-600")} />
            <span className="text-[10px] font-black uppercase text-primary">
              {nativeActive} of {nativeEvents.length} native rules active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
