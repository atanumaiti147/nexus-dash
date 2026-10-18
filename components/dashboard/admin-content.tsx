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

"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Shield, Users, Server, Activity, Database, Cpu, Globe, Lock, Settings,
  RefreshCw, Leaf, Bot, Clock, Gauge, Wifi, WifiOff, AlertTriangle, Megaphone, Power
} from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { AdminStats, AdminConfig } from "@/types/api";
import { toast } from "sonner";

const NODE_ICONS: Record<string, React.ElementType> = {
  Globe, Database, Cpu, Lock, Activity, Leaf,
};

function StatusPill({ ok, label }: { ok: boolean | null; label: string }) {
  const tone =
    ok === null ? "bg-slate-500/10 border-slate-500/20 text-slate-400"
    : ok ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
    : "bg-amber-500/10 border-amber-500/20 text-amber-400";
  const dot = ok === null ? "bg-slate-400" : ok ? "bg-emerald-500" : "bg-amber-500";
  return (
    <span className={cn("inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider whitespace-nowrap", tone)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", dot)} />
      {label}
    </span>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-white/5 last:border-0">
      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 shrink-0">{label}</span>
      <span className="text-sm font-semibold text-white text-right break-all min-w-0">{value}</span>
    </div>
  );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("bg-[#0f172a]/70 backdrop-blur-xl border border-white/5 rounded-2xl sm:rounded-3xl overflow-hidden min-w-0", className)}>
      {children}
    </div>
  );
}

function CardHeader({ icon: Icon, title, right, iconClass = "text-blue-500" }: {
  icon: React.ElementType; title: string; right?: React.ReactNode; iconClass?: string;
}) {
  return (
    <div className="px-5 sm:px-8 py-5 sm:py-6 border-b border-white/5 flex flex-wrap items-center justify-between gap-3 bg-white/[0.01]">
      <div className="flex items-center gap-3 min-w-0">
        <Icon className={cn("h-5 w-5 shrink-0", iconClass)} />
        <h3 className="text-base sm:text-lg font-bold text-white truncate">{title}</h3>
      </div>
      {right}
    </div>
  );
}

