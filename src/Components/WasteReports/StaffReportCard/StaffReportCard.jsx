import React from "react";
import { Typography } from "../../../@All/Tags/Tags";
import { motion } from "framer-motion";
import { Brain, MapPin, Calendar, ShieldCheck, AlertCircle, ArrowRight } from "lucide-react";

const statusMeta = (status) => {
  switch (status) {
    case "RESOLVED":
      return {
        label: "Resolved",
        chip: "bg-emerald-50 text-emerald-700 border-emerald-200",
        bar: "bg-emerald-500",
        icon: <ShieldCheck size={16} className="text-emerald-600" />,
      };
    case "IN_PROGRESS":
      return {
        label: "In Progress",
        chip: "bg-blue-50 text-blue-700 border-blue-200",
        bar: "bg-blue-500",
        icon: <AlertCircle size={16} className="text-blue-600" />,
      };
    default:
      return {
        label: "Pending",
        chip: "bg-amber-50 text-amber-700 border-amber-200",
        bar: "bg-amber-500",
        icon: <AlertCircle size={16} className="text-amber-600" />,
      };
  }
};

const fmtDate = (date) =>
  new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const StaffReportCard = ({ report, onUpdate,openView }) => {
  const meta = statusMeta(report.status);
  const isResolved = report.status === "RESOLVED";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      whileHover={{ y: -2 }}
      className="relative w-full rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all overflow-hidden"
    >
      {/* left status bar */}
      <div className={`absolute left-0 top-0 h-full w-1.5 ${meta.bar}`} />

      <div className="flex flex-col md:flex-row gap-4 p-4 md:p-5">
        {/* IMAGE */}
        <div className="relative w-full md:w-56 h-40 md:h-28 rounded-xl overflow-hidden shrink-0 border border-slate-100 bg-slate-50">
          <img
            src={report.wasteImage}
            alt="Waste"
            className="w-full h-full object-cover"
          />

          {/* AI chip */}
          {typeof report.aiConfidence === "number" && (
            <div className="absolute top-2 left-2 inline-flex items-center gap-1.5 bg-slate-900/80 text-white px-2.5 py-1 rounded-full backdrop-blur border border-white/15">
              <Brain size={14} className="text-emerald-400" />
              <Typography className="text-[10px] font-black">
                {(report.aiConfidence * 100).toFixed(0)}% MATCH
              </Typography>
            </div>
          )}
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          {/* top row */}
          <div className="flex flex-wrap items-center gap-2">
            {/* category */}
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-black tracking-widest text-slate-600">
              {(report.wasteCategory || "OTHERS").toUpperCase()}
            </span>

            {/* status chip */}
            <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-black ${meta.chip}`}>
              {meta.icon}
              {meta.label}
            </span>
          </div>

          {/* title/desc */}
          <Typography className="text-[15px] md:text-[16px] font-extrabold text-slate-900 leading-snug line-clamp-1">
            {report.description || "No description provided."}
          </Typography>

          {/* landmark when OTHERS */}
          {report?.wasteLocation === "OTHERS" && report?.landmark && (
            <Typography className="text-[12px] text-slate-500 font-semibold line-clamp-1">
              <span className="text-slate-400 font-bold">Landmark:</span>{" "}
              {report.landmark}
            </Typography>
          )}

          {/* meta row */}
          <div className="flex flex-wrap items-center gap-4 pt-1 text-[12px] text-slate-500 font-semibold">
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={14} className="text-slate-400" />
              <span className="truncate max-w-65">{report.wasteLocation}</span>
            </span>

            <span className="inline-flex items-center gap-1.5">
              <Calendar size={14} className="text-slate-400" />
              {fmtDate(report.createdAt)}
            </span>
          </div>
        </div>

        {/* RIGHT ACTIONS */}
      <div className="flex md:flex-col md:items-end gap-2 md:gap-3 justify-between md:justify-center shrink-0 w-full md:w-48">

  {/* View Button */}
  <button
    onClick={() => openView(report)}
    className="w-full inline-flex items-center justify-center gap-2 cursor-pointer rounded-xl border border-gray-400 bg-white text-black px-4 py-3 text-[11px]  uppercase tracking-widest hover:bg-gray-200 active:scale-[0.98] transition"
  >
    <Typography>View Details</Typography>   
    <ArrowRight size={16} />
  </button>

  {!isResolved ? (
    <button
      onClick={() => onUpdate(report)}
      className="w-full inline-flex items-center cursor-pointer justify-center gap-2 rounded-xl bg-(--main-web-color) px-4 py-3 text-[11px] font-black uppercase tracking-widest text-white hover:opacity-95 active:scale-[0.98] transition"
    >
      Initiate Cleanup
      <ArrowRight size={16} />
    </button>
  ) : (
    <div className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3">
      <ShieldCheck size={16} className="text-emerald-600" />
      <Typography className="text-[11px] font-black uppercase tracking-widest text-emerald-700">
        Resolved
      </Typography>
    </div>
  )}

  {/* User Name */}
  <Typography className="text-[10px] font-black text-slate-400 uppercase tracking-widest md:text-right">
    Name:- {report?.userId?.fullName}
  </Typography>

</div>
      </div>
    </motion.div>
  );
};

export default StaffReportCard;