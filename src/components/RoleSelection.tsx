import { Users, UserCircle, Sparkles } from "lucide-react";
import qbeLogo from "../assets/qbeLogo.png";

interface RoleSelectionProps {
  onSelectRole: (role: "underwriter" | "manager") => void;
}

export function RoleSelection({ onSelectRole }: RoleSelectionProps) {
  return (
    <div className="min-h-screen bg-[#F9F9F8] flex items-center justify-center p-8">
      <div className="max-w-lg w-full">
        {/* Logo and Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-5">
            <img src={qbeLogo.src} alt="QBE" className="w-14 h-14" />
          </div>
          <h1 className="text-2xl text-[#1A1A1A] mb-2" style={{ fontWeight: 600 }}>
            QBE AI Underwriting Agent
          </h1>
          <p className="text-sm text-[#9B9B98]">
            Commercial Property · Excess & Surplus Lines
          </p>
        </div>

        {/* Role Cards */}
        <div className="space-y-3">
          <button
            onClick={() => onSelectRole("underwriter")}
            className="w-full group bg-white rounded-xl p-5 border border-[#E8E6E1] hover:border-[#009AE4] hover:shadow-md transition-all text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#F3F3F1] flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                <UserCircle className="w-5 h-5 text-[#5D5D5D] group-hover:text-[#009AE4] transition-colors" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-[#1A1A1A]" style={{ fontWeight: 600 }}>Underwriter</div>
                <p className="text-[11px] text-[#9B9B98] mt-0.5">
                  Risk assessment, pricing, and quote generation for your assigned queue
                </p>
              </div>
              <div className="text-[#B0B0AC] group-hover:text-[#009AE4] transition-colors text-xl">
                &rsaquo;
              </div>
            </div>
          </button>

          <button
            onClick={() => onSelectRole("manager")}
            className="w-full group bg-white rounded-xl p-5 border border-[#E8E6E1] hover:border-[#009AE4] hover:shadow-md transition-all text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#F3F3F1] flex items-center justify-center group-hover:bg-purple-50 transition-colors">
                <Users className="w-5 h-5 text-[#5D5D5D] group-hover:text-purple-600 transition-colors" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-[#1A1A1A]" style={{ fontWeight: 600 }}>Manager</div>
                <p className="text-[11px] text-[#9B9B98] mt-0.5">
                  Portfolio analytics, team oversight, and strategic insights
                </p>
              </div>
              <div className="text-[#B0B0AC] group-hover:text-[#009AE4] transition-colors text-xl">
                &rsaquo;
              </div>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#B0B0AC]">
            <Sparkles className="w-3 h-3" />
            <span>Powered by AI-driven underwriting intelligence</span>
          </div>
        </div>
      </div>
    </div>
  );
}
