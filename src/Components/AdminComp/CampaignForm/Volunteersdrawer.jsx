import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Users, Search, CheckCircle2, Circle, Trash2, Loader2, UserCheck, AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../../Api/APi";

const COLORS = [
  "bg-emerald-100 text-emerald-700 border-emerald-200",
  "bg-blue-100 text-blue-700 border-blue-200",
  "bg-violet-100 text-violet-700 border-violet-200",
  "bg-amber-100 text-amber-700 border-amber-200",
  "bg-rose-100 text-rose-700 border-rose-200",
  "bg-teal-100 text-teal-700 border-teal-200",
];
const avatarColor = (name = "") => COLORS[(name?.charCodeAt(0) || 0) % COLORS.length];

/* ─── Volunteer Row ──────────────────────────────────────────────── */
const VolunteerRow = ({ volunteer, campaignId, index, isCompleted, onAttendToggled, onRemoved }) => {
  const [loadingAttend, setLoadingAttend] = useState(false);
  const [loadingRemove, setLoadingRemove] = useState(false);

  const userId   = volunteer?.userId?._id || volunteer?.userId;
  const name     = volunteer?.userId?.fullName || "Unknown";
  const email    = volunteer?.userId?.email || "—";
  const role     = volunteer?.userId?.role || volunteer?.userModel || "user";
  const attended = volunteer?.attended;

  const handleAttend = async () => {
    try {
      setLoadingAttend(true);
      const res = await api.patch(`/${campaignId}/volunteers/${userId}/attend`);
      toast.success(res.data.msg);
      onAttendToggled(userId);
    } catch (err) {
      toast.error(err?.response?.data?.msg || "Failed to update attendance");
    } finally {
      setLoadingAttend(false);
    }
  };

  const handleRemove = async () => {
    try {
      setLoadingRemove(true);
      await api.delete(`/${campaignId}/volunteers/${userId}`);
      toast.success("Volunteer removed");
      onRemoved(userId);
    } catch (err) {
      toast.error(err?.response?.data?.msg || "Failed to remove");
    } finally {
      setLoadingRemove(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }} transition={{ delay: index * 0.04 }}
      className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all ${
        attended ? "bg-emerald-50/60 border-emerald-100" : "bg-slate-50 border-slate-100 hover:border-slate-200"
      }`}
    >
      {/* Avatar */}
      <div className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center text-sm font-black uppercase shrink-0 ${avatarColor(name)}`}>
        {name[0] || "?"}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-bold text-slate-700 truncate">{name}</p>
          {attended && <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />}
        </div>
        <p className="text-[11px] text-slate-400 font-medium truncate">{email}</p>
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-wider mt-0.5">{role}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Attend toggle — disabled until campaign is COMPLETED */}
        <button
          onClick={handleAttend}
          disabled={loadingAttend || !isCompleted}
          title={
            !isCompleted
              ? "Attendance can only be marked after campaign completes"
              : attended ? "Mark absent" : "Mark attended"
          }
          className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all
            ${!isCompleted
              ? "opacity-30 cursor-not-allowed bg-slate-50 border-slate-100 text-slate-300"
              : attended
                ? "bg-emerald-100 border-emerald-200 text-emerald-600 hover:bg-emerald-200"
                : "bg-white border-slate-200 text-slate-400 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600"
            } disabled:opacity-30`}
        >
          {loadingAttend
            ? <Loader2 size={12} className="animate-spin" />
            : attended
              ? <CheckCircle2 size={13} />
              : <Circle size={13} />
          }
        </button>

        {/* Remove */}
        <button onClick={handleRemove} disabled={loadingRemove}
          className="w-8 h-8 rounded-xl border border-slate-200 bg-white text-slate-400 hover:bg-red-50 hover:border-red-200 hover:text-red-500 flex items-center justify-center transition-all disabled:opacity-50">
          {loadingRemove ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
        </button>
      </div>
    </motion.div>
  );
};

/* ─── Volunteers Drawer ──────────────────────────────────────────── */
const VolunteersDrawer = ({ campaign, onClose, onUpdated, isCompleted }) => {
  const [search, setSearch] = useState("");

  const [localVolunteers, setLocalVolunteers] = useState(campaign?.volunteers || []);

  const attendedCount = localVolunteers.filter((v) => v.attended).length;
  const capacityPct   = Math.min(
    Math.round((localVolunteers.length / (campaign?.maxVolunteers || 1)) * 100),
    100
  );

  const handleAttendToggled = (userId) => {
    setLocalVolunteers((prev) =>
      prev.map((v) => {
        const vId = (v?.userId?._id || v?.userId)?.toString();
        if (vId === userId?.toString()) return { ...v, attended: !v.attended };
        return v;
      })
    );
    onUpdated();
  };

  const handleRemoved = (userId) => {
    setLocalVolunteers((prev) =>
      prev.filter((v) => (v?.userId?._id || v?.userId)?.toString() !== userId?.toString())
    );
    onUpdated();
  };

  const filtered = localVolunteers.filter((v) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    const name            = v?.userId?.fullName?.toLowerCase() || "";
    const staffID         = v?.userId?.staffID?.toLowerCase() || "";
    const admissionNumber = v?.userId?.admissionNumber?.toLowerCase() || "";
    const email           = v?.userId?.email?.toLowerCase() || "";
    const role            = (v?.userId?.role || v?.userModel || "").toLowerCase();
    return name.includes(q) || email.includes(q) || role.includes(q) || staffID.includes(q) || admissionNumber.includes(q);
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/20 backdrop-blur-sm"
      onClick={onClose}>
      <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white border-l border-slate-100 w-full max-w-sm h-full overflow-y-auto shadow-2xl flex flex-col">

        {/* Sticky header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-slate-100 px-6 py-5 z-10 space-y-4">
          {/* Title */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-slate-800 text-base">Volunteers</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                {localVolunteers.length} / {campaign?.maxVolunteers} joined
                {attendedCount > 0 && (
                  <span className="ml-2 text-emerald-500 font-black">· {attendedCount} attended</span>
                )}
              </p>
            </div>
            <button onClick={onClose}
              className="w-9 h-9 rounded-2xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-all border border-slate-200">
              <X size={16} />
            </button>
          </div>

          {/* Capacity bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-bold text-slate-400">
              <span>Capacity</span>
              <span className="text-emerald-500">{capacityPct}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div animate={{ width: `${capacityPct}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="h-full bg-emerald-500 rounded-full" />
            </div>
          </div>

          {/* Attendance pills */}
          <div className="flex gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-xl">
              <CheckCircle2 size={11} className="text-emerald-500" />
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">{attendedCount} Attended</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl">
              <Circle size={11} className="text-slate-400" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                {localVolunteers.length - attendedCount} Absent
              </span>
            </div>
          </div>

          {/* ── Attendance locked notice ── */}
          {!isCompleted && (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5">
              <AlertCircle size={13} className="text-amber-500 shrink-0" />
              <p className="text-[10px] font-black text-amber-600 uppercase tracking-wider leading-snug">
                Attendance available only after campaign completes
              </p>
            </div>
          )}

          {/* Search */}
          {localVolunteers.length > 0 && (
            <div className="relative">
              <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, ID, role..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/10 transition-all placeholder:text-slate-300" />
            </div>
          )}
        </div>

        {/* Legend */}
        {localVolunteers.length > 0 && (
          <div className="px-6 pt-4 pb-1 flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {filtered.length} volunteer{filtered.length !== 1 ? "s" : ""}
              {search && ` for "${search}"`}
            </span>
            <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold">
              <span className="flex items-center gap-1">
                <UserCheck size={10} className={isCompleted ? "text-emerald-500" : "text-slate-300"} />
                {isCompleted ? "Attend" : "Locked"}
              </span>
              <span className="flex items-center gap-1">
                <Trash2 size={10} className="text-red-400" /> Remove
              </span>
            </div>
          </div>
        )}

        {/* Volunteer list */}
        <div className="px-6 pb-6 pt-3 space-y-2 flex-1">
          {!localVolunteers.length ? (
            <div className="flex flex-col items-center py-16 gap-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                <Users size={22} className="text-slate-300" />
              </div>
              <p className="text-slate-400 text-sm font-bold">No volunteers yet</p>
              <p className="text-slate-300 text-xs font-medium text-center">Volunteers who join will appear here</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center py-12 gap-2">
              <Search size={22} className="text-slate-300" />
              <p className="text-slate-400 text-sm font-bold">No results</p>
              <p className="text-slate-300 text-xs">Try a different search term</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filtered.map((v, i) => (
                <VolunteerRow
                  key={v?.userId?._id || v?.userId || i}
                  volunteer={v}
                  campaignId={campaign._id}
                  index={i}
                  isCompleted={isCompleted}
                  onAttendToggled={handleAttendToggled}
                  onRemoved={handleRemoved}
                />
              ))}
            </AnimatePresence>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default VolunteersDrawer;