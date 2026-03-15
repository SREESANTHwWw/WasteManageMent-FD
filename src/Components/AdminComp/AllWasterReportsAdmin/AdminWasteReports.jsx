import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Leaf, ChevronLeft, ChevronRight, Filter, Search, RefreshCw,
  Loader2, Eye, CheckCircle2, Ban, UserPlus, Trash2, X,
  ShieldCheck, Brush, MapPin, Clock, User, ImageOff,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../../Api/APi";

const STATUS_META = {
  PENDING:     { label: "Pending",     chip: "bg-rose-50 text-rose-700 border-rose-100",        dot: "bg-rose-500 animate-pulse",  bar: "bg-rose-400"    },
  IN_PROGRESS: { label: "In Progress", chip: "bg-amber-50 text-amber-700 border-amber-100",      dot: "bg-amber-500 animate-pulse", bar: "bg-amber-400"   },
  RESOLVED:    { label: "Resolved",    chip: "bg-emerald-50 text-emerald-700 border-emerald-100", dot: "bg-emerald-500",             bar: "bg-emerald-500" },
  REJECTED:    { label: "Rejected",    chip: "bg-slate-100 text-slate-500 border-slate-200",     dot: "bg-slate-400",               bar: "bg-slate-300"   },
};
const STATUS_FILTERS = ["ALL", "PENDING", "IN_PROGRESS", "RESOLVED", "REJECTED"];
const AVATAR_COLORS = [
  "bg-teal-100 text-teal-700 border-teal-200",
  "bg-blue-100 text-blue-700 border-blue-200",
  "bg-violet-100 text-violet-700 border-violet-200",
  "bg-emerald-100 text-emerald-700 border-emerald-200",
];
const ac = (n = "") => AVATAR_COLORS[(n?.charCodeAt(0) || 0) % AVATAR_COLORS.length];

const SkeletonCard = () => (
  <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden animate-pulse p-5 flex gap-5 shadow-sm">
    <div className="w-52 h-40 rounded-2xl bg-slate-100 shrink-0" />
    <div className="flex-1 space-y-3 py-1">
      <div className="flex gap-2"><div className="h-6 w-24 bg-slate-100 rounded-full" /><div className="h-6 w-16 bg-slate-100 rounded-lg" /></div>
      <div className="h-5 bg-slate-100 rounded-full w-3/4" />
      <div className="h-3 bg-slate-100 rounded-full w-1/2" />
      <div className="flex gap-2 mt-5"><div className="h-9 bg-slate-100 rounded-xl w-28" /><div className="h-9 bg-slate-100 rounded-xl w-24" /></div>
    </div>
  </div>
);

