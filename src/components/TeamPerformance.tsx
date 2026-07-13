import { useMemo, useState } from "react";
import { TrendingUp, Clock, Target, CheckCircle2, Award, BarChart3, DollarSign, Filter, Users, MapPin, Calendar, ChevronDown } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useRole } from "./RoleContext";

type Region = "Northeast" | "Southeast" | "Midwest" | "West";
type Timeline = "4w" | "q1" | "q2" | "ytd";

interface TeamMember {
  id: string;
  name: string;
  role: "UW" | "Sr UW" | "Lead UW";
  region: Region;
  team: string;
  submissions: number;
  premium: number;
  handleTime: number;
  bindRate: number;
  sla: number;
}

const TEAM_MEMBERS: TeamMember[] = [
  // Mike's team — Midwest (Mike is the UW user)
  { id: "mike-chen",   name: "Mike Chen",       role: "Sr UW",   region: "Midwest",   team: "Midwest Property", submissions: 38, premium: 18.4, handleTime: 2.6, bindRate: 51, sla: 97 },
  { id: "rachel-park", name: "Rachel Park",     role: "UW",      region: "Midwest",   team: "Midwest Property", submissions: 32, premium: 14.8, handleTime: 2.9, bindRate: 46, sla: 95 },
  { id: "david-liu",   name: "David Liu",       role: "UW",      region: "Midwest",   team: "Midwest Property", submissions: 29, premium: 12.2, handleTime: 3.0, bindRate: 44, sla: 94 },
  { id: "tara-singh",  name: "Tara Singh",      role: "UW",      region: "Midwest",   team: "Midwest Property", submissions: 36, premium: 17.1, handleTime: 2.5, bindRate: 49, sla: 98 },
  // Northeast
  { id: "jen-kim",     name: "Jen Kim",         role: "Lead UW", region: "Northeast", team: "NE Commercial",    submissions: 41, premium: 22.6, handleTime: 2.4, bindRate: 53, sla: 98 },
  { id: "marco-rossi", name: "Marco Rossi",     role: "Sr UW",   region: "Northeast", team: "NE Commercial",    submissions: 34, premium: 16.9, handleTime: 2.8, bindRate: 47, sla: 96 },
  { id: "amy-stone",   name: "Amy Stone",       role: "UW",      region: "Northeast", team: "NE Commercial",    submissions: 27, premium: 11.4, handleTime: 3.2, bindRate: 42, sla: 91 },
  // Southeast
  { id: "luis-garza",  name: "Luis Garza",      role: "Lead UW", region: "Southeast", team: "SE CAT-Heavy",     submissions: 45, premium: 26.8, handleTime: 2.3, bindRate: 55, sla: 99 },
  { id: "kara-bell",   name: "Kara Bell",       role: "Sr UW",   region: "Southeast", team: "SE CAT-Heavy",     submissions: 31, premium: 15.2, handleTime: 2.9, bindRate: 45, sla: 93 },
  { id: "owen-pratt",  name: "Owen Pratt",      role: "UW",      region: "Southeast", team: "SE CAT-Heavy",     submissions: 24, premium: 9.8,  handleTime: 3.4, bindRate: 39, sla: 89 },
  // West
  { id: "nina-cole",   name: "Nina Cole",       role: "Sr UW",   region: "West",      team: "West Property",    submissions: 33, premium: 16.3, handleTime: 2.7, bindRate: 48, sla: 96 },
  { id: "sam-vega",    name: "Sam Vega",        role: "UW",      region: "West",      team: "West Property",    submissions: 28, premium: 12.6, handleTime: 3.0, bindRate: 43, sla: 92 },
];

const TIMELINE_LABEL: Record<Timeline, string> = {
  "4w": "Last 4 Weeks",
  "q1":  "Q1 2026",
  "q2":  "Q2 2026 (Current)",
  "ytd": "Year to Date",
};

