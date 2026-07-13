"use client";

import { useState } from "react";
import { CustomerTable } from "./CustomerTable";
import { SubmissionAnalysisDetail } from "./SubmissionAnalysisDetail";
import { X, ChevronLeft, ChevronRight, FileText, Upload, Shield, TrendingUp, FileCheck, CheckCircle2 } from "lucide-react";
import { useRole } from "./RoleContext";

export function SubmissionsPanel() {
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "new-business" | "renewals">("all");
  const userRole = useRole();

  const handleSubmissionSelect = (id: string) => {
    setSelectedSubmissionId(id);
  };

  const handleClose = () => {
    setSelectedSubmissionId(null);
  };

  const metrics = [
    { label: "Total", value: "47", change: "+8", positive: true, icon: FileText },
    { label: "Ingested", value: "12", change: "+3", positive: true, icon: Upload },
    { label: "Triaged", value: "18", change: "+5", positive: true, icon: Shield },
    { label: "In Analysis", value: "8", change: "+2", positive: true, icon: TrendingUp },
    { label: "Ready to Quote", value: "6", change: "+1", positive: true, icon: FileCheck },
    { label: "Quoted", value: "3", change: "-1", positive: false, icon: CheckCircle2 },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="border-b border-[#E8E6E1] px-6">
        <div className="flex gap-6">
          {([
            { key: "all", label: "All" },
            { key: "new-business", label: "New Business" },
            { key: "renewals", label: "Renewals" },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-2 py-3 text-sm border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-[#2D2D2D] text-[#2D2D2D]"
                  : "border-transparent text-[#9B9B98] hover:text-[#5D5D5D]"
              }`}
              style={{ fontWeight: activeTab === tab.key ? 500 : 400 }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex">
        {selectedSubmissionId && (
          <div
            className={`overflow-auto transition-all duration-300 border-r border-[#E8E6E1] relative ${
              sidebarCollapsed ? "w-0" : "w-80"
            }`}
          >
            <div className={`${sidebarCollapsed ? "hidden" : "block"}`}>
              <CustomerTable
                onSubmissionSelect={handleSubmissionSelect}
                selectedId={selectedSubmissionId}
                filterType={activeTab}
              />
            </div>
          </div>
        )}

        {!selectedSubmissionId && (
          <div className="w-full overflow-auto">
            {/* Metrics */}
            <div className="p-6 pb-0">
              <div className="grid grid-cols-6 gap-3 mb-6">
                {metrics.map((metric) => {
                  const Icon = metric.icon;
                  return (
                    <div key={metric.label} className="bg-white rounded-xl p-4 border border-[#E8E6E1]">
                      <div className="flex items-start justify-between mb-2">
                        <div className="w-7 h-7 rounded-lg bg-[#F3F3F1] flex items-center justify-center">
                          <Icon className="w-3.5 h-3.5 text-[#009AE4]" />
                        </div>
                        <span className={`text-[11px] ${metric.positive ? "text-green-600" : "text-red-500"}`} style={{ fontWeight: 500 }}>
                          {metric.change}
                        </span>
                      </div>
                      <div className="text-xl text-[#1A1A1A]" style={{ fontWeight: 600 }}>{metric.value}</div>
                      <div className="text-[11px] text-[#9B9B98]">{metric.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            <CustomerTable
              onSubmissionSelect={handleSubmissionSelect}
              selectedId={selectedSubmissionId}
              filterType={activeTab}
            />
          </div>
        )}

        {selectedSubmissionId && (
          <div className="flex-1 overflow-auto relative">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="absolute top-4 left-4 z-10 w-7 h-7 rounded-lg bg-white border border-[#E8E6E1] flex items-center justify-center hover:bg-[#F3F3F1] transition-colors shadow-sm"
            >
              {sidebarCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 w-7 h-7 rounded-lg bg-white border border-[#E8E6E1] flex items-center justify-center hover:bg-[#F3F3F1] transition-colors shadow-sm"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <SubmissionAnalysisDetail submissionId={selectedSubmissionId} />
          </div>
        )}
      </div>
    </div>
  );
}
