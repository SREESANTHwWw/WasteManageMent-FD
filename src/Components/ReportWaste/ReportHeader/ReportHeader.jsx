import React from "react";
import { Typography } from "../../../@All/Tags/Tags";
import { Sparkles } from "lucide-react";

const ReportHeader = ({ user }) => {
  return (
    <header className="flex flex-col md:flex-row justify-center items-start px-10 md:items-center mb-10 gap-6">
      <div className="space-y-1">
        <div className="flex items-center  gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <Typography className="text-[10px] font-bold tracking-[0.3em] text-slate-400 uppercase">
            Environmental Protocol
          </Typography>
        </div>
        <Typography className="text-5xl font-black text-slate-900 tracking-tight">
          Submit{" "}
          <span className="text-emerald-500 underline decoration-slate-200 underline-offset-8">
            Report
          </span>
        </Typography>
      </div>

      {/* <div className="bg-white border-2 border-slate-900 p-4 rounded-2xl shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-xl">
            <Sparkles className="text-emerald-600" size={24} />
          </div>
          <div className="flex flex-col">
            <Typography className="text-[10px] font-black text-slate-400 uppercase">
              Current Balance
            </Typography>
            <Typography className="text-xl font-black text-slate-900">
              {user?.rewardPoint || 0} pts
            </Typography>
          </div>
        </div>
      </div> */}
    </header>
  );
};

export default ReportHeader;