"use client";

import Link from "next/link";
import { useRole } from "./RoleContext";
import { useState, useEffect } from "react";
import {
  Sparkles, AlertTriangle, Clock, CheckCircle2, TrendingUp, TrendingDown, ArrowUp, ArrowDown, Users,
  ArrowRight, Zap, ChevronRight, FileText, DollarSign, Target,
  Shield, Activity, Calendar, MapPin, Flame, BarChart3,
  Inbox, Mail, User, Paperclip
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import { motion, AnimatePresence } from "motion/react";

// ── Shared Components ──

function AIMessage({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="flex gap-3 items-start"
    >
      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#009AE4] to-[#007BB6] flex items-center justify-center flex-shrink-0 mt-0.5">
        <Sparkles className="w-3.5 h-3.5 text-white" />
      </div>
      <div className="flex-1 min-w-0">{children}</div>
    </motion.div>
  );
}

function Artifact({ children, title, delay = 0 }: { children: React.ReactNode; title?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.3 }}
      className="bg-white rounded-xl border border-[#E8E6E1] overflow-hidden shadow-sm"
    >
      {title && (
        <div className="px-5 py-3 border-b border-[#E8E6E1] bg-[#FAFAF9]">
          <span className="text-xs text-[#8E8C88] uppercase tracking-wider" style={{ fontWeight: 600 }}>{title}</span>
        </div>
      )}
      <div className="p-5">{children}</div>
    </motion.div>
  );
}

function QuickAction({ label, onClick, icon: Icon }: { label: string; onClick?: () => void; icon?: any }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#D9D9D6] bg-white hover:bg-[#F3F3F1] hover:border-[#C0BFBB] transition-all text-sm text-[#5D5D5D] hover:text-[#2D2D2D]"
    >
      {Icon && <Icon className="w-3.5 h-3.5" />}
      <span>{label}</span>
    </button>
  );
}

// ── Book Snapshot tiles ──

interface SnapRow { label: string; value: string | number; tone?: "default" | "muted" | "accent" }

