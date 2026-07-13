import { useState } from "react";
import { Activity, CheckCircle2, Clock, Zap, Brain, FileText, TrendingUp } from "lucide-react";

const agents = [
  {
    id: "orchestration",
    name: "Orchestration Agent",
    scope: "Coordinator",
    type: "Coordinator",
    color: "#002F87",
    inputs: ["Submission intake events", "Agent status signals", "HITL gate responses"],
    actions: [
      "Coordinate the entire workflow",
      "Route submissions",
      "Manage state and hand-offs",
      "Coordinate change scenarios",
    ],
    guidelineRefs: ["Overall Appetite", "HITL Gate Rules"],
    inferredLogic: ["Single authority on what happens next", "Optimal parallelism patterns from throughput data"],
    outputs: ["Workflow state", "Next agent assignment", "UI progress updates"],
    workflowSteps: "1 – 7 (all)",
    consolidates: "R1 Core routing · R2 + Memory · R3 Unified UI",
    techStack: "QBE.ai · Azure AI Foundry · Cosmos DB",
  },
  {
    id: "ingestion",
    name: "Ingestion Agent",
    scope: "CAT Prep & SOV",
    type: "Front-door Agent",
    color: "#1696D2",
    inputs: ["Email", "Broker portals", "ACORD forms", "SOV", "Loss runs", "Supporting documents"],
    actions: [
      "Monitor email / broker portals",
      "Extract ACORD, SOV, loss runs, supporting documents",
      "Normalize SOV",
      "Ping AI geocoding",
      "Format RMS / CatNet payload",
    ],
    guidelineRefs: ["OED Schema Standards", "Capacity by Peril"],
    inferredLogic: ["Field extraction confidence thresholds learned from validation feedback", "Document format patterns from 10k+ processed submissions"],
    outputs: ["Canonical submission context object consumed by all downstream agents"],
    workflowSteps: "1 – 3",
    consolidates: "SOV normalization + CAT prep + RMS / CatNet payload formatting (previously split across multiple sub-agents)",
    techStack: "Ping AI · Outlook · GDrive · Salesforce · Majesco",
  },
  {
    id: "intelligence",
    name: "Intelligence & Reasoning Agent",
    scope: "Risk Analysis",
    type: "Knowledge-Based Reasoning",
    color: "#177E89",
    inputs: ["Submission documents", "Loss history", "COPE data", "Geocoded locations", "In-force book", "Portfolio analytics"],
    actions: [
      "L1–L2 risk score & exposure summary",
      "Portfolio accumulation check",
      "Unified risk synopsis builder",
      "Drive one decision-ready document for UW at the HITL gate",
    ],
    guidelineRefs: ["Occupancy Classification", "Capacity by Peril", "Overall Appetite"],
    inferredLogic: ["Synthesizes deal-level (L1), risk-level (L2), and portfolio-level (L3) views into one decision-ready document"],
    outputs: ["Unified risk synopsis", "Accumulation alerts", "Portfolio strategy view"],
    workflowSteps: "4 – 6",
    consolidates: "Risk Read + Accumulation Super + Portfolio Strategy (previously 3 separate sub-agents)",
    techStack: "QBE.ai · Azure AI Foundry · Cosmos DB · Hyperexponential (R2+)",
  },
  {
    id: "drafting",
    name: "Document Summarization Agent",
    scope: "Pricing Guidance",
    type: "Drafting & Pricing",
    color: "#5F6B7A",
    inputs: ["CAT analysis", "Risk analysis", "Pricing guidance"],
    actions: [
      "Rate guidance",
      "Synthesize CAT + Risk analysis into pricing view",
      "Draft quote documents",
      "Negotiation briefs",
      "Reporting scenarios",
      "Generate binder & policy documents",
      "Downstream finance / reporting / analytics sync",
    ],
    guidelineRefs: ["Pricing & Commission", "Coverage Forms & Endorsements"],
    inferredLogic: ["Communication templates", "Form selection from state compliance database"],
    outputs: ["Quote documents", "Binder", "Policy manuscript", "Downstream system updates"],
    workflowSteps: "5 – 12",
    consolidates: "Pricing & CAT + Broker Drafting + Issuance Utility (previously 3 separate sub-agents)",
    techStack: "Majesco · Salesforce · IGEN · Adobe · Hyperexponential",
  },
];

