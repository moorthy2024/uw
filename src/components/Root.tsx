"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  LayoutGrid,
  FileText,
  BookOpen,
  Users,
  UserCircle,
  Settings,
  Briefcase,
  Plus,
  Sparkles,
  PanelLeftClose,
  PanelLeft,
  Zap,
  ArrowUp,
  Paperclip,
  Globe,
  AtSign,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import qbeLogo from "../assets/qbeLogo.png";
import { RoleSelection } from "./RoleSelection";
import { Welcome } from "./Welcome";
import { RoleContext } from "./RoleContext";
import { Hub } from "./Hub";
import { SubmissionsPanel } from "./SubmissionsPanel";
import { SubmissionAnalysis } from "./SubmissionAnalysis";
import { Distribution } from "./Distribution";
import { Portfolio } from "./Portfolio";
import { Guidelines } from "./Guidelines";
import { TeamPanel } from "./TeamPanel";
import { AccountPanel } from "./AccountPanel";
import { useChatContext } from "@/features/context/chat-context";
import { useUserContext } from "@/features/context/user-context";
import { useWorkspaceContext } from "@/features/context/workspace-context";

type UserRole = "underwriter" | "manager";

const navigation: Array<{ name: string; path: string; icon: typeof LayoutGrid; roles: UserRole[] }> = [
  { name: "Hub", path: "/", icon: LayoutGrid, roles: ["underwriter", "manager"] },
  { name: "Customer", path: "/submissions", icon: FileText, roles: ["underwriter", "manager"] },
  { name: "Distribution", path: "/distribution", icon: Users, roles: ["manager"] },
  { name: "Portfolio", path: "/portfolio", icon: Briefcase, roles: ["manager"] },
  { name: "Guidelines", path: "/guidelines", icon: BookOpen, roles: ["underwriter", "manager"] },
  { name: "Team", path: "/team", icon: UserCircle, roles: ["underwriter", "manager"] },
  { name: "Account", path: "/account", icon: Settings, roles: ["underwriter", "manager"] },
];

const agentActivityFeed = [
  { agent: "Orchestration", action: "Routed SUB-0847 to deep analysis", time: "2m" },
  { agent: "Ingestion", action: "Extracted SOV & formatted CatNet payload - 98% confidence", time: "4m" },
  { agent: "Orchestration", action: "SUB-0847 passed triage rules engine", time: "6m" },
  { agent: "Intelligence & Reasoning", action: "Score 94 for SUB-0847", time: "8m" },
  { agent: "Document Summarization", action: "Drafted pricing & quote for SUB-0843", time: "22m" },
];

function formatRelativeTime(isoDate: string): string {
  const timestamp = Date.parse(isoDate);
  if (Number.isNaN(timestamp)) {
    return "Just now";
  }

  const diffSeconds = Math.max(0, Math.round((Date.now() - timestamp) / 1000));
  if (diffSeconds < 60) {
    return "Now";
  }

  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return diffDays === 1 ? "Yesterday" : `${diffDays}d ago`;
}

export function Root() {
  const { role, setRole, userName } = useUserContext();
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);
  const [hasSelectedRole, setHasSelectedRole] = useState(false);

  if (!hasSelectedRole) {
    return (
      <RoleSelection
        onSelectRole={(nextRole) => {
          setRole(nextRole);
          setHasSelectedRole(true);
        }}
      />
    );
  }

  if (!hasSeenWelcome) {
    return <Welcome role={role} onContinue={() => setHasSeenWelcome(true)} />;
  }

  return <MainWorkbench userRole={role} userName={userName} />;
}