const DeleteModal = ({ report, onConfirm, onCancel, loading }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
    <motion.div initial={{ scale: 0.9, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
      className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl border border-slate-100">
      <div className="w-14 h-14 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <Trash2 size={24} className="text-red-500" />
      </div>
      <h3 className="text-lg font-black text-slate-800 text-center">Delete Report?</h3>
      <p className="text-sm text-slate-400 text-center mt-2">
        Report <span className="font-bold text-slate-600">#{report?._id?.slice(-6).toUpperCase()}</span> will be permanently removed.
      </p>
      <div className="flex gap-3 mt-7">
        <button onClick={onCancel} disabled={loading} className="flex-1 py-3 rounded-2xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 disabled:opacity-50 transition-all">Cancel</button>
        <button onClick={onConfirm} disabled={loading} className="flex-1 py-3 rounded-2xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
          {loading ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
          {loading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </motion.div>
  </motion.div>
);

const RejectModal = ({ report, onConfirm, onCancel, loading }) => {
  const [reason, setReason] = useState("");
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
      <motion.div initial={{ scale: 0.9, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl border border-slate-100">
        <div className="w-14 h-14 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Ban size={24} className="text-red-500" />
        </div>
        <h3 className="text-lg font-black text-slate-800 text-center">Reject Report?</h3>
        <p className="text-sm text-slate-400 text-center mt-1 line-clamp-2">"{report?.description?.slice(0, 60) || "This report"}"</p>
        <div className="mt-5 space-y-1.5">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reason (optional)</label>
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3}
            placeholder="Why is this report being rejected?"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-red-300 focus:ring-2 focus:ring-red-500/10 transition-all resize-none placeholder:text-slate-300" />
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onCancel} disabled={loading} className="flex-1 py-3 rounded-2xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 disabled:opacity-50 transition-all">Cancel</button>
          <button onClick={() => onConfirm(reason)} disabled={loading} className="flex-1 py-3 rounded-2xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Ban size={15} />}
            {loading ? "Rejecting..." : "Reject"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ViewDrawer = ({ report, onClose }) => {
  const meta = STATUS_META[report.status] || STATUS_META.PENDING;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/20 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white border-l border-slate-100 w-full max-w-sm h-full overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-slate-100 px-6 py-5 z-10 flex items-center justify-between">
          <div>
            <h3 className="font-black text-slate-800">Report Details</h3>
            <p className="text-[11px] text-slate-400 font-medium">#{report._id?.slice(-6).toUpperCase()}</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 transition-all">
            <X size={16} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {report.wasteImage?.[0] && (
            <div className="space-y-2">
              <div className="relative rounded-2xl overflow-hidden h-52">
                <img src={report.wasteImage[0]} alt="waste" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase backdrop-blur-sm bg-white/80 ${meta.chip}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} /> {meta.label}
                </div>
              </div>
              {report.wasteImage.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {report.wasteImage.slice(1).map((img, i) => (
                    <img key={i} src={img} alt={`w-${i}`} className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-100" />
                  ))}
                </div>
              )}
            </div>
          )}
          {[
            { label: "Description",      value: report.description },
            { label: "Category",         value: report.wasteCategory },
            { label: "Quantity",         value: report.wasteQty },
            { label: "Location",         value: report.wasteLocation === "OTHERS" ? `Custom — ${report.landmark || ""}` : report.wasteLocation },
            { label: "Reporter",         value: report.userId?.fullName || (report.guestName ? `${report.guestName} (Guest)` : null) },
            { label: "Reporter Type",    value: report.reporterType },
            { label: "Submitted",        value: new Date(report.createdAt).toLocaleString() },
            { label: "Assigned To",      value: report.assignedTo?.fullName },
            { label: "AI Confidence",    value: report.aiConfidence ? `${(report.aiConfidence * 100).toFixed(0)}%` : null },
            { label: "Rejection Reason", value: report.rejectionReason },
          ].filter(({ value }) => value).map(({ label, value }) => (
            <div key={label} className="bg-slate-50 rounded-2xl px-4 py-3 border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
              <p className="text-sm font-bold text-slate-700">{value}</p>
            </div>
          ))}
          {report.verificationImages?.length > 0 && (
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Proof Images</p>
              <div className="flex gap-2 flex-wrap">
                {report.verificationImages.map((img, i) => (
                  <img key={i} src={img} alt={`proof-${i}`} className="w-24 h-24 rounded-xl object-cover border border-slate-100" />
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// mode "approve" = approve + assign together | mode "assign" = reassign only
const ApproveAssignDrawer = ({ report, mode, onClose, onDone }) => {
  const [staffList, setStaffList]       = useState([]);
  const [cleaningList, setCleaningList] = useState([]);
  const [search, setSearch]             = useState("");
  const [loadingStaff, setLoadingStaff] = useState(true);
  const [processing, setProcessing]     = useState(null);
  const [tab, setTab]                   = useState("cleaning");
  const isApproveMode = mode === "approve";

  useEffect(() => {
    (async () => {
      try {
        setLoadingStaff(true);
        const [s, c] = await Promise.all([api.get("/staff/all"), api.get("/cleaning-staff/all")]);
        setStaffList(s.data?.staff || []);
        setCleaningList(c.data?.data || []);
      } catch { toast.error("Failed to load staff"); }
      finally { setLoadingStaff(false); }
    })();
  }, []);

  const active   = tab === "cleaning" ? cleaningList : staffList;
  const idKey    = tab === "cleaning" ? "staffId" : "staffID";
  const filtered = active.filter((s) => {
    const q = search.toLowerCase().trim();
    return !q || s.fullName?.toLowerCase().includes(q) || s[idKey]?.toLowerCase().includes(q);
  });

  const handleSelect = async (staff) => {
    try {
      setProcessing(staff._id);
      if (isApproveMode) {
        await api.patch(`/approve/report/${report._id}`);
        await api.patch(`/assign/report/${report._id}`, {
          assignedTo: staff._id,
          staffModel: tab === "cleaning" ? "CleaningStaff" : "Staff",
        });
        toast.success(`Approved & assigned to ${staff.fullName}`);
        onDone(report._id, "IN_PROGRESS", staff);
      } else {
        await api.patch(`/assign/report/${report._id}`, {
          assignedTo: staff._id,
          staffModel: tab === "cleaning" ? "CleaningStaff" : "Staff",
        });
        toast.success(`Reassigned to ${staff.fullName}`);
        onDone(report._id, report.status, staff);
      }
      onClose();
    } catch (err) { toast.error(err?.response?.data?.msg || "Operation failed"); }
    finally { setProcessing(null); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/20 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white border-l border-slate-100 w-full max-w-sm h-full flex flex-col shadow-2xl">
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-slate-100 px-6 py-5 z-10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center ${isApproveMode ? "bg-emerald-50 border-emerald-100" : "bg-teal-50 border-teal-100"}`}>
                {isApproveMode ? <CheckCircle2 size={16} className="text-emerald-600" /> : <UserPlus size={16} className="text-teal-600" />}
              </div>
              <div>
                <h3 className="font-black text-slate-800">{isApproveMode ? "Approve & Assign" : "Reassign Staff"}</h3>
                <p className="text-[11px] text-slate-400 font-medium">
                  {isApproveMode ? "Pick staff to handle this report" : `Currently: ${report.assignedTo?.fullName || "Unassigned"}`}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="w-9 h-9 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 transition-all">
              <X size={16} />
            </button>
          </div>

          {/* Report mini preview */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 flex items-center gap-3">
            {report.wasteImage?.[0] && (
              <img src={report.wasteImage[0]} alt="" className="w-10 h-10 rounded-xl object-cover shrink-0" />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-black text-slate-700 truncate">{report.description || "No description"}</p>
              <p className="text-[10px] text-slate-400 font-medium truncate">
                {report.wasteLocation === "OTHERS" ? report.landmark || "Custom" : report.wasteLocation} · {report.wasteCategory}
              </p>
            </div>
            {isApproveMode && (
              <div className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-100">
                <CheckCircle2 size={10} className="text-emerald-600" />
                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-wider">Approving</span>
              </div>
            )}
          </div>

          {/* Tab */}
          <div className="flex bg-slate-100 rounded-2xl p-1 gap-1">
            {[{ key: "cleaning", label: "Cleaning", icon: Brush }, { key: "staff", label: "Campus Staff", icon: ShieldCheck }]
              .map(({ key, label, icon: Icon }) => (
                <button key={key} onClick={() => setTab(key)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${tab === key ? "bg-white text-slate-800 shadow-sm" : "text-slate-400"}`}>
                  <Icon size={12} /> {label}
                </button>
              ))}
          </div>

          <div className="relative">
            <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or ID..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/10 transition-all placeholder:text-slate-300" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
          {loadingStaff ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-2xl animate-pulse">
                <div className="w-10 h-10 rounded-xl bg-slate-200 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-slate-200 rounded-full w-2/3" />
                  <div className="h-3 bg-slate-200 rounded-full w-1/2" />
                </div>
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center py-12 gap-3">
              <Search size={22} className="text-slate-300" />
              <p className="text-slate-400 font-bold text-sm">No staff found</p>
            </div>
          ) : (
            filtered.map((staff, i) => (
              <motion.div key={staff._id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3 p-3.5 bg-slate-50 border border-slate-100 rounded-2xl hover:border-emerald-200 hover:bg-emerald-50/20 transition-all">
                <div className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center text-sm font-black uppercase shrink-0 ${ac(staff.fullName)}`}>
                  {staff.fullName?.[0] || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-700 truncate">{staff.fullName}</p>
                  <p className="text-[11px] text-slate-400">{staff[idKey] || "—"}</p>
                  {staff.phone && <p className="text-[10px] text-slate-300">{staff.phone}</p>}
                </div>
                <button onClick={() => handleSelect(staff)} disabled={processing === staff._id}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all disabled:opacity-60 shrink-0 ${isApproveMode ? "bg-emerald-600 text-white hover:bg-emerald-500" : "bg-teal-600 text-white hover:bg-teal-500"}`}>
                  {processing === staff._id ? <Loader2 size={11} className="animate-spin" /> : isApproveMode ? <CheckCircle2 size={11} /> : <UserPlus size={11} />}
                  {isApproveMode ? "Approve" : "Assign"}
                </button>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

const ReportCard = ({ report, index, onApprove, onReject, onAssign, onView, onDelete, approving }) => {
  const meta   = STATUS_META[report.status] || STATUS_META.PENDING;
  const canAct = report.status !== "RESOLVED" && report.status !== "REJECTED";
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: index * 0.04 }}
      className="group relative bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
    >
      <div className={`absolute top-0 left-0 w-1 h-full ${meta.bar}`} />
      <div className="flex flex-col md:flex-row">
        <div className="relative md:w-52 h-44 md:h-auto shrink-0 overflow-hidden bg-slate-100">
          {report.wasteImage?.[0] ? (
            <img src={report.wasteImage[0]} alt="waste" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale-[15%] group-hover:grayscale-0" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <ImageOff size={26} className="text-slate-300" />
              <span className="text-[10px] font-bold text-slate-300 uppercase">No Image</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3">
            <span className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full border border-white/10">
              <Leaf size={9} /> {report.wasteCategory || "—"}
            </span>
          </div>
          {report.wasteImage?.length > 1 && (
            <span className="absolute top-3 right-3 bg-black/40 text-white text-[9px] font-black px-2 py-0.5 rounded-full backdrop-blur-sm">+{report.wasteImage.length - 1}</span>
          )}
        </div>

        <div className="flex-1 p-5 pl-7 flex flex-col min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-wider ${meta.chip}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} /> {meta.label}
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg">
                #{report._id?.slice(-6).toUpperCase()}
              </span>
              {report.reporterType === "GUEST" && (
                <span className="text-[10px] font-black text-amber-600 bg-amber-50 border border-amber-100 px-2 py-1 rounded-lg uppercase">Guest</span>
              )}
            </div>
            <button onClick={() => onView(report)} className="p-2 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all border border-transparent hover:border-slate-200 shrink-0">
              <Eye size={15} />
            </button>
          </div>

          <p className="text-base font-black text-slate-800 mt-2.5 line-clamp-1 tracking-tight">
            {report.description || "No description provided"}
          </p>

          <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-2">
            <div className="flex items-center gap-1.5">
              <MapPin size={11} className="text-emerald-500 shrink-0" />
              <span className="text-[11px] font-semibold text-slate-500 truncate max-w-[140px]">
                {report.wasteLocation === "OTHERS" ? report.landmark || "Custom" : report.wasteLocation}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={11} className="text-slate-400 shrink-0" />
              <span className="text-[11px] font-semibold text-slate-400">
                {new Date(report.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
              </span>
            </div>
            {report.wasteQty && <span className="text-[11px] font-semibold text-slate-400">Qty: {report.wasteQty}</span>}
          </div>

          <div className="flex items-center gap-4 mt-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-50 border border-emerald-200 flex items-center justify-center shrink-0">
                <User size={12} className="text-emerald-600" />
              </div>
              <span className="text-[11px] font-bold text-slate-600 truncate max-w-[120px]">
                {report.userId?.fullName || report.guestName || "Anonymous"}
              </span>
            </div>
            {report.assignedTo && (
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={11} className="text-teal-500 shrink-0" />
                <span className="text-[11px] font-bold text-teal-600 truncate max-w-[100px]">{report.assignedTo?.fullName}</span>
              </div>
            )}
          </div>

          {report.status === "REJECTED" && report.rejectionReason && (
            <div className="mt-2.5 flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
              <Ban size={11} className="text-red-400 mt-0.5 shrink-0" />
              <p className="text-[11px] text-red-600 font-medium line-clamp-1">{report.rejectionReason}</p>
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-slate-50 flex items-center gap-2 flex-wrap">
            {/* PENDING → opens approve+assign drawer */}
            {report.status === "PENDING" && (
              <button onClick={() => onApprove(report, "approve")}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-[11px] font-black uppercase tracking-wider hover:bg-emerald-500 transition-all shadow-sm shadow-emerald-200">
                <CheckCircle2 size={12} /> Approve & Assign
              </button>
            )}

            {/* IN_PROGRESS → mark resolved directly */}
            {report.status === "IN_PROGRESS" && (
              <button onClick={() => onApprove(report, "resolve")} disabled={approving === report._id}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-[11px] font-black uppercase tracking-wider hover:bg-emerald-500 transition-all disabled:opacity-60 shadow-sm shadow-emerald-200">
                {approving === report._id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                Mark Resolved
              </button>
            )}

            {/* Reassign — only if already assigned and still active */}
            {canAct && report.assignedTo && (
              <button onClick={() => onAssign(report)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-50 text-teal-700 border border-teal-100 text-[11px] font-black uppercase tracking-wider hover:bg-teal-100 transition-all">
                <UserPlus size={12} /> Reassign
              </button>
            )}

            {canAct && (
              <button onClick={() => onReject(report)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 text-red-600 border border-red-100 text-[11px] font-black uppercase tracking-wider hover:bg-red-100 transition-all">
                <Ban size={12} /> Reject
              </button>
            )}

            {report.status === "RESOLVED" && (
              <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 text-[11px] font-black">
                <CheckCircle2 size={12} /> Resolved
              </div>
            )}
            {report.status === "REJECTED" && (
              <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 text-slate-500 border border-slate-200 text-[11px] font-black">
                <Ban size={12} /> Rejected
              </div>
            )}

            <button onClick={() => onDelete(report)} className="ml-auto p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 border border-slate-100 hover:border-red-100 transition-all">
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const AdminWasteReports = () => {
  const [reports, setReports]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [startDate, setStartDate]       = useState("");
  const [endDate, setEndDate]           = useState("");
  const [page, setPage]                 = useState(1);
  const [totalPages, setTotalPages]     = useState(1);
  const [total, setTotal]               = useState(0);
  const [statusSummary, setStatusSummary] = useState({ PENDING: 0, IN_PROGRESS: 0, RESOLVED: 0, REJECTED: 0 });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [approving, setApproving]       = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejecting, setRejecting]       = useState(false);
  const [approveAssignTarget, setApproveAssignTarget] = useState(null); // { report, mode }
  const [viewTarget, setViewTarget]     = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]         = useState(false);

  const LIMIT = 8;

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      let q = `/getAll/reports?page=${page}&limit=${LIMIT}`;
      if (statusFilter !== "ALL") q += `&status=${statusFilter}`;
      if (startDate) q += `&start=${startDate}`;
      if (endDate)   q += `&end=${endDate}`;
      const res = await api.get(q);
      setReports(res.data?.reports || []);
      setTotalPages(res.data?.totalPages || 1);
      setTotal(res.data?.total || 0);
      setStatusSummary(res.data?.statusSummary || { PENDING: 0, IN_PROGRESS: 0, RESOLVED: 0, REJECTED: 0 });
    } catch { toast.error("Failed to load reports"); }
    finally { setLoading(false); }
  }, [page, statusFilter, startDate, endDate]);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  const handleApprove = async (report, mode) => {
    if (mode === "approve") {
      setApproveAssignTarget({ report, mode: "approve" });
      return;
    }
    try {
      setApproving(report._id);
      const res = await api.patch(`/approve/report/${report._id}`);
      toast.success(res.data.msg);
      setReports((prev) => prev.map((r) => r._id === report._id ? { ...r, status: res.data.report.status } : r));
    } catch (err) { toast.error(err?.response?.data?.msg || "Failed to resolve"); }
    finally { setApproving(null); }
  };

  const handleReject = async (reason) => {
    try {
      setRejecting(true);
      await api.patch(`/reject/report/${rejectTarget._id}`, { rejectionReason: reason });
      toast.success("Report rejected");
      setReports((prev) => prev.map((r) => r._id === rejectTarget._id ? { ...r, status: "REJECTED", rejectionReason: reason } : r));
      setRejectTarget(null);
    } catch (err) { toast.error(err?.response?.data?.msg || "Rejection failed"); }
    finally { setRejecting(false); }
  };

  const handleApproveAssignDone = (reportId, newStatus, staff) => {
    setReports((prev) => prev.map((r) => r._id === reportId ? { ...r, status: newStatus, assignedTo: staff } : r));
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await api.delete(`/delete/report/${deleteTarget._id}`);
      toast.success("Report deleted");
      setReports((prev) => prev.filter((r) => r._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) { toast.error(err?.response?.data?.msg || "Delete failed"); }
    finally { setDeleting(false); }
  };

  const filtered = search.trim()
    ? reports.filter((r) =>
        r.description?.toLowerCase().includes(search.toLowerCase()) ||
        r.wasteLocation?.toLowerCase().includes(search.toLowerCase()) ||
        r.wasteCategory?.toLowerCase().includes(search.toLowerCase()) ||
        r.userId?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        r.guestName?.toLowerCase().includes(search.toLowerCase())
      )
    : reports;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      <AnimatePresence>
        {rejectTarget   && <RejectModal report={rejectTarget} onConfirm={handleReject} onCancel={() => setRejectTarget(null)} loading={rejecting} />}
        {deleteTarget   && <DeleteModal report={deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />}
        {viewTarget     && <ViewDrawer report={viewTarget} onClose={() => setViewTarget(null)} />}
        {approveAssignTarget && (
          <ApproveAssignDrawer
            report={approveAssignTarget.report}
            mode={approveAssignTarget.mode}
            onClose={() => setApproveAssignTarget(null)}
            onDone={handleApproveAssignDone}
          />
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6 pt-10 pb-6 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full">
                <ShieldCheck size={13} className="text-emerald-600" />
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">Admin Console</span>
              </div>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Waste Reports</h1>
            <p className="text-slate-400 text-sm font-medium mt-1">Approve + assign staff, reject, and manage all campus waste reports</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setIsFilterOpen((p) => !p)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-[11px] font-black text-slate-500 uppercase tracking-wider hover:bg-slate-50 transition-all shadow-sm">
              <Filter size={13} /> Filters
              {(startDate || endDate) && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
            </button>
            <button onClick={fetchReports} disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-[11px] font-black text-slate-500 uppercase tracking-wider hover:bg-slate-50 transition-all shadow-sm disabled:opacity-60">
              {loading ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />} Refresh
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total",       value: total,                     color: "text-slate-800",   bg: "bg-white border-slate-200"        },
            { label: "Pending",     value: statusSummary.PENDING,     color: "text-rose-600",    bg: "bg-rose-50 border-rose-100"       },
            { label: "In Progress", value: statusSummary.IN_PROGRESS, color: "text-amber-600",   bg: "bg-amber-50 border-amber-100"     },
            { label: "Resolved",    value: statusSummary.RESOLVED,    color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
          ].map((s) => (
            <div key={s.label} className={`rounded-[1.5rem] border p-5 shadow-sm space-y-1 ${s.bg}`}>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
              <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search description, location, reporter..."
              className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-5 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/10 transition-all shadow-sm placeholder:text-slate-300" />
          </div>
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-2xl px-2 py-2 shadow-sm overflow-x-auto">
            {STATUS_FILTERS.map((s) => (
              <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${statusFilter === s ? "bg-emerald-600 text-white shadow-sm" : "text-slate-400 hover:bg-slate-100"}`}>
                {s === "ALL" ? "All" : s === "IN_PROGRESS" ? "In Progress" : s.charAt(0) + s.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence>
        {isFilterOpen && (
  <motion.div 
    initial={{ opacity: 0, y: -12 }} 
    animate={{ opacity: 1, y: 0 }} 
    exit={{ opacity: 0, y: -12 }}
    className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-3xl p-6 shadow-xl shadow-slate-200/40 flex flex-wrap md:flex-row justify-between items-end gap-6"
  >
    <div className="flex flex-wrap gap-6 items-end">
      {[{ label: "Start Date", val: startDate, set: setStartDate }, { label: "End Date", val: endDate, set: setEndDate }].map(({ label, val, set }) => (
        <div key={label} className="space-y-2 flex flex-col min-w-[160px]">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
            {label}
          </label>
          <input 
            type="date" 
            value={val} 
            onChange={(e) => { set(e.target.value); setPage(1); }}
            className="bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all cursor-pointer hover:border-slate-300 shadow-sm" 
          />
        </div>
      ))}
    </div>

    <motion.button 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => { setStartDate(""); setEndDate(""); setPage(1); setIsFilterOpen(false); }}
      className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
    >
      <X size={14} strokeWidth={3} /> 
      Clear Filter
    </motion.button>
  </motion.div>
)}
        </AnimatePresence>

        {!loading && (
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
            {search ? `${filtered.length} result${filtered.length !== 1 ? "s" : ""} for "${search}"` : `${total} report${total !== 1 ? "s" : ""}`}
          </p>
        )}

        {loading ? (
          <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center">
              <Leaf size={26} className="text-slate-300" />
            </div>
            <p className="text-slate-400 font-black text-base">No reports found</p>
            {(search || statusFilter !== "ALL") && (
              <button onClick={() => { setSearch(""); setStatusFilter("ALL"); }}
                className="px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((report, i) => (
                <ReportCard key={report._id} report={report} index={i}
                  onApprove={handleApprove}
                  onReject={setRejectTarget}
                  onAssign={(r) => setApproveAssignTarget({ report: r, mode: "assign" })}
                  onView={setViewTarget}
                  onDelete={setDeleteTarget}
                  approving={approving} />
              ))}
            </AnimatePresence>
          </div>
        )}

        {!loading && totalPages > 1 && !search && (
          <div className="flex justify-center items-center gap-4 pt-4 pb-8">
            <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}
              className="p-3 bg-white border border-slate-200 rounded-2xl disabled:opacity-20 hover:border-emerald-400 transition-colors">
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)}
                  className={`w-9 h-9 rounded-xl text-xs font-black transition-all ${page === i + 1 ? "bg-emerald-600 text-white shadow-md" : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
                  {i + 1}
                </button>
              ))}
            </div>
            <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}
              className="p-3 bg-white border border-slate-200 rounded-2xl disabled:opacity-20 hover:border-emerald-400 transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminWasteReports;