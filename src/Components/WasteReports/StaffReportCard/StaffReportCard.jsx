import React, { useState } from "react";
import { Typography } from "../../../@All/Tags/Tags";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  ShieldCheck,
  Leaf,
  ClipboardCheck,
  User,
  Eye,
  Zap,
  Clock,
  MoreVertical,
  CheckCircle2,
  Navigation,
  Activity,
  XCircle,      // Added for Reject
  UserPlus,     // Added for Assign
  ThumbsUp,     // Added for Approve
} from "lucide-react";

const statusMeta = (status) => {
  switch (status) {
    case "RESOLVED":
      return {
        label: "Operational",
        chip: "bg-emerald-50 text-emerald-700 border-emerald-100",
        indicator: "bg-emerald-500",
        icon: <ShieldCheck size={14} className="text-emerald-600" />,
      };
    case "IN_PROGRESS":
      return {
        label: "In Remediation",
        chip: "bg-amber-50 text-amber-700 border-amber-100",
        indicator: "bg-amber-500",
        icon: (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          >
            <Activity size={14} />
          </motion.div>
        ),
      };
    case "REJECTED": // Added meta for Rejected status
      return {
        label: "Rejected",
        chip: "bg-gray-100 text-gray-600 border-gray-200",
        indicator: "bg-gray-400",
        icon: <XCircle size={14} />,
      };
    default:
      return {
        label: "Critical Alert",
        chip: "bg-rose-50 text-rose-700 border-rose-100",
        indicator: "bg-rose-500",
        icon: <Zap size={14} />,
      };
  }
};

const StaffReportCard = ({
  report,
  onUpdate,
  openView,
  handleTakeTaskOpen,
  onReject,   // New Prop
  onApprove,  // New Prop
  onAssign,   // New Prop
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const meta = statusMeta(report.status);
  const status = report.status;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative w-full rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur-md p-4 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-500"
    >
      {/* Status Bar Indicator */}
      <div
        className={`absolute top-4 left-0 w-1.5 h-12 rounded-r-full ${meta.indicator} shadow-[0_0_10px_rgba(0,0,0,0.1)]`}
      />

      <div className="flex flex-col lg:flex-row gap-5">
        {/* IMAGE SECTION */}
        <div className="relative w-full lg:w-56 h-40 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
          <img
            src={report.wasteImage[0]}
            alt="Campus Audit"
            className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/30">
            <Leaf size={12} className="text-emerald-300" />
            <span className="text-[10px] font-bold text-white tracking-wider uppercase">
              {report.wasteCategory || "Campus"}
            </span>
          </div>
        </div>

        {/* CONTENT SECTION */}
        <div className="flex-1 flex flex-col min-w-0 py-1">
          <div className="flex justify-between items-start">
            <div className="flex flex-wrap items-center gap-2">
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${meta.chip}`}>
                {meta.icon}
                <span className="text-[10px] font-extrabold uppercase tracking-tight">
                  {meta.label}
                </span>
              </div>
              <span className="text-[10px] font-mono font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                ID: {report._id.slice(-6).toUpperCase()}
              </span>
            </div>

            {/* ACTION MENU */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 hover:bg-emerald-50 rounded-lg transition-colors text-slate-400 hover:text-emerald-700"
              >
                <MoreVertical size={18} />
              </button>

              <AnimatePresence>
                {showMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -5 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -5 }}
                      className="absolute right-0 mt-2 w-52 bg-white border border-slate-100 rounded-2xl shadow-2xl z-20 overflow-hidden p-1.5"
                    >
                      <MenuButton
                        icon={<Eye size={16} />}
                        label="Detailed Analysis"
                        onClick={() => {
                          openView(report);
                          setShowMenu(false);
                        }}
                      />

                      {status === "PENDING" && (
                        <>
                          <MenuButton
                            icon={<ThumbsUp size={16} />}
                            label="Approve Report"
                            color="text-emerald-600"
                            onClick={() => {
                              onApprove?.(report);
                              setShowMenu(false);
                            }}
                          />
                          <MenuButton
                            icon={<UserPlus size={16} />}
                            label="Assign Staff"
                            color="text-indigo-600"
                            onClick={() => {
                              onAssign?.(report);
                              setShowMenu(false);
                            }}
                          />
                          <MenuButton
                            icon={<XCircle size={16} />}
                            label="Reject Report"
                            color="text-rose-600"
                            onClick={() => {
                              onReject?.(report);
                              setShowMenu(false);
                            }}
                          />
                          <div className="h-px bg-slate-100 my-1" />
                          <MenuButton
                            icon={<ClipboardCheck size={16} />}
                            label="Dispatch Response"
                            onClick={() => {
                              handleTakeTaskOpen(report);
                              setShowMenu(false);
                            }}
                          />
                        </>
                      )}

                      {status === "IN_PROGRESS" && (
                        <MenuButton
                          icon={<CheckCircle2 size={16} />}
                          label="Complete Audit"
                          color="text-sky-600"
                          onClick={() => {
                            onUpdate(report);
                            setShowMenu(false);
                          }}
                        />
                      )}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          <Typography className="text-lg font-bold text-slate-800 mt-2 tracking-tight line-clamp-1">
            {report.description || "Unspecified Environmental Event"}
          </Typography>

          {/* META GRID */}
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div className="flex items-center gap-2 group/loc">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 group-hover/loc:bg-emerald-600 group-hover/loc:text-white transition-colors">
                <MapPin size={12} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-slate-600 truncate uppercase tracking-tighter">
                  {report.wasteLocation === "OTHERS" ? "Custom Location" : report.wasteLocation}
                </span>
                {report.wasteLocation === "OTHERS" && report.landmark && (
                  <span className="text-[10px] font-medium text-emerald-600 truncate italic">
                    near {report.landmark}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-slate-50 text-slate-400">
                <Clock size={12} />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-slate-500 leading-none">
                  {new Date(report.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span className="text-[9px] text-slate-400 font-medium uppercase mt-0.5">
                  {new Date(report.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-50 flex items-center justify-center border border-emerald-200">
                  <User size={14} className="text-emerald-700" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-slate-700 leading-none">
                  {report?.userId?.fullName || "External Auditor"}
                </span>
                <span className="text-[9px] font-medium text-slate-400 mt-1 uppercase tracking-tighter">
                  Reporting Officer
                </span>
              </div>
            </div>

            <button
              onClick={() =>
                status === "PENDING" ? handleTakeTaskOpen(report) : openView(report)
              }
              className={`group/btn flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all
                ${
                  status === "RESOLVED"
                    ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    : "bg-emerald-900 text-white hover:bg-emerald-800 shadow-lg shadow-emerald-900/10"
                }`}
            >
              {status === "PENDING" ? "Initiate Response" : "View Report"}
              <Navigation
                size={12}
                className="group-hover/btn:translate-x-1 transition-transform"
              />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const MenuButton = ({ icon, label, onClick, color = "text-slate-600" }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2 text-[13px] font-bold ${color} hover:bg-slate-50 rounded-xl transition-all`}
  >
    {icon} {label}
  </button>
);

export default StaffReportCard;