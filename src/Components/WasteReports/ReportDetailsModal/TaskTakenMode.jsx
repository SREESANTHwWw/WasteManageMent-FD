import React, { useEffect, useMemo, useState } from "react";
import api from "../../../Api/APi";
import {
  Clock,
  Users,
  CheckCircle2,
  UserPlus,
  X,
  Search,
  Filter,
  Logs,
} from "lucide-react";
import { OptionController, Typography } from "../../../@All/Tags/Tags";
import { useAuth } from "../../Context/UserContext/UserContext"; // if you have it
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";

const TaskTakenMode = ({ reportId, onSuccess, onClose }) => {
  const { user } = useAuth?.() || {};
  const currentStaffId = user?._id || user?.id;
  console.log(reportId);
  const { control } = useForm();

  const [team, setTeam] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [showCustomTime, setShowCustomTime] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await api.get("/staff/all");
        setStaffList(res.data.staff || []);
      } catch (err) {
        console.error("Failed to fetch staff:", err);
      }
    };
    fetchStaff();
  }, []);

  const toggleTeamMember = (id) => {
    setTeam((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  };

  const filteredStaff = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return (staffList || [])
      .filter((s) => (currentStaffId ? s._id !== currentStaffId : true)) // avoid selecting self
      .filter((staff) => {
        const matchesSearch = (staff.fullName || "").toLowerCase().includes(q);
        const matchesToggle = showSelectedOnly
          ? team.includes(staff._id)
          : true;
        return matchesSearch && matchesToggle;
      });
  }, [staffList, searchQuery, showSelectedOnly, team, currentStaffId]);

  const handleTakeTask = async () => {
  

    try {
      setLoading(true);

      const res = await api.patch(`/take/task/${reportId}`, {
      
        team,
      });

      if (res.data.success) {
        onSuccess?.();
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || "Error taking task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-4xl overflow-hidden max-w-md w-full shadow-2xl border border-white/20 animate-in fade-in zoom-in duration-200">
        <div className="bg-(--main-web-color) p-6 text-white flex justify-between items-center">
          <div>
            <Typography className="text-xl font-black tracking-tight flex items-center gap-2">
              <UserPlus size={20} className="text-emerald-400" />
              ASSIGN TASK
            </Typography>
            <Typography className="text-slate-300 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">
              Initialize Operations
            </Typography>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center cursor-pointer justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
              <label className="flex items-center gap-2 text-slate-500 text-[11px] font-black uppercase tracking-widest">
                <Users size={14} className="text-emerald-500" />
                Team ({team.length})
              </label>
              <button
                onClick={() => setShowSelectedOnly(!showSelectedOnly)}
                className={`text-[10px] font-black px-2 py-1 rounded-md cursor-pointer transition-all flex items-center gap-1 ${
                  showSelectedOnly
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                <Filter size={10} />
                {showSelectedOnly ? "SHOW ALL" : "SELECTED ONLY"}
              </button>
            </div>

            <div className="relative group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-(--main-web-color) transition-colors"
                size={14}
              />
              <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100/50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold outline-none focus:bg-white focus:border-slate-300 transition-all"
              />
            </div>

            <div className="max-h-44 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
              {filteredStaff.length > 0 ? (
                filteredStaff.map((staff) => {
                  const isSelected = team.includes(staff._id);
                  return (
                    <div
                      key={staff._id}
                      onClick={() => toggleTeamMember(staff._id)}
                      className={`flex items-center justify-between p-3 rounded-2xl border-2 cursor-pointer transition-all active:scale-[0.99] ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-50/50"
                          : "border-slate-50 bg-slate-50/30 hover:border-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-black shadow-sm ${
                            isSelected
                              ? "bg-emerald-500 text-white"
                              : "bg-white text-slate-400 border border-slate-100"
                          }`}
                        >
                          {(staff.fullName || "NA")
                            .substring(0, 2)
                            .toUpperCase()}
                        </div>
                        <Typography
                          className={`text-sm font-bold ${isSelected ? "text-emerald-900" : "text-slate-600"}`}
                        >
                          {staff.fullName}
                        </Typography>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? "bg-emerald-500 border-emerald-500"
                            : "border-slate-300"
                        }`}
                      >
                        {isSelected && (
                          <CheckCircle2 size={12} className="text-white" />
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-10 text-center">
                  <Typography className="text-slate-400 text-xs font-bold italic">
                    {showSelectedOnly
                      ? "No members selected yet."
                      : "No staff matches found."}
                  </Typography>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleTakeTask}
            disabled={loading}
            className="w-full relative group overflow-hidden bg-(--main-web-color) cursor-pointer disabled:bg-slate-300 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-slate-200 transition-all active:scale-[0.98]"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? "PROCESSING..." : "CONFIRM "}
              {!loading && <CheckCircle2 size={16} />}
            </span>
            <div className="absolute inset-0 bg-linear-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskTakenMode;
