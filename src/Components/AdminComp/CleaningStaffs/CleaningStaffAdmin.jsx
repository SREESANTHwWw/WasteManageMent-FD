import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  Check,
  Loader2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Mail,
  Phone,
  BadgeCheck,
  User,
  Sparkles,
  Brush,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../../Api/APi";

/* ─── Avatar color ───────────────────────────────────────────────── */
const COLORS = [
  "bg-cyan-100 text-cyan-700 border-cyan-200",
  "bg-teal-100 text-teal-700 border-teal-200",
  "bg-emerald-100 text-emerald-700 border-emerald-200",
  "bg-sky-100 text-sky-700 border-sky-200",
  "bg-indigo-100 text-indigo-700 border-indigo-200",
  "bg-violet-100 text-violet-700 border-violet-200",
];
const avatarColor = (name = "") =>
  COLORS[(name.charCodeAt(0) || 0) % COLORS.length];

/* ─── Field config (shared by Create + Edit) ────────────────────── */
const FIELDS = [
  { name: "fullName", label: "Full Name", placeholder: "e.g. Ravi Kumar", icon: User, required: true },
  { name: "staffId", label: "Staff ID", placeholder: "e.g. CLN-042", icon: BadgeCheck, required: true },
  { name: "phone", label: "Phone", placeholder: "+91 98765 43210", icon: Phone, required: true },
  { name: "email", label: "Email", placeholder: "ravi@campus.edu", icon: Mail, required: false },
];

const EMPTY_FORM = { fullName: "", staffId: "", phone: "", email: "" };

/* ─── Skeleton ───────────────────────────────────────────────────── */
const Skeleton = () => (
  <div className="animate-pulse flex items-center gap-4 px-6 py-4">
    <div className="w-10 h-10 rounded-2xl bg-slate-100 shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-3.5 bg-slate-100 rounded-full w-1/3" />
      <div className="h-3 bg-slate-100 rounded-full w-1/2" />
    </div>
    <div className="h-8 w-24 bg-slate-100 rounded-xl" />
  </div>
);

