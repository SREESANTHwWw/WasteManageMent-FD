import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Leaf, Trophy, Trash2, Zap, ArrowUpRight } from "lucide-react";


import { Typography } from "../../@All/Tags/Tags";
import { useAuth } from "../Context/UserContext/UserContext";
import { formatTime } from "../../functions/FormateDate";
import { useNavigate } from "react-router-dom";
import { capitalizeFirst } from "../../functions/capitalizeFirst";
import api from "../../Api/APi";
import Statcard from "../OverView/StarCard/Startcard";
import ActivityItem from "../OverView/ActivityItem/ActivityItem";

const StaffOverview = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const reports = user?.wastereports || [];


  const [leaderboardStudents, setLeaderboardStudents] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);

  const fetchLeaderboardMeta = async () => {
    try {
      const res = await api.get("/leaderboard");
      if (res?.data?.success) {
        setLeaderboardStudents(res.data.students || []);
        setTotalStudents(res.data.totalStudents ?? (res.data.students?.length || 0));
      }
    } catch (e) {
      console.log("leaderboard meta error:", e);
    }
  };

  useEffect(() => {
   
    if (user?._id) fetchLeaderboardMeta();
  }, [user?._id]);


  const myRankIndex = useMemo(() => {
    if (!user?._id || !leaderboardStudents?.length) return null;
    const idx = leaderboardStudents.findIndex((s) => s._id === user._id);
    return idx === -1 ? null : idx + 1;
  }, [user?._id, leaderboardStudents]);

  const stats = [
    {
      title: "Pending Reports",
      value: user?.wastereports?.length || 0,
      icon: Trash2,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Eco-Points Earned",
      value: user?.rewardPoint || 0,
      icon: Trophy,
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
    {
      title: "Reports Resolved",
      value: user?.wastereports.filter(r => r.status === "RESOLVED").length || 0,
      icon: Leaf,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      title: "Active Reports",
      value: reports.filter((r) => r.status !== "RESOLVED").length,
      icon: Zap,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  ];

  const userdata = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="space-y-8">
    
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex justify-between items-center"
      >
        <Typography className="text-2xl font-bold text-slate-800">
          Hello, {capitalizeFirst(userdata?.fullName || "User")} 👋
        </Typography>

        <button
          onClick={() => navigate("/dashboard/reportwaste")}
          className="bg-emerald-600 text-white cursor-pointer px-6 py-3 rounded-xl font-medium shadow-lg hover:bg-emerald-700 transition-all"
        >
          <Typography>Report New Waste</Typography>
        </button>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((s, i) => (
          <Statcard
            key={i}
            {...s}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 },
            }}
          />
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <Typography className="text-lg font-bold text-slate-800">
              Recent Reports
            </Typography>
            <button
              onClick={() => navigate("/dashboard/myreports")}
              className="text-emerald-600 text-sm cursor-pointer flex items-center  gap-1"
            >
            <Typography>View all </Typography>  
            </button>
          </div>

          {reports?.length ? (
            reports.slice(0, 4).map((r) => (
              <ActivityItem
                key={r._id}
                location={r.wasteLocation}
                time={formatTime(r.createdAt)}
                status={r.status}
              />
            ))
          ) : (
            <Typography className="text-slate-500">No reports yet.</Typography>
          )}
        </div>

      
   
      </div>
    </div>
  );
};

export default StaffOverview;