export function AdminContent() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [config, setConfig] = useState<AdminConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState(false);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const [statsData, configData] = await Promise.all([
        api.getAdminStats(),
        api.getAdminConfig(),
      ]);
      setStats(statsData);
      setConfig(configData);
      setError(false);
      setLastUpdated(new Date());
      // Don't overwrite a draft the admin is typing during auto-refresh
      if (!isRefresh) setNotification(configData.global_notification || "");
    } catch (err) {
      console.error("Failed to fetch admin data:", err);
      setError(true);
      toast.error("Failed to load real-time data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(true), 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleToggleMaintenance = async () => {
    if (!config) return;
    setSaving(true);
    try {
      const newStatus = !config.maintenance_mode;
      await api.updateAdminConfig({ maintenance_mode: newStatus });
      setConfig({ ...config, maintenance_mode: newStatus });
      toast.success(`Maintenance mode ${newStatus ? "enabled" : "disabled"}`);
    } catch {
      toast.error("Failed to update maintenance mode");
    } finally {
      setSaving(false);
    }
  };

  const handleBroadcast = async () => {
    setSaving(true);
    try {
      await api.updateAdminConfig({ global_notification: notification });
      if (config) setConfig({ ...config, global_notification: notification });
      toast.success("Broadcast message updated");
    } catch {
      toast.error("Failed to update broadcast message");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <RefreshCw className="h-10 w-10 text-blue-500 animate-spin opacity-40" />
      </div>
    );
  }

  const mongo = stats?.mongodb;
  const mongoOk = mongo ? mongo.connected : null;
  const botInfo = stats?.bot;

  const statItems = [
    { name: "Total Users", value: stats?.total_users || "0", icon: Users, color: "text-blue-400" },
    { name: "Active Servers", value: stats?.active_servers || "0", icon: Server, color: "text-emerald-400" },
    { name: "API Latency", value: stats?.api_latency || "0ms", icon: Gauge, color: "text-amber-400" },
    { name: "Database Size", value: stats?.db_size || "0 MB", icon: Database, color: "text-violet-400" },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="bg-[#0f172a]/70 backdrop-blur-xl border border-white/5 rounded-2xl sm:rounded-3xl p-5 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-start sm:items-center gap-4 min-w-0">
          <div className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-2xl bg-blue-500/15 flex items-center justify-center border border-blue-500/30">
            <Shield className="h-6 w-6 sm:h-7 sm:w-7 text-blue-500" />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight font-outfit">Admin Control Panel</h1>
            <p className="text-slate-400 mt-1 text-sm sm:text-base">Restricted access for Nexus administrators only.</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {lastUpdated && (
            <span className="text-[11px] text-slate-500 font-medium">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={() => fetchData(true)}
            className="flex items-center gap-2 bg-blue-500/10 px-4 sm:px-5 py-2.5 rounded-xl border border-blue-500/20 hover:bg-blue-500/20 transition-all active:scale-95 min-h-[44px]"
          >
            <RefreshCw className={cn("h-4 w-4 text-blue-400", refreshing && "animate-spin")} />
            <span className="text-xs font-black uppercase tracking-wider text-blue-400">
              {refreshing ? "Refreshing" : "Live · Refresh"}
            </span>
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
          <span>Bot API se data nahi aa raha. Connection ya API key check karein. Auto-retry har 30 second mein hoga.</span>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-6">
        {statItems.map((stat) => (
          <Card key={stat.name} className="p-4 sm:p-6 hover:border-white/10 transition-all group">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className={cn("p-2.5 sm:p-3 rounded-xl bg-white/[0.04] group-hover:scale-110 transition-transform", stat.color)}>
                <stat.icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg">Live</span>
            </div>
            <p className="text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest truncate">{stat.name}</p>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-1 font-outfit truncate">{stat.value}</h3>
          </Card>
        ))}
      </div>

      {/* MongoDB + Bot runtime */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader
            icon={Leaf}
            iconClass="text-emerald-400"
            title="MongoDB Connection"
            right={<StatusPill ok={mongoOk} label={mongo ? (mongo.status || (mongo.connected ? "Connected" : "Down")) : "Not reported"} />}
          />
          <div className="px-5 sm:px-8 py-2">
            {mongo ? (
              <>
                <InfoRow label="Status" value={
                  <span className={cn("inline-flex items-center gap-2", mongo.connected ? "text-emerald-400" : "text-amber-400")}>
                    {mongo.connected ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
                    {mongo.connected ? "Connected" : "Disconnected"}
                  </span>
                } />
                <InfoRow label="Ping" value={mongo.ping_ms !== undefined ? `${mongo.ping_ms} ms` : "—"} />
                <InfoRow label="Host" value={mongo.host || "—"} />
                <InfoRow label="Database" value={mongo.database || "—"} />
                <InfoRow label="Collections" value={mongo.collections ?? "—"} />
                <InfoRow label="Documents" value={mongo.documents?.toLocaleString() ?? "—"} />
                <InfoRow label="Storage" value={mongo.storage_mb || "—"} />
                <InfoRow label="Server Version" value={mongo.version || "—"} />
              </>
            ) : (
              <div className="py-8 text-center">
                <Leaf className="h-8 w-8 text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-400">MongoDB status abhi bot API se nahi aa raha.</p>
                <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto">
                  Bot ke <code className="text-blue-400">/admin/stats</code> response mein <code className="text-blue-400">mongodb</code> object add karein (neeche guide dekhein).
                </p>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <CardHeader icon={Bot} title="Bot Runtime" right={<StatusPill ok={botInfo ? true : null} label={botInfo ? "Online" : "Not reported"} />} />
          <div className="px-5 sm:px-8 py-2">
            {botInfo ? (
              <>
                <InfoRow label="Uptime" value={botInfo.uptime || "—"} />
                <InfoRow label="Guilds" value={botInfo.guilds ?? "—"} />
                <InfoRow label="Users" value={botInfo.users?.toLocaleString() ?? "—"} />
                <InfoRow label="Commands" value={botInfo.commands ?? "—"} />
                <InfoRow label="Restarts" value={botInfo.restarts ?? "—"} />
                <InfoRow label="Version" value={botInfo.version || "—"} />
              </>
            ) : (
              <div className="py-8 text-center">
                <Clock className="h-8 w-8 text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-400">Bot runtime data abhi available nahi hai.</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* System Nodes + Global Settings */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2">
          <CardHeader
            icon={Activity}
            title="System Nodes Status"
            right={<span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Auto-polling · 30s</span>}
          />
          <div className="p-4 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {stats?.nodes?.length ? stats.nodes.map((node) => {
              const Icon = NODE_ICONS[node.icon as string] || Lock;
              const isHealthy = node.status === "Healthy";
              return (
                <div key={node.name} className="flex items-center justify-between gap-3 p-4 bg-white/[0.02] rounded-2xl border border-white/5 hover:bg-white/[0.04] transition-all min-w-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-slate-800 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-slate-400" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">{node.name}</h4>
                      <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest truncate">Load: {node.load}</p>
                    </div>
                  </div>
                  <StatusPill ok={isHealthy} label={node.status} />
                </div>
              );
            }) : (
              <p className="text-sm text-slate-500 col-span-full text-center py-6">No node data.</p>
            )}
          </div>
        </Card>

        <Card className="flex flex-col">
          <CardHeader icon={Settings} title="Global Settings" />
          <div className="p-5 sm:p-8 flex-1 space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Maintenance Mode</label>
              <button
                onClick={handleToggleMaintenance}
                disabled={saving || !config}
                className={cn(
                  "w-full flex items-center justify-between gap-3 p-4 rounded-2xl border transition-all min-h-[56px] disabled:opacity-50",
                  config?.maintenance_mode
                    ? "bg-blue-500/10 border-blue-500/30 text-blue-300"
                    : "bg-white/[0.03] border-white/5 text-slate-300 hover:bg-white/[0.05]"
                )}
              >
                <span className="flex items-center gap-3 text-sm font-medium text-left">
                  <Power className="h-4 w-4 shrink-0" />
                  {config?.maintenance_mode ? "Restricting Access" : "Standard Operations"}
                </span>
                <span className={cn(
                  "h-6 w-11 shrink-0 rounded-full relative transition-colors duration-300",
                  config?.maintenance_mode ? "bg-blue-500" : "bg-slate-700"
                )}>
                  <span className={cn(
                    "absolute top-1 h-4 w-4 bg-white rounded-full transition-all duration-300 shadow-sm",
                    config?.maintenance_mode ? "left-6" : "left-1"
                  )} />
                </span>
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                <Megaphone className="h-3.5 w-3.5" /> Global Notification
              </label>
              <textarea
                value={notification}
                onChange={(e) => setNotification(e.target.value)}
                className="w-full min-h-[120px] bg-white/[0.03] border border-white/5 rounded-2xl p-4 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500/40 transition-all placeholder:text-slate-600 resize-y"
                placeholder="Message to display across all dashboards..."
              />
            </div>

            <button
              onClick={handleBroadcast}
              disabled={saving || !config}
              className="w-full min-h-[48px] py-3.5 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black uppercase tracking-widest text-xs text-white shadow-xl shadow-blue-600/20 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {saving ? "Processing..." : "Broadcast Message"}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