// Active submissions being processed
const activeSubmissions = [
  {
    id: "SUB-2026-0847",
    name: "Westfield Manufacturing",
    status: "In Analysis",
    currentAgent: "intelligence",
    workflow: [
      { agent: "orchestration", status: "complete", timestamp: "10:23 AM" },
      { agent: "ingestion", status: "complete", timestamp: "10:25 AM" },
      { agent: "intelligence", status: "active", timestamp: "10:27 AM" },
      { agent: "drafting", status: "pending", timestamp: null },
    ],
    activeActions: "Analyzing loss history patterns, Generating COPE risk profile",
  },
  {
    id: "SUB-2026-0846",
    name: "Global Tech Industries",
    status: "Pricing",
    currentAgent: "drafting",
    workflow: [
      { agent: "orchestration", status: "complete", timestamp: "9:15 AM" },
      { agent: "ingestion", status: "complete", timestamp: "9:18 AM" },
      { agent: "intelligence", status: "complete", timestamp: "9:31 AM" },
      { agent: "drafting", status: "active", timestamp: "9:45 AM" },
    ],
    activeActions: "Synthesizing CAT + risk analysis, Drafting pricing recommendation",
  },
  {
    id: "SUB-2026-0845",
    name: "Atlantic Distribution",
    status: "HITL Gate 1b",
    currentAgent: "orchestration",
    workflow: [
      { agent: "orchestration", status: "active", timestamp: "10:31 AM" },
      { agent: "ingestion", status: "complete", timestamp: "10:15 AM" },
    ],
    activeActions: "Awaiting UW review - CAT concentration threshold triggered",
  },
  {
    id: "SUB-2026-0844",
    name: "Northeast Logistics",
    status: "Extracting",
    currentAgent: "ingestion",
    workflow: [
      { agent: "orchestration", status: "complete", timestamp: "10:42 AM" },
      { agent: "ingestion", status: "active", timestamp: "10:43 AM" },
    ],
    activeActions: "Parsing SOV (8 of 23 locations geocoded), Extracting ACORD 125 fields",
  },
];

