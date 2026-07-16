import { useState } from "react";
import { Filter, ArrowUpDown, ChevronDown, CheckCircle2, Clock, Circle, AlertCircle, Lock, UserCog, Cloud } from "lucide-react";

interface CustomerTableProps {
  onSubmissionSelect?: (id: string) => void;
  selectedId?: string | null;
  filterType?: "all" | "new-business" | "renewals";
}

type SortField = "account" | "broker" | "receivedDate" | "needByDate" | "processingPattern" | "aiPriorityScore";
type SortDirection = "asc" | "desc";

// Workflow statuses
type WorkflowStatus = "complete" | "in-progress" | "pending" | "not-started";

const CURRENT_USER = "Mike Chen";
const TEAM_UWS = ["Mike Chen", "Priya Patel", "Jordan Lee", "Ashley Romero", "Diego Alvarez"];

interface Submission {
  id: string;
  account: string;
  accountIndustry: string;
  broker: string;
  brokerContact: string;
  submissionType: "New Business" | "Renewal" | "Endorsement" | "Remarket";
  receivedDate: string;
  needByDate: string;
  processingPattern: "Low Touch" | "Medium Touch" | "High Touch";
  aiPriorityScore: number;
  winPropensity: number;
  accretiveness: "High" | "Medium" | "Low";
  assignedUW: string;
  clearance: "complete" | "in-progress";

  // Workflow statuses
  ingested: WorkflowStatus;
  processed: WorkflowStatus;
  triaged: WorkflowStatus;
  uwAnalysis: WorkflowStatus;
  modellingReady: WorkflowStatus;
  raterGenerated: WorkflowStatus;
  quoteReady: WorkflowStatus;
  quoted: WorkflowStatus;
  formManuscript: WorkflowStatus;
  book: WorkflowStatus;
  bind: WorkflowStatus;
  issue: WorkflowStatus;
}

