import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  RefreshCw,
  Loader2,
  AlertTriangle,
  Pencil,
  X,
  Check,
  Trash2,
  Users,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  Building2,
  BadgeCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../../Api/APi";

/* ─── Avatar color by initial ────────────────────────────────────── */
const AVATAR_COLORS = [
  "bg-emerald-100 text-emerald-700 border-emerald-200",
  "bg-blue-100 text-blue-700 border-blue-200",
  "bg-violet-100 text-violet-700 border-violet-200",
  "bg-amber-100 text-amber-700 border-amber-200",
  "bg-rose-100 text-rose-700 border-rose-200",
  "bg-teal-100 text-teal-700 border-teal-200",
];
const avatarColor = (name = "") =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

/* ─── Skeleton Row ───────────────────────────────────────────────── */
const SkeletonRow = () => (
  <div className="flex items-center gap-4 px-6 py-4 animate-pulse">
    <div className="w-10 h-10 rounded-2xl bg-slate-100 shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-3.5 bg-slate-100 rounded-full w-1/3" />
      <div className="h-3 bg-slate-100 rounded-full w-1/2" />
    </div>
    <div className="h-8 w-20 bg-slate-100 rounded-xl" />
  </div>
);

/* ─── Delete Modal ───────────────────────────────────────────────── */
const DeleteModal = ({ staff, onConfirm, onCancel, deleting }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
  >
    <motion.div
      initial={{ scale: 0.92, opacity: 0, y: 16 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.92, opacity: 0 }}
      className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl border border-slate-100"
    >
      <div className="flex items-center justify-center w-14 h-14 bg-red-50 rounded-2xl mb-5 mx-auto border border-red-100">
        <AlertTriangle size={26} className="text-red-500" />
      </div>
      <h3 className="text-lg font-black text-slate-800 text-center">
        Remove Staff Member?
      </h3>
      <p className="text-sm text-slate-500 text-center mt-2 font-medium leading-relaxed">
        <span className="font-bold text-slate-700">"{staff?.fullName}"</span>{" "}
        will be permanently removed from the system.
      </p>
      <div className="flex gap-3 mt-7">
        <button
          onClick={onCancel}
          disabled={deleting}
          className="flex-1 py-3 rounded-2xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={deleting}
          className="flex-1 py-3 rounded-2xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {deleting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Trash2 size={16} />
          )}
          {deleting ? "Removing..." : "Confirm"}
        </button>
      </div>
    </motion.div>
  </motion.div>
);

