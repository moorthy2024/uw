"use client";

import { useState, useRef, useEffect, createContext, useContext } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Circle, Sparkles, ThumbsUp, ThumbsDown, ChevronDown, MessageSquare, Send, X, FileText } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ArtifactsPanel, type ArtifactsStepStatus } from "./ArtifactsPanel";
import { IngestionDetails } from "./IngestionDetails";

type StepId = "overview" | "s01" | "s02" | "s03" | "s04" | "s05";
type StepStatus = "complete" | "current" | "pending";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface StepDef {
  id: StepId;
  number: string;
  label: string;
  status: StepStatus;
}

const steps: StepDef[] = [
  { id: "overview", number: "", label: "Account Overview", status: "current" },
  { id: "s01", number: "01", label: "Ingestion", status: "complete" },
  { id: "s02", number: "02", label: "Triage", status: "complete" },
  { id: "s03", number: "03", label: "UW Analysis", status: "complete" },
  { id: "s04", number: "04", label: "UW Review", status: "complete" },
  { id: "s05", number: "05", label: "Decision", status: "current" },
];

interface SubmissionMeta {
  id: string;
  accountName: string;
  namedInsured: string;
  broker: string;
  brokerageHouse: string;
  type: "New Business" | "Renewal" | "Endorsement" | "Remarket";
  coverageType: string;
  tiv: string;
  tivFull: string;
  territory: string;
  locations: string;
  inceptionDate: string;
  submissionDate: string;
  naics: string;
  industry: string;
  summary: string;
}

function getSectionId(stepId: StepId): string | null {
  const mapping: Record<StepId, string | null> = {
    overview: null,
    s01: "account-identity",
    s02: "program-structure",
    s03: "risk-assessment",
    s04: "indication-quote",
    s05: "decision-bind",
  };
  return mapping[stepId];
}

const submissionData: Record<string, SubmissionMeta> = {
  "SUB-2026-0847": {
    id: "SUB-2026-0847",
    accountName: "Westfield Manufacturing",
    namedInsured: "Westfield Manufacturing LLC",
    broker: "Sarah Chen",
    brokerageHouse: "Marsh & McLennan",
    type: "New Business",
    coverageType: "Commercial Property",
    tiv: "$285M",
    tivFull: "$285,000,000",
    territory: "OH, IN, FL",
    locations: "8 — OH:4, IN:3, FL:1",
    inceptionDate: "01 Jul 2026",
    submissionDate: "08 Apr 2026",
    naics: "332710 — Metal Mfg",
    industry: "Manufacturing",
    summary:
      "Westfield Manufacturing operates three light industrial facilities in Ohio and Indiana producing fabricated metal components. Primary CAT exposure is wind/hail (OH/IN) and hurricane (FL location added 2025). Painting booth flagged as ignition hazard.",
  },
  "SUB-2026-0846": {
    id: "SUB-2026-0846",
    accountName: "Global Tech Industries",
    namedInsured: "Global Tech Industries LLC",
    broker: "Michael Torres",
    brokerageHouse: "Aon",
    type: "Renewal",
    coverageType: "Commercial Property",
    tiv: "$172M",
    tivFull: "$172,000,000",
    territory: "CA, TX, NC",
    locations: "5 — CA:2, TX:2, NC:1",
    inceptionDate: "01 Jun 2026",
    submissionDate: "06 Apr 2026",
    naics: "541512 — Computer Systems Design",
    industry: "Technology",
    summary:
      "Global Tech operates data centers and tech offices across CA/TX/NC. Renewal of expiring program — clean loss history (LR 0.08). CA earthquake exposure and rising data-center fire load are renewal focus areas.",
  },
  "SUB-2026-0845": {
    id: "SUB-2026-0845",
    accountName: "Atlantic Distribution",
    namedInsured: "Atlantic Distribution Centers, Inc.",
    broker: "Jennifer Blake",
    brokerageHouse: "Willis Towers Watson",
    type: "New Business",
    coverageType: "Commercial Property",
    tiv: "$214M",
    tivFull: "$214,000,000",
    territory: "FL, GA, SC",
    locations: "12 — FL:6, GA:4, SC:2",
    inceptionDate: "15 May 2026",
    submissionDate: "09 Apr 2026",
    naics: "493110 — General Warehousing",
    industry: "Logistics",
    summary:
      "Atlantic Distribution runs 12 high-bay distribution centers across FL/GA/SC. New business — no prior QBE relationship. Hurricane exposure heavy along FL coast; ESFR sprinkler protection confirmed at 10 of 12 sites.",
  },
  "SUB-2026-0844": {
    id: "SUB-2026-0844",
    accountName: "Northeast Logistics Group",
    namedInsured: "Northeast Logistics Group LLC",
    broker: "David Park",
    brokerageHouse: "Lockton",
    type: "Endorsement",
    coverageType: "Commercial Property",
    tiv: "$118M",
    tivFull: "$118,000,000",
    territory: "NY, NJ, PA",
    locations: "6 — NY:3, NJ:2, PA:1",
    inceptionDate: "10 Mar 2026",
    submissionDate: "07 Apr 2026",
    naics: "488510 — Freight Arrangement",
    industry: "Logistics",
    summary:
      "Mid-term endorsement to add a new Bronx, NY warehouse ($18M TIV) to existing program. Standard occupancy match; no change to perils. Quick-touch endorsement.",
  },
  "SUB-2026-0850": {
    id: "SUB-2026-0850",
    accountName: "TechCorp Solutions",
    namedInsured: "TechCorp Solutions Inc.",
    broker: "Lisa Rodriguez",
    brokerageHouse: "Aon",
    type: "Renewal",
    coverageType: "Excess Property",
    tiv: "$210M",
    tivFull: "$210,000,000",
    territory: "TX, OK",
    locations: "4 — TX:3, OK:1",
    inceptionDate: "15 Jun 2026",
    submissionDate: "12 Apr 2026",
    naics: "541512 — Computer Systems Design",
    industry: "Technology",
    summary:
      "TechCorp renewal of $25M xs $25M layer. Expiring LR 0.04 — clean. SCS exposure across TX is the only renewal focus; broker requesting modest premium reduction.",
  },
  "SUB-2026-0851": {
    id: "SUB-2026-0851",
    accountName: "TechCorp Solutions",
    namedInsured: "TechCorp Solutions Inc.",
    broker: "Lisa Rodriguez",
    brokerageHouse: "Aon",
    type: "Endorsement",
    coverageType: "Excess Property",
    tiv: "$210M",
    tivFull: "$210,000,000",
    territory: "TX, OK",
    locations: "4 — TX:3, OK:1",
    inceptionDate: "15 Feb 2026",
    submissionDate: "15 Feb 2026",
    naics: "541512 — Computer Systems Design",
    industry: "Technology",
    summary:
      "TechCorp endorsement — name change endorsement following entity rename. No exposure change.",
  },
  "SUB-2026-0843": {
    id: "SUB-2026-0843",
    accountName: "Pacific Coast Hotels & Resorts",
    namedInsured: "Pacific Coast Hotels & Resorts LP",
    broker: "Sarah Chen",
    brokerageHouse: "Marsh & McLennan",
    type: "New Business",
    coverageType: "Commercial Property",
    tiv: "$156M",
    tivFull: "$156,000,000",
    territory: "CA, OR, WA",
    locations: "9 — CA:5, OR:2, WA:2",
    inceptionDate: "01 May 2026",
    submissionDate: "05 Apr 2026",
    naics: "721110 — Hotels (except Casino)",
    industry: "Hospitality",
    summary:
      "Boutique hotel portfolio across the Pacific Coast. New business submission with mixed wood-frame and Type II construction. CA earthquake and wildfire are primary CAT exposures; sprinkler coverage incomplete at 2 of 9 properties.",
  },
  "SUB-2026-0842": {
    id: "SUB-2026-0842",
    accountName: "Midwest Manufacturing",
    namedInsured: "Midwest Manufacturing Inc.",
    broker: "Michael Torres",
    brokerageHouse: "Aon",
    type: "Renewal",
    coverageType: "Commercial Property",
    tiv: "$94M",
    tivFull: "$94,000,000",
    territory: "IL, WI",
    locations: "3 — IL:2, WI:1",
    inceptionDate: "01 Jun 2026",
    submissionDate: "10 Apr 2026",
    naics: "333120 — Construction Mfg",
    industry: "Manufacturing",
    summary:
      "Midwest Manufacturing renewal — long-standing account, 6 years on book. Single small loss this period ($38K — equipment breakdown). Stable program structure expected.",
  },
};

