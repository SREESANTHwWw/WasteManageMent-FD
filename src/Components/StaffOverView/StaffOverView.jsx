import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Zap,
  Clock,
  CheckCircle2,
  MapPin,
  ChevronRight,
  Power,
  ShieldCheck,
  Calendar,
  Briefcase,
} from "lucide-react";

import { Typography } from "../../@All/Tags/Tags";
import { useAuth } from "../Context/UserContext/UserContext";
import { capitalizeFirst } from "../../functions/capitalizeFirst";
import api from "../../Api/APi";
import StatBox from "./StatBox/StatBox";
import RecentrepStaff from "./RecentActivity/RecentrepStaff";
import { useNavigate } from "react-router-dom";


const StaffOverView = () => {
 const { user, refreshUser } = useAuth();
 const navigate =useNavigate()
  const [reports ,setReports] = useState([])
  const [status, setStatus] = useState("OFFLINE");
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [loading, setLoading] = useState(false);

 
  useEffect(() => {
    if (user?.status) setStatus(user.status);
  }, [user]);


const [statusSummary, setStatusSummary] = useState({
  PENDING: 0,
  IN_PROGRESS: 0,
  RESOLVED: 0,
});


const fetchReports = async () => {
  setLoading(true);
  try {
    const res = await api.get("/getAll/reports");
    setReports(res.data.reports || []);
    setStatusSummary(res.data.statusSummary || { PENDING: 0, IN_PROGRESS: 0, RESOLVED: 0 });
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchReports();
  }, [user]);

 
const statsData = useMemo(() => {
  const pendingCount = statusSummary.PENDING || 0;
  const inProgressCount = statusSummary.IN_PROGRESS || 0;
  const resolvedCount = statusSummary.RESOLVED || 0;

  return [
    {
      label: "Resolved Reports",
      value: String(resolvedCount).padStart(2, "0"),
      icon: <CheckCircle2 size={20} />,
      color: "text-emerald-500",
    },
    {
      label: "In Progress",
      value: String(inProgressCount).padStart(2, "0"),
      icon: <Clock size={20} />,
      color: "text-blue-500",
    },
    {
      label: "Pending Reports",
      value: String(pendingCount).padStart(2, "0"),
      icon: <Clock size={20} />,
      color: "text-amber-500",
    },
  ];
}, [statusSummary]);
  


  const isOnline = status === "ONLINE";
  const isInWork = status === "IN_WORK";

  const initials = useMemo(() => {
    const name = user?.fullName?.trim() || "ST";
    const parts = name.split(" ").filter(Boolean);
    const first = parts[0]?.[0] || "S";
    const second = parts[1]?.[0] || parts[0]?.[1] || "T";
    return (first + second).toUpperCase();
  }, [user?.fullName]);

  const statusMeta = useMemo(() => {
    switch (status) {
      case "ONLINE":
        return { dot: "bg-emerald-500", label: "Online", pill: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: <Power size={16} /> };
      case "IN_WORK":
        return { dot: "bg-amber-500", label: "In Work", pill: "bg-amber-50 text-amber-700 border-amber-200", icon: <Briefcase size={16} /> };
      default:
        return { dot: "bg-slate-300", label: "Offline", pill: "bg-slate-50 text-slate-500 border-slate-200", icon: <Power size={16} /> };
    }
  }, [status]);


const handleOnlineToggle = async () => {
  try {
    if (loadingStatus) return;
    if (status === "IN_WORK") return;

    setLoadingStatus(true);

    const newStatus = status === "ONLINE" ? "OFFLINE" : "ONLINE";

    // optimistic UI
    setStatus(newStatus);

    await api.patch("/staff/status", { status: newStatus });

    // ✅ sync global user (so navigation won't reset)
    await refreshUser(); 
  } catch (err) {
    console.log(err);
    // rollback if needed
    fetchMyStatus();
  } finally {
    setLoadingStatus(false);
  }
};

  


  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-4">
      <div className="max-w-6xl mx-auto space-y-5">
        {/* --- HEADER --- */}
        <header className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6 text-center md:text-left flex-col md:flex-row">
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl bg-(--main-web-color) flex items-center justify-center text-white text-2xl font-black shadow-lg">
                {initials}
              </div>

              <motion.div
                animate={{ scale: isOnline ? [1, 1.2, 1] : 1 }}
                transition={{ repeat: isOnline ? Infinity : 0, duration: 2 }}
                className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white ${statusMeta.dot}`}
              />
            </div>

            <div>
              <Typography className="text-3xl font-black text-slate-900 tracking-tight">
                Welcome back, {capitalizeFirst(user?.fullName || "Staff")}
              </Typography>

              <div className="flex items-center gap-2 text-slate-400 mt-1 justify-center md:justify-start">
                <ShieldCheck size={16} className="text-emerald-500" />
                <Typography className="text-xs font-bold uppercase tracking-widest">
                  Field Supervisor • ID #{user?.staffID || "----"}
                </Typography>

                <span className={`ml-2 px-3 py-1 rounded-xl border text-[10px] font-black uppercase ${statusMeta.pill}`}>
                  {statusMeta.label}
                </span>
              </div>
            </div>
          </div>

          {/* STATUS BUTTON */}
          <button
            onClick={handleOnlineToggle}
            disabled={loadingStatus || isInWork}
            className={`group relative flex items-center gap-4 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
              isOnline
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200"
                : "bg-white text-slate-400 border-2 border-slate-100 hover:border-slate-200"
            }`}
            title={isInWork ? "You are IN_WORK. Finish the current task to change status." : ""}
          >
            {status === "IN_WORK" ? <Briefcase size={18} /> : <Power size={18} className={isOnline ? "animate-pulse" : ""} />}

            {loadingStatus
              ? "Updating..."
              : status === "IN_WORK"
              ? "You are In Work"
              : isOnline
              ? "You are Online"
              : "Set Go Online"}

            {/* Offline ping indicator */}
            {!isOnline && status !== "IN_WORK" && !loadingStatus && (
              <span className="absolute -top-2 -right-2 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500"></span>
              </span>
            )}
          </button>
        </header>

    
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {statsData.map((stat, index) => (
    <StatBox 
      key={index}
      label={stat.label} 
      value={stat.value} 
      icon={stat.icon} 
      color={stat.color} 
    />
  ))}
</div>

        {/* --- RECENT ACTIVITY --- */}
       <RecentrepStaff 
        title="Recent Assignments"
        subtitle="Updates on waste reports in your sector."
        reports={reports} // This now uses the data from setReports(res.data.reports)
        onViewAll={() => navigate("/dashboard/wastereports")}
      />
      </div>
    </div>
  );
};






export default StaffOverView;