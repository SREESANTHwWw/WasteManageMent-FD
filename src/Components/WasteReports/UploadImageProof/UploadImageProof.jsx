import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, CheckCircle2, X, ShieldCheck, Zap, Info, Loader2 } from 'lucide-react';
import { Typography } from '../../../@All/Tags/Tags';
import { capitalizeFirst } from '../../../functions/capitalizeFirst';

const StaffCleanupModal = ({ 
  isOpen, onClose, imageFiles, imagePreviews, 
  handleImageUpload, removeImage, areaName, taskType, onSubmit, isSubmitting 
}) => {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose} 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-100">
              <ShieldCheck size={24} />
            </div>
            <div className='flex flex-col'>
              <Typography className="text-xl font-black text-slate-900 leading-none">Task Verified</Typography>
              <Typography className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest">Submit Cleanup Proof</Typography>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="bg-slate-50 rounded-2xl p-4 flex gap-3 border border-slate-100">
            <Info size={18} className="text-emerald-600 shrink-0" />
            <Typography className="text-xs text-slate-600 leading-relaxed">
              Upload clear photos of the cleared area. AI will verify these against the reported complaint to close the ticket.
            </Typography>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {imagePreviews.map((src, idx) => (
                <motion.div 
                  key={src} 
                  layout 
                  initial={{ opacity: 0, scale: 0.8 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  className="relative aspect-square rounded-3xl overflow-hidden border-2 border-white shadow-sm group"
                >
                  <img src={src} className="w-full h-full object-cover" alt="Proof" />
                  <button 
                    onClick={() => removeImage(idx)} 
                    className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <X size={14} strokeWidth={3} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {imageFiles.length < 4 && (
              <label className="aspect-square rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-50 hover:border-emerald-300 transition-all group">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Camera size={24} className="text-slate-400 group-hover:text-emerald-500" />
                </div>
                <Typography className="text-[10px] font-black text-slate-400 uppercase mt-3 tracking-tighter">Capture Photo</Typography>
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 bg-slate-50 border-t border-slate-100">
          <div className="flex justify-between items-center mb-6">
             <div className='flex flex-col'>
                <Typography className="text-[10px] font-black text-slate-400 uppercase mb-1">Location Context</Typography>
                <Typography className="text-sm font-bold text-slate-700">{areaName}</Typography>
             </div>
             <div className="text-right flex flex-col">
                <Typography className="text-[10px] font-black text-slate-400 uppercase mb-1">Reported By</Typography>
                <Typography className="text-sm font-bold text-emerald-600">{capitalizeFirst( taskType)}</Typography>
             </div>
          </div>

          <button
            onClick={onSubmit}
            disabled={imageFiles.length === 0 || isSubmitting}
            className={`w-full py-5 rounded-2xl font-black uppercase cursor-pointer text-xs tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${
              imageFiles.length > 0 && !isSubmitting
              ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-200 hover:bg-emerald-700 active:scale-[0.98]' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                <Zap size={16} className="fill-current" />
                Complete & Resolve Task
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default StaffCleanupModal;