const TIMELINE_BUCKETS: Record<Timeline, { label: string; actual: number; plan: number }[]> = {
  "4w":  [{label:"W1",actual:30,plan:30},{label:"W2",actual:34,plan:30},{label:"W3",actual:36,plan:30},{label:"W4",actual:35,plan:30}],
  "q1":  [{label:"Jan",actual:112,plan:105},{label:"Feb",actual:118,plan:110},{label:"Mar",actual:127,plan:115}],
  "q2":  [{label:"Apr",actual:135,plan:120},{label:"May",actual:128,plan:122},{label:"Jun",actual:118,plan:120}],
  "ytd": [{label:"Jan",actual:112,plan:105},{label:"Feb",actual:118,plan:110},{label:"Mar",actual:127,plan:115},{label:"Apr",actual:135,plan:120}],
};

const HANDLE_TIME_BUCKETS: Record<Timeline, { label: string; actual: number; target: number }[]> = {
  "4w":  [{label:"W1",actual:2.8,target:3.5},{label:"W2",actual:2.6,target:3.5},{label:"W3",actual:2.9,target:3.5},{label:"W4",actual:2.7,target:3.5}],
  "q1":  [{label:"Jan",actual:3.2,target:3.5},{label:"Feb",actual:3.0,target:3.5},{label:"Mar",actual:2.9,target:3.5}],
  "q2":  [{label:"Apr",actual:2.7,target:3.5},{label:"May",actual:2.6,target:3.5},{label:"Jun",actual:2.5,target:3.5}],
  "ytd": [{label:"Q1",actual:3.0,target:3.5},{label:"Q2",actual:2.6,target:3.5}],
};

