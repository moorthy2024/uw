"use client";

import { Users, Mail, TrendingUp, Clock, AlertCircle, Send, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const producerData = [
  {
    producer: "Marsh & McLennan",
    producerTier: "Platinum",
    totalSubmissions: 342,
    submissionVolume: 28,
    quoteConversionRate: "72%",
    bindConversionRate: "58%",
    averageWrittenPremium: "$485,000",
    responseTime: "2.1 days",
    openCommunicationsCount: 5,
    submissionPipelineStatus: "Active",
    producerEngagementScore: 92,
    slaStatus: "Compliant",
  },
  {
    producer: "Aon",
    producerTier: "Platinum",
    totalSubmissions: 298,
    submissionVolume: 24,
    quoteConversionRate: "68%",
    bindConversionRate: "55%",
    averageWrittenPremium: "$520,000",
    responseTime: "2.4 days",
    openCommunicationsCount: 3,
    submissionPipelineStatus: "Active",
    producerEngagementScore: 88,
    slaStatus: "Compliant",
  },
  {
    producer: "Willis Towers Watson",
    producerTier: "Gold",
    totalSubmissions: 187,
    submissionVolume: 15,
    quoteConversionRate: "65%",
    bindConversionRate: "52%",
    averageWrittenPremium: "$412,000",
    responseTime: "2.8 days",
    openCommunicationsCount: 8,
    submissionPipelineStatus: "Active",
    producerEngagementScore: 85,
    slaStatus: "At Risk",
  },
  {
    producer: "Lockton",
    producerTier: "Gold",
    totalSubmissions: 156,
    submissionVolume: 12,
    quoteConversionRate: "70%",
    bindConversionRate: "60%",
    averageWrittenPremium: "$398,000",
    responseTime: "2.3 days",
    openCommunicationsCount: 2,
    submissionPipelineStatus: "Active",
    producerEngagementScore: 90,
    slaStatus: "Compliant",
  },
];

const volumeChartData = [
  { month: "Oct", volume: 82 },
  { month: "Nov", volume: 91 },
  { month: "Dec", volume: 78 },
  { month: "Jan", volume: 95 },
  { month: "Feb", volume: 88 },
  { month: "Mar", volume: 103 },
];

export function Distribution() {
  return (
    <div className="p-8">
      <div className="grid grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          {/* Producer Performance Summary */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 border border-[#E5E7EB]">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-[#009AE4]" />
                <div className="text-xs text-[#4B5563]">Active Producers</div>
              </div>
              <div className="text-2xl font-semibold text-[#111827]">24</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-[#E5E7EB]">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-[#009AE4]" />
                <div className="text-xs text-[#4B5563]">Avg Conversion</div>
              </div>
              <div className="text-2xl font-semibold text-[#111827]">56%</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-[#E5E7EB]">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-[#009AE4]" />
                <div className="text-xs text-[#4B5563]">Avg Response</div>
              </div>
              <div className="text-2xl font-semibold text-[#111827]">2.4d</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-[#E5E7EB]">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4 text-[#009AE4]" />
                <div className="text-xs text-[#4B5563]">Open Comms</div>
              </div>
              <div className="text-2xl font-semibold text-[#111827]">18</div>
            </div>
          </div>

          {/* Submission Volume Trend */}
          <div className="bg-white rounded-xl border border-[#E5E7EB]">
            <div className="p-6 border-b border-[#E5E7EB]">
              <h3 className="text-lg font-semibold text-[#111827]">Submission Volume (Trailing Period)</h3>
              <p className="text-sm text-[#4B5563] mt-1">Monthly submission trends from all producers</p>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={volumeChartData}>
                  <CartesianGrid key="grid-dist" strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis key="xaxis-dist" dataKey="month" stroke="#4B5563" style={{ fontSize: "12px" }} />
                  <YAxis key="yaxis-dist" stroke="#4B5563" style={{ fontSize: "12px" }} />
                  <Tooltip
                    key="tooltip-dist"
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar key="bar-volume" dataKey="volume" fill="#009AE4" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Producer Performance Table */}
          <div className="bg-white rounded-xl border border-[#E5E7EB]">
            <div className="p-6 border-b border-[#E5E7EB]">
              <h3 className="text-lg font-semibold text-[#111827]">Producer Performance</h3>
              <p className="text-sm text-[#4B5563] mt-1">Key metrics and engagement scores</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F7F8FA] border-b border-[#E5E7EB]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#4B5563] uppercase tracking-wider">
                      Producer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#4B5563] uppercase tracking-wider">
                      Tier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#4B5563] uppercase tracking-wider">
                      Volume (30d)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#4B5563] uppercase tracking-wider">
                      Bind Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#4B5563] uppercase tracking-wider">
                      Avg Premium
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#4B5563] uppercase tracking-wider">
                      Engagement
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#4B5563] uppercase tracking-wider">
                      SLA
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {producerData.map((prod, idx) => (
                    <tr key={idx} className="hover:bg-[#F7F8FA] cursor-pointer transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-[#111827]">{prod.producer}</div>
                        <div className="text-xs text-[#4B5563]">{prod.openCommunicationsCount} open comms</div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            prod.producerTier === "Platinum"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {prod.producerTier}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#111827]">{prod.submissionVolume}</td>
                      <td className="px-6 py-4 text-sm font-medium text-[#111827]">{prod.bindConversionRate}</td>
                      <td className="px-6 py-4 text-sm text-[#111827]">{prod.averageWrittenPremium}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-[#E5E7EB] rounded-full h-2 max-w-[60px]">
                            <div
                              className="bg-[#009AE4] h-2 rounded-full"
                              style={{ width: `${prod.producerEngagementScore}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-[#4B5563]">{prod.producerEngagementScore}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            prod.slaStatus === "Compliant"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {prod.slaStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Open Communications */}
          <div className="bg-white rounded-xl border border-[#E5E7EB]">
            <div className="p-6 border-b border-[#E5E7EB]">
              <h3 className="text-lg font-semibold text-[#111827]">Open Communications</h3>
              <p className="text-sm text-[#4B5563] mt-1">Pending responses and follow-ups</p>
            </div>

            <div className="p-6 space-y-3">
              <div className="p-4 bg-[#F7F8FA] rounded-lg border border-[#E5E7EB]">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-sm font-medium text-[#111827]">Quote Package – SUB-2026-0846</div>
                    <div className="text-xs text-[#4B5563] mt-1">To: Aon (Global Tech Industries)</div>
                  </div>
                  <span className="text-xs text-[#4B5563]">2 days ago</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="px-3 py-1.5 bg-white border border-[#E5E7EB] rounded text-xs font-medium hover:bg-[#F3F4F6] transition-colors">
                    View Thread
                  </button>
                  <button className="px-3 py-1.5 bg-[#009AE4] text-white rounded text-xs font-medium hover:bg-[#007BB6] transition-colors">
                    Follow Up
                  </button>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                      <div className="text-sm font-medium text-[#111827]">Info Request – SUB-2026-0845</div>
                    </div>
                    <div className="text-xs text-[#4B5563] mt-1">To: Willis Towers Watson (Atlantic Distribution)</div>
                  </div>
                  <span className="text-xs text-yellow-700 font-medium">Overdue 1d</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="px-3 py-1.5 bg-white border border-[#E5E7EB] rounded text-xs font-medium hover:bg-[#F3F4F6] transition-colors">
                    View Thread
                  </button>
                  <button className="px-3 py-1.5 bg-[#009AE4] text-white rounded text-xs font-medium hover:bg-[#007BB6] transition-colors">
                    Send Reminder
                  </button>
                </div>
              </div>

              <div className="p-4 bg-[#F7F8FA] rounded-lg border border-[#E5E7EB]">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-sm font-medium text-[#111827]">Pricing Discussion – SUB-2026-0843</div>
                    <div className="text-xs text-[#4B5563] mt-1">To: Lockton (Pacific Coast Hotels)</div>
                  </div>
                  <span className="text-xs text-[#4B5563]">5 hours ago</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="px-3 py-1.5 bg-white border border-[#E5E7EB] rounded text-xs font-medium hover:bg-[#F3F4F6] transition-colors">
                    View Thread
                  </button>
                  <button className="px-3 py-1.5 bg-white border border-[#E5E7EB] rounded text-xs font-medium hover:bg-[#F3F4F6] transition-colors">
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* AI Engagement Panel */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] sticky top-6">
            <div className="p-6 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#009AE4] flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">AI</span>
                </div>
                <h3 className="text-sm font-semibold text-[#111827]">Engagement Insights</h3>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
                  <div>
                    <div className="text-xs font-medium text-[#111827] mb-1">Urgent Follow-Up</div>
                    <div className="text-xs text-[#4B5563]">
                      Willis Towers Watson has 8 open items, 3 overdue. Schedule check-in call.
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[#F7F8FA] rounded-lg">
                <div className="text-xs font-medium text-[#111827] mb-1">High Performer</div>
                <div className="text-xs text-[#4B5563]">
                  Lockton maintains 90 engagement score with 60% bind rate. Consider capacity increase.
                </div>
              </div>

              <div className="p-3 bg-[#F7F8FA] rounded-lg">
                <div className="text-xs font-medium text-[#111827] mb-1">Volume Alert</div>
                <div className="text-xs text-[#4B5563]">
                  Marsh & McLennan volume up 18% MoM. Pipeline review recommended.
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5E7EB]">
                <button className="w-full px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg hover:bg-[#F3F4F6] transition-colors text-sm font-medium text-[#111827]">
                  View Full Analysis
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
            <h3 className="text-sm font-semibold text-[#111827] mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-2 px-4 py-2 bg-[#009AE4] text-white rounded-lg hover:bg-[#007BB6] transition-colors text-sm font-medium">
                <Mail className="w-4 h-4" />
                Draft Email
              </button>
              <button className="w-full flex items-center gap-2 px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg hover:bg-[#F3F4F6] transition-colors text-sm font-medium">
                <Send className="w-4 h-4" />
                Send Quote Package
              </button>
              <button className="w-full flex items-center gap-2 px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg hover:bg-[#F3F4F6] transition-colors text-sm font-medium">
                <Calendar className="w-4 h-4" />
                Schedule Follow-Up
              </button>
            </div>
          </div>

          {/* Pipeline Status */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
            <h3 className="text-sm font-semibold text-[#111827] mb-4">Submission Pipeline Status</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#4B5563]">In Review</span>
                  <span className="font-medium text-[#111827]">47</span>
                </div>
                <div className="bg-[#E5E7EB] rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: "42%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#4B5563]">Quoted</span>
                  <span className="font-medium text-[#111827]">35</span>
                </div>
                <div className="bg-[#E5E7EB] rounded-full h-2">
                  <div className="bg-[#009AE4] h-2 rounded-full" style={{ width: "31%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#4B5563]">Pending Info</span>
                  <span className="font-medium text-[#111827]">18</span>
                </div>
                <div className="bg-[#E5E7EB] rounded-full h-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{ width: "16%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#4B5563]">Bound</span>
                  <span className="font-medium text-[#111827]">12</span>
                </div>
                <div className="bg-[#E5E7EB] rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: "11%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