const submissions: Submission[] = [
  {
    id: "SUB-2026-0847",
    account: "Westfield Manufacturing Corp",
    accountIndustry: "Manufacturing",
    broker: "Marsh & McLennan",
    brokerContact: "Sarah Chen",
    submissionType: "New Business",
    receivedDate: "2026-04-08",
    needByDate: "2026-04-18",
    processingPattern: "High Touch",
    aiPriorityScore: 94,
    winPropensity: 78,
    accretiveness: "High",
    assignedUW: "Mike Chen",
    clearance: "complete",
    ingested: "complete",
    processed: "complete",
    triaged: "complete",
    uwAnalysis: "in-progress",
    modellingReady: "pending",
    raterGenerated: "not-started",
    quoteReady: "not-started",
    quoted: "not-started",
    formManuscript: "not-started",
    book: "not-started",
    bind: "not-started",
    issue: "not-started",
  },
  {
    id: "SUB-2026-0846",
    account: "Global Tech Industries LLC",
    accountIndustry: "Technology",
    broker: "Aon",
    brokerContact: "Michael Torres",
    submissionType: "Renewal",
    receivedDate: "2026-04-06",
    needByDate: "2026-04-25",
    processingPattern: "Low Touch",
    aiPriorityScore: 88,
    winPropensity: 85,
    accretiveness: "Medium",
    assignedUW: "Priya Patel",
    clearance: "complete",
    ingested: "complete",
    processed: "complete",
    triaged: "complete",
    uwAnalysis: "complete",
    modellingReady: "complete",
    raterGenerated: "complete",
    quoteReady: "complete",
    quoted: "complete",
    formManuscript: "not-started",
    book: "not-started",
    bind: "not-started",
    issue: "not-started",
  },
  {
    id: "SUB-2026-0845",
    account: "Atlantic Distribution Centers",
    accountIndustry: "Logistics",
    broker: "Willis Towers Watson",
    brokerContact: "Jennifer Blake",
    submissionType: "New Business",
    receivedDate: "2026-04-09",
    needByDate: "2026-04-22",
    processingPattern: "High Touch",
    aiPriorityScore: 92,
    winPropensity: 65,
    accretiveness: "High",
    assignedUW: "Mike Chen",
    clearance: "in-progress",
    ingested: "complete",
    processed: "complete",
    triaged: "in-progress",
    uwAnalysis: "pending",
    modellingReady: "not-started",
    raterGenerated: "not-started",
    quoteReady: "not-started",
    quoted: "not-started",
    formManuscript: "not-started",
    book: "not-started",
    bind: "not-started",
    issue: "not-started",
  },
  {
    id: "SUB-2026-0844",
    account: "Northeast Logistics Group",
    accountIndustry: "Logistics",
    broker: "Lockton",
    brokerContact: "David Park",
    submissionType: "Endorsement",
    receivedDate: "2026-04-07",
    needByDate: "2026-04-17",
    processingPattern: "Medium Touch",
    aiPriorityScore: 76,
    winPropensity: 90,
    accretiveness: "Medium",
    assignedUW: "Jordan Lee",
    clearance: "complete",
    ingested: "complete",
    processed: "complete",
    triaged: "complete",
    uwAnalysis: "in-progress",
    modellingReady: "in-progress",
    raterGenerated: "not-started",
    quoteReady: "not-started",
    quoted: "not-started",
    formManuscript: "not-started",
    book: "not-started",
    bind: "not-started",
    issue: "not-started",
  },
  {
    id: "SUB-2026-0850",
    account: "TechCorp Solutions Inc",
    accountIndustry: "Technology",
    broker: "Aon",
    brokerContact: "Lisa Rodriguez",
    submissionType: "Renewal",
    receivedDate: "2026-04-12",
    needByDate: "2026-05-01",
    processingPattern: "Medium Touch",
    aiPriorityScore: 91,
    winPropensity: 88,
    accretiveness: "High",
    assignedUW: "Mike Chen",
    clearance: "complete",
    ingested: "complete",
    processed: "complete",
    triaged: "in-progress",
    uwAnalysis: "pending",
    modellingReady: "not-started",
    raterGenerated: "not-started",
    quoteReady: "not-started",
    quoted: "not-started",
    formManuscript: "not-started",
    book: "not-started",
    bind: "not-started",
    issue: "not-started",
  },
  {
    id: "SUB-2026-0851",
    account: "TechCorp Solutions Inc",
    accountIndustry: "Technology",
    broker: "Aon",
    brokerContact: "Lisa Rodriguez",
    submissionType: "Endorsement",
    receivedDate: "2026-02-15",
    needByDate: "2026-03-01",
    processingPattern: "Low Touch",
    aiPriorityScore: 82,
    winPropensity: 92,
    accretiveness: "Medium",
    assignedUW: "Diego Alvarez",
    clearance: "complete",
    ingested: "complete",
    processed: "complete",
    triaged: "complete",
    uwAnalysis: "complete",
    modellingReady: "complete",
    raterGenerated: "complete",
    quoteReady: "complete",
    quoted: "complete",
    formManuscript: "not-started",
    book: "not-started",
    bind: "not-started",
    issue: "not-started",
  },
  {
    id: "SUB-2026-0843",
    account: "Pacific Coast Hotels & Resorts",
    accountIndustry: "Hospitality",
    broker: "Marsh & McLennan",
    brokerContact: "Sarah Chen",
    submissionType: "New Business",
    receivedDate: "2026-04-05",
    needByDate: "2026-04-20",
    processingPattern: "Medium Touch",
    aiPriorityScore: 90,
    winPropensity: 72,
    accretiveness: "High",
    assignedUW: "Mike Chen",
    clearance: "complete",
    ingested: "complete",
    processed: "complete",
    triaged: "complete",
    uwAnalysis: "complete",
    modellingReady: "in-progress",
    raterGenerated: "not-started",
    quoteReady: "not-started",
    quoted: "not-started",
    formManuscript: "not-started",
    book: "not-started",
    bind: "not-started",
    issue: "not-started",
  },
  {
    id: "SUB-2026-0842",
    account: "Midwest Manufacturing Inc",
    accountIndustry: "Manufacturing",
    broker: "Aon",
    brokerContact: "Michael Torres",
    submissionType: "Renewal",
    receivedDate: "2026-04-10",
    needByDate: "2026-04-28",
    processingPattern: "Low Touch",
    aiPriorityScore: 72,
    winPropensity: 88,
    accretiveness: "Low",
    assignedUW: "Priya Patel",
    clearance: "complete",
    ingested: "complete",
    processed: "in-progress",
    triaged: "not-started",
    uwAnalysis: "not-started",
    modellingReady: "not-started",
    raterGenerated: "not-started",
    quoteReady: "not-started",
    quoted: "not-started",
    formManuscript: "not-started",
    book: "not-started",
    bind: "not-started",
    issue: "not-started",
  },
];