export function TeamPerformance() {
  const role = useRole();
  const isManager = role === "manager";

  // UW view is locked to Mike's region/team
  const mikeMember = TEAM_MEMBERS.find(m => m.id === "mike-chen")!;
  const defaultRegion: Region | "all" = isManager ? "all" : mikeMember.region;
  const defaultTeam: string | "all" = isManager ? "all" : mikeMember.team;

  const [region, setRegion] = useState<Region | "all">(defaultRegion);
  const [team, setTeam] = useState<string | "all">(defaultTeam);
  const [timeline, setTimeline] = useState<Timeline>("q2");
  const [memberId, setMemberId] = useState<string>("all");

  const visibleMembers = useMemo(() => {
    return TEAM_MEMBERS.filter(m => {
      // UW always restricted to their team
      if (!isManager && m.team !== mikeMember.team) return false;
      if (region !== "all" && m.region !== region) return false;
      if (team !== "all" && m.team !== team) return false;
      if (memberId !== "all" && m.id !== memberId) return false;
      return true;
    });
  }, [isManager, region, team, memberId]);

  const teamOptions = useMemo(() => {
    const base = isManager ? TEAM_MEMBERS : TEAM_MEMBERS.filter(m => m.team === mikeMember.team);
    const teams = Array.from(new Set(base.filter(m => region === "all" || m.region === region).map(m => m.team)));
    return teams;
  }, [isManager, region]);

  // Aggregate KPIs across the visible members
  const totals = useMemo(() => {
    const submissions = visibleMembers.reduce((s, m) => s + m.submissions, 0);
    const premium = visibleMembers.reduce((s, m) => s + m.premium, 0);
    const handleTime = visibleMembers.length
      ? visibleMembers.reduce((s, m) => s + m.handleTime, 0) / visibleMembers.length
      : 0;
    const sla = visibleMembers.length
      ? visibleMembers.reduce((s, m) => s + m.sla, 0) / visibleMembers.length
      : 0;
    const bindRate = visibleMembers.length
      ? visibleMembers.reduce((s, m) => s + m.bindRate, 0) / visibleMembers.length
      : 0;
    return { submissions, premium, handleTime, sla, bindRate };
  }, [visibleMembers]);

  const submissionsTrend = TIMELINE_BUCKETS[timeline];
  const handleTrend = HANDLE_TIME_BUCKETS[timeline];

  // Region rollup (Manager only)
  const regionRollup = useMemo(() => {
    const regions: Region[] = ["Northeast","Southeast","Midwest","West"];
    return regions.map(r => {
      const members = TEAM_MEMBERS.filter(m => m.region === r);
      return {
        region: r,
        submissions: members.reduce((s,m)=>s+m.submissions,0),
        premium: members.reduce((s,m)=>s+m.premium,0),
        handleTime: members.reduce((s,m)=>s+m.handleTime,0)/members.length,
        sla: members.reduce((s,m)=>s+m.sla,0)/members.length,
        members: members.length,
      };
    });
  }, []);

  return (
    <div className="p-8">
      {/* Filters */}
      <div className="mb-6 bg-white border border-[#E5E7EB] rounded-xl p-4 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 text-sm text-[#111827]">
          <Filter className="w-4 h-4 text-[#009AE4]" />
          <span className="font-semibold">Filters</span>
        </div>

        {/* Region — Manager only editable */}
        <FilterSelect
          icon={MapPin}
          label="Region"
          value={region}
          disabled={!isManager}
          onChange={(v) => { setRegion(v as Region | "all"); setTeam("all"); setMemberId("all"); }}
          options={[
            { value: "all", label: "All Regions" },
            { value: "Northeast", label: "Northeast" },
            { value: "Southeast", label: "Southeast" },
            { value: "Midwest", label: "Midwest" },
            { value: "West", label: "West" },
          ]}
        />

        {/* Team — Manager only editable */}
        <FilterSelect
          icon={Users}
          label="Team"
          value={team}
          disabled={!isManager}
          onChange={(v) => { setTeam(v); setMemberId("all"); }}
          options={[
            { value: "all", label: isManager ? "All Teams" : mikeMember.team },
            ...teamOptions.map(t => ({ value: t, label: t })),
          ]}
        />

        {/* Member */}
        <FilterSelect
          icon={Users}
          label="Member"
          value={memberId}
          onChange={setMemberId}
          options={[
            { value: "all", label: "All Members" },
            ...visibleMembers.length === 0
              ? TEAM_MEMBERS.filter(m => isManager || m.team === mikeMember.team).map(m => ({ value: m.id, label: m.name }))
              : visibleMembers.map(m => ({ value: m.id, label: m.name })),
          ]}
        />

        {/* Timeline */}
        <FilterSelect
          icon={Calendar}
          label="Timeline"
          value={timeline}
          onChange={(v) => setTimeline(v as Timeline)}
          options={[
            { value: "4w",  label: "Last 4 Weeks" },
            { value: "q1",  label: "Q1 2026" },
            { value: "q2",  label: "Q2 2026" },
            { value: "ytd", label: "Year to Date" },
          ]}
        />

        <div className="ml-auto text-[11px] text-[#6B7280]">
          {isManager ? "Manager view · all regions" : `Underwriter view · ${mikeMember.team}`} · {TIMELINE_LABEL[timeline]}
        </div>
      </div>

      {/* Status banner */}
      <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-green-600 flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-green-900 mb-0.5">
              {isManager ? "Portfolio Exceeding Plan" : "Team Exceeding Plan"}
            </h3>
            <p className="text-sm text-green-700">
              {visibleMembers.length} {visibleMembers.length === 1 ? "member" : "members"} · {region === "all" ? "All Regions" : region}
              {team !== "all" ? ` · ${team}` : ""} · {TIMELINE_LABEL[timeline]}
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-xl font-bold text-green-900">+12%</div>
              <div className="text-[11px] text-green-700">vs Plan</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-900">118%</div>
              <div className="text-[11px] text-green-700">Attainment</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-4 gap-4">
            <MetricCard icon={BarChart3} label="Submission Volume" actual={`${totals.submissions}`} plan={`${Math.round(totals.submissions / 1.12)}`} />
            <MetricCard icon={DollarSign} label="Premium Written" actual={`$${totals.premium.toFixed(1)}M`} plan={`$${(totals.premium/1.10).toFixed(1)}M`} />
            <MetricCard icon={Clock} label="Avg Handle Time" actual={`${totals.handleTime.toFixed(1)}d`} plan="3.5d" />
            <MetricCard icon={Target} label="SLA Compliance" actual={`${Math.round(totals.sla)}%`} plan="92%" />
          </div>

          {/* Region rollup — Manager only */}
          {isManager && (
            <div className="bg-white rounded-xl border border-[#E5E7EB]">
              <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#111827]">Performance by Region</h3>
                  <p className="text-sm text-[#4B5563] mt-1">All regions you oversee</p>
                </div>
                <span className="text-[11px] text-[#6B7280]">Click a region to filter</span>
              </div>
              <div className="overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-[#FAFAF9] text-[11px] uppercase tracking-wider text-[#6B7280]">
                    <tr>
                      <th className="text-left px-6 py-2.5 font-semibold">Region</th>
                      <th className="text-right px-3 py-2.5 font-semibold">Members</th>
                      <th className="text-right px-3 py-2.5 font-semibold">Submissions</th>
                      <th className="text-right px-3 py-2.5 font-semibold">Premium</th>
                      <th className="text-right px-3 py-2.5 font-semibold">Avg HT</th>
                      <th className="text-right px-6 py-2.5 font-semibold">SLA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {regionRollup.map(r => (
                      <tr
                        key={r.region}
                        className={`border-t border-[#E5E7EB] cursor-pointer hover:bg-[#F7F8FA] ${region === r.region ? "bg-[#EEF6FB]" : ""}`}
                        onClick={() => { setRegion(r.region); setTeam("all"); setMemberId("all"); }}
                      >
                        <td className="px-6 py-2.5 font-medium text-[#111827]">{r.region}</td>
                        <td className="px-3 py-2.5 text-right">{r.members}</td>
                        <td className="px-3 py-2.5 text-right">{r.submissions}</td>
                        <td className="px-3 py-2.5 text-right">${r.premium.toFixed(1)}M</td>
                        <td className="px-3 py-2.5 text-right">{r.handleTime.toFixed(1)}d</td>
                        <td className="px-6 py-2.5 text-right">
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${r.sla >= 95 ? "bg-green-100 text-green-700" : r.sla >= 90 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
                            {Math.round(r.sla)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Submissions trend */}
          <div className="bg-white rounded-xl border border-[#E5E7EB]">
            <div className="p-6 border-b border-[#E5E7EB]">
              <h3 className="text-lg font-semibold text-[#111827]">Submission Volume vs Plan</h3>
              <p className="text-sm text-[#4B5563] mt-1">{TIMELINE_LABEL[timeline]}</p>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={submissionsTrend}>
                  <CartesianGrid key="grid-vol" strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis key="xaxis-vol" dataKey="label" stroke="#4B5563" style={{ fontSize: "12px" }} />
                  <YAxis key="yaxis-vol" stroke="#4B5563" style={{ fontSize: "12px" }} />
                  <Tooltip key="tooltip-vol" contentStyle={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 12 }} />
                  <Legend key="legend-vol" />
                  <Bar key="bar-plan-vol" dataKey="plan" fill="#E5E7EB" name="Plan" />
                  <Bar key="bar-actual-vol" dataKey="actual" fill="#10B981" name="Actual" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Handle time trend */}
          <div className="bg-white rounded-xl border border-[#E5E7EB]">
            <div className="p-6 border-b border-[#E5E7EB]">
              <h3 className="text-lg font-semibold text-[#111827]">Avg Handle Time Trend</h3>
              <p className="text-sm text-[#4B5563] mt-1">Days submission → decision · {TIMELINE_LABEL[timeline]}</p>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={handleTrend}>
                  <CartesianGrid key="grid-ht" strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis key="xaxis-ht" dataKey="label" stroke="#4B5563" style={{ fontSize: "12px" }} />
                  <YAxis key="yaxis-ht" stroke="#4B5563" style={{ fontSize: "12px" }} domain={[0, 5]} />
                  <Tooltip key="tooltip-ht" contentStyle={{ backgroundColor: "#fff", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 12 }} />
                  <Legend key="legend-ht" />
                  <Line key="line-target-ht" type="monotone" dataKey="target" stroke="#F59E0B" strokeWidth={2} strokeDasharray="5 5" name="Target" />
                  <Line key="line-actual-ht" type="monotone" dataKey="actual" stroke="#10B981" strokeWidth={3} name="Actual" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Member breakdown */}
          <div className="bg-white rounded-xl border border-[#E5E7EB]">
            <div className="p-6 border-b border-[#E5E7EB] flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#111827]">
                  {isManager ? "Performance by Team Member" : "My Team"}
                </h3>
                <p className="text-sm text-[#4B5563] mt-1">{visibleMembers.length} {visibleMembers.length === 1 ? "member" : "members"} matching filters</p>
              </div>
            </div>
            <div className="overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[#FAFAF9] text-[11px] uppercase tracking-wider text-[#6B7280]">
                  <tr>
                    <th className="text-left px-6 py-2.5 font-semibold">Underwriter</th>
                    <th className="text-left px-3 py-2.5 font-semibold">Region · Team</th>
                    <th className="text-right px-3 py-2.5 font-semibold">Subs</th>
                    <th className="text-right px-3 py-2.5 font-semibold">Premium</th>
                    <th className="text-right px-3 py-2.5 font-semibold">Avg HT</th>
                    <th className="text-right px-3 py-2.5 font-semibold">Bind %</th>
                    <th className="text-right px-6 py-2.5 font-semibold">SLA</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleMembers.map(m => (
                    <tr key={m.id} className={`border-t border-[#E5E7EB] hover:bg-[#F7F8FA] ${m.id === mikeMember.id && !isManager ? "bg-[#EEF6FB]" : ""}`}>
                      <td className="px-6 py-2.5">
                        <div className="font-medium text-[#111827]">{m.name}</div>
                        <div className="text-[11px] text-[#6B7280]">{m.role}</div>
                      </td>
                      <td className="px-3 py-2.5 text-[#4B5563]">{m.region} · {m.team}</td>
                      <td className="px-3 py-2.5 text-right">{m.submissions}</td>
                      <td className="px-3 py-2.5 text-right">${m.premium.toFixed(1)}M</td>
                      <td className="px-3 py-2.5 text-right">{m.handleTime.toFixed(1)}d</td>
                      <td className="px-3 py-2.5 text-right">{m.bindRate}%</td>
                      <td className="px-6 py-2.5 text-right">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${m.sla >= 95 ? "bg-green-100 text-green-700" : m.sla >= 90 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
                          {m.sla}%
                        </span>
                      </td>
                    </tr>
                  ))}
                  {visibleMembers.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center px-6 py-8 text-sm text-[#6B7280]">No team members match the selected filters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-[#E5E7EB] sticky top-6">
            <div className="p-6 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#009AE4]" />
                <h3 className="text-sm font-semibold text-[#111827]">Performance Summary</h3>
              </div>
              <p className="text-[11px] text-[#6B7280] mt-1">{TIMELINE_LABEL[timeline]}</p>
            </div>
            <div className="p-6 space-y-3">
              <SummaryCard label="Volume Target" value={`${totals.submissions} subs · +12%`} />
              <SummaryCard label="Speed Target" value={`${totals.handleTime.toFixed(1)}d avg · 23% faster`} />
              <SummaryCard label="Quality Target" value={`${Math.round(totals.sla)}% SLA · +${Math.max(0, Math.round(totals.sla)-92)}pp`} />
              <SummaryCard label="Revenue Target" value={`$${totals.premium.toFixed(1)}M · +10%`} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#009AE4] flex items-center justify-center">
                <span className="text-white text-xs font-semibold">AI</span>
              </div>
              <h3 className="text-sm font-semibold text-[#111827]">AI Impact</h3>
            </div>
            <div className="space-y-4">
              <ProgressRow label="AI Adoption Rate" value="89%" pct={89} color="#009AE4" />
              <ProgressRow label="Time Saved per Submission" value="1.2 days" pct={75} color="#10B981" />
              <div className="pt-3 border-t border-[#E5E7EB] space-y-1">
                <div className="text-xs text-[#4B5563] mb-1">Efficiency Gains</div>
                <Row label="Automated Decisions" value="68%" />
                <Row label="Human-in-Loop" value="32%" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
            <h3 className="text-sm font-semibold text-[#111827] mb-4">{isManager ? "Portfolio Capacity" : "Team Capacity"}</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#4B5563]">Utilization Rate</span>
                  <span className="font-medium text-[#111827]">82%</span>
                </div>
                <div className="bg-[#E5E7EB] rounded-full h-3">
                  <div className="bg-green-600 h-3 rounded-full" style={{ width: "82%" }}></div>
                </div>
                <div className="text-[11px] text-green-600 mt-1">Optimal range (75–85%)</div>
              </div>
              <div className="pt-3 border-t border-[#E5E7EB]">
                <Row label="Current Queue" value={`${visibleMembers.length * 11}`} bold />
                <Row label="Avg per UW" value={`${visibleMembers.length ? (visibleMembers.length * 11 / visibleMembers.length).toFixed(1) : "0"}`} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterSelect({
  icon: Icon, label, value, onChange, options, disabled,
}: {
  icon: any; label: string; value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
}) {
  return (
    <label className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-sm transition-colors ${disabled ? "bg-[#FAFAF9] border-[#E5E7EB] text-[#9B9B98] cursor-not-allowed" : "bg-white border-[#E5E7EB] text-[#111827] hover:border-[#D1CFC9] cursor-pointer"}`}>
      <Icon className="w-3.5 h-3.5 text-[#6B7280]" />
      <span className="text-[11px] text-[#6B7280] uppercase tracking-wide font-semibold">{label}</span>
      <select
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent text-sm outline-none pr-5 disabled:cursor-not-allowed appearance-none"
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <ChevronDown className="w-3.5 h-3.5 text-[#6B7280] absolute right-2 pointer-events-none" />
    </label>
  );
}

function MetricCard({ icon: Icon, label, actual, plan }: { icon: any; label: string; actual: string; plan: string }) {
  return (
    <div className="bg-white rounded-xl p-4 border border-[#E5E7EB]">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-[#009AE4]" />
        <div className="text-xs text-[#4B5563]">{label}</div>
      </div>
      <div className="text-2xl font-semibold text-[#111827] mb-1">{actual}</div>
      <div className="flex items-center gap-2">
        <div className="text-xs text-[#4B5563]">Plan: {plan}</div>
        <CheckCircle2 className="w-3 h-3 text-green-600" />
      </div>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
      <div>
        <div className="text-xs font-medium text-[#111827] mb-0.5">{label}</div>
        <div className="text-xs text-[#4B5563]">{value}</div>
      </div>
    </div>
  );
}

function ProgressRow({ label, value, pct, color }: { label: string; value: string; pct: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-[#4B5563]">{label}</span>
        <span className="font-medium text-[#111827]">{value}</span>
      </div>
      <div className="bg-[#E5E7EB] rounded-full h-2">
        <div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: color }}></div>
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-[#4B5563]">{label}</span>
      <span className={`${bold ? "text-lg font-semibold" : "text-sm font-medium"} text-[#111827]`}>{value}</span>
    </div>
  );
}