/* ─── Edit Drawer ────────────────────────────────────────────────── */
const EditDrawer = ({ staff, onClose, onSaved }) => {
  const [form, setForm] = useState({
    fullName: staff.fullName || "",
    email: staff.email || "",
    phone: staff.phone || "",
    department: staff.department || "",
    staffID: staff.staffID || "",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.patch(`/staff/${staff._id}/edit`, form);
      toast.success("Staff updated successfully");
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.msg || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/10 transition-all placeholder:text-slate-300";
  const labelCls =
    "text-[10px] font-black text-slate-400 uppercase tracking-widest";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/20 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white border-l border-slate-100 w-full max-w-md h-full overflow-y-auto shadow-2xl flex flex-col"
      >
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-slate-100 px-6 py-5 z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              <Pencil size={16} className="text-emerald-600" />
            </div>
            <div>
              <h3 className="font-black text-slate-800">Edit Staff</h3>
              <p className="text-[11px] text-slate-400 font-medium">
                Admin override
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

        <div className="px-6 pt-6 pb-2 flex items-center gap-4">
          <div
            className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center text-xl font-black uppercase ${avatarColor(form.fullName)}`}
          >
            {form.fullName?.[0] || "?"}
          </div>
          <div>
            <p className="font-black text-slate-800 text-base">
              {form.fullName || "Staff Member"}
            </p>
            <p className="text-[11px] text-slate-400 font-medium">
              {form.staffID || "No ID"}
            </p>
          </div>
        </div>

        <div className="px-6 py-4 space-y-4 flex-1">
          <div className="space-y-1.5">
            <label className={labelCls}>Full Name</label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              className={inputCls}
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-1.5">
            <label className={labelCls}>Email</label>
            <div className="relative">
              <Mail
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className={`${inputCls} pl-10`}
                placeholder="john@campus.edu"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className={labelCls}>Phone</label>
              <div className="relative">
                <Phone
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className={`${inputCls} pl-10`}
                  placeholder="+91 00000 00000"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className={labelCls}>Staff ID</label>
              <div className="relative">
                <BadgeCheck
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  name="staffID"
                  value={form.staffID}
                  onChange={handleChange}
                  className={`${inputCls} pl-10`}
                  placeholder="STF-001"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className={labelCls}>Department</label>
            <div className="relative">
              <Building2
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                name="department"
                value={form.department}
                onChange={handleChange}
                className={`${inputCls} pl-10`}
                placeholder="Sanitation"
              />
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-slate-100 px-6 py-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Check size={16} />
            )}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ─── Staff Row ──────────────────────────────────────────────────── */
const StaffRow = ({ staff, index, onEdit, onDelete }) => {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className="group border-b border-slate-50 hover:bg-slate-50/60 transition-colors"
    >
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center text-sm font-black uppercase shrink-0 ${avatarColor(staff.fullName)}`}
          >
            {staff.fullName?.[0] || "?"}
          </div>
          <div>
            <p className="font-bold text-slate-800 text-sm">{staff.fullName || "—"}</p>
            <p className="text-[11px] text-slate-400 font-medium">{staff.staffID || "—"}</p>
          </div>
        </div>
      </td>

      <td className="px-4 py-4 hidden md:table-cell">
        <div className="flex items-center gap-1.5">
          <Mail size={12} className="text-slate-400 shrink-0" />
          <span className="text-sm text-slate-500 font-medium truncate max-w-[180px]">
            {staff.email || "—"}
          </span>
        </div>
      </td>

      <td className="px-4 py-4 hidden lg:table-cell">
        <div className="flex items-center gap-1.5">
          <Building2 size={12} className="text-slate-400 shrink-0" />
          <span className="text-sm text-slate-500 font-medium">
            {staff.department || "—"}
          </span>
        </div>
      </td>

      <td className="px-4 py-4 hidden xl:table-cell">
        <div className="flex items-center gap-1.5">
          <Phone size={12} className="text-slate-400 shrink-0" />
          <span className="text-sm text-slate-500 font-medium">
            {staff.phone || "—"}
          </span>
        </div>
      </td>

      <td className="px-4 py-4">
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
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
};

/* ─── Staff Card (mobile) ────────────────────────────────────────── */
const StaffCard = ({ staff, index, onEdit, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm p-5 space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-2xl border-2 flex items-center justify-center text-sm font-black uppercase ${avatarColor(staff.fullName)}`}
          >
            {staff.fullName?.[0] || "?"}
          </div>
          <div>
            <p className="font-black text-slate-800">{staff.fullName || "—"}</p>
            <p className="text-[11px] text-slate-400 font-medium">{staff.staffID || "—"}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {staff.email && (
          <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2 col-span-2">
            <Mail size={11} className="text-slate-400 shrink-0" />
            <span className="text-[11px] font-medium text-slate-500 truncate">{staff.email}</span>
          </div>
        )}
        {staff.department && (
          <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2">
            <Building2 size={11} className="text-slate-400 shrink-0" />
            <span className="text-[11px] font-medium text-slate-500 truncate">{staff.department}</span>
          </div>
        )}
        {staff.phone && (
          <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2">
            <Phone size={11} className="text-slate-400 shrink-0" />
            <span className="text-[11px] font-medium text-slate-500">{staff.phone}</span>
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
};

/* ─── Main Component ─────────────────────────────────────────────── */
const AllStaffs = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  const LIMIT = 10;

  const fetchStaff = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/staff/all");
      setStaffList(res.data?.staff || []);
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Failed to load staff");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await api.delete(`/staff/${deleteTarget._id}`);
      toast.success("Staff member removed");
      setDeleteTarget(null);
      fetchStaff();
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  const filtered = staffList.filter((s) => {
    return !search.trim() ||
      s.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase()) ||
      s.staffID?.toLowerCase().includes(search.toLowerCase()) ||
      s.department?.toLowerCase().includes(search.toLowerCase());
  });

  const totalPages = Math.ceil(filtered.length / LIMIT);
  const paginated = filtered.slice((page - 1) * LIMIT, page * LIMIT);

  return (
    <>
      <AnimatePresence>
        {deleteTarget && (
          <DeleteModal
            staff={deleteTarget}
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
            deleting={deleting}
          />
        )}
        {editTarget && (
          <EditDrawer
            staff={editTarget}
            onClose={() => setEditTarget(null)}
            onSaved={fetchStaff}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full min-h-screen bg-[#f8fafc] p-6 lg:p-10 space-y-8"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full">
                <ShieldCheck size={13} className="text-emerald-600" />
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">
                  Admin Console
                </span>
              </div>
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              Staff Management
            </h1>
            <p className="text-slate-400 font-medium mt-1 text-sm">
              Manage, edit and remove campus staff accounts
            </p>
          </div>

          <button
            onClick={fetchStaff}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-[11px] font-black text-slate-500 uppercase tracking-wider hover:bg-slate-50 transition-all shadow-sm disabled:opacity-60"
          >
            {loading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <RefreshCw size={14} />
            )}
            Refresh
          </button>
        </div>

        {/* ── Stats (Simple Total) ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="rounded-[1.5rem] border p-5 shadow-sm space-y-1 bg-white border-slate-200">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Total Staff
            </p>
            <p className="text-3xl font-black text-slate-800">{staffList.length}</p>
          </div>
        </motion.div>

        <div className="relative">
          <Search
            size={15}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, email, ID or department..."
            className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-5 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/10 transition-all shadow-sm placeholder:text-slate-300"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="hidden md:block bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden"
        >
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Staff Member
                </th>
                <th className="px-4 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest hidden md:table-cell">
                  Email
                </th>
                <th className="px-4 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest hidden lg:table-cell">
                  Department
                </th>
                <th className="px-4 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest hidden xl:table-cell">
                  Phone
                </th>
                <th className="px-4 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5}>
                      <SkeletonRow />
                    </td>
                  </tr>
                ))
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                      <div className="w-14 h-14 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                        <Users size={24} className="text-slate-300" />
                      </div>
                      <p className="text-slate-400 font-bold text-sm">No staff members found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((staff, i) => (
                  <StaffRow
                    key={staff._id}
                    staff={staff}
                    index={i}
                    onEdit={setEditTarget}
                    onDelete={setDeleteTarget}
                  />
                ))
              )}
            </tbody>
          </table>
        </motion.div>

        <div className="md:hidden space-y-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-[1.5rem] border border-slate-100 p-5 animate-pulse space-y-3">
                <div className="flex gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-slate-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-100 rounded-full w-1/2" />
                    <div className="h-3 bg-slate-100 rounded-full w-1/3" />
                  </div>
                </div>
              </div>
            ))
          ) : paginated.length === 0 ? (
            <div className="flex flex-col items-center py-20 gap-3">
              <Users size={28} className="text-slate-300" />
              <p className="text-slate-400 font-bold text-sm">No staff found</p>
            </div>
          ) : (
            paginated.map((staff, i) => (
              <StaffCard
                key={staff._id}
                staff={staff}
                index={i}
                onEdit={setEditTarget}
                onDelete={setDeleteTarget}
              />
            ))
          )}
        </div>

        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronLeft size={16} /> Prev
            </button>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-9 h-9 rounded-xl text-xs font-black transition-all
                    ${page === i + 1
                      ? "bg-emerald-600 text-white shadow-md"
                      : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
                    }`}
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
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default AllStaffs;