function getCurrentStage(submission: Submission): { stage: string; status: WorkflowStatus } {
  const stages: { key: keyof Submission; label: string }[] = [
    { key: "ingested", label: "Ingested" },
    { key: "processed", label: "Processed" },
    { key: "triaged", label: "Triaged" },
    { key: "uwAnalysis", label: "UW Analysis" },
    { key: "modellingReady", label: "Modelling" },
    { key: "raterGenerated", label: "Rater Generated" },
    { key: "quoteReady", label: "Quote Ready" },
    { key: "quoted", label: "Quoted" },
    { key: "formManuscript", label: "Form/Manuscript" },
    { key: "book", label: "Book" },
    { key: "bind", label: "Bind" },
    { key: "issue", label: "Issue" },
  ];

  // Find the first non-complete stage
  for (let i = 0; i < stages.length; i++) {
    const stageStatus = submission[stages[i].key] as WorkflowStatus;
    if (stageStatus !== "complete") {
      return { stage: stages[i].label, status: stageStatus };
    }
  }

  // All stages complete
  return { stage: "Issue", status: "complete" };
}

function StatusBadge({ stage, status }: { stage: string; status: WorkflowStatus }) {
  let bgColor = "";
  let textColor = "";
  let icon = null;

  switch (status) {
    case "complete":
      bgColor = "bg-green-100";
      textColor = "text-green-700";
      icon = <CheckCircle2 className="w-3 h-3" />;
      break;
    case "in-progress":
      bgColor = "bg-blue-100";
      textColor = "text-blue-700";
      icon = <Clock className="w-3 h-3 animate-pulse" />;
      break;
    case "pending":
      bgColor = "bg-yellow-100";
      textColor = "text-yellow-700";
      icon = <AlertCircle className="w-3 h-3" />;
      break;
    case "not-started":
      bgColor = "bg-gray-100";
      textColor = "text-gray-600";
      icon = <Circle className="w-3 h-3" />;
      break;
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${bgColor} ${textColor}`}>
      {icon}
      <span className="text-xs font-medium">{stage}</span>
    </div>
  );
}

function uwInitials(name: string) {
  return name.split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase();
}

function uwColor(name: string) {
  const palette = ["#009AE4", "#7C3AED", "#059669", "#DC2626", "#D97706", "#0891B2"];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % palette.length;
  return palette[h];
}

function UWAssignmentCell({
  submission,
  isMine,
  onReassign,
}: {
  submission: Submission;
  isMine: boolean;
  onReassign: (id: string, uw: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const name = submission.assignedUW;
  const color = uwColor(name);

  return (
    <div className="relative inline-block">
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (isMine) setOpen(o => !o);
        }}
        disabled={!isMine}
        className={`flex items-center gap-2 px-2 py-1 rounded-md border ${
          isMine
            ? "border-[#E8E6E1] bg-white hover:bg-[#FAFAF9]"
            : "border-[#EFEDE7] bg-[#F7F6F3] cursor-not-allowed"
        }`}
        title={isMine ? "Click to re-assign" : `Locked — assigned to ${name}`}
      >
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px]"
          style={{ backgroundColor: color, fontWeight: 700 }}
        >
          {uwInitials(name)}
        </div>
        <div className="text-left">
          <div className={`text-xs ${isMine ? "text-[#111827]" : "text-[#6B7280]"}`} style={{ fontWeight: 600 }}>
            {name}
          </div>
          <div className="text-[10px] text-[#9B9B98]">{isMine ? "Assigned to you" : "Other UW"}</div>
        </div>
        {isMine ? (
          <ChevronDown className="w-3 h-3 text-[#6B7280]" />
        ) : (
          <Lock className="w-3 h-3 text-[#9B9B98]" />
        )}
      </button>

      {open && isMine && (
        <div
          className="absolute top-full left-0 mt-1 z-20 w-56 bg-white border border-[#E8E6E1] rounded-lg shadow-lg py-1"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-3 py-1.5 text-[10px] text-[#9B9B98] uppercase tracking-wider" style={{ fontWeight: 700 }}>
            Re-assign to
          </div>
          {TEAM_UWS.filter(u => u !== name).map(u => (
            <button
              key={u}
              onClick={() => {
                onReassign(submission.id, u);
                setOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[#2D2D2D] hover:bg-[#FAFAF9]"
            >
              <UserCog className="w-3.5 h-3.5 text-[#009AE4]" />
              <span>{u}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ClearanceBadge({ status }: { status: "complete" | "in-progress" }) {
  if (status === "complete") {
    return (
      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200" title="Clearance completed via Salesforce">
        <CheckCircle2 className="w-3 h-3" />
        <Cloud className="w-3 h-3" />
        <span className="text-[10px]" style={{ fontWeight: 600 }}>Cleared · SF</span>
      </div>
    );
  }
  return (
    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200" title="Salesforce clearance in progress">
      <Clock className="w-3 h-3 animate-pulse" />
      <span className="text-[10px]" style={{ fontWeight: 600 }}>Clearing · SF</span>
    </div>
  );
}

export function CustomerTable({ onSubmissionSelect, selectedId, filterType = "all" }: CustomerTableProps = {}) {
  const [sortField, setSortField] = useState<SortField>("receivedDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBroker, setSelectedBroker] = useState<string>("all");
  const [selectedProcessingPattern, setSelectedProcessingPattern] = useState<string>("all");
  const [view, setView] = useState<"all" | "mine">("all");
  const [assignments, setAssignments] = useState<Record<string, string>>({});

  const handleReassign = (id: string, uw: string) => {
    setAssignments(prev => ({ ...prev, [id]: uw }));
  };
  const getAssignedUW = (s: Submission) => assignments[s.id] ?? s.assignedUW;

  // Filter submissions
  let filteredSubmissions = submissions.filter(sub => {
    if (filterType === "all") return true;
    if (filterType === "new-business") {
      return sub.submissionType === "New Business" || sub.submissionType === "Remarket";
    }
    return sub.submissionType === "Renewal" || sub.submissionType === "Endorsement";
  });

  // Apply search filter
  if (searchTerm) {
    filteredSubmissions = filteredSubmissions.filter(sub =>
      sub.account.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.broker.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Apply broker filter
  if (selectedBroker !== "all") {
    filteredSubmissions = filteredSubmissions.filter(sub => sub.broker === selectedBroker);
  }

  // Apply processing pattern filter
  if (selectedProcessingPattern !== "all") {
    filteredSubmissions = filteredSubmissions.filter(sub => sub.processingPattern === selectedProcessingPattern);
  }

  // Apply view filter (all UWs vs Mike's submissions)
  if (view === "mine") {
    filteredSubmissions = filteredSubmissions.filter(sub => getAssignedUW(sub) === CURRENT_USER);
  }

  // Sort submissions
  const sortedSubmissions = [...filteredSubmissions].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (sortField === "receivedDate" || sortField === "needByDate") {
      aVal = new Date(aVal as string).getTime();
      bVal = new Date(bVal as string).getTime();
    }

    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const uniqueBrokers = Array.from(new Set(submissions.map(s => s.broker)));

  const isCompressed = selectedId !== null;

  return (
    <div className={`${isCompressed ? "p-4" : "p-6"}`}>
      {/* Top Controls */}
      {!isCompressed && (
        <div className="mb-5 space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search accounts, submissions, brokers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-[#E8E6E1] rounded-xl text-sm w-96 focus:outline-none focus:ring-2 focus:ring-[#009AE4] bg-white placeholder:text-[#B0B0AC]"
            />
            <select
              value={selectedBroker}
              onChange={(e) => setSelectedBroker(e.target.value)}
              className="px-3 py-2 bg-white border border-[#E8E6E1] rounded-xl text-sm text-[#5D5D5D]"
            >
              <option value="all">All Brokers</option>
              {uniqueBrokers.map(broker => (
                <option key={broker} value={broker}>{broker}</option>
              ))}
            </select>
            <select
              value={selectedProcessingPattern}
              onChange={(e) => setSelectedProcessingPattern(e.target.value)}
              className="px-3 py-2 bg-white border border-[#E8E6E1] rounded-xl text-sm text-[#5D5D5D]"
            >
              <option value="all">All Patterns</option>
              <option value="Low Touch">Low Touch</option>
              <option value="Medium Touch">Medium Touch</option>
              <option value="High Touch">High Touch</option>
            </select>
            <div className="ml-auto inline-flex rounded-xl border border-[#E8E6E1] bg-white p-0.5">
              <button
                onClick={() => setView("all")}
                className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                  view === "all" ? "bg-[#2D2D2D] text-white" : "text-[#5D5D5D] hover:bg-[#FAFAF9]"
                }`}
                style={{ fontWeight: 600 }}
              >
                All UWs ({submissions.length})
              </button>
              <button
                onClick={() => setView("mine")}
                className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                  view === "mine" ? "bg-[#2D2D2D] text-white" : "text-[#5D5D5D] hover:bg-[#FAFAF9]"
                }`}
                style={{ fontWeight: 600 }}
              >
                My submissions ({submissions.filter(s => (assignments[s.id] ?? s.assignedUW) === CURRENT_USER).length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E8E6E1] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#FAFAF9] border-b border-[#E8E6E1]">
              <tr>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort("account")}
                    className="flex items-center gap-1 text-xs font-medium text-[#4B5563] uppercase tracking-wider hover:text-[#111827]"
                  >
                    Account
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort("broker")}
                    className="flex items-center gap-1 text-xs font-medium text-[#4B5563] uppercase tracking-wider hover:text-[#111827]"
                  >
                    Broker
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort("receivedDate")}
                    className="flex items-center gap-1 text-xs font-medium text-[#4B5563] uppercase tracking-wider hover:text-[#111827]"
                  >
                    Received
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort("needByDate")}
                    className="flex items-center gap-1 text-xs font-medium text-[#4B5563] uppercase tracking-wider hover:text-[#111827]"
                  >
                    Need By
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort("processingPattern")}
                    className="flex items-center gap-1 text-xs font-medium text-[#4B5563] uppercase tracking-wider hover:text-[#111827]"
                  >
                    Pattern
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#4B5563] uppercase tracking-wider">Underwriter</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#4B5563] uppercase tracking-wider">Clearance</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#4B5563] uppercase tracking-wider">Current Stage</th>
                <th className="px-4 py-3 text-left">
                  <button
                    onClick={() => handleSort("aiPriorityScore")}
                    className="flex items-center gap-1 text-xs font-medium text-[#4B5563] uppercase tracking-wider hover:text-[#111827]"
                  >
                    Priority
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {sortedSubmissions.map((sub) => (
                <tr
                  key={sub.id}
                  onClick={() => onSubmissionSelect?.(sub.id)}
                  className={`hover:bg-[#F7F8FA] cursor-pointer transition-colors ${
                    selectedId === sub.id ? "bg-blue-50 border-l-4 border-[#009AE4]" : ""
                  }`}
                >
                  <td className="px-4 py-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-semibold text-[#111827]">{sub.account}</div>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded border ${
                            sub.submissionType === "New Business" || sub.submissionType === "Remarket"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-purple-50 text-purple-700 border-purple-200"
                          }`}
                          style={{ fontWeight: 600 }}
                        >
                          {sub.submissionType}
                        </span>
                      </div>
                      <div className="text-xs text-[#4B5563]">{sub.accountIndustry}</div>
                      <div className="text-xs text-[#009AE4] font-medium mt-1">{sub.id}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div>
                      <div className="text-sm font-medium text-[#111827]">{sub.broker}</div>
                      <div className="text-xs text-[#4B5563]">{sub.brokerContact}</div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-[#111827]">
                      {new Date(sub.receivedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-[#111827]">
                      {new Date(sub.needByDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        sub.processingPattern === "Low Touch"
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : sub.processingPattern === "Medium Touch"
                          ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      {sub.processingPattern}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <UWAssignmentCell
                      submission={{ ...sub, assignedUW: getAssignedUW(sub) }}
                      isMine={getAssignedUW(sub) === CURRENT_USER}
                      onReassign={handleReassign}
                    />
                  </td>
                  <td className="px-4 py-4">
                    <ClearanceBadge status={sub.clearance} />
                  </td>
                  <td className="px-4 py-4">
                    {(() => {
                      const { stage, status } = getCurrentStage(sub);
                      return <StatusBadge stage={stage} status={status} />;
                    })()}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-[#009AE4] text-white flex items-center justify-center font-bold text-sm">
                        {sub.aiPriorityScore}
                      </div>
                      <div className="text-xs">
                        <div className="text-[#4B5563]">Win: <span className="font-semibold text-green-600">{sub.winPropensity}%</span></div>
                        <div className="text-[#4B5563]">
                          <span className={`font-semibold ${
                            sub.accretiveness === "High" ? "text-green-600" : sub.accretiveness === "Medium" ? "text-yellow-600" : "text-gray-600"
                          }`}>
                            {sub.accretiveness}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      {!isCompressed && (
        <div className="mt-4 p-4 bg-white rounded-lg border border-[#E5E7EB]">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-xs font-semibold text-[#111827] mb-2">Workflow Stages</div>
              <div className="text-xs text-[#4B5563] space-y-1">
                <div>Ingested → Processed → Triaged → UW Analysis → Modelling → Rater Generated</div>
                <div>→ Quote Ready → Quoted → Form/Manuscript → Book → Bind → Issue</div>
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-[#111827] mb-2">Status Indicators</div>
              <div className="flex items-center gap-6 text-xs flex-wrap">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3 h-3 text-green-600" />
                  <span className="text-[#4B5563]">Complete</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3 text-blue-600" />
                  <span className="text-[#4B5563]">In Progress</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-3 h-3 text-yellow-600" />
                  <span className="text-[#4B5563]">Pending</span>
                </div>
                <div className="flex items-center gap-2">
                  <Circle className="w-3 h-3 text-gray-300" />
                  <span className="text-[#4B5563]">Not Started</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}