function MainWorkbench({ userRole, userName }: { userRole: "underwriter" | "manager"; userName: string }) {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const { sidebarPinned, setSidebarPinned } = useWorkspaceContext();
  const [sidebarHover, setSidebarHover] = useState(false);
  const sidebarOpen = sidebarPinned || sidebarHover;
  const [inputValue, setInputValue] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [showAgentActivity, setShowAgentActivity] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [chatWidth, setChatWidth] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartX = useRef(0);
  const resizeStartWidth = useRef(50);

  const {
    recentThreads,
    activeThreadId,
    activeMessages,
    pendingAttachments,
    isThinking,
    createNewThread,
    openThread,
    attachFiles,
    removeAttachment,
    sendMessage,
  } = useChatContext();

  const isSubmissionDetail = pathname.startsWith("/submission/");
  const userInitials = userName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "UW";

  useEffect(() => {
    if (pathname === "/chat") {
      setChatOpen(true);
      if (!activeThreadId && recentThreads[0]?.id) {
        openThread(recentThreads[0].id);
        router.replace(`/chat/${recentThreads[0].id}`);
      }
      return;
    }

    if (pathname.startsWith("/chat/")) {
      const threadId = pathname.replace("/chat/", "").replace(/\/$/, "");
      if (threadId) {
        openThread(threadId);
        setChatOpen(true);
      }
      return;
    }

    setChatOpen(false);
  }, [pathname, activeThreadId, recentThreads, openThread, router]);

  const getPageLabel = () => {
    if (pathname.startsWith("/chat")) {
      return "Thread";
    }

    if (isSubmissionDetail) {
      return "Submission Analysis";
    }

    const nav = navigation.find((item) => item.path === pathname);
    return nav?.name || "QBE";
  };

  const handleCreateThread = () => {
    const threadId = createNewThread();
    router.push(`/chat/${threadId}`);
    setChatOpen(true);
  };

  const handleSend = async () => {
    if (!inputValue.trim()) {
      return;
    }

    const text = inputValue.trim();

    if (!activeThreadId) {
      const threadId = createNewThread();
      router.push(`/chat/${threadId}`);
    }

    setChatOpen(true);
    setInputValue("");
    await sendMessage(text);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSend();
    }
  };

  const handleResizeStart = (event: React.MouseEvent) => {
    event.preventDefault();
    setIsResizing(true);
    resizeStartX.current = event.clientX;
    resizeStartWidth.current = chatWidth;
  };

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!isResizing) {
        return;
      }

      const containerWidth = window.innerWidth;
      const deltaX = resizeStartX.current - event.clientX;
      const deltaPercent = (deltaX / containerWidth) * 100;
      const newWidth = Math.max(30, Math.min(70, resizeStartWidth.current + deltaPercent));
      setChatWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "ew-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing]);

  return (
    <div className="flex h-screen bg-[#F9F9F8] relative">
      {!sidebarPinned && (
        <div className="absolute top-0 left-0 w-3 h-full z-30" onMouseEnter={() => setSidebarHover(true)} />
      )}

      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onMouseEnter={() => setSidebarHover(true)}
            onMouseLeave={() => setSidebarHover(false)}
            className={`h-full flex flex-col bg-[#F2F1EE] border-r border-[#E8E6E1] overflow-hidden flex-shrink-0 ${
              !sidebarPinned ? "absolute top-0 left-0 z-40 shadow-xl" : ""
            }`}
          >
            <div className="px-4 pt-4 pb-2 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img src={qbeLogo.src} alt="QBE" className="w-7 h-7" />
                <span className="text-sm text-[#2D2D2D]" style={{ fontWeight: 600 }}>
                  QBE UW Agent
                </span>
              </div>
              <button
                onClick={() => setSidebarPinned(false)}
                className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[#E0DDD8] transition-colors text-[#8E8C88]"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </div>

            <div className="px-3 py-2">
              <button
                onClick={handleCreateThread}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#E0DDD8] transition-colors text-[#5D5D5D] text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>New thread</span>
              </button>
            </div>

            <div className="px-3 mb-1">
              <div className="text-[10px] uppercase tracking-wider text-[#9B9B98] px-3 py-1.5" style={{ fontWeight: 600 }}>
                Workbench
              </div>
              <nav className="space-y-0.5">
                {navigation
                  .filter((item) => item.roles.includes(userRole))
                  .map((item) => {
                    const isActive =
                      pathname === item.path ||
                      (item.path === "/submissions" && pathname.startsWith("/submission"));
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        href={item.path}
                        className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          isActive ? "bg-[#E0DDD8] text-[#1A1A1A]" : "text-[#5D5D5D] hover:bg-[#E8E6E1]"
                        }`}
                        style={{ fontWeight: isActive ? 500 : 400 }}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
              </nav>
            </div>

            <div className="px-3 mt-2 flex-1 overflow-auto">
              <div className="text-[10px] uppercase tracking-wider text-[#9B9B98] px-3 py-1.5" style={{ fontWeight: 600 }}>
                Recent
              </div>
              <div className="space-y-0.5">
                {recentThreads.map((thread) => (
                  <button
                    key={thread.id}
                    onClick={() => {
                      openThread(thread.id);
                      router.push(`/chat/${thread.id}`);
                      setChatOpen(true);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg hover:bg-[#E8E6E1] transition-colors group ${
                      thread.id === activeThreadId ? "bg-[#E8E6E1]" : ""
                    }`}
                  >
                    <div className="text-sm text-[#3D3D3D] truncate" style={{ fontWeight: 400 }}>
                      {thread.title}
                    </div>
                    <div className="text-[11px] text-[#9B9B98] mt-0.5">{formatRelativeTime(thread.updatedAt)}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="px-3 py-2 border-t border-[#E0DDD8]">
              <button
                onClick={() => setShowAgentActivity(!showAgentActivity)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#E0DDD8] transition-colors"
              >
                <div className="relative">
                  <Zap className="w-4 h-4 text-[#009AE4]" />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-[#F2F1EE]" />
                </div>
                <span className="text-sm text-[#5D5D5D]" style={{ fontWeight: 400 }}>
                  Agent Activity
                </span>
                <span
                  className="ml-auto text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full"
                  style={{ fontWeight: 600 }}
                >
                  12 live
                </span>
              </button>

              <AnimatePresence>
                {showAgentActivity && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-1 py-2 px-1 max-h-44 overflow-auto">
                      {agentActivityFeed.map((activity, index) => (
                        <div key={index} className="flex items-start gap-2 px-2 py-1.5 rounded-md bg-[#E8E6E1]/60">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                          <div className="min-w-0">
                            <div className="text-[11px] text-[#009AE4]" style={{ fontWeight: 600 }}>
                              {activity.agent}
                            </div>
                            <div className="text-[11px] text-[#5D5D5D] truncate">{activity.action}</div>
                          </div>
                          <span className="text-[10px] text-[#9B9B98] ml-auto flex-shrink-0">{activity.time}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="px-3 py-3 border-t border-[#E0DDD8]">
              <div className="flex items-center gap-2.5 px-3">
                <div
                  className="w-7 h-7 rounded-full bg-gradient-to-br from-[#009AE4] to-[#007BB6] flex items-center justify-center text-white text-[11px]"
                  style={{ fontWeight: 600 }}
                >
                  {userInitials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-[#2D2D2D] truncate" style={{ fontWeight: 500 }}>
                    {userName}
                  </div>
                  <div className="text-[11px] text-[#9B9B98] capitalize">{userRole}</div>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0 relative">
        <div className="h-12 flex items-center px-4 flex-shrink-0">
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarPinned(true)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#EEEDEB] transition-colors text-[#8E8C88] mr-2"
            >
              <PanelLeft className="w-4 h-4" />
            </button>
          )}
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#2D2D2D]" style={{ fontWeight: 500 }}>
              {getPageLabel()}
            </span>
            {userRole === "manager" && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-700" style={{ fontWeight: 600 }}>
                Manager
              </span>
            )}
          </div>
          <div className="ml-auto flex items-center gap-1">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 border border-green-200">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[11px] text-green-700" style={{ fontWeight: 500 }}>
                AI Agents Active
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <motion.div
            layout
            className="overflow-auto"
            animate={{ width: chatOpen ? `${100 - chatWidth}%` : "100%" }}
            transition={{ duration: isResizing ? 0 : 0.3, ease: "easeInOut" }}
          >
            <RoleContext.Provider value={userRole}>{renderPage(pathname)}</RoleContext.Provider>
          </motion.div>
          <AnimatePresence>
            {chatOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: `${chatWidth}%`, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: isResizing ? 0 : 0.3, ease: "easeInOut" }}
                className="border-l border-[#E8E6E1] bg-white flex flex-col overflow-hidden relative"
              >
                <div
                  onMouseDown={handleResizeStart}
                  className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-[#009AE4] transition-colors z-10 group"
                  style={{ backgroundColor: isResizing ? "#009AE4" : "transparent" }}
                >
                  <div className="absolute left-0 top-0 bottom-0 w-3 -translate-x-1" />
                </div>

                <div className="h-12 px-4 flex items-center border-b border-[#E8E6E1] flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#009AE4] to-[#5B52E0] flex items-center justify-center">
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-sm text-[#2D2D2D]" style={{ fontWeight: 600 }}>
                      AI UW Agent
                    </span>
                  </div>
                  <button
                    onClick={() => setChatOpen(false)}
                    className="ml-auto w-7 h-7 rounded-md hover:bg-[#F3F3F1] flex items-center justify-center text-[#8E8C88]"
                    aria-label="Close chat"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 overflow-auto px-5 py-4 space-y-3">
                  {activeMessages.map((message) => (
                    <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                          message.role === "user"
                            ? "bg-[#2D2D2D] text-white rounded-br-sm"
                            : "bg-[#F3F3F1] text-[#2D2D2D] rounded-bl-sm"
                        }`}
                      >
                        <div>{message.content}</div>
                        {!!message.attachments?.length && (
                          <div className={`mt-2 space-y-1 ${message.role === "user" ? "text-[#E0E0E0]" : "text-[#6D6D69]"}`}>
                            {message.attachments.map((attachment) => (
                              <div key={attachment.id} className="text-[11px] truncate">
                                Attachment: {attachment.name}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isThinking && (
                    <div className="flex justify-start">
                      <div className="bg-[#F3F3F1] rounded-2xl px-3.5 py-2.5 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#009AE4] animate-bounce" />
                        <div className="w-1.5 h-1.5 rounded-full bg-[#009AE4] animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-[#009AE4] animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex-shrink-0 px-4 pb-4 pt-2">
          <div className="max-w-3xl mx-auto">
            <AnimatePresence>
              {isThinking && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="mb-2 flex items-center gap-2 px-4"
                >
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#009AE4] animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#009AE4] animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#009AE4] animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <span className="text-sm text-[#9B9B98]">AI UW Agent is thinking...</span>
                </motion.div>
              )}
            </AnimatePresence>

            {!!pendingAttachments.length && (
              <div className="mb-2 px-2 py-2 rounded-xl border border-[#D9D9D6] bg-white">
                <div className="flex flex-wrap gap-1.5">
                  {pendingAttachments.map((attachment) => (
                    <div key={attachment.id} className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#F3F3F1] text-xs text-[#4D4D49]">
                      <span className="max-w-[220px] truncate">{attachment.name}</span>
                      <button
                        onClick={() => removeAttachment(attachment.id)}
                        className="text-[#8E8C88] hover:text-[#2D2D2D]"
                        aria-label={`Remove ${attachment.name}`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="relative bg-white rounded-2xl border border-[#D9D9D6] shadow-sm hover:border-[#C0BFBB] focus-within:border-[#009AE4] focus-within:shadow-md transition-all">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask the AI UW Agent anything..."
                rows={1}
                className="w-full resize-none px-4 pt-3.5 pb-2 bg-transparent text-sm text-[#2D2D2D] placeholder:text-[#B0B0AC] focus:outline-none"
                style={{ minHeight: "44px", maxHeight: "160px" }}
              />
              <div className="flex items-center justify-between px-3 pb-2.5">
                <div className="flex items-center gap-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    multiple
                    onChange={(event) => {
                      attachFiles(event.target.files);
                      event.currentTarget.value = "";
                    }}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F3F3F1] transition-colors text-[#B0B0AC]"
                    aria-label="Attach files"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F3F3F1] transition-colors text-[#B0B0AC]">
                    <Globe className="w-4 h-4" />
                  </button>
                  <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#F3F3F1] transition-colors text-[#B0B0AC]">
                    <AtSign className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={() => void handleSend()}
                  disabled={!inputValue.trim()}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${
                    inputValue.trim() ? "bg-[#2D2D2D] text-white hover:bg-[#1A1A1A]" : "bg-[#EEEDEB] text-[#B0B0AC]"
                  }`}
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="text-center mt-1.5">
              <span className="text-[10px] text-[#B0B0AC]">
                AI UW Agent may produce inaccurate information. Always verify critical underwriting decisions.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function renderPage(pathname: string) {
  if (pathname.startsWith("/submission/")) {
    const id = pathname.replace("/submission/", "").replace(/\/$/, "");
    return <SubmissionAnalysis submissionId={id || undefined} />;
  }

  if (pathname === "/submissions") {
    return <SubmissionsPanel />;
  }

  if (pathname === "/distribution") {
    return <Distribution />;
  }

  if (pathname === "/portfolio") {
    return <Portfolio />;
  }

  if (pathname === "/guidelines") {
    return <Guidelines />;
  }

  if (pathname === "/team") {
    return <TeamPanel />;
  }

  if (pathname === "/account") {
    return <AccountPanel />;
  }

  return <Hub />;
}
