import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Typography } from "../../@All/Tags/Tags";
import api from "../../Api/APi";
import { useAuth } from "../Context/UserContext/UserContext";

const CampusRank = () => {
  const { user } = useAuth(); // logged-in user
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const getRank = (points) => {
    if (points >= 6000) return "Campus Guardian";
    if (points >= 3000) return "Sustainability Leader";
    if (points >= 1500) return "Eco Champion";
    if (points >= 500) return "Green Contributor";
    return "Eco Starter";
  };

  const fetchLeaderboard = async () => {
    try {
      const res = await api.get("/leaderboard");

      if (res.data.success) {
        setStudents(res.data.students);
      }
    } catch (error) {
      console.error("Leaderboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Typography>Loading leaderboard...</Typography>
      </div>
    );
  }

  // Merge current user into list if not in top 10
  let allUsers = [...students];

  if (user && !students.find((u) => u._id === user._id)) {
    allUsers.push(user);
  }

  const sortedData = allUsers.sort((a, b) => b.rewardPoint - a.rewardPoint);

  const topThree = sortedData.slice(0, 3);
  const others = sortedData.filter(
    (u) => !topThree.find((t) => t._id === u._id)
  );

  const myRankIndex =
    user ? sortedData.findIndex((u) => u._id === user._id) + 1 : null;

  const podiumOrder = [topThree[1], topThree[0], topThree[2]].filter(Boolean);

  const getPodiumHeight = (idx) =>
    idx === 1 ? "h-32" : idx === 0 ? "h-24" : "h-16";

  const getPodiumColor = (idx) =>
    idx === 1 ? "bg-emerald-600" : idx === 0 ? "bg-emerald-500" : "bg-emerald-400";

  const getBadgeColor = (idx) =>
    idx === 1
      ? "bg-amber-400 scale-110"
      : idx === 0
      ? "bg-slate-300"
      : "bg-orange-400";

  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-50 min-h-screen pb-32">
      {/* Header */}
      <div className="text-center mb-10 flex flex-col">
        <Typography className="text-3xl font-black text-slate-800 tracking-tight">
          Campus Eco-Champions
        </Typography>
        <Typography className="text-slate-500 font-medium">
          Top contributors to a green campus
        </Typography>
      </div>

      {/* Podium */}
      <div className="flex justify-center items-end gap-4 mb-16 h-64">
        {podiumOrder.map((student, index) => {
          const pos =
            sortedData.findIndex((u) => u._id === student._id) + 1;

          const isMe = user?._id === student._id;

          return (
            <motion.div
              key={student._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col items-center flex-1 ${
                pos === 1 ? "z-10" : "z-0"
              }`}
            >
              <div className="relative group">
                <div
                  className={`absolute -inset-1 rounded-full blur opacity-25 ${
                    pos === 1 ? "bg-emerald-400" : "bg-slate-400"
                  }`}
                />
                <img
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${student.fullName}`}
                  className={`${
                    pos === 1
                      ? "w-24 h-24 border-4 border-emerald-500"
                      : "w-20 h-20 border-4 border-white"
                  } rounded-full relative bg-white object-cover ${
                    isMe ? "ring-4 ring-blue-400" : ""
                  }`}
                  alt=""
                />
                <div
                  className={`absolute -top-3 -right-3 w-10 h-10 rounded-full flex items-center justify-center font-black text-white shadow-lg ${getBadgeColor(
                    index
                  )}`}
                >
                  #{pos}
                </div>
              </div>

              <Typography className="mt-6 font-bold text-sm">
                {isMe ? "You" : student.fullName}
              </Typography>

              <Typography className="text-emerald-600 font-black text-xs">
                {student.rewardPoint?.toLocaleString()} Pts
              </Typography>

              <div
                className={`w-full mt-4 rounded-t-2xl shadow-inner ${getPodiumHeight(
                  index
                )} ${getPodiumColor(index)}`}
              />
            </motion.div>
          );
        })}
      </div>
      {/* Top 10 List */}
<div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-10">
  <div className="p-6 border-b border-slate-100 bg-slate-50">
    <Typography className="font-black text-slate-800">
      Top Contributors
    </Typography>
  </div>

  <div className="divide-y divide-slate-100">
    {others.slice(0, 7).map((student, index) => {
      const rank =
        sortedData.findIndex((u) => u._id === student._id) + 1;

      const isMe = user?._id === student._id;

      return (
        <div
          key={student._id}
          className={`flex items-center justify-between p-4 transition ${
            isMe
              ? "bg-blue-50"
              : "hover:bg-emerald-50"
          }`}
        >
          <div className="flex items-center gap-4">
            <Typography className="w-8 font-bold text-slate-400">
              #{rank}
            </Typography>

            <img
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${student.fullName}`}
              className="w-10 h-10 rounded-xl"
              alt=""
            />

            <div className="flex flex-col">
              <Typography className="font-semibold">
                {isMe ? "You" : student.fullName}
              </Typography>
              <Typography className="text-xs text-emerald-600 font-bold uppercase">
                {getRank(student.rewardPoint)}
              </Typography>
            </div>
          </div>

          <Typography className="text-emerald-600 font-bold">
            {student.rewardPoint?.toLocaleString()} Pts
          </Typography>
        </div>
      );
    })}
  </div>
</div>


      {/* Persistent My Rank Card */}
      {user && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-6 left-2/3 -translate-x-1/2 w-[calc(100%-3rem)] max-w-2xl"
        >
          <div className="bg-(--main-web-color) rounded-3xl p-4 shadow-2xl border border-(--main-web-color) flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <div className="bg-emerald-500 h-12 w-12 rounded-2xl flex items-center justify-center font-black text-xl">
                #{myRankIndex}
              </div>
              <div className="flex flex-col">
                <Typography className="text-[10px] text-slate-300 font-black uppercase tracking-widest">
                  Your Standing
                </Typography>
                <Typography className="font-bold">
                  {getRank(user.rewardPoint)}
                </Typography>
              </div>
            </div>

            <div className="text-right">
              <Typography className=" font-black text-lg">
                {user.rewardPoint?.toLocaleString()} Pts
              </Typography>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CampusRank;
