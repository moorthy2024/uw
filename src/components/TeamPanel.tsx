"use client";

import { useState } from "react";
import { TeamPerformance } from "./TeamPerformance";
import { Agents } from "./Agents";

export function TeamPanel() {
  const [activeTab, setActiveTab] = useState<"team" | "agents">("team");

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="bg-white border-b border-[#E5E7EB] px-8">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab("team")}
            className={`px-4 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "team"
                ? "border-[#009AE4] text-[#009AE4]"
                : "border-transparent text-[#4B5563] hover:text-[#111827]"
            }`}
          >
            Team Performance
          </button>
          <button
            onClick={() => setActiveTab("agents")}
            className={`px-4 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "agents"
                ? "border-[#009AE4] text-[#009AE4]"
                : "border-transparent text-[#4B5563] hover:text-[#111827]"
            }`}
          >
            AI Agents
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === "team" && <TeamPerformance />}
        {activeTab === "agents" && <Agents />}
      </div>
    </div>
  );
}
