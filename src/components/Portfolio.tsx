"use client";

import { useState } from "react";
import { MapPin, AlertTriangle, TrendingUp, FileText, DollarSign, Shield, Target, Flame } from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, Legend
} from "recharts";

const inforceMetrics = [
  { label: "Total Policies", value: "1,247", change: "+8.3%" },
  { label: "Total TIV", value: "$18.4B", change: "+12.1%" },
  { label: "GWP Inforce", value: "$142.8M", change: "+12.4%" },
  { label: "Avg Premium", value: "$485K", change: "+5.2%" },
  { label: "Loss Ratio YTD", value: "54%", change: "-2.8%" },
  { label: "Combined Ratio", value: "96.5%", change: "-1.5%" },
];

const locationExposures = [
  { territory: "California", policyCount: 342, tiv: "$5.2B", locationCount: 2847, catExposure: "High", eqPML: "$1.8B" },
  { territory: "New York", policyCount: 198, tiv: "$3.8B", locationCount: 1456, catExposure: "Moderate", eqPML: "$420M" },
  { territory: "Florida", policyCount: 156, tiv: "$2.9B", locationCount: 1098, catExposure: "High", eqPML: "$0" },
  { territory: "Texas", policyCount: 134, tiv: "$2.1B", locationCount: 978, catExposure: "Moderate", eqPML: "$0" },
  { territory: "Illinois", policyCount: 112, tiv: "$1.7B", locationCount: 745, catExposure: "Low", eqPML: "$85M" },
];

const accumulations = [
  { zone: "Los Angeles Metro", peril: "Earthquake", tivConcentration: "$1.5B", policyCount: 112, limitUtilization: 92, status: "At Limit" },
  { zone: "San Francisco Bay", peril: "Earthquake", tivConcentration: "$1.2B", policyCount: 87, limitUtilization: 85, status: "Near Limit" },
  { zone: "Miami-Dade County", peril: "Hurricane", tivConcentration: "$890M", policyCount: 64, limitUtilization: 78, status: "Monitor" },
  { zone: "Houston Metro", peril: "Flood/Wind", tivConcentration: "$720M", policyCount: 52, limitUtilization: 62, status: "Healthy" },
  { zone: "Tornado Alley", peril: "Convective Storm", tivConcentration: "$580M", policyCount: 45, limitUtilization: 58, status: "Healthy" },
  { zone: "Pacific NW", peril: "Earthquake", tivConcentration: "$340M", policyCount: 28, limitUtilization: 42, status: "Healthy" },
];

const catExceedance = [
  { rp: "10yr", fire: 8.2, eq: 12.5, wind: 6.8, flood: 3.2 },
  { rp: "25yr", fire: 14.5, eq: 28.4, wind: 15.2, flood: 7.8 },
  { rp: "50yr", fire: 22.1, eq: 48.2, wind: 28.5, flood: 14.2 },
  { rp: "100yr", fire: 32.8, eq: 72.4, wind: 45.8, flood: 22.5 },
  { rp: "250yr", fire: 48.5, eq: 112.8, wind: 68.2, flood: 35.4 },
  { rp: "500yr", fire: 65.2, eq: 158.4, wind: 92.5, flood: 48.8 },
];

const lossRatioTrend = [
  { quarter: "Q1'25", attritional: 32, cat: 8, total: 40 },
  { quarter: "Q2'25", attritional: 35, cat: 22, total: 57 },
  { quarter: "Q3'25", attritional: 33, cat: 5, total: 38 },
  { quarter: "Q4'25", attritional: 30, cat: 4, total: 34 },
  { quarter: "Q1'26", attritional: 31, cat: 3, total: 34 },
];

const occupancyDistribution = [
  { name: "Office", value: 32, color: "#009AE4" },
  { name: "Healthcare", value: 18, color: "#22C55E" },
  { name: "Retail", value: 15, color: "#F59E0B" },
  { name: "Education", value: 12, color: "#8B5CF6" },
  { name: "Manufacturing", value: 14, color: "#EF4444" },
  { name: "Municipal", value: 9, color: "#6B7280" },
];

