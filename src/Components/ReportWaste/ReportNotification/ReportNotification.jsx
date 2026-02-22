import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Typography } from "../../../@All/Tags/Tags";
import { CheckCircle2, Sparkles, ArrowRight } from "lucide-react";

const ReportNotification = ({ showModal, closeModal }) => {
  // Auto-close after 5 seconds
  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(closeModal, 5000);
      return () => clearTimeout(timer);
    }
  }, [showModal, closeModal]);

  return (
    <AnimatePresence>
      {showModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="absolute inset-0"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="relative bg-white rounded-[2.5rem] p-8 md:p-12 max-w-sm w-full text-center shadow-[0_40px_80px_-15px_rgba(0,0,0,0.35)] overflow-hidden"
          >
            {/* Success Particles Decoration */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-emerald-400/30"
                  animate={{
                    y: [-20, 100],
                    x: [0, i % 2 === 0 ? 20 : -20],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.4,
                  }}
                  style={{ left: `${i * 20}%`, top: "-10%" }}
                />
              ))}
            </div>

            {/* Icon Section */}
            <div className="relative w-28 h-28 mx-auto mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                className="absolute inset-0 bg-emerald-50 rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-4 bg-emerald-500/10 rounded-full"
              />
              <motion.div
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="absolute inset-0 flex items-center justify-center text-emerald-500"
              >
                <CheckCircle2 size={64} strokeWidth={2} />
              </motion.div>
            </div>

            {/* Content Section */}
            <div className="space-y-3 mb-10 relative">
              <div className="flex items-center justify-center gap-2 mb-1">
                 <Sparkles size={18} className="text-amber-400 fill-amber-400" />
                 <Typography className="text-xs font-bold text-emerald-600 uppercase tracking-[0.2em]">
                   Mission Accomplished
                 </Typography>
                 <Sparkles size={18} className="text-amber-400 fill-amber-400" />
              </div>

              <Typography className="text-4xl font-black text-slate-900 leading-tight">
                Report Filed <br /> Successfully!
              </Typography>

              <Typography className="text-slate-500 text-base leading-relaxed px-4">
                Verification started. We&apos;ve credited 
                <span className="text-slate-900 font-bold mx-1 inline-flex items-center bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                  +50 Tokens
                </span> 
                to your Eco-Wallet.
              </Typography>
            </div>

            {/* Action Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={closeModal}
              className="group relative w-full py-5 cursor-pointer bg-slate-900 hover:bg-emerald-600 text-white rounded-2xl font-bold transition-all shadow-xl flex items-center justify-center gap-3 overflow-hidden"
            >
              <Typography className="uppercase tracking-widest text-xs font-black">
                Return to Terminal
              </Typography>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              
              {/* Animated Shine Effect */}
              <motion.div 
                animate={{ x: ['-100%', '200%'] }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear", repeatDelay: 1 }}
                className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent skew-x-12"
              />
            </motion.button>

            {/* Auto-close Progress Bar */}
            <div className="absolute bottom-0 left-0 w-full h-1.5 bg-slate-100">
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 5, ease: "linear" }}
                className="h-full bg-emerald-500"
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ReportNotification;