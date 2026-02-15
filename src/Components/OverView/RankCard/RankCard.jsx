import { motion } from "framer-motion";
import { Typography } from "../../../@All/Tags/Tags";

// ✅ Rank system + thresholds
const RANKS = [
  { name: "Eco Starter", min: 0, max: 499 },
  { name: "Green Contributor", min: 500, max: 1499 },
  { name: "Eco Champion", min: 1500, max: 2999 },
  { name: "Sustainability Leader", min: 3000, max: 5999 },
  { name: "Campus Guardian", min: 6000, max: Infinity },
];

const getRankInfo = (points = 0) => {
  const current =
    RANKS.find((r) => points >= r.min && points <= r.max) || RANKS[0];

  const currentIndex = RANKS.findIndex((r) => r.name === current.name);
  const next = currentIndex < RANKS.length - 1 ? RANKS[currentIndex + 1] : null;

  const pointsNeeded = next ? Math.max(0, next.min - points) : 0;

  // progress within current level range
  const range = current.max === Infinity ? 1000 : current.max - current.min + 1;
  const progressRaw =
    current.max === Infinity ? 100 : ((points - current.min) / range) * 100;

  const progress = Math.min(100, Math.max(0, progressRaw));

  return { current, next, pointsNeeded, progress };
};

const RankCard = ({ rank, totalStudents, rewardPoint = 0, onViewLeaderboard }) => {
  const { current, next, pointsNeeded, progress } = getRankInfo(rewardPoint);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-linear-to-br from-emerald-600 to-teal-700 p-6 rounded-2xl shadow-xl text-white relative overflow-hidden"
    >
      <div className="relative z-10">
        <Typography className="text-lg font-bold mb-2">Campus Rank</Typography>

        <div className="flex items-baseline gap-2 mb-1">
          <Typography className="text-4xl font-black">#{rank}</Typography>
          <Typography className="text-emerald-200">
            / {totalStudents} Students
          </Typography>
        </div>

        {/* ✅ Current Rank Title */}
        <Typography className="text-sm text-emerald-100 mb-4">
          Current Level: <span className="font-black text-white">{current.name}</span>
        </Typography>

        {/* ✅ Next rank message */}
        {next ? (
          <Typography className="text-sm text-emerald-100 mb-6">
            You're only{" "}
            <span className="font-black text-white">{pointsNeeded}</span>{" "}
            points away from reaching{" "}
            <span className="font-black text-white">"{next.name}"</span>!
          </Typography>
        ) : (
          <Typography className="text-sm text-emerald-100 mb-6">
            You reached the highest level 🎉{" "}
            <span className="font-black text-white">"{current.name}"</span>
          </Typography>
        )}

        {/* ✅ Progress Bar */}
        <div className="w-full bg-white/20 h-2 rounded-full mb-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, delay: 0.8 }}
            className="bg-white h-full rounded-full"
          />
        </div>

      
        <Typography className="text-xs text-emerald-100 mb-4">
          Total Points: <span className="font-black text-white">{rewardPoint}</span>
        </Typography>

        <button
          onClick={onViewLeaderboard}
          className="w-full py-3 bg-white text-emerald-700 rounded-xl font-bold text-sm shadow-md hover:bg-emerald-50 transition-colors"
        >
          <Typography>View Leaderboard</Typography>
        </button>
      </div>

      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
    </motion.div>
  );
};

export default RankCard;
