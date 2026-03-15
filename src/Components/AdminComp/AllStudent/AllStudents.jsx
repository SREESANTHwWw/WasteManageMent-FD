import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  RefreshCw,
  Loader2,
  Pencil,
  X,
  Check,
  Trash2,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Coins,
  CalendarDays,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../../Api/APi";

/* ─── Avatar color helper ────────────────────────────────────────── */
const AVATAR_COLORS = [
  "bg-blue-100 text-blue-700 border-blue-200",
  "bg-indigo-100 text-indigo-700 border-indigo-200",
  "bg-purple-100 text-purple-700 border-purple-200",
  "bg-sky-100 text-sky-700 border-sky-200",
];
const avatarColor = (name = "") =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

/* ─── Skeleton ───────────────────────────────────────────────────── */
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

/* ─── Edit Student Drawer ────────────────────────────────────────── */
const StudentEditDrawer = ({ student, onClose, onSaved }) => {
  const [form, setForm] = useState({
    fullName: student.fullName || "",
    email: student.email || "",
    admissionNumber: student.admissionNumber || "",
    dateOfBirth: student.dateOfBirth || "",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.patch(`/edit/${student._id}`, form);
      toast.success("Student records updated");
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.msg || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all";
  const labelCls = "text-[10px] font-black text-slate-400 uppercase tracking-widest";

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/20 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28 }}
        className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b flex items-center justify-between">
          <h3 className="font-black text-slate-800 flex items-center gap-2">
            <Pencil size={18} className="text-indigo-500" /> Update Student Profile
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-all"><X size={20}/></button>
        </div>

        <div className="p-6 space-y-5 flex-1 overflow-y-auto">
           <div className="space-y-1.5">
            <label className={labelCls}>Full Name</label>
            <input value={form.fullName} onChange={(e)=>setForm({...form, fullName: e.target.value})} className={inputCls} />
          </div>
          
          <div className="space-y-1.5">
              <label className={labelCls}>Admission Number</label>
              <input value={form.admissionNumber} onChange={(e)=>setForm({...form, admissionNumber: e.target.value})} className={inputCls} />
          </div>

          <div className="space-y-1.5">
              <label className={labelCls}>Date of Birth</label>
              <div className="relative">
                <CalendarDays size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="DD-MM-YYYY" value={form.dateOfBirth} onChange={(e)=>setForm({...form, dateOfBirth: e.target.value})} className={inputCls} />
              </div>
          </div>

          <div className="space-y-1.5">
            <label className={labelCls}>Email Address</label>
            <input value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})} className={inputCls} />
          </div>
        </div>

        <div className="p-6 border-t bg-slate-50 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 font-bold text-slate-600 hover:bg-slate-100 rounded-2xl transition-all">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="flex-1 py-3 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-200">
            {saving ? <Loader2 size={16} className="animate-spin"/> : <Check size={16}/>} Save Changes
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ─── Main Component ─────────────────────────────────────────────── */
const AllStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editTarget, setEditTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(null);

  const LIMIT = 10;

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/get/all-students");
      setStudents(res.data?.students || []);
    } catch (error) {
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/delete/${id}`);
      toast.success("Student removed successfully");
      setIsDeleting(null);
      fetchStudents();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const filtered = students.filter(s => 
    s.fullName?.toLowerCase().includes(search.toLowerCase()) || 
    s.admissionNumber?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice((page - 1) * LIMIT, page * LIMIT);
  const totalPages = Math.ceil(filtered.length / LIMIT);

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] p-6 lg:p-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 border-b pb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full mb-3">
            <GraduationCap size={14} className="text-emerald-900" />
            <span className="text-[10px] font-black text-emerald-900 uppercase tracking-wider">Student Management</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Active Students</h1>
          <p className="text-slate-400 font-medium text-sm">Managing records, rewards, and credentials</p>
        </div>
        <button onClick={fetchStudents} className="flex items-center gap-2 px-5 py-2.5 bg-white border rounded-2xl text-[11px] font-black text-slate-500 uppercase hover:bg-slate-50 transition-all shadow-sm">
          <RefreshCw size={14} className={loading ? "animate-spin" : ""}/> Sync Data
        </button>
      </div>

      {/* Stats Bento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Enrollment</p>
                <p className="text-4xl font-black text-slate-800">{students.length}</p>
            </div>
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                <GraduationCap size={24} />
            </div>
        </div>
        <div className="bg-emerald-900 p-6 rounded-[2rem] shadow-xl shadow-indigo-100 flex items-center justify-between text-white">
            <div>
                <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-1">Community Rewards</p>
                <p className="text-4xl font-black">{students.reduce((acc, curr) => acc + (curr.rewardPoint || 0), 0)}</p>
            </div>
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-indigo-100">
                <Coins size={24} />
            </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative group">
        <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
        <input 
          type="text" 
          placeholder="Search by name, email, or admission number..." 
          className="w-full bg-white border-2 border-slate-100 rounded-3xl pl-14 pr-6 py-5 text-sm font-semibold shadow-sm focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none"
          value={search}
          onChange={(e) => {setSearch(e.target.value); setPage(1);}}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Info</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Admission ID</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Rewards</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
                {loading ? Array.from({length: 5}).map((_, i) => <tr key={i}><td colSpan={5}><SkeletonRow/></td></tr>) : 
                paginated.map((student) => (
                <tr key={student._id} className="hover:bg-slate-50/80 transition-all group">
                    <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm shadow-sm border ${avatarColor(student.fullName)}`}>
                                {student.fullName?.[0]}
                            </div>
                            <div>
                                <p className="font-bold text-slate-800 text-sm leading-tight">{student.fullName}</p>
                                <p className="text-[11px] text-slate-400 font-medium">{student.email || 'No email provided'}</p>
                            </div>
                        </div>
                    </td>
                    <td className="px-6 py-5">
                        <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                            {student.admissionNumber}
                        </span>
                    </td>
                    <td className="px-6 py-5">
                        <div className="flex items-center gap-1.5 text-amber-600 font-black text-sm">
                            <Coins size={14} />
                            {student.rewardPoint || 0}
                        </div>
                    </td>
                    <td className="px-6 py-5">
                        <span className="px-3 py-1 bg-indigo-50 text-emerald-900 rounded-full text-[10px] font-black uppercase tracking-tight">
                            {student.role}
                        </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                            <button onClick={()=>setEditTarget(student)} className="p-2.5 bg-white text-slate-600 rounded-xl border border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 transition-all">
                                <Pencil size={14}/>
                            </button>
                            <button 
                                onClick={()=>setIsDeleting(student._id)} 
                                className={`p-2.5 rounded-xl border transition-all ${isDeleting === student._id ? 'bg-red-500 text-white border-red-500' : 'bg-white text-slate-600 border-slate-200 hover:bg-red-50 hover:text-red-500'}`}
                            >
                                {isDeleting === student._id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14}/>}
                            </button>
                        </div>
                    </td>
                </tr>
                ))
                }
            </tbody>
            </table>
        </div>
      </div>

      {/* Delete Confirmation Overlay */}
      <AnimatePresence>
        {isDeleting && (
            <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4"
            >
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className="bg-white p-8 rounded-[2.5rem] max-w-sm w-full text-center shadow-2xl"
                >
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
                        <Trash2 size={28} />
                    </div>
                    <h3 className="text-xl font-black text-slate-800 mb-2">Are you sure?</h3>
                    <p className="text-slate-500 text-sm font-medium mb-8">This will permanently delete the student and all associated reward data.</p>
                    <div className="flex gap-3">
                        <button onClick={()=>setIsDeleting(null)} className="flex-1 py-4 font-bold text-slate-500 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all">Cancel</button>
                        <button onClick={()=>handleDelete(isDeleting)} className="flex-1 py-4 font-bold text-white bg-red-500 rounded-2xl shadow-lg shadow-red-200 hover:bg-red-600 transition-all">Delete</button>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
            <button disabled={page === 1} onClick={()=>setPage(p => p - 1)} className="w-12 h-12 flex items-center justify-center rounded-2xl border bg-white disabled:opacity-30 shadow-sm"><ChevronLeft size={18}/></button>
            <div className="bg-white px-6 py-3 rounded-2xl border shadow-sm">
                <span className="text-xs font-black text-slate-800 uppercase tracking-widest">Page {page} / {totalPages}</span>
            </div>
            <button disabled={page === totalPages} onClick={()=>setPage(p => p + 1)} className="w-12 h-12 flex items-center justify-center rounded-2xl border bg-white disabled:opacity-30 shadow-sm"><ChevronRight size={18}/></button>
        </div>
      )}

      {/* Edit Drawer */}
      <AnimatePresence>
        {editTarget && <StudentEditDrawer student={editTarget} onClose={()=>setEditTarget(null)} onSaved={fetchStudents}/>}
      </AnimatePresence>
    </div>
  );
};

export default AllStudents;