export function Agents() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  return (
    <div className="flex h-full">
      {/* Main Agent Tiles */}
      <div className="flex-1 overflow-auto p-8">
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 mb-6">
          <h3 className="text-lg font-semibold text-[#111827] mb-2">AI Agent Framework</h3>
          <p className="text-sm text-[#4B5563] mb-4">
            The final agent structure consolidates prior sub-agents and focus areas under 4 named agents. Triage is a rules engine, not an agent.
          </p>
          <div className="grid grid-cols-4 gap-4">
            <div className="p-3 bg-[#F7F8FA] rounded-lg">
              <div className="text-2xl font-bold text-[#009AE4] mb-1">4</div>
              <div className="text-xs text-[#4B5563]">Named Agents</div>
            </div>
            <div className="p-3 bg-[#F7F8FA] rounded-lg">
              <div className="text-2xl font-bold text-[#009AE4] mb-1">12</div>
              <div className="text-xs text-[#4B5563]">Workflow Steps</div>
            </div>
            <div className="p-3 bg-[#F7F8FA] rounded-lg">
              <div className="text-2xl font-bold text-[#009AE4] mb-1">4</div>
              <div className="text-xs text-[#4B5563]">Active Now</div>
            </div>
            <div className="p-3 bg-[#F7F8FA] rounded-lg">
              <div className="text-2xl font-bold text-[#009AE4] mb-1">24</div>
              <div className="text-xs text-[#4B5563]">Submissions Today</div>
            </div>
          </div>
        </div>

        {/* Agent Tiles Grid */}
        <div className="grid grid-cols-2 gap-4">
          {agents.map((agent, index) => {
            const isActive = activeSubmissions.some(s => s.currentAgent === agent.id);

            return (
              <div
                key={agent.id}
                className={`bg-white rounded-xl border transition-all cursor-pointer ${
                  selectedAgent === agent.id
                    ? "border-[#009AE4] border-2 shadow-lg"
                    : "border-[#E5E7EB] hover:border-[#009AE4]"
                }`}
                onClick={() => setSelectedAgent(agent.id)}
              >
                {/* Agent Header */}
                <div className="p-4 border-b border-[#E5E7EB] bg-[#F7F8FA]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: agent.color }}
                      ></div>
                      <div className="text-xs font-semibold text-[#4B5563]">AGENT {index + 1} · {agent.type.toUpperCase()}</div>
                    </div>
                    {isActive && (
                      <div className="flex items-center gap-1 text-xs font-medium text-green-600">
                        <Activity className="w-3 h-3" />
                        Active
                      </div>
                    )}
                  </div>
                  <h4 className="text-sm font-semibold text-[#111827]">
                    {agent.name} <span className="text-[#4B5563] font-normal">({agent.scope})</span>
                  </h4>
                </div>

                {/* Agent Details */}
                <div className="p-4 space-y-3">
                  {/* Scope / Actions */}
                  <div>
                    <div className="flex items-center gap-1 text-xs font-semibold text-[#111827] mb-1">
                      <Zap className="w-3 h-3 text-[#009AE4]" />
                      Scope
                    </div>
                    <div className="space-y-1">
                      {agent.actions.slice(0, 3).map((action, idx) => (
                        <div key={idx} className="text-xs text-[#4B5563] pl-4">• {action}</div>
                      ))}
                      {agent.actions.length > 3 && (
                        <div className="text-xs text-[#009AE4] pl-4">+ {agent.actions.length - 3} more</div>
                      )}
                    </div>
                  </div>

                  {/* Workflow Steps */}
                  <div>
                    <div className="flex items-center gap-1 text-xs font-semibold text-[#111827] mb-1">
                      <Clock className="w-3 h-3 text-[#009AE4]" />
                      Workflow steps
                    </div>
                    <div className="text-xs text-[#4B5563] pl-4">{agent.workflowSteps}</div>
                  </div>

                  {/* Consolidates */}
                  <div>
                    <div className="flex items-center gap-1 text-xs font-semibold text-[#111827] mb-1">
                      <Brain className="w-3 h-3 text-[#009AE4]" />
                      Consolidates prior focus
                    </div>
                    <div className="text-xs text-[#4B5563] pl-4">{agent.consolidates}</div>
                  </div>

                  {/* Tech stack */}
                  <div>
                    <div className="flex items-center gap-1 text-xs font-semibold text-[#111827] mb-1">
                      <FileText className="w-3 h-3 text-[#009AE4]" />
                      Tech stack
                    </div>
                    <div className="text-xs text-[#4B5563] pl-4">{agent.techStack}</div>
                  </div>

                  {/* Outputs */}
                  <div>
                    <div className="flex items-center gap-1 text-xs font-semibold text-[#111827] mb-1">
                      <TrendingUp className="w-3 h-3 text-[#009AE4]" />
                      Outputs
                    </div>
                    <div className="space-y-1">
                      {agent.outputs.slice(0, 2).map((output, idx) => (
                        <div key={idx} className="text-xs text-[#4B5563] pl-4">• {output}</div>
                      ))}
                      {agent.outputs.length > 2 && (
                        <div className="text-xs text-[#009AE4] pl-4">+ {agent.outputs.length - 2} more</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Panel - Agent Feed */}
      <div className="w-96 border-l border-[#E5E7EB] bg-[#F7F8FA] overflow-auto">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-[#009AE4]" />
            <h3 className="text-lg font-semibold text-[#111827]">Agent Feed</h3>
          </div>
          <p className="text-xs text-[#4B5563] mb-4">
            Real-time view of active agent processing across all submissions
          </p>

          {/* Active Submissions */}
          <div className="space-y-4">
            {activeSubmissions.map((submission) => (
              <div key={submission.id} className="bg-white rounded-lg border border-[#E5E7EB] p-4">
                {/* Submission Header */}
                <div className="mb-3">
                  <div className="text-sm font-semibold text-[#111827] mb-1">{submission.name}</div>
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-[#4B5563]">{submission.id}</div>
                    <div className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      submission.status.includes("HITL")
                        ? "bg-yellow-100 text-yellow-800"
                        : submission.status === "Pricing"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}>
                      {submission.status}
                    </div>
                  </div>
                </div>

                {/* Workflow Timeline */}
                <div className="mb-3 space-y-1">
                  {submission.workflow.map((step, idx) => {
                    const agent = agents.find(a => a.id === step.agent);
                    return (
                      <div key={idx} className="flex items-center gap-2">
                        {step.status === "complete" ? (
                          <CheckCircle2 className="w-3 h-3 text-green-600 flex-shrink-0" />
                        ) : step.status === "active" ? (
                          <Activity className="w-3 h-3 text-[#009AE4] flex-shrink-0 animate-pulse" />
                        ) : (
                          <Clock className="w-3 h-3 text-[#9CA3AF] flex-shrink-0" />
                        )}
                        <div className="flex-1 flex items-center justify-between">
                          <span className={`text-xs ${
                            step.status === "active"
                              ? "font-semibold text-[#009AE4]"
                              : step.status === "complete"
                              ? "text-[#4B5563]"
                              : "text-[#9CA3AF]"
                          }`}>
                            {agent?.name || step.agent}
                          </span>
                          {step.timestamp && (
                            <span className="text-xs text-[#9CA3AF]">{step.timestamp}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Active Actions */}
                <div className="p-2 bg-blue-50 rounded border-l-2 border-[#009AE4]">
                  <div className="text-xs text-[#4B5563]">{submission.activeActions}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="mt-6 pt-6 border-t border-[#E5E7EB]">
            <div className="text-xs font-semibold text-[#111827] mb-3">Processing Summary</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#4B5563]">Active Submissions</span>
                <span className="font-semibold text-[#111827]">4</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#4B5563]">Agents Running</span>
                <span className="font-semibold text-[#111827]">4</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#4B5563]">Awaiting HITL</span>
                <span className="font-semibold text-yellow-600">1</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#4B5563]">Avg. Processing Time</span>
                <span className="font-semibold text-[#111827]">18 min</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
