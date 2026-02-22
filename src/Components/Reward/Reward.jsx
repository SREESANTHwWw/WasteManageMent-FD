import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Award,
  Download,
  Star,
  ShieldCheck,
  FileCheck,
} from "lucide-react";
import { useAuth } from "../Context/UserContext/UserContext";
import { Typography } from "../../@All/Tags/Tags";

const RewardGate = () => {
  const { user } = useAuth();
  const userPoints = user?.rewardPoint || 0;
  const THRESHOLD = 5000;
  const isUnlocked = userPoints >= THRESHOLD;
  const progressPercent = Math.min((userPoints / THRESHOLD) * 100, 100);

  return (
    <div className="flex w-full justify-center items-center min-h-full p-6">
      <AnimatePresence mode="wait">
        {isUnlocked ? (
          /* --- UNLOCKED STATE: MAX WIDTH 7XL --- */
          <motion.div
            key="unlocked"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="relative w-full max-w-7xl bg-white border-16 border-double border-slate-100 p-1 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] rounded-[3rem] overflow-hidden"
          >
            {/* Background Flair */}
            <div className="absolute top-0 left-0 w-full h-3 bg-linear-to-r from-yellow-500 via-amber-200 to-yellow-500" />
            
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              {/* Left Column: Visual Iconography */}
              <div className="lg:col-span-4 flex justify-center">
                <motion.div
                  initial={{ rotate: -10, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-yellow-400 blur-[60px] opacity-20 animate-pulse" />
                  <div className="relative bg-linear-to-br from-yellow-400 to-amber-600 p-12 rounded-4xl shadow-2xl rotate-3">
                    <Award size={120} className="text-white" />
                  </div>
                </motion.div>
              </div>

              {/* Right Column: Content */}
              <div className="lg:col-span-8 text-left space-y-6">
                <div className="space-y-2">
                  <Typography className="text-sm font-bold tracking-[0.3em] text-amber-600 uppercase">
                    Official Recognition
                  </Typography>
                  <Typography className="text-6xl font-black text-slate-900 leading-none">
                    CERTIFICATE OF <br/> ACHIEVEMENT
                  </Typography>
                </div>

                <Typography className="text-xl text-slate-500 font-serif italic">
                  This prestigious award is presented to
                </Typography>

                <div className="py-4">
                  <Typography className="text-7xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-slate-900 to-slate-600">
                    {user?.displayName || "Elite Member"}
                  </Typography>
                  <div className="h-1 w-full max-w-md bg-linear-to-r from-amber-400 to-transparent mt-4" />
                </div>

                <Typography className="max-w-2xl text-lg text-slate-600 leading-relaxed">
                  For outstanding performance and achieving the elite milestone of 
                  <span className="font-bold text-slate-900 mx-2 inline-flex items-center gap-1">
                    <Star size={18} className="text-amber-500 fill-amber-500" />
                    {THRESHOLD.toLocaleString()} Points
                  </span> 
                  on our platform.
                </Typography>

                <div className="flex gap-4 pt-6">
                  <motion.button
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-3 bg-slate-900 text-white px-12 py-6 rounded-2xl font-bold text-xl shadow-xl hover:bg-black transition-all"
                  >
                    <Download size={24} />
                    Download PDF
                  </motion.button>
                  <button className="flex items-center gap-2 text-slate-500 px-8 py-6 rounded-2xl font-semibold hover:bg-slate-50 transition-colors">
                    <FileCheck size={24} />
                    Verify ID: #CERT-{Math.floor(Math.random() * 100000)}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* --- LOCKED STATE: MAX WIDTH 4XL --- */
          <motion.div
            key="locked"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl bg-white border border-slate-200 p-16 rounded-[3rem] shadow-2xl text-center"
          >
            <div className="relative mb-10 inline-block">
              <div className="bg-slate-50 p-10 rounded-full shadow-inner border border-slate-100">
                <Lock size={72} className="text-slate-300" />
              </div>
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
                className="absolute -top-2 -right-2 bg-(--main-web-color) text-white p-4 rounded-2xl shadow-xl"
              >
                <ShieldCheck size={32} />
              </motion.div>
            </div>

            <div className="max-w-2xl mx-auto mb-12 flex flex-col">
              <Typography className="text-4xl font-bold text-slate-800 mb-4">
                Exclusive Reward Awaits
              </Typography>
              <Typography className="text-slate-500 text-lg leading-relaxed">
                You are currently on the "Mastery Path." Gain full certification and exclusive benefits by reaching our 5,000-point threshold.
              </Typography>
            </div>

            {/* Large Progress Bar Section */}
            <div className="space-y-6">
              <div className="flex justify-between items-end px-2">
                <div className="text-left flex flex-col">
                  <Typography className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                    Current Progress
                  </Typography>
                  <Typography className="text-5xl font-black text-(--text)">
                    {userPoints.toLocaleString()} <span className="text-lg font-normal text-slate-400 italic">pts</span>
                  </Typography>
                </div>
                <div className="text-right flex flex-col">
                  <Typography className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                    Milestone
                  </Typography>
                  <Typography className="text-2xl font-bold text-slate-800">
                    5,000
                  </Typography>
                </div>
              </div>

              <div className="h-10 bg-slate-100 rounded-2xl overflow-hidden shadow-inner p-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 2, ease: "anticipate" }}
                  className="h-full bg-linear-to-r from-(--main-web-color) via-(--eco-accent) to-(--main-web-color) rounded-xl relative"
                >
                  <div className="absolute inset-0 bg-white/30 w-full animate-[shimmer_2s_infinite] skew-x-12" />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="inline-flex items-center gap-3 text-(--text) bg-(--main-web-color)/5 py-4 px-10 rounded-2xl font-bold border border-(--main-web-color)/10"
              >
                <Star size={24} className="text-amber-500 fill-amber-500" />
                Just {(THRESHOLD - userPoints).toLocaleString()} points remaining!
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RewardGate;