/* ─── Delete Modal ───────────────────────────────────────────────── */
const DeleteModal = ({ target, onConfirm, onCancel, loading }) => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
  >
    <motion.div
      initial={{ scale: 0.9, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
      className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl border border-slate-100"
    >
      <div className="w-14 h-14 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <AlertTriangle size={24} className="text-red-500" />
      </div>
      <h3 className="text-lg font-black text-slate-800 text-center">Remove Staff?</h3>
      <p className="text-sm text-slate-500 text-center mt-2 leading-relaxed">
        <span className="font-bold text-slate-700">"{target?.fullName}"</span> will be permanently deleted.
      </p>
      <div className="flex gap-3 mt-7">
        <button
          onClick={onCancel} disabled={loading}
          className="flex-1 py-3 rounded-2xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all disabled:opacity-50"
        >Cancel</button>
        <button
          onClick={onConfirm} disabled={loading}
          className="flex-1 py-3 rounded-2xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
          {loading ? "Removing..." : "Delete"}
        </button>
      </div>
    </motion.div>
  </motion.div>
);

/* ─── Staff Form Drawer (Create + Edit) ──────────────────────────── */
const StaffDrawer = ({ mode, staff, onClose, onSaved }) => {
  const [form, setForm] = useState(
    mode === "edit"
      ? { fullName: staff.fullName || "", staffId: staff.staffId || "", phone: staff.phone || "", email: staff.email || "" }
      : { ...EMPTY_FORM }
  );
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Required";
    if (!form.staffId.trim()) e.staffId = "Required";
    if (!form.phone.trim()) e.phone = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: undefined }));
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      setSaving(true);
      if (mode === "edit") {
        await api.put(`/cleaning-staff/update/${staff._id}`, form);
        toast.success("Staff updated");
      } else {
        await api.post("/cleaning-staff/create", form);
        toast.success("Staff created");
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.msg || "Operation failed");
    } finally {
      setSaving(false);
    }
  };

  const inputBase =
    "w-full bg-slate-50 border rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition-all placeholder:text-slate-300";

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/20 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white border-l border-slate-100 w-full max-w-md h-full overflow-y-auto shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-slate-100 px-6 py-5 z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${mode === "edit" ? "bg-blue-50 border-blue-100" : "bg-emerald-50 border-emerald-100"}`}>
              {mode === "edit" ? <Pencil size={16} className="text-blue-600" /> : <Plus size={16} className="text-emerald-600" />}
            </div>
            <div>
              <h3 className="font-black text-slate-800">{mode === "edit" ? "Edit Staff" : "Add New Staff"}</h3>
              <p className="text-[11px] text-slate-400 font-medium">
                {mode === "edit" ? "Update staff details" : "Create cleaning staff account"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Avatar preview (edit only) */}
        {mode === "edit" && (
          <div className="px-6 pt-6 pb-2 flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center text-xl font-black uppercase ${avatarColor(form.fullName)}`}>
              {form.fullName?.[0] || "?"}
            </div>
            <div>
              <p className="font-black text-slate-800">{form.fullName || "Staff Member"}</p>
              <p className="text-[11px] text-slate-400 font-medium">{form.staffId || "No ID"}</p>
            </div>
          </div>
        )}

        {/* Fields */}
        <div className="px-6 py-5 space-y-4 flex-1">
          {FIELDS.map(({ name, label, placeholder, icon: Icon, required }) => (
            <div key={name} className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {label} {required && <span className="text-red-400">*</span>}
              </label>
              <div className="relative">
                <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className={`${inputBase} pl-10 ${errors[name] ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-500/10" : "border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/10"}`}
                />
              </div>
              {errors[name] && (
                <p className="text-[10px] text-red-500 font-bold flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-400 rounded-full inline-block" /> {errors[name]}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-slate-100 px-6 py-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all"
          >Cancel</button>
          <button
            onClick={handleSave} disabled={saving}
            className={`flex-1 py-3 rounded-2xl text-white font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60 ${mode === "edit" ? "bg-blue-600 hover:bg-blue-500" : "bg-emerald-600 hover:bg-emerald-500"}`}
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
            {saving ? "Saving..." : mode === "edit" ? "Save Changes" : "Create Staff"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ─── Staff Row ──────────────────────────────────────────────────── */
const StaffRow = ({ staff, index, onEdit, onDelete }) => (
  <motion.tr
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.04 }}
    className="group border-b border-slate-50 hover:bg-slate-50/70 transition-colors"
  >
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center text-sm font-black uppercase shrink-0 ${avatarColor(staff.fullName)}`}>
          {staff.fullName?.[0] || "?"}
        </div>
        <div>
          <p className="font-bold text-slate-800 text-sm">{staff.fullName || "—"}</p>
          <p className="text-[11px] text-slate-400 font-semibold">{staff.staffId || "—"}</p>
        </div>
      </div>
    </td>

    <td className="px-4 py-4 hidden md:table-cell">
      <div className="flex items-center gap-1.5">
        <Phone size={11} className="text-slate-400 shrink-0" />
        <span className="text-sm text-slate-500 font-medium">{staff.phone || "—"}</span>
      </div>
    </td>

    <td className="px-4 py-4 hidden lg:table-cell">
      <div className="flex items-center gap-1.5">
        <Mail size={11} className="text-slate-400 shrink-0" />
        <span className="text-sm text-slate-500 font-medium truncate max-w-[200px]">{staff.email || "—"}</span>
      </div>
    </td>

    <td className="px-4 py-4">
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(staff)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 text-[10px] font-black border border-blue-100 transition-all"
        >
          <Pencil size={11} /> Edit
        </button>
        <button
          onClick={() => onDelete(staff)}
          className="px-3 py-1.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 text-[10px] font-black border border-red-100 transition-all"
        >
          <Trash2 size={11} />
        </button>
      </div>
    </td>
  </motion.tr>
);

/* ─── Staff Card (mobile) ────────────────────────────────────────── */
const StaffCard = ({ staff, index, onEdit, onDelete }) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm p-5 space-y-4"
  >
    <div className="flex items-center gap-3">
      <div className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center text-base font-black uppercase ${avatarColor(staff.fullName)}`}>
        {staff.fullName?.[0] || "?"}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-black text-slate-800 truncate">{staff.fullName}</p>
        <p className="text-[11px] text-slate-400 font-semibold">{staff.staffId}</p>
      </div>
    </div>

    <div className="space-y-2">
      {staff.phone && (
        <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2">
          <Phone size={11} className="text-slate-400 shrink-0" />
          <span className="text-[11px] font-medium text-slate-500">{staff.phone}</span>
        </div>
      )}
      {staff.email && (
        <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2">
          <Mail size={11} className="text-slate-400 shrink-0" />
          <span className="text-[11px] font-medium text-slate-500 truncate">{staff.email}</span>
        </div>
      )}
    </div>

    <div className="flex gap-2 pt-1 border-t border-slate-50">
      <button
        onClick={() => onEdit(staff)}
        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 text-[11px] font-black border border-blue-100 transition-all"
      >
        <Pencil size={12} /> Edit
      </button>
      <button
        onClick={() => onDelete(staff)}
        className="px-4 py-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 text-[11px] font-black border border-red-100 transition-all"
      >
        <Trash2 size={12} />
      </button>
    </div>
  </motion.div>
);

/* ─── Main Component ─────────────────────────────────────────────── */
const CleaningStaffAdmin = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [drawer, setDrawer] = useState(null); // null | { mode: "create" | "edit", staff? }

  const LIMIT = 10;

  const fetchStaff = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/cleaning-staff/all");
      setStaffList(res.data?.data || []);
    } catch {
      toast.error("Failed to load staff");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStaff(); }, [fetchStaff]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await api.delete(`/cleaning-staff/delete/${deleteTarget._id}`);
      toast.success("Staff removed");
      setDeleteTarget(null);
      fetchStaff();
    } catch (err) {
      toast.error(err?.response?.data?.msg || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const filtered = staffList.filter((s) => {
    const q = search.toLowerCase().trim();
    return !q ||
      s.fullName?.toLowerCase().includes(q) ||
      s.staffId?.toLowerCase().includes(q) ||
      s.phone?.includes(q) ||
      s.email?.toLowerCase().includes(q);
  });

  const totalPages = Math.ceil(filtered.length / LIMIT);
  const paginated = filtered.slice((page - 1) * LIMIT, page * LIMIT);

  return (
    <>
      <AnimatePresence>
        {deleteTarget && (
          <DeleteModal
            target={deleteTarget}
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
            loading={deleting}
          />
        )}
        {drawer && (
          <StaffDrawer
            mode={drawer.mode}
            staff={drawer.staff}
            onClose={() => setDrawer(null)}
            onSaved={fetchStaff}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full min-h-screen bg-[#f8fafc] p-6 lg:p-10 space-y-8"
      >
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-teal-50 border border-teal-100 rounded-full">
                <Brush size={12} className="text-teal-600" />
                <span className="text-[10px] font-black text-teal-600 uppercase tracking-wider">
                  Admin Console
                </span>
              </div>
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              Cleaning Staff
            </h1>
            <p className="text-slate-400 font-medium mt-1 text-sm">
              Manage campus cleaning team — create, edit and remove members
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchStaff} disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-[11px] font-black text-slate-500 uppercase tracking-wider hover:bg-slate-50 transition-all shadow-sm disabled:opacity-60"
            >
              {loading ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
              Refresh
            </button>
            <button
              onClick={() => setDrawer({ mode: "create" })}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-wider hover:bg-emerald-500 transition-all shadow-sm"
            >
              <Plus size={14} /> Add Staff
            </button>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: "Total Staff", value: staffList.length, color: "text-slate-800", bg: "bg-white border-slate-200" },
            { label: "With Email", value: staffList.filter((s) => s.email).length, color: "text-teal-600", bg: "bg-teal-50 border-teal-100" },
            { label: "Results", value: filtered.length, color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
          ].map((s) => (
            <div key={s.label} className={`rounded-[1.5rem] border p-5 shadow-sm space-y-1 ${s.bg}`}>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
              <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* ── Search ── */}
        <div className="relative ">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, ID, phone or email..."
            className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-5 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-500/10 transition-all shadow-sm placeholder:text-slate-300"
          />
        </div>

        {/* ── Desktop Table ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="hidden md:block bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden"
        >
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                {["Staff Member", "Phone", "Email", "Actions"].map((h) => (
                  <th key={h} className="px-4 first:px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}><td colSpan={4}><Skeleton /></td></tr>
                ))
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                      <div className="w-14 h-14 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                        <Sparkles size={22} className="text-slate-300" />
                      </div>
                      <p className="text-slate-400 font-bold text-sm">No staff members found</p>
                      <button
                        onClick={() => setDrawer({ mode: "create" })}
                        className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-2xl text-xs font-black hover:bg-emerald-500 transition-all"
                      >
                        <Plus size={13} /> Add First Staff
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((staff, i) => (
                  <StaffRow
                    key={staff._id}
                    staff={staff}
                    index={i}
                    onEdit={(s) => setDrawer({ mode: "edit", staff: s })}
                    onDelete={setDeleteTarget}
                  />
                ))
              )}
            </tbody>
          </table>
        </motion.div>

        {/* ── Mobile Cards ── */}
        <div className="md:hidden space-y-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-[1.5rem] border border-slate-100 p-5 animate-pulse space-y-3">
                <div className="flex gap-3 items-center">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-100 rounded-full w-2/5" />
                    <div className="h-3 bg-slate-100 rounded-full w-1/4" />
                  </div>
                </div>
              </div>
            ))
          ) : paginated.length === 0 ? (
            <div className="flex flex-col items-center py-16 gap-4">
              <Sparkles size={28} className="text-slate-300" />
              <p className="text-slate-400 font-bold text-sm">No staff found</p>
              <button
                onClick={() => setDrawer({ mode: "create" })}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-2xl text-xs font-black hover:bg-emerald-500 transition-all"
              >
                <Plus size={13} /> Add Staff
              </button>
            </div>
          ) : (
            paginated.map((staff, i) => (
              <StaffCard
                key={staff._id}
                staff={staff}
                index={i}
                onEdit={(s) => setDrawer({ mode: "edit", staff: s })}
                onDelete={setDeleteTarget}
              />
            ))
          )}
        </div>

        {/* ── Pagination ── */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronLeft size={15} /> Prev
            </button>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-9 h-9 rounded-xl text-xs font-black transition-all ${page === i + 1 ? "bg-teal-600 text-white shadow-md" : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              Next <ChevronRight size={15} />
            </button>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default CleaningStaffAdmin;
