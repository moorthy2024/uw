"use client";

import { useState } from "react";
import { BookOpen, AlertCircle, CheckCircle2, History, Archive, X, Plus, Save, Edit2, Shield, Zap, ZapOff, ChevronLeft, ChevronRight, Activity, ChevronDown, AlertTriangle } from "lucide-react";

// Agent data
const agents = [
  { id: "orchestration", name: "Orchestration Agent", color: "#002F87", short: "Orch" },
  { id: "ingestion", name: "Ingestion Agent", color: "#1696D2", short: "Ingest" },
  { id: "intelligence", name: "Intelligence & Reasoning Agent", color: "#177E89", short: "Intel" },
  { id: "drafting", name: "Document Summarization Agent", color: "#5F6B7A", short: "Draft" },
];

// Guideline to agent mapping
const guidelineAgentMap: Record<string, string[]> = {
  "overall_appetite": ["orchestration", "intelligence"],
  "coverage_type": ["intelligence"],
  "perils_written": ["ingestion", "intelligence"],
  "tiv": ["ingestion", "intelligence"],
  "geography": ["ingestion", "intelligence"],
  "territory_structure": ["intelligence", "drafting"],
  "capacity_peril": ["ingestion", "intelligence"],
  "deductible": ["intelligence", "drafting"],
  "occupancy": ["intelligence"],
  "pricing": ["intelligence", "drafting"],
  "coverage_forms": ["drafting"],
};