interface SubmissionAnalysisProps {
  submissionId?: string;
}

function getAIResponse(query: string): string {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes("declined") || lowerQuery.includes("decline")) {
    return `Based on your book history, here are 3 similar submissions that were declined:\n\n**1. Riverside Manufacturing (SUB-2025-0634)** — Declined Feb 2026\n• TIV: $245M across OH, IN\n• Similar light manufacturing profile\n• Declined due to: Inadequate sprinkler coverage (only 60% of facilities), poor loss history (3 fires in 5 years totaling $2.1M), and unwilling to accept $500K NWS deductible\n\n**2. Midwest Fabrication Partners (SUB-2025-0521)** — Declined Jan 2026\n• TIV: $198M in IL, WI\n• Metal fabrication, painting operations\n• Declined due to: No engineering report in 4+ years, multiple OSHA violations flagged in clearance, CAT accumulation concerns in IL wind zone\n\n**3. Great Lakes Industrial (SUB-2025-0412)** — Declined Dec 2025\n• TIV: $312M across 12 locations\n• Declined due to: Broker unwilling to accept modeled pricing (+42% vs expiring), high wind exposure without adequate deductible structure, prior carrier non-renewed for loss activity\n\n**Key Patterns:** Most declines in this segment relate to (1) inadequate fire protection, (2) high CAT exposure without appropriate deductible structures, or (3) poor loss history. Westfield Manufacturing appears stronger on all three dimensions.`;
  }

  if (lowerQuery.includes("similar") || lowerQuery.includes("comparable")) {
    return `I found 4 comparable submissions currently in your book:\n\n**Atlantic Precision (SUB-2026-0521)** — Currently Quoted\n• TIV $215M, Light Mfg, OH/PA\n• Similar risk profile, quoted at $287K all-in\n• Quote acceptance probability: 68%\n\n**Northern Components (SUB-2025-0892)** — Bound\n• TIV $198M, Metal fabrication, MI/IN\n• Bound at $245K, performing well (no losses YTD)\n\n**Summit Manufacturing (SUB-2026-0234)** — In Rating\n• TIV $302M, Industrial mfg, IN/IL/WI\n• Modelling just returned, target pricing $340K\n\nThese comparables suggest a target range of $260K–$310K for Westfield's profile.`;
  }

  if (lowerQuery.includes("risk") || lowerQuery.includes("exposure") || lowerQuery.includes("cat")) {
    return `**CAT Exposure Summary for Westfield Manufacturing:**\n\n• **Hurricane (FL location):** PML 15% = $42.7M at 250yr\n• **Severe Convective Storm (OH/IN):** PML 8% = $22.8M at 250yr\n• **Earthquake:** Minimal exposure (<2% PML)\n\nThe Tampa facility (Building 8, $48M TIV) drives 65% of total hurricane exposure despite being only 17% of total TIV. This concentration suggests we should structure NWS deductible specifically for FL location.\n\n**Recommendation:** $1.5M aggregate NWS deductible with $500K per-location sublimit for FL.`;
  }

  if (lowerQuery.includes("price") || lowerQuery.includes("pricing") || lowerQuery.includes("quote")) {
    return `**Pricing Analysis for Westfield Manufacturing:**\n\nBased on comparables and modeled loss costs:\n• **Technical Price:** $298,500 (loss cost $142K + expense load + margin)\n• **Market Range:** $260K–$310K\n• **Expiring Premium:** $265,000 (different program structure)\n\n**Recommendation:** Quote at $285,000 with:\n- Strong competitive position vs. expiring\n- 14% margin to technical price for negotiation room\n- Positions us favorably vs. likely market competition (Chubb, AIG typically 5-8% higher in this segment)`;
  }

  return `I can help you analyze this submission. Try asking:\n• "Show me similar submissions that were declined"\n• "What are the key CAT exposures?"\n• "Compare this to similar accounts"\n• "What should we price this at?"\n• "What are the risk flags I should watch?"`;
}

