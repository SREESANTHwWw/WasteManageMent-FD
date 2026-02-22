import React from "react";
import { motion } from "framer-motion";
import { MapPin, ChevronRight, Calendar } from "lucide-react";
import { Typography } from "../../../@All/Tags/Tags";

const RecentrepStaff = ({ title, subtitle, reports = [], onViewAll }) => {
  
  const formatTimeAgo = (dateString) => {
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " mins ago";
    return "Just now";
  };

  return (
    <section className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="p-8 border-b border-slate-50 flex justify-between items-center">
        <div className="flex flex-col"> {/* Added flex-col */}
          <Typography className="text-xl font-black text-slate-900 leading-tight">
            {title}
          </Typography>
          <Typography className="text-slate-400 text-xs mt-1">
            {subtitle}
          </Typography>
        </div>
        <button className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900 transition-colors">
          <Calendar size={20} />
        </button>
      </div>

      {/* List Items */}
      <div className="divide-y divide-slate-50">
        {reports.length > 0 ? (
          // .slice(0, 4) ensures only 4 data points are shown
          reports.slice(0, 4).map((report) => (
            <motion.div
              key={report._id}
              whileHover={{ backgroundColor: "#FBFDFF" }}
              className="p-6 flex flex-wrap items-center justify-between gap-4 transition-colors"
            >
              <div className="flex items-center gap-4 min-w-50">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden flex items-center justify-center text-slate-400 border border-slate-50">
                  {report.wasteImage?.[0] ? (
                    <img 
                      src={report.wasteImage[0]} 
                      alt="waste" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <MapPin size={20} />
                  )}
                </div>
                
                {/* Applied flex-col to Typography container */}
                <div className="flex flex-col">
                  <Typography className="font-bold text-slate-900 capitalize leading-none">
                    {report.wasteLocation?.replace('_', ' ') || "Unknown Location"}
                  </Typography>
                  <Typography className="text-[10px] font-black text-slate-300 uppercase tracking-tighter mt-1">
                    ID: {report._id.slice(-6)} • {report.wasteCategory} • {report.wasteQty}
                  </Typography>
                </div>
              </div>

              {/* Status Badge */}
              <div className="hidden md:flex flex-col gap-1"> {/* Changed to flex-col */}
                <Typography className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Status
                </Typography>
                <div
                  className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase inline-block w-fit ${
                    report.status === "RESOLVED" || report.status === "Verified"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-amber-50 text-amber-600"
                  }`}
                >
                  {report.status}
                </div>
              </div>

              <div className="text-right flex items-center gap-4">
                {/* Applied flex-col to Timestamp container */}
                <div className="flex flex-col items-end">
                  <Typography className="text-sm font-bold text-slate-900">
                    {formatTimeAgo(report.createdAt)}
                  </Typography>
                  <Typography className="text-[10px] text-slate-300 uppercase font-black">
                    By {report.userId?.fullName || "User"}
                  </Typography>
                </div>
                {/* <button className="w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all">
                  <ChevronRight size={18} />
                </button> */}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="p-10 text-center text-slate-400 text-sm italic">
            No reports found in this sector.
          </div>
        )}
      </div>

      <button 
        onClick={onViewAll}
        className="w-full py-6 bg-slate-50 text-slate-400 font-bold text-xs uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
      >
        View All Managed Reports <ArrowRight size={14} />
      </button>
    </section>
  );
};

const ArrowRight = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14m-7-7 7 7-7 7" />
  </svg>
);

export default RecentrepStaff;