export function Guidelines() {
  const [activeTab, setActiveTab] = useState<"guidelines" | "authority">("guidelines");
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [agentSidebarCollapsed, setAgentSidebarCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());

  const handleEdit = () => {
    setShowSubmitModal(true);
  };

  const toggleSection = (sectionNum: number) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionNum)) {
      newExpanded.delete(sectionNum);
    } else {
      newExpanded.add(sectionNum);
    }
    setExpandedSections(newExpanded);
  };

  const getAgentsByGuideline = (guidelineKey: string) => {
    const agentIds = guidelineAgentMap[guidelineKey] || [];
    return agents.filter(a => agentIds.includes(a.id));
  };

  return (
    <div className="flex h-full flex-col">
      {/* Tabs */}
      <div className="bg-white border-b border-[#E5E7EB] px-8">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab("guidelines")}
            className={`px-4 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "guidelines"
                ? "border-[#009AE4] text-[#009AE4]"
                : "border-transparent text-[#4B5563] hover:text-[#111827]"
            }`}
          >
            Guidelines
          </button>
          <button
            onClick={() => setActiveTab("authority")}
            className={`px-4 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "authority"
                ? "border-[#009AE4] text-[#009AE4]"
                : "border-transparent text-[#4B5563] hover:text-[#111827]"
            }`}
          >
            Authority
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 overflow-auto p-8">
        {activeTab === "guidelines" ? (
          <>
        {/* Admin Indicator */}
        <div className="mb-6 flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#009AE4] flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-[#111827]">Admin Access</div>
              <div className="text-xs text-[#4B5563]">Ashley, you can edit guidelines. Changes trigger review & approval workflow.</div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* 1. Overall Appetite & Program Structure */}
          <div className="bg-white rounded-xl border border-[#E5E7EB]">
            <button
              onClick={() => toggleSection(1)}
              className="w-full p-4 flex items-center justify-between hover:bg-[#F7F8FA] transition-colors"
            >
              <div className="flex-1 text-left">
                <h3 className="text-base font-semibold text-[#111827]">1. Overall Appetite & Program Structure</h3>
                <p className="text-xs text-[#4B5563] mt-1">Fundamental program parameters and scope</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {getAgentsByGuideline("overall_appetite").map(agent => (
                    <div
                      key={agent.id}
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: agent.color }}
                      title={agent.name}
                    ></div>
                  ))}
                </div>
                <ChevronDown className={`w-5 h-5 text-[#4B5563] transition-transform ${expandedSections.has(1) ? 'rotate-180' : ''}`} />
              </div>
            </button>
            {expandedSections.has(1) && (
              <div className="p-4 border-t border-[#E5E7EB]">
              <div className="grid grid-cols-2 gap-3">
                <GuidelineCard
                  title="Coverage Type"
                  content="All Risk Commercial Property"
                  subtitle="Shared & Layered (Primary, Quota Share, Excess)"
                  onEdit={handleEdit}
                  active={true}
                  agents={getAgentsByGuideline("coverage_type")}
                />
                <GuidelineCard
                  title="Perils Written"
                  content="All Perils Only"
                  subtitle="No DIC / Mono-Line"
                  badge="out"
                  onEdit={handleEdit}
                  active={true}
                  agents={getAgentsByGuideline("perils_written")}
                />
                <GuidelineCard
                  title="Total Insurable Value"
                  content="$500M minimum"
                  subtitle="No Maximum"
                  onEdit={handleEdit}
                  active={true}
                  agents={getAgentsByGuideline("tiv")}
                />
                <GuidelineCard
                  title="Geography"
                  content="U.S. Domiciled Risks"
                  subtitle="Incidental PR / USVI"
                  onEdit={handleEdit}
                  active={true}
                  agents={getAgentsByGuideline("geography")}
                />
              </div>
              <button className="mt-3 flex items-center gap-2 px-3 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg hover:bg-[#E5E7EB] transition-colors text-xs font-medium text-[#111827]">
                <Plus className="w-3 h-3" />
                Add Guideline
              </button>
              </div>
            )}
          </div>

          {/* 2. Territory & Structure */}
          <div className="bg-white rounded-xl border border-[#E5E7EB]">
            <button
              onClick={() => toggleSection(2)}
              className="w-full p-4 flex items-center justify-between hover:bg-[#F7F8FA] transition-colors"
            >
              <div className="flex-1 text-left">
                <h3 className="text-base font-semibold text-[#111827]">2. Territory & Structure</h3>
                <p className="text-xs text-[#4B5563] mt-1">Allowed structural arrangements</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {getAgentsByGuideline("territory_structure").map(agent => (
                    <div
                      key={agent.id}
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: agent.color }}
                      title={agent.name}
                    ></div>
                  ))}
                </div>
                <ChevronDown className={`w-5 h-5 text-[#4B5563] transition-transform ${expandedSections.has(2) ? 'rotate-180' : ''}`} />
              </div>
            </button>
            {expandedSections.has(2) && (
              <div className="p-4 border-t border-[#E5E7EB]">
              <div className="space-y-2">
                <GuidelineItem
                  text="Domestic policy (U.S.)"
                  onEdit={handleEdit}
                  active={true}
                  agents={getAgentsByGuideline("territory_structure")}
                />
                <GuidelineItem
                  text="Fronted international exposure with MURA"
                  onEdit={handleEdit}
                  active={false}
                  agents={[]}
                />
                <GuidelineItem
                  text="Separate policy numbers by territory"
                  onEdit={handleEdit}
                  active={true}
                  agents={getAgentsByGuideline("territory_structure")}
                />
              </div>
              <button className="mt-3 flex items-center gap-2 px-3 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg hover:bg-[#E5E7EB] transition-colors text-xs font-medium text-[#111827]">
                <Plus className="w-3 h-3" />
                Add Guideline
              </button>
              </div>
            )}
          </div>

          {/* 3. Capacity by Peril */}
          <div className="bg-white rounded-xl border border-[#E5E7EB]">
            <button
              onClick={() => toggleSection(3)}
              className="w-full p-4 flex items-center justify-between hover:bg-[#F7F8FA] transition-colors"
            >
              <div className="flex-1 text-left">
                <h3 className="text-base font-semibold text-[#111827]">3. Capacity by Peril (Visual Ranges)</h3>
                <p className="text-xs text-[#4B5563] mt-1">Maximum net limits by catastrophe exposure</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {getAgentsByGuideline("capacity_peril").map(agent => (
                    <div
                      key={agent.id}
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: agent.color }}
                      title={agent.name}
                    ></div>
                  ))}
                </div>
                <ChevronDown className={`w-5 h-5 text-[#4B5563] transition-transform ${expandedSections.has(3) ? 'rotate-180' : ''}`} />
              </div>
            </button>
            {expandedSections.has(3) && (
              <div className="p-4 border-t border-[#E5E7EB]">
              <div className="space-y-3">
                <CapacityBar
                  label="Fire"
                  value={50}
                  max={50}
                  displayValue="$50M"
                  onEdit={handleEdit}
                  active={true}
                  agents={getAgentsByGuideline("capacity_peril")}
                />
                <CapacityBar
                  label="Earthquake / Earth Movement (Critical States)"
                  value={10}
                  max={50}
                  displayValue="$10M"
                  onEdit={handleEdit}
                  active={true}
                  agents={getAgentsByGuideline("capacity_peril")}
                />
                <CapacityBar
                  label="Named Windstorm (Tier 1)"
                  value={10}
                  max={50}
                  displayValue="$10M"
                  onEdit={handleEdit}
                  active={true}
                  agents={getAgentsByGuideline("capacity_peril")}
                />
                <CapacityBar
                  label="Flood (SFHA)"
                  value={10}
                  max={50}
                  displayValue="$10M"
                  onEdit={handleEdit}
                  active={true}
                  agents={getAgentsByGuideline("capacity_peril")}
                />
              </div>
              <button className="mt-3 flex items-center gap-2 px-3 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg hover:bg-[#E5E7EB] transition-colors text-xs font-medium text-[#111827]">
                <Plus className="w-3 h-3" />
                Add Guideline
              </button>
              </div>
            )}
          </div>

          {/* 4. Deductible Spectrum by Hazard */}
          <div className="bg-white rounded-xl border border-[#E5E7EB]">
            <button
              onClick={() => toggleSection(4)}
              className="w-full p-4 flex items-center justify-between hover:bg-[#F7F8FA] transition-colors"
            >
              <div className="flex-1 text-left">
                <h3 className="text-base font-semibold text-[#111827]">4. Deductible Spectrum by Hazard</h3>
                <p className="text-xs text-[#4B5563] mt-1">Typical deductible ranges by peril category</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {getAgentsByGuideline("deductible").map(agent => (
                    <div
                      key={agent.id}
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: agent.color }}
                      title={agent.name}
                    ></div>
                  ))}
                </div>
                <ChevronDown className={`w-5 h-5 text-[#4B5563] transition-transform ${expandedSections.has(4) ? 'rotate-180' : ''}`} />
              </div>
            </button>
            {expandedSections.has(4) && (
              <div className="p-4 border-t border-[#E5E7EB]">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#F7F8FA] border-b border-[#E5E7EB]">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[#4B5563] uppercase">Peril</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-[#4B5563] uppercase">Typical Range</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-[#4B5563] uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    <DeductibleRow peril="Non-CAT" range="$25K – $100K+" onEdit={handleEdit} active={true} agents={getAgentsByGuideline("deductible")} />
                    <DeductibleRow peril="Earthquake" range="$100K or 2–5%" onEdit={handleEdit} active={true} agents={getAgentsByGuideline("deductible")} />
                    <DeductibleRow peril="Named Windstorm" range="$100K or 3–5%" onEdit={handleEdit} active={true} agents={getAgentsByGuideline("deductible")} />
                    <DeductibleRow peril="Flood" range="$100K (Excess NFIP)" onEdit={handleEdit} active={true} agents={getAgentsByGuideline("deductible")} />
                  </tbody>
                </table>
              </div>
              <button className="mt-3 flex items-center gap-2 px-3 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg hover:bg-[#E5E7EB] transition-colors text-xs font-medium text-[#111827]">
                <Plus className="w-3 h-3" />
                Add Guideline
              </button>
              </div>
            )}
          </div>

          {/* 5. Occupancy Appetite Classification */}
          <div className="bg-white rounded-xl border border-[#E5E7EB]">
            <button
              onClick={() => toggleSection(5)}
              className="w-full p-4 flex items-center justify-between hover:bg-[#F7F8FA] transition-colors"
            >
              <div className="flex-1 text-left">
                <h3 className="text-base font-semibold text-[#111827]">5. Occupancy Appetite Classification</h3>
                <p className="text-xs text-[#4B5563] mt-1">Risk class segmentation by business type</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {getAgentsByGuideline("occupancy").map(agent => (
                    <div
                      key={agent.id}
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: agent.color }}
                      title={agent.name}
                    ></div>
                  ))}
                </div>
                <ChevronDown className={`w-5 h-5 text-[#4B5563] transition-transform ${expandedSections.has(5) ? 'rotate-180' : ''}`} />
              </div>
            </button>
            {expandedSections.has(5) && (
              <div className="p-4 border-t border-[#E5E7EB]">
              <div className="grid grid-cols-3 gap-3">
                <OccupancyCard
                  title="In Scope"
                  items={[
                    "Office & Professional Services",
                    "Healthcare (Non-Hazardous)",
                    "Retail / Wholesale",
                    "Education & Municipal",
                  ]}
                  badge="in"
                  onEdit={handleEdit}
                  active={true}
                  agents={getAgentsByGuideline("occupancy")}
                />
                <OccupancyCard
                  title="Limited"
                  items={[
                    "Habitational (Partial)",
                    "Hotels, Restaurants",
                    "Light Manufacturing",
                  ]}
                  badge="limited"
                  onEdit={handleEdit}
                  active={true}
                  agents={getAgentsByGuideline("occupancy")}
                />
                <OccupancyCard
                  title="Out of Scope"
                  items={[
                    "Chemicals & Energy",
                    "Mining, Rail, Agriculture",
                    "Builders Risk / Construction",
                  ]}
                  badge="out"
                  onEdit={handleEdit}
                  active={true}
                  agents={getAgentsByGuideline("occupancy")}
                />
              </div>
              <button className="mt-3 flex items-center gap-2 px-3 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg hover:bg-[#E5E7EB] transition-colors text-xs font-medium text-[#111827]">
                <Plus className="w-3 h-3" />
                Add Guideline
              </button>
              </div>
            )}
          </div>

          {/* 6. Pricing & Commission Guidance */}
          <div className="bg-white rounded-xl border border-[#E5E7EB]">
            <button
              onClick={() => toggleSection(6)}
              className="w-full p-4 flex items-center justify-between hover:bg-[#F7F8FA] transition-colors"
            >
              <div className="flex-1 text-left">
                <h3 className="text-base font-semibold text-[#111827]">6. Pricing & Commission Guidance</h3>
                <p className="text-xs text-[#4B5563] mt-1">Commission structure and minimum premium requirements</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {getAgentsByGuideline("pricing").map(agent => (
                    <div
                      key={agent.id}
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: agent.color }}
                      title={agent.name}
                    ></div>
                  ))}
                </div>
                <ChevronDown className={`w-5 h-5 text-[#4B5563] transition-transform ${expandedSections.has(6) ? 'rotate-180' : ''}`} />
              </div>
            </button>
            {expandedSections.has(6) && (
              <div className="p-4 border-t border-[#E5E7EB]">
              <div className="space-y-2">
                <PricingItem
                  label="Minimum Premium"
                  value="$50,000"
                  onEdit={handleEdit}
                  active={true}
                  agents={getAgentsByGuideline("pricing")}
                />
                <PricingItem
                  label="Retail Commission"
                  value="10% – 15%"
                  onEdit={handleEdit}
                  active={true}
                  agents={getAgentsByGuideline("pricing")}
                />
                <PricingItem
                  label="Wholesale Commission"
                  value="15% – 17.5%"
                  onEdit={handleEdit}
                  active={true}
                  agents={getAgentsByGuideline("pricing")}
                />
                <div className="p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="text-xs text-[#111827]">
                    Significant deviations require referral to Head of Commercial Property.
                  </div>
                </div>
              </div>
              <button className="mt-3 flex items-center gap-2 px-3 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg hover:bg-[#E5E7EB] transition-colors text-xs font-medium text-[#111827]">
                <Plus className="w-3 h-3" />
                Add Guideline
              </button>
              </div>
            )}
          </div>

          {/* 7. Coverage Forms & Endorsements */}
          <div className="bg-white rounded-xl border border-[#E5E7EB]">
            <button
              onClick={() => toggleSection(7)}
              className="w-full p-4 flex items-center justify-between hover:bg-[#F7F8FA] transition-colors"
            >
              <div className="flex-1 text-left">
                <h3 className="text-base font-semibold text-[#111827]">7. Coverage Forms & Endorsements</h3>
                <p className="text-xs text-[#4B5563] mt-1">Acceptable policy forms and required endorsements</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {getAgentsByGuideline("coverage_forms").map(agent => (
                    <div
                      key={agent.id}
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: agent.color }}
                      title={agent.name}
                    ></div>
                  ))}
                </div>
                <ChevronDown className={`w-5 h-5 text-[#4B5563] transition-transform ${expandedSections.has(7) ? 'rotate-180' : ''}`} />
              </div>
            </button>
            {expandedSections.has(7) && (
              <div className="p-4 border-t border-[#E5E7EB]">
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-semibold text-[#111827] mb-2">Acceptable Forms</div>
                  <div className="space-y-2">
                    <GuidelineItem text="Manuscript / Broker Form" onEdit={handleEdit} active={true} agents={getAgentsByGuideline("coverage_forms")} />
                    <GuidelineItem text="Carrier Form" onEdit={handleEdit} active={true} agents={getAgentsByGuideline("coverage_forms")} />
                    <GuidelineItem text="Commercial Property Follow / Excess Forms" onEdit={handleEdit} active={true} agents={getAgentsByGuideline("coverage_forms")} />
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#111827] mb-2">Mandatory Endorsements</div>
                  <div className="space-y-2">
                    <GuidelineItem text="LMA 5393" onEdit={handleEdit} active={true} agents={getAgentsByGuideline("coverage_forms")} />
                    <GuidelineItem text="LMA 5400 / 5401 (No amendments)" onEdit={handleEdit} active={false} agents={[]} />
                  </div>
                </div>
                <div className="p-2 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
                  <div className="text-sm font-medium text-red-800">No Cyber, Crisis Management, Non-Physical Damage</div>
                  <div className="flex items-center gap-2">
                    <button onClick={handleEdit} className="p-1 hover:bg-red-100 rounded transition-colors">
                      <Edit2 className="w-3 h-3 text-red-600" />
                    </button>
                    <button className="p-1 hover:bg-red-100 rounded transition-colors">
                      <Archive className="w-3 h-3 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
              <button className="mt-3 flex items-center gap-2 px-3 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg hover:bg-[#E5E7EB] transition-colors text-xs font-medium text-[#111827]">
                <Plus className="w-3 h-3" />
                Add Guideline
              </button>
              </div>
            )}
          </div>
        </div>
          </>
        ) : (
          <AuthorityView />
        )}
      </div>

      {/* Right Panel - Executing AI UW Agents */}
      <div className={`border-l border-[#E5E7EB] bg-[#F7F8FA] transition-all duration-300 ${agentSidebarCollapsed ? 'w-12' : 'w-80'} flex flex-col`}>
        {/* Collapse/Expand Button */}
        <button
          onClick={() => setAgentSidebarCollapsed(!agentSidebarCollapsed)}
          className="p-3 border-b border-[#E5E7EB] bg-white hover:bg-[#F7F8FA] transition-colors flex items-center justify-center"
        >
          {agentSidebarCollapsed ? (
            <ChevronLeft className="w-4 h-4 text-[#4B5563]" />
          ) : (
            <ChevronRight className="w-4 h-4 text-[#4B5563]" />
          )}
        </button>

        {!agentSidebarCollapsed && (
          <div className="flex-1 overflow-auto p-4">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-[#009AE4]" />
              <h3 className="text-sm font-semibold text-[#111827]">Executing AI UW Agents</h3>
            </div>
            <p className="text-xs text-[#4B5563] mb-4">
              Agents actively using these guidelines for underwriting decisions
            </p>

            {/* Agent List */}
            <div className="space-y-2">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className="bg-white rounded-lg border border-[#E5E7EB] p-3"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: agent.color }}
                    ></div>
                    <div className="text-xs font-semibold text-[#111827]">{agent.name}</div>
                  </div>
                  <div className="text-xs text-[#4B5563] space-y-1">
                    {/* Show which guideline sections this agent uses */}
                    {Object.entries(guidelineAgentMap)
                      .filter(([_, agentIds]) => agentIds.includes(agent.id))
                      .map(([key, _]) => {
                        const sectionNames: Record<string, string> = {
                          overall_appetite: "Overall Appetite",
                          coverage_type: "Coverage Type",
                          perils_written: "Perils Written",
                          tiv: "TIV Limits",
                          geography: "Geography",
                          territory_structure: "Territory",
                          capacity_peril: "Capacity by Peril",
                          deductible: "Deductibles",
                          occupancy: "Occupancy",
                          pricing: "Pricing",
                          coverage_forms: "Coverage Forms",
                        };
                        return (
                          <div key={key} className="flex items-center gap-1">
                            <CheckCircle2 className="w-2 h-2 text-green-600 flex-shrink-0" />
                            <span>{sectionNames[key]}</span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
              <div className="text-xs font-semibold text-[#111827] mb-2">Active Usage</div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#4B5563]">Total Agents</span>
                  <span className="font-semibold text-[#111827]">9</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#4B5563]">Active Guidelines</span>
                  <span className="font-semibold text-green-600">32</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#4B5563]">Inactive Guidelines</span>
                  <span className="font-semibold text-[#9CA3AF]">2</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Ready to Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-[#E5E7EB]">
              <h3 className="text-lg font-semibold text-[#111827]">Ready to Submit</h3>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-[#111827] mb-2">
                    Ashley, your changes will trigger a review & approval workflow before being activated.
                  </p>
                  <p className="text-xs text-[#4B5563]">
                    Senior underwriters will be notified and must approve this guideline update.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-[#E5E7EB] flex gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 px-4 py-2 bg-white border border-[#E5E7EB] rounded-lg hover:bg-[#F3F4F6] transition-colors text-sm font-medium text-[#111827]"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 px-4 py-2 bg-[#009AE4] text-white rounded-lg hover:bg-[#007BB6] transition-colors text-sm font-medium"
              >
                Submit for Review
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

// Authority View Component
function AuthorityView() {
  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#111827] mb-2">Underwriting Authority</h2>
        <p className="text-sm text-[#4B5563]">Ashley Rodriguez · Senior Underwriter · Commercial Property</p>
      </div>

      {/* Authority Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-white rounded-xl border border-[#E5E7EB] p-6 mb-6">
        <div className="grid grid-cols-3 gap-6">
          <div>
            <div className="text-xs text-[#4B5563] uppercase tracking-wider mb-2">Maximum Line Size</div>
            <div className="text-2xl font-bold text-[#111827]">$5M</div>
            <div className="text-xs text-[#4B5563] mt-1">Per risk</div>
          </div>
          <div>
            <div className="text-xs text-[#4B5563] uppercase tracking-wider mb-2">PML Authority</div>
            <div className="text-2xl font-bold text-[#111827]">$15M</div>
            <div className="text-xs text-[#4B5563] mt-1">1-in-250 year</div>
          </div>
          <div>
            <div className="text-xs text-[#4B5563] uppercase tracking-wider mb-2">Authority Level</div>
            <div className="text-2xl font-bold text-[#009AE4]">Level 3</div>
            <div className="text-xs text-[#4B5563] mt-1">Senior UW</div>
          </div>
        </div>
      </div>

      {/* Binding Authority */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] mb-6">
        <div className="p-6 border-b border-[#E5E7EB]">
          <h3 className="text-lg font-semibold text-[#111827]">Binding Authority</h3>
          <p className="text-sm text-[#4B5563] mt-1">Maximum limits by line of business</p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <AuthorityItem
              label="All Risk Property"
              limit="$5,000,000"
              sublimit="Per location: $2,500,000"
              approved={true}
            />
            <AuthorityItem
              label="Equipment Breakdown"
              limit="$3,000,000"
              sublimit="Per occurrence"
              approved={true}
            />
            <AuthorityItem
              label="Business Interruption"
              limit="$5,000,000"
              sublimit="12 month period"
              approved={true}
            />
            <AuthorityItem
              label="Earthquake"
              limit="$2,000,000"
              sublimit="Subject to accumulation review"
              approved={true}
            />
            <AuthorityItem
              label="Named Windstorm"
              limit="$2,000,000"
              sublimit="Tier 1 zones require referral"
              approved={true}
            />
          </div>
        </div>
      </div>

      {/* Referral Requirements */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] mb-6">
        <div className="p-6 border-b border-[#E5E7EB]">
          <h3 className="text-lg font-semibold text-[#111827]">Referral Requirements</h3>
          <p className="text-sm text-[#4B5563] mt-1">Submissions requiring manager approval</p>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            <ReferralItem
              condition="Line size exceeds $5M"
              referTo="Head of Commercial Property"
              severity="required"
            />
            <ReferralItem
              condition="TIV exceeds $500M"
              referTo="Senior Manager"
              severity="required"
            />
            <ReferralItem
              condition="CAT PML exceeds $15M (1-in-250)"
              referTo="CAT Manager"
              severity="required"
            />
            <ReferralItem
              condition="New construction > $10M"
              referTo="Engineering & Risk Control"
              severity="required"
            />
            <ReferralItem
              condition="Occupancy outside appetite"
              referTo="Senior Manager"
              severity="required"
            />
            <ReferralItem
              condition="Premium below $50K minimum"
              referTo="Head of Commercial Property"
              severity="required"
            />
            <ReferralItem
              condition="Commission deviation > 2%"
              referTo="Senior Manager"
              severity="recommended"
            />
          </div>
        </div>
      </div>

      {/* Pricing Authority */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] mb-6">
        <div className="p-6 border-b border-[#E5E7EB]">
          <h3 className="text-lg font-semibold text-[#111827]">Pricing Authority</h3>
          <p className="text-sm text-[#4B5563] mt-1">Rate on line and pricing discretion</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-[#F7F8FA] rounded-lg">
              <div className="text-xs text-[#4B5563] uppercase tracking-wider mb-2">Minimum Rate on Line</div>
              <div className="text-xl font-bold text-[#111827]">0.12%</div>
              <div className="text-xs text-[#4B5563] mt-1">Below requires referral</div>
            </div>
            <div className="p-4 bg-[#F7F8FA] rounded-lg">
              <div className="text-xs text-[#4B5563] uppercase tracking-wider mb-2">Pricing Discretion</div>
              <div className="text-xl font-bold text-[#111827]">±15%</div>
              <div className="text-xs text-[#4B5563] mt-1">From model indication</div>
            </div>
            <div className="p-4 bg-[#F7F8FA] rounded-lg">
              <div className="text-xs text-[#4B5563] uppercase tracking-wider mb-2">Commission Range</div>
              <div className="text-xl font-bold text-[#111827]">10-17.5%</div>
              <div className="text-xs text-[#4B5563] mt-1">Within appetite</div>
            </div>
            <div className="p-4 bg-[#F7F8FA] rounded-lg">
              <div className="text-xs text-[#4B5563] uppercase tracking-wider mb-2">Minimum Premium</div>
              <div className="text-xl font-bold text-[#111827]">$50,000</div>
              <div className="text-xs text-[#4B5563] mt-1">Per policy</div>
            </div>
          </div>
        </div>
      </div>

      {/* Territory Restrictions */}
      <div className="bg-white rounded-xl border border-[#E5E7EB]">
        <div className="p-6 border-b border-[#E5E7EB]">
          <h3 className="text-lg font-semibold text-[#111827]">Territory & Coverage Restrictions</h3>
          <p className="text-sm text-[#4B5563] mt-1">Geographic and coverage limitations</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-semibold text-[#111827] mb-3">Approved Territories</div>
              <div className="space-y-2">
                <TerritoryItem name="United States (All states)" status="approved" />
                <TerritoryItem name="Puerto Rico" status="approved" />
                <TerritoryItem name="U.S. Virgin Islands" status="approved" />
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold text-[#111827] mb-3">Restricted Coverage</div>
              <div className="space-y-2">
                <TerritoryItem name="International (requires referral)" status="restricted" />
                <TerritoryItem name="Cyber / Non-physical damage" status="excluded" />
                <TerritoryItem name="Builders Risk > $10M" status="restricted" />
                <TerritoryItem name="Occupancies out of appetite" status="excluded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components for Authority View
function AuthorityItem({ label, limit, sublimit, approved }: { label: string; limit: string; sublimit: string; approved: boolean }) {
  return (
    <div className="flex items-center justify-between p-3 bg-[#F7F8FA] rounded-lg">
      <div className="flex-1">
        <div className="text-sm font-semibold text-[#111827]">{label}</div>
        <div className="text-xs text-[#4B5563] mt-1">{sublimit}</div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="text-lg font-bold text-[#009AE4]">{limit}</div>
        </div>
        {approved && <CheckCircle2 className="w-5 h-5 text-green-600" />}
      </div>
    </div>
  );
}

function ReferralItem({ condition, referTo, severity }: { condition: string; referTo: string; severity: "required" | "recommended" }) {
  return (
    <div className={`p-3 rounded-lg border ${severity === "required" ? "bg-red-50 border-red-200" : "bg-yellow-50 border-yellow-200"}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-sm font-medium text-[#111827]">{condition}</div>
          <div className="text-xs text-[#4B5563] mt-1">Refer to: {referTo}</div>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${severity === "required" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
          {severity === "required" ? "Required" : "Recommended"}
        </span>
      </div>
    </div>
  );
}

function TerritoryItem({ name, status }: { name: string; status: "approved" | "restricted" | "excluded" }) {
  const statusConfig = {
    approved: { bg: "bg-green-50", text: "text-green-700", icon: CheckCircle2, iconColor: "text-green-600" },
    restricted: { bg: "bg-yellow-50", text: "text-yellow-700", icon: AlertTriangle, iconColor: "text-yellow-600" },
    excluded: { bg: "bg-red-50", text: "text-red-700", icon: X, iconColor: "text-red-600" },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-2 p-2 ${config.bg} rounded-lg`}>
      <Icon className={`w-4 h-4 ${config.iconColor} flex-shrink-0`} />
      <span className={`text-xs font-medium ${config.text}`}>{name}</span>
    </div>
  );
}

// Helper Components
interface Agent {
  id: string;
  name: string;
  color: string;
  short: string;
}

function GuidelineCard({ title, content, subtitle, badge, onEdit, active = true, agents = [] }: any) {
  return (
    <div className="p-3 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 flex-1">
          <div className="text-xs font-semibold text-[#111827]">{title}</div>
          {active ? (
  <span title="Active">
  <Zap className="w-2 h-2 text-green-600 flex-shrink-0" />
</span>
) : (
  <span title="Inactive">
  <ZapOff className="w-2 h-2 text-[#9CA3AF] flex-shrink-0" />
</span>
)}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onEdit} className="p-1 hover:bg-[#E5E7EB] rounded transition-colors">
            <Edit2 className="w-3 h-3 text-[#4B5563]" />
          </button>
          <button className="p-1 hover:bg-[#E5E7EB] rounded transition-colors">
            <Archive className="w-3 h-3 text-[#9CA3AF]" />
          </button>
        </div>
      </div>
      <div className="text-xs text-[#111827] mb-1">{content}</div>
      {subtitle && (
        <div className={`text-xs mt-1 ${badge === "out" ? "text-red-600" : "text-[#4B5563]"}`}>{subtitle}</div>
      )}
      {agents.length > 0 && (
        <div className="flex items-center gap-1 mt-2">
          {agents.map((agent: Agent) => (
            <div
              key={agent.id}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: agent.color }}
              title={agent.name}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
}

function GuidelineItem({ text, onEdit, active = true, agents = [] }: any) {
  return (
    <div className="flex items-center justify-between p-2 bg-[#F7F8FA] rounded-lg">
      <div className="flex items-center gap-2 flex-1">
        <CheckCircle2 className="w-3 h-3 text-green-600 flex-shrink-0" />
        <span className="text-xs text-[#111827]">{text}</span>
        {active ? (
  <Zap
    className="w-2 h-2 text-green-600 flex-shrink-0"
    aria-hidden="true"
  />
) : (
  <ZapOff
    className="w-2 h-2 text-[#9CA3AF] flex-shrink-0"
    aria-hidden="true"
  />
)}
        {agents.length > 0 && (
          <div className="flex items-center gap-0.5 ml-auto">
            {agents.map((agent: Agent) => (
              <div
                key={agent.id}
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: agent.color }}
                title={agent.name}
              ></div>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 ml-2">
        <button onClick={onEdit} className="p-1 hover:bg-[#E5E7EB] rounded transition-colors">
          <Edit2 className="w-3 h-3 text-[#4B5563]" />
        </button>
        <button className="p-1 hover:bg-[#E5E7EB] rounded transition-colors">
          <Archive className="w-3 h-3 text-[#9CA3AF]" />
        </button>
      </div>
    </div>
  );
}

function CapacityBar({ label, value, max, displayValue, onEdit, active = true, agents = [] }: any) {
  const percentage = (value / max) * 100;
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#111827]">{label}</span>
          {active ? (
  <span title="Active">
    <Zap className="w-2 h-2 text-green-600" />
  </span>
) : (
  <span title="Inactive">
    <ZapOff className="w-2 h-2 text-[#9CA3AF]" />
  </span>
)}
          {agents.length > 0 && (
            <div className="flex items-center gap-0.5">
              {agents.map((agent: Agent) => (
                <div
                  key={agent.id}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: agent.color }}
                  title={agent.name}
                ></div>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onEdit} className="p-1 hover:bg-[#F3F4F6] rounded transition-colors">
            <Edit2 className="w-3 h-3 text-[#4B5563]" />
          </button>
          <button className="p-1 hover:bg-[#F3F4F6] rounded transition-colors">
            <Archive className="w-3 h-3 text-[#9CA3AF]" />
          </button>
        </div>
      </div>
      <div className="bg-[#E5E7EB] rounded-full h-5 overflow-hidden">
        <div
          className="bg-[#009AE4] h-5 flex items-center justify-end pr-2 text-white text-xs font-medium transition-all"
          style={{ width: `${percentage}%` }}
        >
          {displayValue}
        </div>
      </div>
    </div>
  );
}

function DeductibleRow({ peril, range, onEdit, active = true, agents = [] }: any) {
  return (
    <tr className="hover:bg-[#F7F8FA] transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#111827]">{peril}</span>
{active ? (
  <span title="Active">
    <Zap className="w-2 h-2 text-green-600" />
  </span>
) : (
  <span title="Inactive">
    <ZapOff className="w-2 h-2 text-[#9CA3AF]" />
  </span>
)}

          {agents.length > 0 && (
            <div className="flex items-center gap-0.5">
              {agents.map((agent: Agent) => (
                <div
                  key={agent.id}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: agent.color }}
                  title={agent.name}
                ></div>
              ))}
            </div>
          )}
        </div>
      </td>
      <td className="px-4 py-3 text-xs text-[#111827]">{range}</td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-2">
          <button onClick={onEdit} className="p-1 hover:bg-[#E5E7EB] rounded transition-colors">
            <Edit2 className="w-3 h-3 text-[#4B5563]" />
          </button>
          <button className="p-1 hover:bg-[#E5E7EB] rounded transition-colors">
            <Archive className="w-3 h-3 text-[#9CA3AF]" />
          </button>
        </div>
      </td>
    </tr>
  );
}

function OccupancyCard({ title, items, badge, onEdit, active = true, agents = [] }: any) {
  const badgeClass =
    badge === "in"
      ? "bg-green-100 text-green-800"
      : badge === "limited"
      ? "bg-yellow-100 text-yellow-800"
      : "bg-red-100 text-red-800";

  return (
    <div className="p-3 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${badgeClass}`}>{title}</span>
          {active ? (
            <span title="Active" className="inline-flex">
              <Zap className="w-2 h-2 text-green-600" />
            </span>
          ) : (
            <span title="Inactive" className="inline-flex">
              <ZapOff className="w-2 h-2 text-[#9CA3AF]" />
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={onEdit} className="p-1 hover:bg-[#E5E7EB] rounded transition-colors">
            <Edit2 className="w-3 h-3 text-[#4B5563]" />
          </button>
          <button className="p-1 hover:bg-[#E5E7EB] rounded transition-colors">
            <Archive className="w-3 h-3 text-[#9CA3AF]" />
          </button>
        </div>
      </div>
      <ul className="space-y-1 mb-2">
        {items.map((item: string, idx: number) => (
          <li key={idx} className="text-xs text-[#111827] flex items-start">
            <span className="mr-1">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      {agents.length > 0 && (
        <div className="flex items-center gap-1 pt-2 border-t border-[#E5E7EB]">
          {agents.map((agent: Agent) => (
            <div
              key={agent.id}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: agent.color }}
              title={agent.name}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
}

function PricingItem({ label, value, onEdit, active = true, agents = [] }: any) {
  return (
    <div className="flex items-center justify-between p-2 bg-[#F7F8FA] rounded-lg">
      <div className="flex items-center gap-2">
        <div>
          <div className="text-xs text-[#4B5563]">{label}</div>
          <div className="text-sm font-semibold text-[#111827]">{value}</div>
        </div>
        {active ? (
          <span title="Active" className="inline-flex">
            <Zap className="w-2 h-2 text-green-600" />
          </span>
        ) : (
          <span title="Inactive" className="inline-flex">
            <ZapOff className="w-2 h-2 text-[#9CA3AF]" />
          </span>
        )}
        {agents.length > 0 && (
          <div className="flex items-center gap-0.5">
            {agents.map((agent: Agent) => (
              <div
                key={agent.id}
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: agent.color }}
                title={agent.name}
              ></div>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button onClick={onEdit} className="p-1 hover:bg-[#E5E7EB] rounded transition-colors">
          <Edit2 className="w-3 h-3 text-[#4B5563]" />
        </button>
        <button className="p-1 hover:bg-[#E5E7EB] rounded transition-colors">
          <Archive className="w-3 h-3 text-[#9CA3AF]" />
        </button>
      </div>
    </div>
  );
}