export function SubmissionAnalysis({ submissionId }: SubmissionAnalysisProps = {}) {
  const params = useParams();
  const router = useRouter();
  const rawId = submissionId || params?.id;
  const id = typeof rawId === "string" ? rawId : Array.isArray(rawId) ? rawId[0] : undefined;
  const [activeStep, setActiveStep] = useState<StepId>("overview");
  const [chatActive, setChatActive] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [artifactsOpen, setArtifactsOpen] = useState(false);
  const [pendingArtifactId, setPendingArtifactId] = useState<string | null>(null);

  const submission = id ? submissionData[id] : null;

  const artifactStepStatus: ArtifactsStepStatus = {
    s01: "complete",
    s02: "complete",
    s03: "complete",
    s04: "complete",
    s05: "current",
  };

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setChatActive(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        role: "assistant",
        content: getAIResponse(content.trim()),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 800);
  };

  const isExpanded = !sidebarCollapsed || sidebarHovered;

  return (
    <div className="h-full flex bg-[#F9F9F8]">
      {/* Side Panel — 5-step Workflow */}
      <motion.aside
        animate={{ width: isExpanded ? 260 : 48 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        onMouseEnter={() => setSidebarHovered(true)}
        onMouseLeave={() => setSidebarHovered(false)}
        className="flex-shrink-0 border-r border-[#E8E6E1] bg-[#F2F1EE] flex flex-col relative overflow-hidden"
      >
        <div className={`py-5 border-b border-[#E8E6E1] ${isExpanded ? "px-5" : "px-3"}`}>
          <button
            onClick={() => router.back()}
            className={`flex items-center gap-1.5 text-[11px] text-[#6B7280] hover:text-[#2D2D2D] mb-3 transition-colors ${
              !isExpanded ? "justify-center w-full" : ""
            }`}
          >
            <ArrowLeft className="w-3 h-3" />
            {isExpanded && <span>Back</span>}
          </button>
          {isExpanded && (
            <>
              <div className="text-[10px] text-[#009AE4] uppercase tracking-wider" style={{ fontWeight: 600 }}>
                Commercial Property
              </div>
              <h1 className="text-base text-[#2D2D2D] mt-0.5" style={{ fontWeight: 600 }}>
                {submission?.accountName || "Account"}
              </h1>
              <p className="text-[11px] text-[#9B9B98] mt-0.5">{submission?.id}</p>
            </>
          )}
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {steps.map((step) => {
            const isActive = activeStep === step.id;
            const isOverview = step.id === "overview";
            return (
              <button
                key={step.id}
                onClick={() => {
                  setActiveStep(step.id);
                  setSidebarCollapsed(true);
                  if (step.id === "overview") {
                    document.querySelector("main")?.scrollTo({ top: 0, behavior: "smooth" });
                  } else {
                    const sectionId = getSectionId(step.id);
                    if (sectionId) {
                      const element = document.getElementById(sectionId);
                      element?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }
                }}
                className={`w-full flex items-center ${isExpanded ? "gap-3" : "justify-center"} px-3 py-2.5 rounded-lg text-left transition-all ${
                  isActive
                    ? "bg-white border border-[#E8E6E1] shadow-sm"
                    : "hover:bg-white/60"
                }`}
              >
                <StepBadge step={step} isActive={isActive} isOverview={isOverview} />
                {isExpanded && (
                  <span
                    className={`text-sm ${
                      isActive
                        ? "text-[#0F3B6B]"
                        : step.status === "pending" && !isOverview
                        ? "text-[#9B9B98]"
                        : "text-[#2D2D2D]"
                    }`}
                    style={{ fontWeight: isActive ? 700 : 500 }}
                  >
                    {isOverview ? step.label : `${step.number} ${step.label}`}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Toggle Button */}
        <div className="px-3 py-3 border-t border-[#E8E6E1]">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg hover:bg-white/60 transition-colors"
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronDown
              className={`w-4 h-4 text-[#6B7280] transition-transform ${
                sidebarCollapsed ? "rotate-90" : "-rotate-90"
              }`}
            />
            {isExpanded && (
              <span className="text-[11px] text-[#6B7280]" style={{ fontWeight: 600 }}>
                {sidebarCollapsed ? "Expand" : "Collapse"}
              </span>
            )}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area with Chat */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Chat Panel */}
        <AnimatePresence>
          {chatActive && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "60%", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="border-r border-[#E8E6E1] bg-white flex flex-col overflow-hidden"
            >
              <ChatPanel
                messages={messages}
                onSendMessage={handleSendMessage}
                onClose={() => setChatActive(false)}
                submission={submission}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submission Details */}
        <motion.main
          layout
          className="flex-1 overflow-auto"
          animate={{ opacity: chatActive ? 0.95 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <AccountOverview
            submission={submission}
            onOpenArtifacts={(id?: string) => {
              setPendingArtifactId(id ?? null);
              setArtifactsOpen(true);
            }}
            artifactsAvailable={
              Object.values(artifactStepStatus).filter((s) => s === "complete").length
            }
          />
        </motion.main>

        {/* Artifacts Panel */}
        <AnimatePresence>
          {artifactsOpen && submission && (
            <ArtifactsPanel
              accountName={submission.accountName}
              submissionId={submission.id}
              stepStatus={artifactStepStatus}
              onClose={() => {
                setArtifactsOpen(false);
                setPendingArtifactId(null);
              }}
              initialArtifactId={pendingArtifactId}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  onClose: () => void;
  submission: SubmissionMeta | null;
}

function ChatPanel({ messages, onSendMessage, onClose, submission }: ChatPanelProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput("");
    }
  };

  return (
    <>
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#E8E6E1] bg-[#FAFAF9] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#009AE4] to-[#007BB6] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm text-[#1A1A1A]" style={{ fontWeight: 600 }}>
              AI Assistant
            </h2>
            <p className="text-[11px] text-[#9B9B98]">
              Ask about {submission?.accountName || "this submission"}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-lg hover:bg-[#E8E6E1] flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-[#5D5D5D]" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto px-6 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="w-12 h-12 rounded-xl bg-[#F3F3F1] flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-[#009AE4]" />
              </div>
              <h3 className="text-sm text-[#2D2D2D] mb-2" style={{ fontWeight: 600 }}>
                How can I help with this submission?
              </h3>
              <p className="text-[12px] text-[#9B9B98] mb-4">
                Ask me about similar submissions, pricing, risk factors, or comparables.
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => onSendMessage("Show me similar submissions that were declined")}
                  className="w-full px-3 py-2 rounded-lg border border-[#E8E6E1] bg-white hover:bg-[#F3F3F1] text-[11px] text-[#2D2D2D] text-left transition-colors"
                >
                  Show me similar submissions that were declined
                </button>
                <button
                  onClick={() => onSendMessage("What are the key CAT exposures?")}
                  className="w-full px-3 py-2 rounded-lg border border-[#E8E6E1] bg-white hover:bg-[#F3F3F1] text-[11px] text-[#2D2D2D] text-left transition-colors"
                >
                  What are the key CAT exposures?
                </button>
                <button
                  onClick={() => onSendMessage("What should we price this at?")}
                  className="w-full px-3 py-2 rounded-lg border border-[#E8E6E1] bg-white hover:bg-[#F3F3F1] text-[11px] text-[#2D2D2D] text-left transition-colors"
                >
                  What should we price this at?
                </button>
              </div>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {message.role === "assistant" && (
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#009AE4] to-[#007BB6] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-xl px-4 py-3 ${
                message.role === "user"
                  ? "bg-[#0F3B6B] text-white"
                  : "bg-[#F3F3F1] text-[#2D2D2D]"
              }`}
            >
              <p
                className="text-[13px] leading-relaxed whitespace-pre-wrap"
                style={{ fontWeight: message.role === "user" ? 500 : 400 }}
              >
                {message.content}
              </p>
            </div>
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="px-6 py-4 border-t border-[#E8E6E1] bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about this submission..."
            className="flex-1 px-4 py-2.5 rounded-lg border border-[#E8E6E1] bg-[#F9F9F8] text-sm text-[#2D2D2D] placeholder-[#9B9B98] focus:outline-none focus:border-[#009AE4] focus:ring-1 focus:ring-[#009AE4] transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="px-4 py-2.5 rounded-lg bg-[#009AE4] text-white hover:bg-[#007BB6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </>
  );
}

function StepBadge({ step, isActive, isOverview }: { step: StepDef; isActive: boolean; isOverview: boolean }) {
  if (isOverview) {
    return (
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${
          isActive ? "border-[#0F3B6B] bg-white" : "border-[#C9C7C1] bg-transparent"
        }`}
      >
        <Circle className={`w-3 h-3 ${isActive ? "text-[#0F3B6B]" : "text-[#C9C7C1]"}`} />
      </div>
    );
  }
  if (step.status === "complete") {
    return (
      <div className="w-7 h-7 rounded-full bg-[#16A34A] flex items-center justify-center flex-shrink-0">
        <CheckCircle2 className="w-4 h-4 text-white" />
      </div>
    );
  }
  if (step.status === "current") {
    return (
      <div className="w-7 h-7 rounded-full bg-[#0F3B6B] flex items-center justify-center flex-shrink-0">
        <span className="text-[10px] text-white" style={{ fontWeight: 700 }}>
          {step.number}
        </span>
      </div>
    );
  }
  return (
    <div className="w-7 h-7 rounded-full border-2 border-[#D1CFC9] bg-transparent flex items-center justify-center flex-shrink-0">
      <span className="text-[10px] text-[#9B9B98]" style={{ fontWeight: 600 }}>
        {step.number}
      </span>
    </div>
  );
}

/* ─────────── Renewal context: marks fields as changed vs prior policy period ─────────── */

interface RenewalCtx {
  isRenewal: boolean;
  changed: Set<string>;
}
const RenewalContext = createContext<RenewalCtx>({ isRenewal: false, changed: new Set() });

const RENEWAL_CHANGED_FIELDS = new Set<string>([
  "Total Insured Value",
  "No. of Locations",
  "AOP Deductible Change",
  "Named Windstorm",
  "New Locations",
  "TIV Change YoY",
  "Target Price 2",
  "ATC Occupancy",
  "100yr AAL (All Perils)",
  "250yr PML",
]);

function RenewalLegend() {
  return (
    <div className="bg-purple-50 border border-purple-200 rounded-md px-3 py-2 mb-3 flex flex-wrap gap-x-5 gap-y-1.5 items-center">
      <span className="text-[11px] text-purple-800 uppercase tracking-wide" style={{ fontWeight: 700 }}>
        Renewal Diff
      </span>
      <span className="inline-flex items-center gap-1 text-[10px] text-[#4B5563]">
        <span className="inline-flex items-center px-1 py-0 rounded text-[9px] bg-amber-100 text-amber-800 border border-amber-300" style={{ fontWeight: 700 }}>Δ CHANGED</span>
        Differs from prior policy period — focus area
      </span>
      <span className="inline-flex items-center gap-1 text-[10px] text-[#4B5563]">
        <span className="inline-flex items-center px-1 py-0 rounded text-[9px] bg-gray-100 text-gray-600 border border-gray-300" style={{ fontWeight: 700 }}>= NO CHANGE</span>
        Carries forward unchanged
      </span>
    </div>
  );
}

function RenewalAIBanner({ accountName }: { accountName: string }) {
  return (
    <div
      className="mb-3 rounded-lg p-4 text-white"
      style={{ background: "linear-gradient(135deg, #6D28D9 0%, #2E6BD6 100%)" }}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 rounded-md bg-white/15 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <span className="text-[13px] text-white" style={{ fontWeight: 700 }}>
          AI UW Agent — Renewal Focus for {accountName}
        </span>
      </div>
      <ul className="text-[12px] text-white/95 leading-relaxed space-y-1 pl-2">
        <li>• <span style={{ fontWeight: 700 }}>Exposure delta:</span> Notable changes vs prior policy period — recalibrate CAT load and program structure where flagged below.</li>
        <li>• <span style={{ fontWeight: 700 }}>Claims in last policy period:</span> Review incurred loss activity since last renewal before reaffirming deductible structure.</li>
        <li>• <span style={{ fontWeight: 700 }}>Portfolio shift:</span> Check QBE-wide accumulation trends in this account's territory and occupancy class.</li>
        <li>• <span style={{ fontWeight: 700 }}>Carry-forward:</span> Manuscript wording, engineering certs, broker/contact unchanged unless flagged.</li>
      </ul>
    </div>
  );
}

/* ─────────── Account Overview (comprehensive, progressive) ─────────── */

function AccountOverview({
  submission,
  onOpenArtifacts,
  artifactsAvailable,
}: {
  submission: SubmissionMeta | null;
  onOpenArtifacts?: (artifactId?: string) => void;
  artifactsAvailable?: number;
}) {
  const isRenewal = submission?.type === "Renewal";
  return (
    <RenewalContext.Provider value={{ isRenewal, changed: RENEWAL_CHANGED_FIELDS }}>
    <div className="px-8 max-w-[1400px]">
      {/* Frozen pane — breadcrumb + legend + artifacts button stay pinned while content scrolls */}
      <div className="sticky top-0 z-30 -mx-8 px-8 pt-6 pb-3 bg-[#F9F9F8] border-b border-[#E8E6E1]">
        {/* Breadcrumb */}
        <div className="text-[11px] text-[#6B7280] mb-3">
          Customer <span className="mx-1.5">›</span>
          <span className="text-[#2D2D2D]" style={{ fontWeight: 600 }}>
            {submission?.accountName || "Account"} — Account Overview
          </span>
          {isRenewal && (
            <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 text-[10px]" style={{ fontWeight: 700 }}>
              RENEWAL
            </span>
          )}
        </div>

        {/* Legend row + Artifacts button */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <FieldLegend />
            {isRenewal && <RenewalLegend />}
          </div>
          {onOpenArtifacts && (
            <button
              onClick={(event) => {
                event.preventDefault();
                onOpenArtifacts();
              }}
              title="Artifacts — quotes, terms, binders, policy & supporting documents"
              className="group inline-flex items-center gap-1.5 pl-2 pr-2.5 py-1.5 rounded-md border border-[#E8E6E1] bg-white hover:bg-[#FAFAF9] hover:border-[#D4D2CC] text-[#2D2D2D] shadow-sm transition-colors flex-shrink-0"
            >
              <FileText className="w-3.5 h-3.5 text-[#2D2D2D]" />
              <span className="text-[11px]" style={{ fontWeight: 600 }}>
                Artifacts
              </span>
              {typeof artifactsAvailable === "number" && (
                <span className="ml-1 px-1.5 py-0.5 rounded bg-[#F2F1EE] text-[#6B7280] text-[10px]" style={{ fontWeight: 700 }}>
                  {artifactsAvailable}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {isRenewal && <div className="pt-4"><RenewalAIBanner accountName={submission?.accountName || ""} /></div>}
      <div className="pt-4" />

      {/* Section 1 — Account Identity (01 COMPLETE) */}
      <OverviewSection
        id="account-identity"
        tone="done"
        badge={<StepTag status="complete" label="01 Ingestion" />}
        title="Account Identity"
        actionLabel="Edit in Step 01 →"
        onOpenArtifacts={onOpenArtifacts}
        artifactId="submission-email"
      >
        <div className="grid grid-cols-5 gap-3 mb-3">
          <Field label="Named Insured" value={submission?.namedInsured || "—"} state="confirmed" />
          <Field label="Business Type" value={submission?.type || "—"} state="confirmed" />
          <Field label="Inception Date" value={submission?.inceptionDate || "—"} state="confirmed" />
          <Field label="Total Insured Value" value={submission?.tivFull || "—"} state="confirmed" />
          <Field label="No. of Locations" value={submission?.locations || "—"} state="confirmed" />
          <Field label="Broker" value={submission?.broker || "—"} state="confirmed" />
          <Field label="Brokerage House" value={submission?.brokerageHouse || "—"} state="confirmed" />
          <Field label="NAICS Code" value={submission?.naics || "—"} state="confirmed" />
          <Field label="Submission Date" value={submission?.submissionDate || "—"} state="confirmed" />
          <Field label="Clearance Status" value="Cleared" state="confirmed" />
        </div>
        <div className="rounded-md border border-[#D7EEFB] bg-[#F5FBFF] p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[10px] text-[#6B7280] uppercase tracking-wide" style={{ fontWeight: 600 }}>
              AI Operational Summary
            </span>
            <AIBadge />
          </div>
          <p className="text-[12px] text-[#4B5563] italic leading-relaxed">
            "{submission?.summary || ""}"
          </p>
        </div>
        <AIUWAgentCallout
          title="Account Ingestion"
          paras={[
            {
              lead: "Ingestion Complete",
              text:
                "All 14 submission documents parsed and classified (SOV, loss runs 5yr, engineering reports, manuscript wording). Named Insured verified against D&B; clearance cleared — no prior QBE submission in 12 months.",
            },
            {
              lead: "Key Finding",
              text:
                "Florida location (Building 8, Tampa) added post-2025 renewal — materially changes hurricane exposure profile vs. prior OH/IN-only footprint. TIV grew +14% YoY driven primarily by FL addition.",
            },
            {
              lead: "Recommendation",
              text:
                "Proceed to Triage. Flag FL exposure for CAT modelling priority and NWS deductible review in Step 02.",
            },
          ]}
        />
        <IngestionDetails
          accountName={submission?.accountName || "Account"}
          submissionId={submission?.id || ""}
        />
      </OverviewSection>

      {/* Section 2 — Program Structure (02 ACTIVE) */}
      <OverviewSection
        id="program-structure"
        tone="done"
        badge={<StepTag status="complete" label="02 Triage" />}
        title="Program Structure, ATC Occupancy & Target Pricing"
        actionLabel="Edit in Step 02 →"
        onOpenArtifacts={onOpenArtifacts}
        artifactId="triage-report"
      >
        <div className="grid grid-cols-2 gap-6">
          {/* Program Structure table */}
          <div>
            <SubsectionLabel>
              Program Structure <AITag />
            </SubsectionLabel>
            <ProgramTable
              rows={[
                { coverage: "Total Insured Value", limit: "$285,000,000", deductible: "—", aiLimit: true },
                { coverage: "Program", limit: "$25M xs $3M", deductible: "AOP: $250,000", aiLimit: true, aiDed: true },
                { coverage: "Flood", limit: "$10,000,000", deductible: "$500,000", aiLimit: true, aiDed: true },
                { coverage: "Earthquake", limit: "$5,000,000", deductible: "$500,000", aiLimit: true, aiDed: true },
                {
                  coverage: "Named Windstorm 🔴",
                  limit: "$15,000,000",
                  deductible: "$1,000,000",
                  aiLimit: true,
                  flagDed: "⚠ FLAG",
                  flagRow: true,
                },
                { coverage: "ABC", limit: "$2,000,000", deductible: "Wind/Hail: $250,000", aiLimit: true, aiDed: true },
                { coverage: "DEF", limit: "$1,000,000", deductible: "TBD", aiLimit: true },
                { coverage: "GHI", limit: "$1,000,000", deductible: "TBD", aiLimit: true },
              ]}
            />
          </div>
          {/* ATC Occupancy & Pricing */}
          <div>
            <SubsectionLabel>
              ATC Occupancy & Target Pricing <AITag />
            </SubsectionLabel>
            <div className="space-y-2">
              <Field label="ATC Occupancy" value="Light Manufacturing (LM-3)" state="ai" />
              <div className="grid grid-cols-3 gap-2">
                <Field label="Target Layer 1" value="$3M" state="ai" />
                <Field label="Target Layer 2" value="$10M" state="ai" />
                <Field label="Target Layer 3" value="$12M" state="ai" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Field label="Target Price 1" value="$85,000" state="ai" />
                <Field label="Target Price 2" value="$120,000" state="ai" />
                <Field label="Target Price 3" value="$95,000" state="ai" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Commission" value="15%" state="prel" />
                <Field label="Form Type" value="Manuscript" state="prel" />
              </div>
              <Field
                label="Form Wording Flags"
                value="NMA2914"
                state="prel"
                flag="amber"
                flagLabel="⚠ REVIEW"
              />
              <Field label="Risk Score" value="—" state="pending" note="Only displayed if a reliable score is available" />
            </div>
          </div>
        </div>
        <AIUWAgentCallout
          title="Triage & Program Structure"
          paras={[
            {
              lead: "Triage Complete",
              text:
                "ATC occupancy classified as Light Manufacturing (LM-3) based on NAICS 332710 and SOV narrative. Program structure parsed from broker submission: $25M xs $3M with three target layers.",
            },
            {
              lead: "Key Finding",
              text:
                "Named Windstorm deductible of $1M on $15M limit is light for new Florida exposure — benchmarked comparables carry $2M–$3M NWS deductibles. Manuscript wording NMA2914 on watchlist (repeat from 2025 with carve-out).",
            },
            {
              lead: "Recommendation",
              text:
                "Advance to UW Analysis. Request broker justification on NWS deductible; target $2M minimum. Price Layer 2 ($10M) with +15% hurricane load.",
            },
          ]}
        />
      </OverviewSection>

      {/* Section 3 — Risk Assessment (03 PENDING) */}
      <OverviewSection
        id="risk-assessment"
        tone="done"
        badge={<StepTag status="complete" label="03 UW Analysis" />}
        title="Risk Assessment, CAT Modelling & Comparable Accounts"
        actionLabel="Edit in Step 03 →"
        onOpenArtifacts={onOpenArtifacts}
        artifactId="risk-synopsis"
      >
        <div className="grid grid-cols-3 gap-4">
          {/* TIV by Zone */}
          <div>
            <SubsectionLabel>
              TIV by Critical CAT Zone / State <AITag />
            </SubsectionLabel>
            <ProgramTable
              rows={[
                { coverage: "Ohio", limit: "$142M", deductible: "Wind — Moderate", aiLimit: true },
                { coverage: "Indiana", limit: "$98M", deductible: "Wind — Low", aiLimit: true },
                {
                  coverage: "Florida 🔴",
                  limit: "$45M",
                  deductible: "Hurricane — HIGH",
                  aiLimit: true,
                  flagRow: true,
                },
              ]}
              headers={["State", "TIV", "CAT Zone"]}
            />
            <SubsectionLabel className="mt-3">
              Automated Flags <AITag />
            </SubsectionLabel>
            <div className="space-y-1.5">
              <FlagRow tone="green" label="Green" text="Submission info adequate for analysis" />
              <FlagRow tone="amber" label="Amber" text="FL TIV concentration $45M (16%) — hurricane zone" />
              <FlagRow tone="red" label="Red" text="NWS Ded $1M on $15M limit — low for hurricane" />
              <FlagRow tone="amber" label="Amber" text="NMA2914 manuscript — watchlist match" />
            </div>
          </div>
          {/* CAT Modelling */}
          <div>
            <SubsectionLabel>CAT Modelling Results</SubsectionLabel>
            <div className="space-y-2">
              <PendingTile label="100yr AAL (All Perils)" note="Pending modelling return" />
              <PendingTile label="250yr PML" note="Pending modelling return" />
              <Field label="Model Reference" value="—" state="pending" />
            </div>
          </div>
          {/* Risks Like This */}
          <div>
            <SubsectionLabel>
              Risks Like This <AITag />
            </SubsectionLabel>
            <SimCard account="Eastfield Manufacturing" note="Same occupancy (LM-3) · Similar TIV $192M · LR 0.21 · AOP $250K" />
            <SimCard account="Southfield Manufacturing" note="Same geography (OH/IN) · NWS ded $2M (higher than requested)" />
            <SubsectionLabel className="mt-3">
              Occupancy Breakdown <AITag />
            </SubsectionLabel>
            <ProgramTable
              headers={["Occupancy", "TIV", "%"]}
              rows={[
                { coverage: "Light Mfg", limit: "$228M", deductible: "80%", aiLimit: true },
                { coverage: "Storage", limit: "$42M", deductible: "15%", aiLimit: true },
                { coverage: "Office", limit: "$15M", deductible: "5%", aiLimit: true },
              ]}
            />
          </div>
        </div>
        <AIUWAgentCallout
          title="CAT Modelling"
          paras={[
            {
              lead: "CAT Modeling Complete",
              text:
                "AIR model v23.1 indicates PML (250yr) of $18.2M (6.4% of TIV). Hurricane exposure from FL location drives 62% of CAT load. Wind/hail (OH/IN) contributes 28%; earthquake minimal.",
            },
            {
              lead: "Key Finding",
              text:
                "Tampa location (Building 8) has single-location PML of $9.1M — 50% of total modelled PML concentrated in one asset. NWS deductible of $1M against this exposure is insufficient.",
            },
            {
              lead: "Recommendation",
              text:
                "Require $2M per-occurrence NWS deductible OR 3% of TIV location sublimit on Tampa. Proceed to UW Review with hurricane load priced into Layer 2.",
            },
          ]}
        />
      </OverviewSection>

      {/* Section 4 — Prior Submission / Engineering / Notes */}
      <OverviewSection
        id="prior-submission"
        tone="mixed"
        badge={
          <div className="flex gap-1">
            <StepTag status="complete" label="01" compact />
            <StepTag status="pending" label="03" compact />
          </div>
        }
        title="Prior Submission History · Engineering Documents · Notes"
        actionLabel="Prior: Step 01 →"
        onOpenArtifacts={onOpenArtifacts}
        artifactId="engineering-reports"
      >
        <div className="grid grid-cols-3 gap-4">
          {/* Prior Submission */}
          <div>
            <SubsectionLabel>
              Prior Submission — 2025 <ConfirmedTag />
            </SubsectionLabel>
            <Field label="Bound in 2025?" value="Yes — $12M xs $3M · LR 0.21" state="confirmed" />
            <div className="space-y-2 mt-2">
              <Field label="TIV Change YoY" value="+14%" state="confirmed" />
              <Field label="AOP Deductible Change" value="$250K → $100K requested" state="confirmed" flag="amber" />
              <Field label="Prior Quote" value="$10M xs $3M in 2026" state="confirmed" />
              <Field label="New Locations" value="Florida added (Hurricane zone)" state="confirmed" flag="red" />
              <Field label="Manuscript Requests" value="NMA2914 — repeat from 2025" state="confirmed" flag="amber" />
            </div>
          </div>
          {/* Engineering */}
          <div>
            <SubsectionLabel>
              Engineering Documents <ConfirmedTag text="Received" />
            </SubsectionLabel>
            <div className="space-y-1.5 mb-3">
              <EngDoc label="Survey Report 2025 — AI Analysis" active />
              <EngDoc label="Sprinkler Certification" />
              <EngDoc label="Risk Improvement Report" />
            </div>
            <SubsectionLabel>
              Engineering AI Analysis{" "}
              <span className="ml-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-[#D1CFC9] text-[9px] text-[#9B9B98]">
                ○ Step 03
              </span>
            </SubsectionLabel>
            <div className="space-y-2">
              <PendingTile
                label="PML / MFL"
                valueOverride="— / —"
                note="Populated in Engineering Review (Step 03)"
                align="left"
              />
              <Field label="AI Recommendations" value="—" state="pending" />
            </div>
          </div>
          {/* Notes */}
          <div>
            <SubsectionLabel>
              Notes{" "}
              <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded border border-[#CBDAEA] bg-[#EEF4FB] text-[9px] text-[#2E5D9E]" style={{ fontWeight: 600 }}>
                ⊙ UW Working
              </span>
            </SubsectionLabel>
            <div className="rounded-md border-[1.5px] border-[#CBDAEA] bg-[#F7FAFD] p-2.5">
              <textarea
                defaultValue={`2025: Agreed reduced AOP ded post engineering (improved sprinklers). FL location added mid-term. NMA2914 accepted with carve-out.

2026: Revisit NWS ded — FL exposure materially higher. Authority check likely needed on final limit vs target pricing.`}
                className="w-full bg-transparent text-[12px] text-[#2D2D2D] leading-relaxed resize-y min-h-[130px] outline-none border-none"
              />
            </div>
            <div className="text-[11px] text-[#6B7280] mt-2 px-0.5">
              📌 Persists across renewal years — institutional memory
            </div>
          </div>
        </div>
        <AIUWAgentCallout
          title="Engineering & Prior Submission Review"
          paras={[
            {
              lead: "Engineering Review Complete",
              text:
                "2025 Survey Report confirms full sprinkler coverage at all OH/IN locations (NFPA 13 compliant), ESFR in warehouse bays. Painting booth has dedicated suppression and interlocks — residual ignition risk acceptable.",
            },
            {
              lead: "Key Finding",
              text:
                "Tampa (FL) facility has no current engineering report on file — was added post-2025 inspection cycle. Prior 2025 bound policy had $12M xs $3M at LR 0.21; requested 2026 AOP reduction from $250K → $100K is not supported by loss history alone.",
            },
            {
              lead: "Recommendation",
              text:
                "Order FL engineering survey as bind subjectivity. Hold AOP deductible at $250K. Note in UW file for renewal continuity.",
            },
          ]}
        />
      </OverviewSection>

      {/* Section 5 — Indication & Quote (04 PENDING) */}
      <OverviewSection
        id="indication-quote"
        tone="done"
        badge={<StepTag status="complete" label="04 UW Review" />}
        title="Indication & Quote — HX Data"
        actionLabel="Edit in Step 04 →"
        onOpenArtifacts={onOpenArtifacts}
        artifactId="quote-letter"
      >
        <div className="grid grid-cols-3 gap-4">
          <div>
            <SubsectionLabel>Insured & Layer Details</SubsectionLabel>
            <div className="space-y-2">
              <Field label="HX Model Reference" value="—" state="pending" />
              <Field label="Indication Date" value="—" state="pending" />
              <Field label="Quote Date" value="—" state="pending" />
            </div>
          </div>
          <div>
            <SubsectionLabel>Layer Structure & Premium</SubsectionLabel>
            <ProgramTable
              headers={["Layer", "Limit", "Premium"]}
              rows={[
                { coverage: "Layer 1", limit: "—", deductible: "—", pending: true },
                { coverage: "Layer 2", limit: "—", deductible: "—", pending: true },
                { coverage: "Layer 3", limit: "—", deductible: "—", pending: true },
              ]}
            />
          </div>
          <div>
            <SubsectionLabel>Authority & Sanctions</SubsectionLabel>
            <div className="space-y-2">
              <Field label="Authority Check" value="—" state="pending" />
              <Field label="Sanctions Check" value="—" state="pending" />
              <Field label="Total Indication Premium" value="—" state="pending" />
              <Field label="Total Quote Premium" value="—" state="pending" />
            </div>
          </div>
        </div>
        <AIUWAgentCallout
          title="Indication & Quote"
          paras={[
            {
              lead: "UW Review Complete",
              text:
                "HX rating run 23-Apr-2026. Indicated total premium $312,400 across three layers ($85K / $132K / $95K). Rate online 1.10% — within target band for LM-3 occupancy with hurricane load.",
            },
            {
              lead: "Key Finding",
              text:
                "Quote is within delegated authority ($25M limit, no referral trigger). Sanctions and OFAC clear. NMA2914 manuscript accepted with 2025 carve-out language retained.",
            },
            {
              lead: "Recommendation",
              text:
                "Release quote to broker with subjectivities: (1) $2M NWS deductible, (2) FL engineering survey within 60 days of bind, (3) signed manuscript endorsement.",
            },
          ]}
        />
      </OverviewSection>

      {/* Section 6 — Decision & Bind (05 PENDING) */}
      <OverviewSection
        id="decision-bind"
        tone="active"
        badge={<StepTag status="current" label="05 Decision" />}
        title="Customer Decision & Bind"
        note="Awaiting broker response — quote released"
        actionLabel="Work in Step 05 →"
        onOpenArtifacts={onOpenArtifacts}
        artifactId="binder"
      >
        <div className="grid grid-cols-4 gap-3">
          <Field label="Decision" value="—" state="pending" note="Indication / Quote / Bind / Decline / NTU" />
          <Field label="Final Program Limit" value="—" state="pending" />
          <Field label="Final Gross Premium" value="—" state="pending" />
          <Field label="Net Premium (Broker)" value="—" state="pending" />
          <Field label="Bind Date" value="—" state="pending" />
          <Field label="Policy Number" value="—" state="pending" />
          <Field label="Broker Notification" value="—" state="pending" />
          <Field label="Policy Period" value="—" state="pending" />
        </div>
        <AIUWAgentCallout
          title="Customer Decision & Bind"
          paras={[
            {
              lead: "Awaiting Broker Response",
              text:
                "Quote released 23-Apr-2026 with three subjectivities. Broker (Sarah Mitchell, AON) acknowledged receipt; decision expected by 15-May-2026 ahead of 01-Jul inception.",
            },
            {
              lead: "Key Finding",
              text:
                "Benchmarking across similar LM-3 placements shows 68% bind rate at this premium band. Competitor market (inferred from broker commentary) likely quoting $290K–$320K. Our price is competitive without sacrificing structure.",
            },
            {
              lead: "Recommendation",
              text:
                "Monitor broker communications and diarise 7-day follow-up. On bind: issue policy with subjectivities in endorsement schedule; schedule FL survey via QBE Risk Engineering.",
            },
          ]}
        />
      </OverviewSection>
    </div>
    </RenewalContext.Provider>
  );
}

/* ─────────── Section / shared primitives ─────────── */

function OverviewSection({
  tone,
  badge,
  title,
  note,
  actionLabel,
  actionLocked,
  children,
  id,
  onOpenArtifacts,
  artifactId,
}: {
  tone: "done" | "active" | "pending" | "mixed";
  badge: React.ReactNode;
  title: string;
  note?: string;
  actionLabel?: string;
  actionLocked?: string;
  children: React.ReactNode;
  id?: string;
  onOpenArtifacts?: (artifactId?: string) => void;
  artifactId?: string;
}) {
  const borderColor =
    tone === "done"
      ? "border-l-[#16A34A]"
      : tone === "active"
      ? "border-l-[#0F3B6B]"
      : tone === "mixed"
      ? "border-l-[#16A34A]"
      : "border-l-[#D1CFC9]";

  const headerBg = tone === "active" ? "bg-[#EEF4FB]" : tone === "done" || tone === "mixed" ? "bg-[#F1F8F3]" : "bg-[#F5F4F1]";

  return (
    <div id={id} className={`bg-white border border-[#E8E6E1] border-l-[3px] ${borderColor} rounded-md mb-3 overflow-hidden`}>
      <div className={`${headerBg} px-4 py-2.5 border-b border-[#E8E6E1] flex items-center gap-3`}>
        {badge}
        <span className="text-[13px] text-[#2D2D2D]" style={{ fontWeight: 600 }}>
          {title}
        </span>
        {note && <span className="text-[11px] text-[#6B7280] italic">— {note}</span>}
        <div className="ml-auto flex items-center gap-1">
          {actionLabel && (
            <button className="text-[11px] text-[#0F3B6B] hover:underline px-2 py-1" style={{ fontWeight: 600 }}>
              {actionLabel}
            </button>
          )}
          {actionLocked && (
            <span className="text-[11px] text-[#9B9B98] px-2 py-1">{actionLocked}</span>
          )}
          {onOpenArtifacts && (
            <button
              type="button"
              onClick={() => onOpenArtifacts(artifactId)}
              className="inline-flex items-center gap-1 text-[11px] text-[#0F3B6B] hover:underline px-2 py-1"
              style={{ fontWeight: 600 }}
              aria-label="Open section artifacts"
            >
              <FileText className="w-3 h-3" />
              Artifacts →
            </button>
          )}
        </div>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function StepTag({ status, label, compact }: { status: StepStatus; label: string; compact?: boolean }) {
  const base = `inline-flex items-center gap-1 rounded ${compact ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-[11px]"}`;
  if (status === "complete")
    return (
      <span className={`${base} bg-[#16A34A] text-white`} style={{ fontWeight: 700 }}>
        ✓ {label}
      </span>
    );
  if (status === "current")
    return (
      <span className={`${base} bg-[#0F3B6B] text-white`} style={{ fontWeight: 700 }}>
        ● {label}
      </span>
    );
  return (
    <span className={`${base} border border-[#D1CFC9] text-[#9B9B98]`} style={{ fontWeight: 600 }}>
      ○ {label}
    </span>
  );
}

type FieldState = "confirmed" | "ai" | "prel" | "pending";

function Field({
  label,
  value,
  state,
  flag,
  flagLabel,
  note,
}: {
  label: string;
  value: string;
  state: FieldState;
  flag?: "red" | "amber";
  flagLabel?: string;
  note?: string;
}) {
  const styles: Record<FieldState, string> = {
    confirmed: "bg-white border-[#E8E6E1]",
    ai: "bg-[#F5FBFF] border-[#D7EEFB]",
    prel: "bg-[#F7FAFD] border-[#CBDAEA]",
    pending: "bg-[#F5F4F1] border-[#E8E6E1] text-[#9B9B98]",
  };
  const flagStyle =
    flag === "red"
      ? "border-l-[3px] border-l-[#DC2626] bg-[#FFF8F8]"
      : flag === "amber"
      ? "border-l-[3px] border-l-[#D97706] bg-[#FFFBEB]"
      : "";

  const renewal = useContext(RenewalContext);
  const isChanged = renewal.isRenewal && renewal.changed.has(label);
  const renewalRing = renewal.isRenewal && isChanged ? "ring-1 ring-amber-300" : "";

  return (
    <div className={`rounded-md border p-2 ${styles[state]} ${flagStyle} ${renewalRing}`}>
      <div className="text-[10px] text-[#6B7280] uppercase tracking-wide mb-0.5 flex items-center gap-1" style={{ fontWeight: 600 }}>
        <span>{label}</span>
        {renewal.isRenewal && (
          <span
            className={`ml-auto inline-flex items-center px-1 py-0 rounded text-[9px] border ${
              isChanged
                ? "bg-amber-100 text-amber-800 border-amber-300"
                : "bg-gray-100 text-gray-500 border-gray-300"
            }`}
            style={{ fontWeight: 700 }}
          >
            {isChanged ? "Δ CHANGED" : "= NO CHG"}
          </span>
        )}
      </div>
      <div className="text-[12px] text-[#2D2D2D] flex items-center gap-1.5 flex-wrap" style={{ fontWeight: 600 }}>
        <span>{value}</span>
        {state === "confirmed" && <ConfirmedTag />}
        {state === "ai" && <AIFieldTag />}
        {state === "prel" && <PrelTag />}
        {flag && flagLabel && <FlagTag tone={flag} label={flagLabel} />}
      </div>
      {note && <div className="text-[10px] text-[#9B9B98] italic mt-0.5">{note}</div>}
    </div>
  );
}

function SubsectionLabel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`text-[11px] text-[#4B5563] uppercase tracking-wide mb-1.5 flex items-center gap-1.5 ${className}`} style={{ fontWeight: 700 }}>
      {children}
    </div>
  );
}

function AITag() {
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded border border-[#D7EEFB] bg-[#F5FBFF] text-[9px] text-[#009AE4]" style={{ fontWeight: 700 }}>
      ◐ AI
    </span>
  );
}

function AIBadge() {
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-[#009AE4] text-[9px] text-white" style={{ fontWeight: 700 }}>
      AI
    </span>
  );
}

function AIFieldTag() {
  return (
    <span className="inline-flex items-center px-1 py-0 rounded text-[9px] text-[#009AE4] border border-[#D7EEFB]" style={{ fontWeight: 700 }}>
      ◐ AI
    </span>
  );
}

function PrelTag() {
  return (
    <span className="inline-flex items-center px-1 py-0 rounded text-[9px] text-[#2E5D9E] border border-[#CBDAEA]" style={{ fontWeight: 700 }}>
      ⊙ PREL
    </span>
  );
}

function ConfirmedTag({ text = "✓" }: { text?: string }) {
  return (
    <span className="inline-flex items-center px-1 py-0 rounded text-[9px] text-[#16A34A] border border-[#C6E9D0] bg-[#F1F8F3]" style={{ fontWeight: 700 }}>
      {text === "✓" ? "✓" : `✓ ${text}`}
    </span>
  );
}

function FlagTag({ tone, label }: { tone: "red" | "amber"; label: string }) {
  const cls =
    tone === "red"
      ? "bg-[#FEE2E2] text-[#991B1B] border-[#F5B5B5]"
      : "bg-[#FEF3C7] text-[#92400E] border-[#F5D98A]";
  return (
    <span className={`inline-flex items-center px-1 py-0 rounded text-[9px] border ${cls}`} style={{ fontWeight: 700 }}>
      {label}
    </span>
  );
}

function FieldLegend() {
  return (
    <div className="bg-white border border-[#E8E6E1] rounded-md px-3 py-2 mb-3 flex flex-wrap gap-x-5 gap-y-1.5 items-center">
      <span className="text-[11px] text-[#4B5563] uppercase tracking-wide" style={{ fontWeight: 700 }}>
        Field State
      </span>
      <LegendItem swatch="#FFFFFF" border="#E8E6E1" label="Confirmed — value finalised" />
      <LegendItem swatch="#F5FBFF" border="#D7EEFB" label="AI extracted — preliminary" tag={<AIFieldTag />} />
      <LegendItem swatch="#F7FAFD" border="#CBDAEA" label="UW working value" tag={<PrelTag />} />
      <LegendItem swatch="#F5F4F1" border="#E8E6E1" label="Not yet reached — pending" />
      <LegendItem swatch="#FFF8F8" border="#DC2626" leftBorder label="Risk flag on value" />
    </div>
  );
}

function LegendItem({
  swatch,
  border,
  label,
  tag,
  leftBorder,
}: {
  swatch: string;
  border: string;
  label: string;
  tag?: React.ReactNode;
  leftBorder?: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className="w-7 h-3.5 rounded"
        style={{
          background: swatch,
          border: `1.5px solid ${leftBorder ? "#F5B5B5" : border}`,
          borderLeft: leftBorder ? `3px solid ${border}` : undefined,
        }}
      />
      {tag}
      <span className="text-[10px] text-[#4B5563]">{label}</span>
    </div>
  );
}

interface ProgRow {
  coverage: string;
  limit: string;
  deductible: string;
  aiLimit?: boolean;
  aiDed?: boolean;
  flagDed?: string;
  flagRow?: boolean;
  pending?: boolean;
}

function ProgramTable({
  rows,
  headers = ["Coverage / Layer", "Limit", "Deductible"],
}: {
  rows: ProgRow[];
  headers?: string[];
}) {
  return (
    <table className="w-full text-[11px] border-collapse">
      <thead>
        <tr className="bg-[#F5F4F1]">
          {headers.map((h) => (
            <th key={h} className="text-left px-2 py-1.5 text-[10px] text-[#4B5563] uppercase tracking-wide border border-[#E8E6E1]" style={{ fontWeight: 700 }}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr
            key={`${r.coverage}-${i}`}
            className={`${r.flagRow ? "bg-[#FFF8F8]" : r.pending ? "bg-[#F5F4F1]" : "bg-white"} ${r.flagRow ? "border-l-[3px] border-l-[#DC2626]" : ""}`}
          >
            <td className="px-2 py-1.5 border border-[#E8E6E1] text-[#2D2D2D]" style={{ fontWeight: 500 }}>
              {r.coverage}
            </td>
            <td className="px-2 py-1.5 border border-[#E8E6E1] text-[#2D2D2D]">
              <span className="inline-flex items-center gap-1.5" style={{ fontWeight: 600 }}>
                <span className={r.pending ? "text-[#9B9B98]" : ""}>{r.limit}</span>
                {r.aiLimit && !r.pending && <AIFieldTag />}
              </span>
            </td>
            <td className="px-2 py-1.5 border border-[#E8E6E1] text-[#2D2D2D]">
              <span className="inline-flex items-center gap-1.5" style={{ fontWeight: 600 }}>
                <span className={r.pending ? "text-[#9B9B98]" : ""}>{r.deductible}</span>
                {r.aiDed && !r.pending && <AIFieldTag />}
                {r.flagDed && <FlagTag tone="red" label={r.flagDed} />}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function FlagRow({ tone, label, text }: { tone: "green" | "amber" | "red"; label: string; text: string }) {
  const bg = tone === "green" ? "bg-[#F1F8F3] border-[#C6E9D0]" : tone === "amber" ? "bg-[#FFFBEB] border-[#F5D98A]" : "bg-[#FFF8F8] border-[#F5B5B5]";
  const chip = tone === "green" ? "bg-[#16A34A]" : tone === "amber" ? "bg-[#D97706]" : "bg-[#DC2626]";
  return (
    <div className={`flex items-center gap-2 px-2 py-1.5 rounded border ${bg}`}>
      <span className={`${chip} text-white text-[9px] px-1.5 py-0.5 rounded`} style={{ fontWeight: 700 }}>
        {label}
      </span>
      <span className="text-[11px] text-[#2D2D2D]">{text}</span>
    </div>
  );
}

function PendingTile({
  label,
  note,
  valueOverride,
  align = "center",
}: {
  label: string;
  note: string;
  valueOverride?: string;
  align?: "center" | "left";
}) {
  return (
    <div
      className={`rounded-md border border-dashed border-[#D1CFC9] bg-[#F5F4F1] p-3 ${
        align === "center" ? "text-center" : "text-left"
      }`}
    >
      <div className="text-[10px] text-[#6B7280] uppercase tracking-wide mb-0.5" style={{ fontWeight: 700 }}>
        {label}
      </div>
      <div className="text-[16px] text-[#9B9B98]" style={{ fontWeight: 600 }}>
        {valueOverride || "—"}
      </div>
      <div className="text-[10px] text-[#9B9B98] italic mt-0.5">{note}</div>
    </div>
  );
}

function SimCard({ account, note }: { account: string; note: string }) {
  return (
    <div className="border border-[#E8E6E1] rounded-md p-2 mb-1.5 bg-white hover:bg-[#FAFAF9] cursor-pointer transition-colors">
      <div className="text-[12px] text-[#0F3B6B]" style={{ fontWeight: 700 }}>
        {account} →
      </div>
      <div className="text-[10px] text-[#6B7280] mt-0.5">{note}</div>
    </div>
  );
}

interface AgentPara {
  lead: string;
  text: string;
}

type Feedback = "up" | "down" | null;

function AIUWAgentCallout({ title, paras }: { title: string; paras: AgentPara[] }) {
  const [feedback, setFeedback] = useState<Feedback[]>(() => paras.map(() => null));
  const [collapsedAll, setCollapsedAll] = useState(false);

  const allAcknowledged = feedback.every((f) => f !== null);
  const isCollapsed = allAcknowledged && collapsedAll;

  const setAt = (i: number, value: Feedback) => {
    setFeedback((prev) => {
      const next = [...prev];
      next[i] = prev[i] === value ? null : value;
      const nowAll = next.every((f) => f !== null);
      if (nowAll && !collapsedAll) setCollapsedAll(true);
      return next;
    });
  };

  return (
    <div
      className="mt-4 rounded-lg p-4 text-white"
      style={{
        background:
          "linear-gradient(135deg, #2E6BD6 0%, #5B52E0 50%, #8B5CD6 100%)",
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 rounded-md bg-white/15 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <span className="text-[13px] text-white" style={{ fontWeight: 700 }}>
          AI UW Agent – {title}
        </span>
        {allAcknowledged && (
          <span className="ml-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/20 text-[10px] text-white" style={{ fontWeight: 600 }}>
            ✓ All acknowledged
          </span>
        )}
        {allAcknowledged && (
          <button
            onClick={() => setCollapsedAll((c) => !c)}
            className="ml-auto flex items-center gap-1 text-[11px] text-white/90 hover:text-white transition-colors"
            style={{ fontWeight: 600 }}
          >
            {isCollapsed ? "Expand" : "Collapse"}
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${isCollapsed ? "-rotate-90" : ""}`}
            />
          </button>
        )}
      </div>
      {!isCollapsed && (
        <div className="space-y-2">
          {paras.map((p, i) => {
            const fb = feedback[i];
            const ack = fb !== null;
            return (
              <div
                key={i}
                className={`rounded-md px-2.5 py-1.5 transition-colors ${
                  ack ? "bg-white/10" : "bg-transparent"
                }`}
              >
                <div className="flex items-start gap-2">
                  <p className="text-[12px] text-white/95 leading-relaxed flex-1">
                    <span style={{ fontWeight: 700 }}>{p.lead}:</span>{" "}
                    {!ack && p.text}
                    {ack && (
                      <span className="text-white/70 italic">
                        — {fb === "up" ? "acknowledged" : "flagged for review"}
                      </span>
                    )}
                  </p>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => setAt(i, "up")}
                      aria-label="Acknowledge"
                      className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
                        fb === "up"
                          ? "bg-white/30 text-white"
                          : "text-white/70 hover:bg-white/15 hover:text-white"
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setAt(i, "down")}
                      aria-label="Flag for review"
                      className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
                        fb === "down"
                          ? "bg-white/30 text-white"
                          : "text-white/70 hover:bg-white/15 hover:text-white"
                      }`}
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function EngDoc({ label, active }: { label: string; active?: boolean }) {
  return (
    <div
      className={`px-2 py-1.5 rounded border text-[11px] cursor-pointer transition-colors ${
        active
          ? "bg-[#EEF4FB] border-[#CBDAEA] text-[#0F3B6B]"
          : "bg-white border-[#E8E6E1] text-[#2D2D2D] hover:bg-[#FAFAF9]"
      }`}
      style={{ fontWeight: active ? 700 : 500 }}
    >
      📄 {label} →
    </div>
  );
}

