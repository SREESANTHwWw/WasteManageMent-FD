import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Calendar, Clock, Users, Trash2, Search, Filter,
  RefreshCw, ImageOff, ChevronLeft, ChevronRight, Loader2,
  Leaf, AlertTriangle, Pencil, X, Check, UserCheck, ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../../Api/APi";
import VolunteersDrawer from "./Volunteersdrawer";

/* ─── Status config ──────────────────────────────────────────────── */
const STATUS_CONFIG = {
  UPCOMING:  { label: "Upcoming",  pill: "bg-blue-50 text-blue-600 border-blue-100",      dot: "bg-blue-500",                   bar: "bg-blue-400"    },
  ONGOING:   { label: "Ongoing",   pill: "bg-emerald-50 text-emerald-600 border-emerald-100", dot: "bg-emerald-500 animate-pulse", bar: "bg-emerald-500" },
  COMPLETED: { label: "Completed", pill: "bg-slate-100 text-slate-500 border-slate-200",  dot: "bg-slate-400",                  bar: "bg-slate-300"   },
  CANCELLED: { label: "Cancelled", pill: "bg-red-100 text-red-500 border-red-200",        dot: "bg-red-400",                    bar: "bg-red-300"     },
};

const STATUS_OPTIONS = ["UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"];

/* ─── Skeleton ───────────────────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden animate-pulse shadow-sm">
    <div className="h-44 bg-slate-100" />
    <div className="p-5 space-y-3">
      <div className="h-3 bg-slate-100 rounded-full w-1/4" />
      <div className="h-5 bg-slate-100 rounded-full w-3/4" />
      <div className="h-3 bg-slate-100 rounded-full w-full" />
      <div className="flex gap-2 mt-4">
        <div className="h-8 bg-slate-100 rounded-xl flex-1" />
        <div className="h-8 bg-slate-100 rounded-xl w-16" />
        <div className="h-8 bg-slate-100 rounded-xl w-16" />
      </div>
    </div>
  </div>
);

/* ─── Delete Modal ───────────────────────────────────────────────── */
const DeleteModal = ({ campaign, onConfirm, onCancel, deleting }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
    <motion.div initial={{ scale: 0.92, opacity: 0, y: 16 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.92, opacity: 0 }}
      className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl border border-slate-100">
      <div className="flex items-center justify-center w-14 h-14 bg-red-50 rounded-2xl mb-5 mx-auto border border-red-100">
        <AlertTriangle size={26} className="text-red-500" />
      </div>
      <h3 className="text-lg font-black text-slate-800 text-center">Delete Campaign?</h3>
      <p className="text-sm text-slate-500 text-center mt-2 font-medium leading-relaxed">
        <span className="font-bold text-slate-700">"{campaign?.title}"</span> will be permanently removed.
      </p>
      <div className="flex gap-3 mt-7">
        <button onClick={onCancel} disabled={deleting}
          className="flex-1 py-3 rounded-2xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all disabled:opacity-50">
          Cancel
        </button>
        <button onClick={onConfirm} disabled={deleting}
          className="flex-1 py-3 rounded-2xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
          {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
          {deleting ? "Deleting..." : "Confirm"}
        </button>
      </div>
    </motion.div>
  </motion.div>
);

/* ─── Edit Modal ─────────────────────────────────────────────────── */
const EditModal = ({ campaign, onClose, onSaved }) => {
  const [form, setForm] = useState({
    title:         campaign.title || "",
    description:   campaign.description || "",
    campaignDate:  campaign.campaignDate?.slice(0, 10) || "",
    startTime:     campaign.startTime || "",
    endTime:       campaign.endTime || "",
    maxVolunteers: campaign.maxVolunteers || 10,
    status:        campaign.status || "UPCOMING",
    building:      campaign.location?.building || "",
    area:          campaign.location?.area || "",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === "building") fd.append("location[building]", v);
        else if (k === "area") fd.append("location[area]", v);
        else fd.append(k, v);
      });
      await api.patch(`/${campaign._id}/edit`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Campaign updated");
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.msg || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/10 transition-all placeholder:text-slate-300";
  const labelCls = "text-[10px] font-black text-slate-400 uppercase tracking-widest";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4 py-8 overflow-y-auto">
      <motion.div initial={{ scale: 0.93, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.93, opacity: 0 }}
        className="bg-white border border-slate-100 rounded-[2rem] p-8 w-full max-w-lg shadow-2xl space-y-6 my-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              <Pencil size={16} className="text-emerald-600" />
            </div>
            <div>
              <h3 className="font-black text-slate-800 text-base">Edit Campaign</h3>
              <p className="text-[11px] text-slate-400 font-medium">Admin override — all fields editable</p>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 transition-all">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className={labelCls}>Title</label>
            <input name="title" value={form.title} onChange={handleChange} className={inputCls} placeholder="Campaign title" />
          </div>
          <div className="space-y-1.5">
            <label className={labelCls}>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} className={`${inputCls} resize-none`} placeholder="Description..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className={labelCls}>Building</label>
              <input name="building" value={form.building} onChange={handleChange} className={inputCls} placeholder="Main Block" />
            </div>
            <div className="space-y-1.5">
              <label className={labelCls}>Area</label>
              <input name="area" value={form.area} onChange={handleChange} className={inputCls} placeholder="North Side" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className={labelCls}>Date</label>
              <input type="date" name="campaignDate" value={form.campaignDate} onChange={handleChange} className={inputCls} />
            </div>
            <div className="space-y-1.5">
              <label className={labelCls}>Start</label>
              <input type="time" name="startTime" value={form.startTime} onChange={handleChange} className={inputCls} />
            </div>
            <div className="space-y-1.5">
              <label className={labelCls}>End</label>
              <input type="time" name="endTime" value={form.endTime} onChange={handleChange} className={inputCls} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className={labelCls}>Max Volunteers</label>
              <input type="number" name="maxVolunteers" min={1} max={100} value={form.maxVolunteers} onChange={handleChange} className={inputCls} />
            </div>
            <div className="space-y-1.5">
              <label className={labelCls}>Status</label>
              <select name="status" value={form.status} onChange={handleChange} className={inputCls}>
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 py-3 rounded-2xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ─── Campaign Card ──────────────────────────────────────────────── */
const AdminCampaignCard = ({ campaign, index, onDelete, onEdit, onViewVolunteers }) => {
  const status = STATUS_CONFIG[campaign.status] || STATUS_CONFIG.UPCOMING;
  const coverImage      = campaign.images?.[0];
  const volunteersCount = campaign.volunteers?.length || 0;
  const capacityPct     = Math.min((volunteersCount / (campaign.maxVolunteers || 1)) * 100, 100);

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }) : "—";

  const formatTime = (t) => {
    if (!t) return "—";
    const [h, m] = t.split(":");
    const hour = parseInt(h);
    return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: "easeOut" }}
      className="group bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-slate-200/80 hover:-translate-y-1 transition-all duration-300"
    >
      {/* Cover */}
      <div className="relative h-44 bg-gradient-to-br from-slate-50 to-emerald-50 overflow-hidden">
        {coverImage ? (
          <img src={coverImage} alt={campaign.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <ImageOff size={26} className="text-slate-300" />
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">No Image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
        <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-wider ${status.pill}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </div>
        {campaign.images?.length > 1 && (
          <span className="absolute bottom-3 right-3 bg-black/40 text-white text-[10px] font-black px-2 py-1 rounded-full backdrop-blur-sm">
            +{campaign.images.length - 1} more
          </span>
        )}
        {/* Hover action buttons */}
        <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200">
          <button onClick={() => onViewVolunteers(campaign)} title="View Volunteers"
            className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-500 hover:text-emerald-600 hover:bg-white shadow-sm transition-all">
            <Users size={14} />
          </button>
          <button onClick={() => onEdit(campaign)} title="Edit Campaign"
            className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-white shadow-sm transition-all">
            <Pencil size={14} />
          </button>
          <button onClick={() => onDelete(campaign)} title="Delete Campaign"
            className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-500 hover:text-red-500 hover:bg-white shadow-sm transition-all">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">
        <div>
          <h3 className="font-black text-slate-800 text-[15px] leading-snug line-clamp-1">{campaign.title}</h3>
          <p className="text-xs text-slate-400 font-medium mt-1 line-clamp-2 leading-relaxed">
            {campaign.description || "No description provided."}
          </p>
        </div>

        {/* Capacity */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <UserCheck size={12} className="text-emerald-500" />
              <span className="text-[11px] font-bold text-slate-500">{volunteersCount} / {campaign.maxVolunteers} volunteers</span>
            </div>
            <span className="text-[11px] font-black text-emerald-600">{Math.round(capacityPct)}%</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-500 ${status.bar}`} style={{ width: `${capacityPct}%` }} />
          </div>
        </div>

        {/* Meta grid */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: MapPin,    val: campaign.location?.area || campaign.location?.building || "—" },
            { icon: Calendar,  val: formatDate(campaign.campaignDate) },
            { icon: Clock,     val: formatTime(campaign.startTime),   iconCls: "text-emerald-500" },
            { icon: Clock,     val: formatTime(campaign.endTime),     iconCls: "text-slate-300"   },
          ].map(({ icon: Icon, val, iconCls = "text-emerald-500" }, i) => (
            <div key={i} className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2">
              <Icon size={11} className={`${iconCls} shrink-0`} />
              <span className="text-[11px] font-bold text-slate-600 truncate">{val}</span>
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end pt-2 border-t border-slate-50 gap-1.5">
          <button onClick={() => onViewVolunteers(campaign)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 text-[10px] font-black transition-all border border-emerald-100">
            <Users size={11} /> {volunteersCount}
          </button>
          <button onClick={() => onEdit(campaign)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 text-[10px] font-black transition-all border border-blue-100">
            <Pencil size={11} /> Edit
          </button>
          <button onClick={() => onDelete(campaign)}
            className="px-2.5 py-1.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 text-[10px] font-black transition-all border border-red-100">
            <Trash2 size={11} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Main Component ─────────────────────────────────────────────── */
const AdminAllCampaigns = () => {
  const [campaigns, setCampaigns]           = useState([]);
  const [loading, setLoading]               = useState(true);
  const [search, setSearch]                 = useState("");
  const [statusFilter, setStatusFilter]     = useState("");
  const [page, setPage]                     = useState(1);
  const [totalPages, setTotalPages]         = useState(1);
  const [total, setTotal]                   = useState(0);
  const [deleteTarget, setDeleteTarget]     = useState(null);
  const [deleting, setDeleting]             = useState(false);
  const [editTarget, setEditTarget]         = useState(null);
  const [volunteersTarget, setVolunteersTarget] = useState(null);

  const LIMIT = 9;

  const fetchCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page, limit: LIMIT });
      if (statusFilter) params.append("status", statusFilter);
      const res = await api.get(`/all?${params.toString()}`);
      setCampaigns(res.data.campaigns || []);
      setTotalPages(res.data.totalPages || 1);
      setTotal(res.data.total || 0);
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { fetchCampaigns(); }, [fetchCampaigns]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await api.delete(`/${deleteTarget._id}`);
      toast.success("Campaign deleted");
      setDeleteTarget(null);
      fetchCampaigns();
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  const filtered = search.trim()
    ? campaigns.filter((c) =>
        c.title?.toLowerCase().includes(search.toLowerCase()) ||
        c.location?.area?.toLowerCase().includes(search.toLowerCase()) ||
        c.location?.building?.toLowerCase().includes(search.toLowerCase())
      )
    : campaigns;

  const stats = [
    { label: "Total",     value: total,                                                      color: "text-slate-800",   bg: "bg-white border-slate-200"          },
    { label: "Upcoming",  value: campaigns.filter((c) => c.status === "UPCOMING").length,   color: "text-blue-600",    bg: "bg-blue-50 border-blue-100"         },
    { label: "Ongoing",   value: campaigns.filter((c) => c.status === "ONGOING").length,    color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100"   },
    { label: "Completed", value: campaigns.filter((c) => c.status === "COMPLETED").length,  color: "text-slate-400",   bg: "bg-slate-50 border-slate-100"       },
  ];

  return (
    <>
      <AnimatePresence>
        {deleteTarget && (
          <DeleteModal campaign={deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} deleting={deleting} />
        )}
        {editTarget && (
          <EditModal campaign={editTarget} onClose={() => setEditTarget(null)} onSaved={fetchCampaigns} />
        )}
        {volunteersTarget && (
          <VolunteersDrawer
            campaign={volunteersTarget}
            isCompleted={volunteersTarget.status === "COMPLETED"}
            onClose={() => setVolunteersTarget(null)}
            onUpdated={fetchCampaigns}
          />
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="w-full min-h-screen p-6 lg:p-8 space-y-6 bg-[#f8fafc]">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full">
                <ShieldCheck size={13} className="text-emerald-600" />
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">Admin Console</span>
              </div>
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Campaign Management</h1>
            <p className="text-slate-400 font-medium mt-1 text-sm">Full access — view, edit, and manage all registered missions</p>
          </div>
          <button onClick={fetchCampaigns}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-[11px] font-black text-slate-500 uppercase tracking-wider hover:bg-slate-50 transition-all shadow-sm">
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className={`bg-white rounded-3xl border p-5 space-y-1 shadow-sm ${s.bg}`}>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
              <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or location..."
              className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-5 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/10 transition-all shadow-sm placeholder:text-slate-300" />
          </div>
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-3 py-2 shadow-sm overflow-x-auto">
            <Filter size={13} className="text-slate-400 shrink-0" />
            {["", ...STATUS_OPTIONS].map((s) => (
              <button key={s || "all"} onClick={() => { setStatusFilter(s); setPage(1); }}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${statusFilter === s ? "bg-emerald-600 text-white shadow-sm" : "text-slate-400 hover:bg-slate-100"}`}>
                {s || "All"}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 rounded-3xl bg-slate-100 border border-slate-200 flex items-center justify-center">
              <Leaf size={28} className="text-slate-300" />
            </div>
            <p className="text-slate-400 font-bold text-sm">No campaigns found</p>
            <p className="text-slate-300 text-xs font-medium">Try adjusting your filters</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((campaign, i) => (
              <AdminCampaignCard key={campaign._id} campaign={campaign} index={i}
                onDelete={setDeleteTarget} onEdit={setEditTarget} onViewVolunteers={setVolunteersTarget} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-4">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm">
              <ChevronLeft size={16} /> Prev
            </button>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)}
                  className={`w-9 h-9 rounded-xl text-xs font-black transition-all ${page === i + 1 ? "bg-emerald-600 text-white shadow-md" : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
                  {i + 1}
                </button>
              ))}
            </div>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm">
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default AdminAllCampaigns;