function SnapTile({ heading, rows }: { heading: string; rows: SnapRow[] }) {
  return (
    <div className="bg-white rounded-xl border border-[#E8E6E1] p-4 flex flex-col gap-2 min-w-0">
      <div className="text-[10px] text-[#009AE4] uppercase tracking-wider" style={{ fontWeight: 700 }}>
        {heading}
      </div>
      <div className="space-y-1.5">
        {rows.map((r) => (
          <div key={r.label} className="flex items-baseline justify-between gap-2">
            <span className="text-[12px] text-[#5D5D5D] truncate">{r.label}</span>
            <span
              className={`text-[18px] tabular-nums ${
                r.tone === "muted" ? "text-[#9B9B98]" : "text-[#1A1A1A]"
              }`}
              style={{ fontWeight: 600 }}
            >
              {r.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RatioTile({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white rounded-xl border border-[#E8E6E1] p-4">
      <div className="text-[10px] text-[#9B9B98] uppercase tracking-wider mb-1" style={{ fontWeight: 700 }}>
        {label}
      </div>
      <div className="text-[22px] text-[#1A1A1A] tabular-nums" style={{ fontWeight: 600 }}>
        {value}
      </div>
      {sub && <div className="text-[10px] text-[#9B9B98] mt-0.5">{sub}</div>}
    </div>
  );
}

function BookSnapshot() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05, duration: 0.35 }}
      className="space-y-3"
    >
      <div>
        <h2 className="text-[20px] text-[#1A1A1A]" style={{ fontWeight: 700 }}>The Hub</h2>
        <p className="text-[12px] text-[#9B9B98]">Real-time book snapshot</p>
      </div>

      <div className="grid grid-cols-5 gap-3">
        <SnapTile
          heading="Submissions"
          rows={[
            { label: "Awaiting TRIAGE", value: 12 },
            { label: "With Modelling", value: 10 },
            { label: "Modelling Returned", value: 5 },
          ]}
        />
        <SnapTile
          heading="Rating"
          rows={[{ label: "Live Rating", value: 3 }]}
        />
        <SnapTile
          heading="Quoting"
          rows={[
            { label: "Indications", value: 1 },
            { label: "Quotes", value: 2 },
          ]}
        />
        <SnapTile
          heading="Binders"
          rows={[
            { label: "Bind Orders", value: 1 },
            { label: "Awaiting Issuance", value: 0, tone: "muted" },
          ]}
        />
        <SnapTile
          heading="Policies"
          rows={[
            { label: "Awaiting Review", value: 8 },
            { label: "Issued YTD", value: 14 },
          ]}
        />
      </div>

      <div className="grid grid-cols-4 gap-3">
        <RatioTile label="GWP / NWP" value="$142.8M" sub="/ $125.3M YTD" />
        <RatioTile label="Sub → Quote" value="0.08" />
        <RatioTile label="Quote → Bind" value="0.33" />
        <RatioTile label="Loss Ratio" value="0.27" />
      </div>
    </motion.div>
  );
}

// ── Distribution mailbox tile ──

interface MailItem {
  id: string;
  from: string;
  subject: string;
  preview: string;
  submission?: string;
  time: string;
  unread?: boolean;
  flag?: "urgent" | "overdue" | "info";
  attachments?: number;
}

const groupMail: MailItem[] = [
  {
    id: "gm-1",
    from: "Sarah Mitchell · AON",
    subject: "Westfield Manufacturing — updated SOV + engineering report",
    preview: "Attaching the revised SOV with Tampa building details and the 2025 engineering walkthrough you asked for…",
    submission: "SUB-2026-0847",
    time: "14m",
    unread: true,
    flag: "urgent",
    attachments: 3,
  },
  {
    id: "gm-2",
    from: "distribution@qbe.com",
    subject: "New submission — Atlantic Distribution renewal",
    preview: "Routed from ingestion queue. Broker: WTW. TIV $89M. Inception 15 May 2026.",
    submission: "SUB-2026-0845",
    time: "1h",
    unread: true,
  },
  {
    id: "gm-3",
    from: "David Park · Lockton",
    subject: "Re: Pacific Coast Hotels — NWS deductible question",
    preview: "Client pushing back on the $2M NWS deductible — can we discuss a $1.5M compromise with a per-location cap?",
    submission: "SUB-2026-0843",
    time: "3h",
    flag: "info",
  },
];

const personalMail: MailItem[] = [
  {
    id: "pm-1",
    from: "Jennifer Blake · Aon",
    subject: "TechCorp Solutions — indication timing",
    preview: "Hi Ashley — the broker team is hoping to get an indication by Friday. Is that feasible given modelling?",
    submission: "SUB-2026-0850",
    time: "22m",
    unread: true,
    flag: "overdue",
  },
  {
    id: "pm-2",
    from: "Michael Torres · WTW",
    subject: "Atlantic Distribution — loss run clarification",
    preview: "Attaching the corrected 2022 loss run. Please confirm receipt before triage.",
    submission: "SUB-2026-0845",
    time: "2h",
    unread: true,
    attachments: 1,
  },
  {
    id: "pm-3",
    from: "Ashley Chen (you)",
    subject: "Draft — Westfield quote cover note",
    preview: "Saved in drafts. Subjectivities block needs final sign-off before send.",
    time: "Yesterday",
  },
];

function MailboxTab({
  active,
  onClick,
  icon: Icon,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  icon: any;
  label: string;
  count: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] transition-colors ${
        active
          ? "bg-[#EEF4FB] text-[#0F3B6B] border border-[#CBDAEA]"
          : "text-[#5D5D5D] hover:bg-[#F3F3F1] border border-transparent"
      }`}
      style={{ fontWeight: active ? 700 : 500 }}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{label}</span>
      <span
        className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] ${
          active ? "bg-[#0F3B6B] text-white" : "bg-[#E8E6E1] text-[#5D5D5D]"
        }`}
        style={{ fontWeight: 700 }}
      >
        {count}
      </span>
    </button>
  );
}

function MailRow({ item }: { item: MailItem }) {
  const flagColor =
    item.flag === "urgent"
      ? "bg-red-500"
      : item.flag === "overdue"
      ? "bg-amber-500"
      : item.flag === "info"
      ? "bg-blue-400"
      : null;

  const target = item.submission ? `#` : "#";

  //const target = item.submission ? `/submission/${item.submission}` : "#";

  return (
    <Link
      href={target || "/"}
      className="group flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-[#F3F3F1] transition-colors border border-transparent hover:border-[#E8E6E1]"
    >
      <div className="flex flex-col items-center gap-1 pt-0.5 flex-shrink-0">
        <div className="w-7 h-7 rounded-full bg-[#EEF4FB] text-[#0F3B6B] flex items-center justify-center text-[10px]" style={{ fontWeight: 700 }}>
          {item.from.charAt(0).toUpperCase()}
        </div>
        {flagColor && <div className={`w-1.5 h-1.5 rounded-full ${flagColor}`} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span
            className={`text-[12px] truncate ${item.unread ? "text-[#1A1A1A]" : "text-[#5D5D5D]"}`}
            style={{ fontWeight: item.unread ? 700 : 500 }}
          >
            {item.from}
          </span>
          {item.submission && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F3F3F1] text-[#5D5D5D] flex-shrink-0" style={{ fontWeight: 600 }}>
              {item.submission}
            </span>
          )}
          <span className="ml-auto text-[10px] text-[#9B9B98] flex-shrink-0">{item.time}</span>
        </div>
        <div
          className={`text-[12px] truncate mb-0.5 ${item.unread ? "text-[#2D2D2D]" : "text-[#5D5D5D]"}`}
          style={{ fontWeight: item.unread ? 600 : 500 }}
        >
          {item.subject}
        </div>
        <div className="text-[11px] text-[#9B9B98] truncate">{item.preview}</div>
        {item.attachments && (
          <div className="flex items-center gap-1 mt-1 text-[10px] text-[#6B7280]">
            <Paperclip className="w-3 h-3" />
            <span>{item.attachments} attachment{item.attachments > 1 ? "s" : ""}</span>
          </div>
        )}
      </div>
      <ChevronRight className="w-3.5 h-3.5 text-[#B0B0AC] mt-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
    </Link>
  );
}

function DistributionMailboxTile() {
  const [tab, setTab] = useState<"group" | "personal">("group");
  const items = tab === "group" ? groupMail : personalMail;
  const groupUnread = groupMail.filter((m) => m.unread).length;
  const personalUnread = personalMail.filter((m) => m.unread).length;

  return (
    <div className="bg-white rounded-xl border border-[#E8E6E1] overflow-hidden">
      <div className="px-5 py-3 border-b border-[#E8E6E1] bg-[#FAFAF9] flex items-center gap-3">
        <span className="text-xs text-[#8E8C88] uppercase tracking-wider" style={{ fontWeight: 600 }}>
          Distribution
        </span>
        <span className="text-[11px] text-[#9B9B98]">· mailbox integration</span>
        <div className="ml-auto flex items-center gap-1.5">
          <MailboxTab
            active={tab === "group"}
            onClick={() => setTab("group")}
            icon={Inbox}
            label="Group inbox"
            count={groupUnread}
          />
          <MailboxTab
            active={tab === "personal"}
            onClick={() => setTab("personal")}
            icon={User}
            label="My inbox"
            count={personalUnread}
          />
        </div>
      </div>
      <div className="p-2">
        {items.map((item) => (
          <MailRow key={item.id} item={item} />
        ))}
      </div>
      <div className="px-4 py-2.5 border-t border-[#E8E6E1] bg-[#FAFAF9] flex items-center justify-between">
        <span className="text-[11px] text-[#9B9B98]">
          {tab === "group" ? "distribution@qbe.com · team-shared" : "ashley.chen@qbe.com"}
        </span>
        <button className="text-[11px] text-[#0F3B6B] hover:underline inline-flex items-center gap-1" style={{ fontWeight: 600 }}>
          Open full mailbox
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

function RecommendedActionsTile() {
  const actions = [
    {
      title: "Westfield Manufacturing",
      desc: "Modelling returned, ready for HX rating",
      to: "/submission/SUB-2026-0847",
    },
    {
      title: "3 submissions approaching 30-day SLA",
      desc: "Triage decisions needed to avoid breach",
      to: "/submissions",
    },
  ];
  return (
    <div className="bg-white rounded-xl border border-[#E8E6E1] overflow-hidden">
      <div className="px-5 py-3 border-b border-[#E8E6E1] bg-[#FAFAF9] flex items-center gap-2">
        <span className="text-xs text-[#8E8C88] uppercase tracking-wider" style={{ fontWeight: 600 }}>
          Recommended Actions
        </span>
        <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-[#009AE4] text-[9px] text-white" style={{ fontWeight: 700 }}>
          AI
        </span>
      </div>
      <div className="p-2 space-y-1">
        {actions.map((a, i) => (
          <Link
            key={i}
            href={a.to || "/"}
            className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-[#F3F3F1] transition-colors group"
          >
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-[#009AE4] to-[#7C3AED] flex items-center justify-center flex-shrink-0 mt-0.5">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] text-[#1A1A1A]" style={{ fontWeight: 600 }}>
                {a.title}
              </div>
              <div className="text-[11px] text-[#5D5D5D]">{a.desc}</div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-[#B0B0AC] mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
      </div>
    </div>
  );
}

// ── Manager Hub ──
function ManagerHub() {
  const [visibleSections, setVisibleSections] = useState(0);

  useEffect(() => {
    const timers = [0, 300, 600, 900, 1200].map((d, i) =>
      setTimeout(() => setVisibleSections(i + 1), d)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const kpis = [
    { label: "GWP YTD", value: "$142.8M", change: "+12.4%", icon: DollarSign },
    { label: "Combined Ratio", value: "96.5%", change: "-1.5%", icon: Target },
    { label: "Loss Ratio", value: "54%", change: "-2.8%", icon: TrendingUp },
    { label: "Bind Ratio", value: "58%", change: "+3.1%", icon: CheckCircle2 },
    { label: "Avg Cycle", value: "3.2d", change: "-18%", icon: Clock },
    { label: "AI Agents", value: "12", change: "active", icon: Zap },
  ];

  const actions = [
    { type: "Accumulation", msg: "LA Metro EQ at 92% — halt new CA earthquake placements until reinsurance review", priority: "critical" as const, to: "/portfolio", icon: AlertTriangle },
    { type: "SLA Risk", msg: "3 submissions approaching SLA deadline within 24 hours", priority: "urgent" as const, to: "/submissions", icon: Clock },
    { type: "Capacity", msg: "Michael Torres at 92% utilization — redirect 3 low-touch to David Park", priority: "high" as const, to: "/team", icon: Users },
    { type: "Renewal", msg: "8 renewals expiring in 30 days — $12.4M premium at risk", priority: "high" as const, to: "/submissions", icon: Calendar },
  ];

  const gwpTrend = [
    { month: "Oct", gwp: 18.2, plan: 17.5 },
    { month: "Nov", gwp: 21.4, plan: 19.0 },
    { month: "Dec", gwp: 19.8, plan: 20.5 },
    { month: "Jan", gwp: 24.1, plan: 22.0 },
    { month: "Feb", gwp: 26.5, plan: 23.5 },
    { month: "Mar", gwp: 32.8, plan: 25.0 },
  ];

  const occupancyMix = [
    { name: "Office", value: 32, color: "#009AE4" },
    { name: "Healthcare", value: 18, color: "#22C55E" },
    { name: "Retail", value: 15, color: "#F59E0B" },
    { name: "Education", value: 12, color: "#8B5CF6" },
    { name: "Manufacturing", value: 14, color: "#EF4444" },
    { name: "Other", value: 9, color: "#9CA3AF" },
  ];

  const zones = [
    { zone: "LA Metro", peril: "Earthquake", util: 92, tiv: "$1.5B", status: "critical" },
    { zone: "SF Bay Area", peril: "Earthquake", util: 85, tiv: "$1.2B", status: "warning" },
    { zone: "Miami-Dade", peril: "Hurricane", util: 78, tiv: "$890M", status: "watch" },
    { zone: "Houston Metro", peril: "Flood", util: 62, tiv: "$720M", status: "healthy" },
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-6">
      {/* Greeting */}
      {visibleSections >= 1 && (
        <AIMessage delay={0}>
          <p className="text-[#2D2D2D] text-base leading-relaxed">
            Good morning, Ashley. Here's your portfolio overview — <span style={{ fontWeight: 600 }}>3 items need your attention today</span>.
            Pipeline velocity is up 12% vs. last week, and your team is tracking ahead of plan.
          </p>
        </AIMessage>
      )}

      {/* Real-time book snapshot */}
      {visibleSections >= 1 && <BookSnapshot />}

      {/* Distribution mailbox + Recommended Actions */}
      {visibleSections >= 2 && (
        <div className="grid grid-cols-2 gap-4">
          <DistributionMailboxTile />
          <RecommendedActionsTile />
        </div>
      )}

      {/* KPIs */}
      {visibleSections >= 2 && (
        <Artifact title="Portfolio KPIs" delay={0.1}>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {kpis.map(k => {
              const Icon = k.icon;
              return (
                <div key={k.label} className="text-center">
                  <div className="w-8 h-8 rounded-lg bg-[#F3F3F1] flex items-center justify-center mx-auto mb-2">
                    <Icon className="w-4 h-4 text-[#009AE4]" />
                  </div>
                  <div className="text-lg text-[#1A1A1A]" style={{ fontWeight: 600 }}>{k.value}</div>
                  <div className="text-[11px] text-[#9B9B98]">{k.label}</div>
                  <div className={`text-[11px] ${
                    k.change.includes('-') ? 'text-red-600' :
                    k.change.includes('$') && k.change.includes('limit') ? 'text-amber-600' :
                    'text-green-600'
                  }`} style={{ fontWeight: 500 }}>{k.change}</div>
                </div>
              );
            })}
          </div>
        </Artifact>
      )}

      {/* Action Items */}
      {visibleSections >= 3 && (
        <AIMessage delay={0.1}>
          <p className="text-[#5D5D5D] text-sm mb-3">These require your review:</p>
          <div className="space-y-2">
            {actions.map((a, i) => {
              const Icon = a.icon;
              const colors = {
                critical: "border-red-200 bg-red-50/80",
                urgent: "border-orange-200 bg-orange-50/80",
                high: "border-amber-200 bg-amber-50/80",
              };
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.08 }}
                >
                  <Link
                    href={a.to || "/"}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all hover:shadow-sm ${colors[a.priority]}`}
                  >
                    <Icon className="w-4 h-4 text-[#5D5D5D] flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] uppercase tracking-wider text-[#9B9B98]" style={{ fontWeight: 600 }}>{a.type}</span>
                      <p className="text-sm text-[#2D2D2D]">{a.msg}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#B0B0AC] flex-shrink-0" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </AIMessage>
      )}

      {/* Charts */}
      {visibleSections >= 4 && (
        <div className="grid grid-cols-2 gap-4">
          <Artifact title="GWP vs Plan ($M)" delay={0.1}>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={gwpTrend}>
                <CartesianGrid key="grid-manager-gwp" strokeDasharray="3 3" stroke="#E8E6E1" />
                <XAxis key="xaxis-manager-gwp" dataKey="month" stroke="#9B9B98" style={{ fontSize: "10px" }} />
                <YAxis key="yaxis-manager-gwp" stroke="#9B9B98" style={{ fontSize: "10px" }} />
                <Tooltip key="tooltip-manager-gwp" contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid #E8E6E1" }} />
                <Area key="area-gwp" type="monotone" dataKey="gwp" stroke="#009AE4" fill="#009AE4" fillOpacity={0.1} strokeWidth={2} name="Actual" />
                <Area key="area-plan" type="monotone" dataKey="plan" stroke="#9CA3AF" fill="none" strokeWidth={1.5} strokeDasharray="4 4" name="Plan" />
              </AreaChart>
            </ResponsiveContainer>
          </Artifact>

          <Artifact title="Occupancy Mix" delay={0.15}>
            <div className="flex items-center gap-3">
              <ResponsiveContainer width="45%" height={140}>
                <PieChart>
                  <Pie key="pie-manager-occupancy" data={occupancyMix} cx="50%" cy="50%" outerRadius={55} innerRadius={30} dataKey="value" paddingAngle={2}>
                    {occupancyMix.map((e) => <Cell key={`cell-manager-${e.name}`} fill={e.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-1">
                {occupancyMix.map(item => (
                  <div key={item.name} className="flex items-center gap-2 text-[11px]">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-[#5D5D5D] flex-1">{item.name}</span>
                    <span className="text-[#2D2D2D]" style={{ fontWeight: 600 }}>{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </Artifact>
        </div>
      )}

      {/* Accumulation */}
      {visibleSections >= 5 && (
        <Artifact title="Accumulation Monitor" delay={0.1}>
          <div className="space-y-3">
            {zones.map(z => (
              <div key={z.zone} className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-[#2D2D2D]" style={{ fontWeight: 500 }}>{z.zone}</div>
                  <div className="text-[11px] text-[#9B9B98]">{z.peril} · {z.tiv}</div>
                </div>
                <div className="w-24">
                  <div className="bg-[#E8E6E1] rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${
                        z.util >= 90 ? "bg-red-500" : z.util >= 75 ? "bg-amber-500" : "bg-green-500"
                      }`}
                      style={{ width: `${z.util}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs text-[#5D5D5D] w-8 text-right" style={{ fontWeight: 600 }}>{z.util}%</span>
              </div>
            ))}
          </div>
        </Artifact>
      )}

      {/* Quick actions */}
      {visibleSections >= 5 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-2"
        >
          <QuickAction label="Review submissions queue" icon={FileText} />
          <QuickAction label="Show CAT accumulation detail" icon={MapPin} />
          <QuickAction label="Team capacity report" icon={Users} />
          <QuickAction label="Renewal pipeline" icon={Calendar} />
        </motion.div>
      )}
    </div>
  );
}

// ── Underwriter Hub ──
function UnderwriterHub() {
  const [visibleSections, setVisibleSections] = useState(0);

  useEffect(() => {
    const timers = [0, 300, 600, 900, 1200].map((d, i) =>
      setTimeout(() => setVisibleSections(i + 1), d)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const kpis = [
    {
      label: "My GWP YTD", value: "$28.4M", icon: DollarSign,
      planPct: 112, planLabel: "of $25.4M plan", planDir: "up" as const,
      wtd: "+$1.8M", wtdDir: "up" as const, wtdLabel: "this week",
      spark: [18, 22, 24, 23, 26, 27, 28.4],
    },
    {
      label: "Active Queue", value: "12", icon: FileText,
      planPct: 80, planLabel: "vs 15 target", planDir: "down" as const,
      wtd: "+3", wtdDir: "up" as const, wtdLabel: "added this wk",
      spark: [14, 13, 11, 10, 9, 11, 12],
    },
    {
      label: "Quote Ratio", value: "74%", icon: Target,
      planPct: 106, planLabel: "of 70% plan", planDir: "up" as const,
      wtd: "+6%", wtdDir: "up" as const, wtdLabel: "WoW",
      spark: [62, 65, 67, 68, 70, 72, 74],
    },
    {
      label: "Avg Cycle", value: "2.8d", icon: Clock,
      planPct: 78, planLabel: "vs 3.6d plan", planDir: "up" as const,
      wtd: "-0.4d", wtdDir: "up" as const, wtdLabel: "WoW",
      spark: [4.1, 3.8, 3.6, 3.3, 3.1, 3.0, 2.8],
    },
    {
      label: "Authority Used", value: "68%", icon: Shield,
      planPct: 68, planLabel: "of $5M limit", planDir: "flat" as const,
      wtd: "+4%", wtdDir: "up" as const, wtdLabel: "WoW",
      spark: [55, 58, 60, 62, 64, 66, 68],
    },
    {
      label: "AI Adoption", value: "94%", icon: Zap,
      planPct: 117, planLabel: "of 80% plan", planDir: "up" as const,
      wtd: "+2%", wtdDir: "up" as const, wtdLabel: "WoW",
      spark: [82, 85, 88, 90, 91, 93, 94],
    },
  ];

  const queue = [
    { id: "SUB-2026-0847", account: "Westfield Manufacturing", tiv: "$125M", stage: "UW Analysis", priority: 94, sla: "urgent", pattern: "High Touch" },
    { id: "SUB-2026-0845", account: "Atlantic Distribution", tiv: "$89M", stage: "Triage", priority: 92, sla: "warning", pattern: "High Touch" },
    { id: "SUB-2026-0850", account: "TechCorp Solutions", tiv: "$210M", stage: "Live Rating", priority: 91, sla: "ok", pattern: "Medium Touch" },
    { id: "SUB-2026-0843", account: "Pacific Coast Hotels", tiv: "$156M", stage: "Modelling", priority: 90, sla: "ok", pattern: "Medium Touch" },
    { id: "SUB-2026-0844", account: "Northeast Logistics", tiv: "$72M", stage: "Quoted", priority: 76, sla: "warning", pattern: "Low Touch" },
  ];

  const hitlGates = [
    { gate: "Triage Decision", pending: 2, desc: "SUB-0847 & SUB-0845 need triage" },
    { gate: "Pricing Validation", pending: 1, desc: "SUB-0843 CAT results ready" },
    { gate: "Approve Quote", pending: 0, desc: "No quotes pending" },
    { gate: "Sign Off Bind", pending: 1, desc: "SUB-0846 binder ready" },
  ];

  const exposure = [
    { peril: "Fire/AOP", tiv: "$1.08B", pct: 100, color: "#009AE4" },
    { peril: "Earthquake", tiv: "$412M", pct: 38, color: "#EF4444" },
    { peril: "Named Wind", tiv: "$285M", pct: 26, color: "#F59E0B" },
    { peril: "Flood", tiv: "$142M", pct: 13, color: "#8B5CF6" },
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-6">
      {/* Greeting */}
      {visibleSections >= 1 && (
        <AIMessage delay={0}>
          <p className="text-[#2D2D2D] text-base leading-relaxed">
            Good morning, Mike. You have <span style={{ fontWeight: 600 }}>5 submissions in your queue</span> and{" "}
            <span style={{ fontWeight: 600 }}>4 HITL decision gates</span> needing attention.
            Westfield Manufacturing is your top priority — approaching SLA deadline.
          </p>
        </AIMessage>
      )}

      {/* Real-time book snapshot */}
      {visibleSections >= 1 && <BookSnapshot />}

      {/* Distribution mailbox + Recommended Actions */}
      {visibleSections >= 2 && (
        <div className="grid grid-cols-2 gap-4">
          <DistributionMailboxTile />
          <RecommendedActionsTile />
        </div>
      )}

      {/* KPIs */}
      {visibleSections >= 2 && (
        <Artifact title="Your Performance" delay={0.1}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {kpis.map(k => {
              const Icon = k.icon;
              const planUp = k.planDir === "up";
              const planFlat = k.planDir === "flat";
              const PlanArrow = planUp ? ArrowUp : ArrowDown;
              const planColor = planFlat ? "text-[#9B9B98]" : planUp ? "text-emerald-600" : "text-red-600";
              const wtdUp = k.wtdDir === "up";
              const WtdArrow = wtdUp ? TrendingUp : TrendingDown;
              const wtdColor = wtdUp ? "text-emerald-600" : "text-red-600";
              const min = Math.min(...k.spark);
              const max = Math.max(...k.spark);
              const range = max - min || 1;
              const w = 64;
              const h = 18;
              const pts = k.spark
                .map((v, i) => `${(i / (k.spark.length - 1)) * w},${h - ((v - min) / range) * h}`)
                .join(" ");
              return (
                <div
                  key={k.label}
                  className="rounded-lg border border-[#E8E6E1] bg-white p-3 hover:border-[#D4D2CC] transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-7 h-7 rounded-md bg-[#F3F3F1] flex items-center justify-center">
                        <Icon className="w-3.5 h-3.5 text-[#009AE4]" />
                      </div>
                      <div className="text-[11px] text-[#6B7280]" style={{ fontWeight: 600 }}>{k.label}</div>
                    </div>
                    <svg width={w} height={h} className="overflow-visible">
                      <polyline
                        points={pts}
                        fill="none"
                        stroke={wtdUp ? "#10B981" : "#EF4444"}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <div className="text-xl text-[#1A1A1A]" style={{ fontWeight: 700 }}>{k.value}</div>
                    <div className={`inline-flex items-center gap-0.5 text-[10px] ${wtdColor}`} style={{ fontWeight: 600 }}>
                      <WtdArrow className="w-3 h-3" />
                      {k.wtd}
                      <span className="text-[#9B9B98] ml-0.5" style={{ fontWeight: 500 }}>{k.wtdLabel}</span>
                    </div>
                  </div>
                  {/* YTD vs plan */}
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-[10px] mb-0.5">
                      <span className="text-[#9B9B98]">YTD vs plan</span>
                      <span className={`inline-flex items-center gap-0.5 ${planColor}`} style={{ fontWeight: 700 }}>
                        <PlanArrow className="w-2.5 h-2.5" />
                        {k.planPct}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#F2F1EE] overflow-hidden">
                      <div
                        className={`h-full rounded-full ${planUp ? "bg-emerald-500" : planFlat ? "bg-[#9B9B98]" : "bg-amber-500"}`}
                        style={{ width: `${Math.min(k.planPct, 120)}%` }}
                      />
                    </div>
                    <div className="text-[9px] text-[#9B9B98] mt-0.5">{k.planLabel}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Artifact>
      )}

      {/* Decision Gates */}
      {visibleSections >= 3 && (
        <AIMessage delay={0.1}>
          <p className="text-[#5D5D5D] text-sm mb-3">Decision gates requiring your action:</p>
          <div className="grid grid-cols-2 gap-2">
            {hitlGates.map((g, i) => (
              <motion.div
                key={g.gate}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.06 }}
                className={`px-4 py-3 rounded-xl border ${
                  g.pending > 0 ? "border-[#009AE4] bg-blue-50/60" : "border-[#E8E6E1] bg-[#FAFAF9]"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[#2D2D2D]" style={{ fontWeight: 600 }}>{g.gate}</span>
                  {g.pending > 0 && (
                    <span className="w-5 h-5 rounded-full bg-[#009AE4] text-white text-[10px] flex items-center justify-center" style={{ fontWeight: 700 }}>
                      {g.pending}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#9B9B98]">{g.desc}</p>
              </motion.div>
            ))}
          </div>
        </AIMessage>
      )}

      {/* Queue */}
      {visibleSections >= 4 && (
        <Artifact title="Your Active Queue" delay={0.1}>
          <div className="space-y-1">
            {queue.map(s => (
              <Link
                key={s.id}
                href={`/submission/${s.id}`}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#F3F3F1] transition-colors group"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] flex-shrink-0 ${
                  s.priority >= 90 ? "bg-[#009AE4]" : "bg-[#9B9B98]"
                }`} style={{ fontWeight: 700 }}>
                  {s.priority}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#2D2D2D]" style={{ fontWeight: 500 }}>{s.account}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      s.pattern === "High Touch" ? "bg-red-100 text-red-600" :
                      s.pattern === "Medium Touch" ? "bg-amber-100 text-amber-600" :
                      "bg-green-100 text-green-600"
                    }`} style={{ fontWeight: 600 }}>{s.pattern}</span>
                  </div>
                  <div className="text-[11px] text-[#9B9B98]">{s.id} · TIV {s.tiv}</div>
                </div>
                <span className="text-[11px] text-[#009AE4] bg-blue-50 px-2 py-0.5 rounded-full" style={{ fontWeight: 500 }}>{s.stage}</span>
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  s.sla === "urgent" ? "bg-red-500" : s.sla === "warning" ? "bg-amber-500" : "bg-green-500"
                }`} />
                <ChevronRight className="w-3.5 h-3.5 text-[#B0B0AC] opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </Artifact>
      )}

      {/* Exposure */}
      {visibleSections >= 5 && (
        <Artifact title="My Book Exposure" delay={0.1}>
          <div className="space-y-2.5">
            {exposure.map(p => (
              <div key={p.peril}>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-[#5D5D5D]">{p.peril}</span>
                  <span className="text-[#2D2D2D]" style={{ fontWeight: 600 }}>{p.tiv}</span>
                </div>
                <div className="bg-[#E8E6E1] rounded-full h-1.5">
                  <div className="h-1.5 rounded-full" style={{ width: `${p.pct}%`, backgroundColor: p.color }} />
                </div>
              </div>
            ))}
          </div>
        </Artifact>
      )}

      {/* Quick actions */}
      {visibleSections >= 5 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-2"
        >
          <QuickAction label="What's my top priority today?" icon={Sparkles} />
          <QuickAction label="Show High Touch submissions" icon={AlertTriangle} />
          <QuickAction label="Compare win propensity" icon={TrendingUp} />
          <QuickAction label="Upcoming renewals" icon={Calendar} />
        </motion.div>
      )}
    </div>
  );
}

export function Hub() {
  const role = useRole();
  return role === "manager" ? <ManagerHub /> : <UnderwriterHub />;
}