const reinsuranceTreaty = [
  { treaty: "Quota Share (25%)", capacity: "$250M", utilized: "$187M", pct: 75, status: "Active" },
  { treaty: "1st Excess ($10M xs $5M)", capacity: "$10M", utilized: "$0", pct: 0, status: "Active" },
  { treaty: "CAT XL ($50M xs $25M)", capacity: "$50M", utilized: "$0", pct: 0, status: "Active" },
  { treaty: "Fac Obligatory", capacity: "$100M", utilized: "$42M", pct: 42, status: "Active" },
];

export function Portfolio() {
  const [activeTab, setActiveTab] = useState<"overview" | "cat" | "reinsurance">("overview");

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="bg-white border-b border-[#E5E7EB] px-8">
        <div className="flex gap-8">
          {[
            { key: "overview" as const, label: "Portfolio Overview" },
            { key: "cat" as const, label: "CAT & Accumulation" },
            { key: "reinsurance" as const, label: "Reinsurance" },
          ].map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key ? "border-[#009AE4] text-[#009AE4]" : "border-transparent text-[#4B5563] hover:text-[#111827]"
              }`}
            >{tab.label}</button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "cat" && <CATTab />}
        {activeTab === "reinsurance" && <ReinsuranceTab />}
      </div>
    </div>
  );
}

function OverviewTab() {
  return (
    <div className="p-8">
      {/* Metrics */}
      <div className="grid grid-cols-6 gap-4 mb-6">
        {inforceMetrics.map((m) => (
          <div key={m.label} className="bg-white rounded-xl p-4 border border-[#E5E7EB]">
            <div className="flex items-start justify-between mb-3">
              <div className="text-xs text-[#4B5563]">{m.label}</div>
              <span className={`text-xs font-medium ${m.change.startsWith("+") && !m.label.includes("Loss") && !m.label.includes("Combined") ? "text-green-600" : m.change.startsWith("-") ? "text-green-600" : "text-green-600"}`}>
                {m.change}
              </span>
            </div>
            <div className="text-2xl font-semibold text-[#111827]">{m.value}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Loss Ratio Trend */}
        <div className="col-span-2 bg-white rounded-xl border border-[#E5E7EB] p-6">
          <h3 className="text-sm font-semibold text-[#111827] mb-1">Loss Ratio Trend (Quarterly)</h3>
          <p className="text-xs text-[#4B5563] mb-4">Attritional vs CAT losses</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={lossRatioTrend}>
              <CartesianGrid key="grid-portfolio-loss" strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis key="xaxis-portfolio-loss" dataKey="quarter" stroke="#4B5563" style={{ fontSize: "11px" }} />
              <YAxis key="yaxis-portfolio-loss" stroke="#4B5563" style={{ fontSize: "11px" }} />
              <Tooltip key="tooltip-portfolio-loss" contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid #E5E7EB" }} />
              <Legend key="legend-portfolio-loss" wrapperStyle={{ fontSize: "11px" }} />
              <Bar key="attritional-bar" dataKey="attritional" stackId="a" fill="#009AE4" name="Attritional" />
              <Bar key="cat-bar" dataKey="cat" stackId="a" fill="#EF4444" radius={[4, 4, 0, 0]} name="CAT" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Occupancy Mix */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
          <h3 className="text-sm font-semibold text-[#111827] mb-1">Occupancy Mix</h3>
          <p className="text-xs text-[#4B5563] mb-4">% of inforce premium</p>
          <div className="flex items-center gap-3">
            <ResponsiveContainer width="50%" height={180}>
              <PieChart>
                <Pie key="pie-portfolio-occupancy" data={occupancyDistribution} cx="50%" cy="50%" outerRadius={65} innerRadius={35} dataKey="value" paddingAngle={2}>
                  {occupancyDistribution.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-1.5">
              {occupancyDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-[#4B5563] flex-1">{item.name}</span>
                  <span className="font-semibold text-[#111827]">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Territory Table */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] mb-6">
        <div className="p-6 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#009AE4]" />
            <h3 className="text-lg font-semibold text-[#111827]">Territory Exposure Summary</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F7F8FA] border-b border-[#E5E7EB]">
              <tr>
                {["Territory", "Policies", "Total TIV", "Locations", "EQ PML", "CAT Exposure"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-[#4B5563] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {locationExposures.map((item) => (
                <tr key={item.territory} className="hover:bg-[#F7F8FA] transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-[#111827]">{item.territory}</td>
                  <td className="px-6 py-4 text-sm text-[#111827]">{item.policyCount}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-[#009AE4]">{item.tiv}</td>
                  <td className="px-6 py-4 text-sm text-[#111827]">{item.locationCount}</td>
                  <td className="px-6 py-4 text-sm text-[#111827]">{item.eqPML}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.catExposure === "High" ? "bg-red-100 text-red-800" : item.catExposure === "Moderate" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                    }`}>{item.catExposure}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CATTab() {
  return (
    <div className="p-8">
      {/* CAT Summary Cards */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {[
          { label: "Portfolio AAL", value: "$12.4M", hint: "All perils" },
          { label: "250-yr OEP", value: "$112.8M", hint: "Earthquake dominant" },
          { label: "500-yr OEP", value: "$158.4M", hint: "Tail risk" },
          { label: "250-yr TVaR", value: "$128.5M", hint: "Tail Value at Risk" },
          { label: "Net Retention", value: "$75M", hint: "After reinsurance" },
        ].map((m) => (
          <div key={m.label} className="bg-white rounded-xl p-4 border border-[#E5E7EB]">
            <div className="text-xs text-[#4B5563] uppercase tracking-wider mb-2">{m.label}</div>
            <div className="text-2xl font-bold text-[#111827] mb-1">{m.value}</div>
            <div className="text-xs text-[#4B5563]">{m.hint}</div>
          </div>
        ))}
      </div>

      {/* Exceedance Curve */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 mb-6">
        <h3 className="text-sm font-semibold text-[#111827] mb-1">OEP Exceedance Curve by Peril ($M)</h3>
        <p className="text-xs text-[#4B5563] mb-4">Return period losses across all modeled perils</p>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={catExceedance}>
            <CartesianGrid key="grid-exceedance" strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis key="xaxis-exceedance" dataKey="rp" stroke="#4B5563" style={{ fontSize: "11px" }} />
            <YAxis key="yaxis-exceedance" stroke="#4B5563" style={{ fontSize: "11px" }} />
            <Tooltip key="tooltip-exceedance" contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid #E5E7EB" }} />
            <Legend key="legend-exceedance" wrapperStyle={{ fontSize: "11px" }} />
            <Line key="eq-line" type="monotone" dataKey="eq" stroke="#EF4444" strokeWidth={2.5} name="Earthquake" dot={{ r: 4 }} />
            <Line key="wind-line" type="monotone" dataKey="wind" stroke="#F59E0B" strokeWidth={2} name="Windstorm" dot={{ r: 3 }} />
            <Line key="fire-line" type="monotone" dataKey="fire" stroke="#009AE4" strokeWidth={2} name="Fire" dot={{ r: 3 }} />
            <Line key="flood-line" type="monotone" dataKey="flood" stroke="#8B5CF6" strokeWidth={1.5} name="Flood" dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Accumulation Table */}
      <div className="bg-white rounded-xl border border-[#E5E7EB]">
        <div className="p-6 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#009AE4]" />
            <h3 className="text-lg font-semibold text-[#111827]">Accumulation Zone Monitoring</h3>
          </div>
          <p className="text-sm text-[#4B5563] mt-1">TIV concentration by zone and peril with capacity limits</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F7F8FA] border-b border-[#E5E7EB]">
              <tr>
                {["Zone", "Peril", "TIV", "Policies", "Limit Utilization", "Status"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-[#4B5563] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {accumulations.map((item) => (
                <tr key={item.zone} className="hover:bg-[#F7F8FA] transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-[#111827]">{item.zone}</td>
                  <td className="px-6 py-4 text-sm text-[#111827]">{item.peril}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-[#009AE4]">{item.tivConcentration}</td>
                  <td className="px-6 py-4 text-sm text-[#111827]">{item.policyCount}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-[#E5E7EB] rounded-full h-2 max-w-[80px]">
                        <div className={`h-2 rounded-full ${
                          item.limitUtilization >= 90 ? "bg-red-600" : item.limitUtilization >= 75 ? "bg-yellow-600" : "bg-green-600"
                        }`} style={{ width: `${item.limitUtilization}%` }} />
                      </div>
                      <span className="text-xs text-[#4B5563]">{item.limitUtilization}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.status === "At Limit" ? "bg-red-100 text-red-800"
                        : item.status === "Near Limit" ? "bg-orange-100 text-orange-800"
                        : item.status === "Monitor" ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}>{item.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ReinsuranceTab() {
  const scenarioTests = [
    { scenario: "San Andreas M8.0", grossLoss: "$145M", ceded: "$95M", netRetained: "$50M", impact: "Within tolerance" },
    { scenario: "FL Cat 5 Landfall (Miami)", grossLoss: "$82M", ceded: "$52M", netRetained: "$30M", impact: "Within tolerance" },
    { scenario: "New Madrid EQ M7.5", grossLoss: "$38M", ceded: "$18M", netRetained: "$20M", impact: "Within tolerance" },
    { scenario: "CA Wildfire (LA County)", grossLoss: "$28M", ceded: "$12M", netRetained: "$16M", impact: "Within tolerance" },
  ];

  return (
    <div className="p-8">
      {/* Treaty Summary */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] mb-6">
        <div className="p-6 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#009AE4]" />
            <h3 className="text-lg font-semibold text-[#111827]">Reinsurance Treaty Structure</h3>
          </div>
          <p className="text-sm text-[#4B5563] mt-1">Active treaty programs and utilization</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F7F8FA] border-b border-[#E5E7EB]">
              <tr>
                {["Treaty", "Capacity", "Utilized", "Utilization", "Status"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-[#4B5563] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {reinsuranceTreaty.map((t) => (
                <tr key={t.treaty} className="hover:bg-[#F7F8FA]">
                  <td className="px-6 py-4 text-sm font-medium text-[#111827]">{t.treaty}</td>
                  <td className="px-6 py-4 text-sm text-[#111827]">{t.capacity}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-[#009AE4]">{t.utilized}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-[#E5E7EB] rounded-full h-2 max-w-[80px]">
                        <div className="bg-[#009AE4] h-2 rounded-full" style={{ width: `${t.pct}%` }} />
                      </div>
                      <span className="text-xs text-[#4B5563]">{t.pct}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">{t.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scenario Testing */}
      <div className="bg-white rounded-xl border border-[#E5E7EB]">
        <div className="p-6 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#009AE4]" />
            <h3 className="text-lg font-semibold text-[#111827]">Stress Test Scenarios</h3>
          </div>
          <p className="text-sm text-[#4B5563] mt-1">Net retained loss after reinsurance recoveries</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F7F8FA] border-b border-[#E5E7EB]">
              <tr>
                {["Scenario", "Gross Loss", "Ceded", "Net Retained", "Assessment"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-[#4B5563] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {scenarioTests.map((s) => (
                <tr key={s.scenario} className="hover:bg-[#F7F8FA]">
                  <td className="px-6 py-4 text-sm font-medium text-[#111827]">{s.scenario}</td>
                  <td className="px-6 py-4 text-sm text-red-600 font-semibold">{s.grossLoss}</td>
                  <td className="px-6 py-4 text-sm text-[#009AE4] font-semibold">{s.ceded}</td>
                  <td className="px-6 py-4 text-sm font-bold text-[#111827]">{s.netRetained}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">{s.impact}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
