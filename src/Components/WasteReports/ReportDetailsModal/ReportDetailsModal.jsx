import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  X,
  MapPin,
  Calendar,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Layers,
  Brain,
  Image as ImageIcon,
} from "lucide-react";
import { Typography } from "../../../@All/Tags/Tags";

const statusMeta = (status) => {
  switch (status) {
    case "RESOLVED":
      return {
        label: "Resolved",
        chip: "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: <ShieldCheck size={16} className="text-emerald-600" />,
      };
    case "IN_PROGRESS":
      return {
        label: "In Progress",
        chip: "bg-blue-50 text-blue-700 border-blue-200",
        icon: <AlertCircle size={16} className="text-blue-600" />,
      };
    default:
      return {
        label: "Pending",
        chip: "bg-amber-50 text-amber-700 border-amber-200",
        icon: <AlertCircle size={16} className="text-amber-600" />,
      };
  }
};

const fmtDateTime = (date) =>
  date
    ? new Date(date).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

const safeName = (userId) => {
  if (!userId) return "Unknown";
  if (typeof userId === "string") return `User #${userId.slice(-6)}`;
  return userId.fullName || `User #${String(userId._id || "").slice(-6)}`;
};

const clampTopAI = (aiDistribution) => {
  if (!Array.isArray(aiDistribution)) return [];
  return [...aiDistribution]
    .sort((a, b) => (b?.confidence ?? 0) - (a?.confidence ?? 0))
    .slice(0, 6);
};

const Backdrop = ({ children, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3 md:p-6"
    onMouseDown={onClose}
  >
    <div onMouseDown={(e) => e.stopPropagation()} className="w-full">
      {children}
    </div>
  </motion.div>
);

const ReportDetailsModal = ({ isOpen, onClose, report }) => {
  const [activeImg, setActiveImg] = useState(0);

  const images = useMemo(() => (Array.isArray(report?.wasteImage) ? report.wasteImage : []), [report]);
  const proofImages = useMemo(
    () => (Array.isArray(report?.verificationImages) ? report.verificationImages : []),
    [report]
  );

  const meta = statusMeta(report?.status);

  const topAI = useMemo(() => clampTopAI(report?.aiDistribution), [report]);

  useEffect(() => {
    if (isOpen) setActiveImg(0);
  }, [isOpen]);

  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <Backdrop onClose={onClose}>
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="mx-auto max-w-5xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 p-5 border-b border-slate-100">
              <div className="min-w-0 flex flex-col">
                <Typography className="text-lg md:text-xl font-black text-slate-900 truncate">
                  Report Details
                </Typography>
                <Typography className="text-xs font-semibold text-slate-500">
                 {safeName(report?.userId)}
                </Typography>
              </div>

              <button
                onClick={onClose}
                className="inline-flex items-center justify-center cursor-pointer h-10 w-10 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 active:scale-[0.98] transition"
              >
                <X size={18} className="text-slate-600" />
              </button>
            </div>

            {/* Body */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Left: Image Viewer */}
              <div className="p-5 border-b lg:border-b-0 lg:border-r border-slate-100">
                <div className="relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                  {images?.length ? (
                    <img
                      src={images[activeImg]}
                      alt="Waste"
                      className="w-full h-65 md:h-85 object-cover"
                    />
                  ) : (
                    <div className="w-full h-65 md:h-85 flex flex-col items-center justify-center gap-2 text-slate-500">
                      <ImageIcon />
                      <Typography className="text-sm font-bold">No image</Typography>
                    </div>
                  )}

                  {/* Status chip on image */}
                  <div className="absolute top-3 left-3">
                    <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-black ${meta.chip}`}>
                      {meta.icon}
                      {meta.label}
                    </div>
                  </div>

                  {/* AI chip */}
                  {typeof report?.aiConfidence === "number" && (
                    <div className="absolute top-3 right-3">
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-slate-900/75 text-white px-3 py-1 text-[11px] font-black backdrop-blur">
                        <Brain size={14} className="text-emerald-300" />
                        {(report.aiConfidence * 100).toFixed(2)}%
                      </div>
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                {images?.length > 1 && (
                  <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                    {images.map((img, idx) => (
                      <button
                        key={img + idx}
                        onClick={() => setActiveImg(idx)}
                        className={`shrink-0 rounded-xl overflow-hidden cursor-pointer border transition ${
                          activeImg === idx ? "border-emerald-400" : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <img src={img} alt={`thumb-${idx}`} className="h-16 w-20 object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Proof Images */}
                <div className="mt-5">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck size={16} className="text-emerald-600" />
                    <Typography className="text-[12px] font-black uppercase tracking-widest text-slate-500">
                      Verification Proof
                    </Typography>
                  </div>

                  {proofImages.length ? (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {proofImages.map((img, idx) => (
                        <a
                          key={img + idx}
                          href={img}
                          target="_blank"
                          rel="noreferrer"
                          className="shrink-0 rounded-xl overflow-hidden border border-slate-200 hover:border-emerald-300 transition"
                          title="Open proof image"
                        >
                          <img src={img} alt={`proof-${idx}`} className="h-16 w-20 object-cover" />
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <Typography className="text-sm font-bold text-slate-600">
                        No verification images uploaded yet.
                      </Typography>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Details */}
              <div className="p-5">
                {/* Top chips */}
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-slate-600">
                    <Layers size={14} className="text-slate-400" />
                    {report?.wasteCategory || "OTHERS"}
                  </span>

                  {report?.wasteQty && (
                    <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-black uppercase tracking-widest text-slate-600">
                      Qty: {report.wasteQty}
                    </span>
                  )}
                </div>

                {/* Description */}
                <div className="mt-4 flex flex-col">
                  <Typography className="text-[12px] font-black uppercase tracking-widest text-slate-400">
                    Description
                  </Typography>
                  <Typography className="mt-1 text-sm font-bold text-slate-800 leading-relaxed">
                    {report?.description || "No description provided."}
                  </Typography>
                </div>

                {/* Location */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin size={16} className="text-slate-400" />
                      <Typography className="text-[12px] font-black uppercase tracking-widest text-slate-500">
                        Location
                      </Typography>
                    </div>
                    <Typography className="text-sm font-extrabold text-slate-800">
                      {report?.wasteLocation || "-"}
                    </Typography>
                    {report?.wasteLocation === "OTHERS" && report?.landmark && report.landmark !== "undefined" && (
                      <Typography className="text-xs font-semibold text-slate-500 mt-1">
                        Landmark: {report.landmark}
                      </Typography>
                    )}
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar size={16} className="text-slate-400" />
                      <Typography className="text-[12px] font-black uppercase tracking-widest text-slate-500">
                        Timeline
                      </Typography>
                    </div>
                    <div className="flex flex-col gap-2">
                            <Typography className="text-xs font-semibold text-slate-600">
                      Reported: <span className="text-slate-900 font-extrabold">{fmtDateTime(report?.createdAt)}</span>
                    </Typography>
                    <Typography className="text-xs font-semibold text-slate-600 mt-1">
                      Updated: <span className="text-slate-900 font-extrabold">{fmtDateTime(report?.updatedAt)}</span>
                    </Typography>
                    {report?.resolvedAt && (
                      <Typography className="text-xs font-semibold text-slate-600 mt-1">
                        Resolved: <span className="text-slate-900 font-extrabold">{fmtDateTime(report?.resolvedAt)}</span>
                      </Typography>
                    )}

                    </div>
                
                  </div>
                </div>

                {/* People */}
                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <Typography className="text-[12px] font-black uppercase tracking-widest text-slate-500">
                    People
                  </Typography>

                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="rounded-xl bg-white border flex flex-col border-slate-200 p-3">
                      <Typography className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Reported By
                      </Typography>
                      <Typography className="text-sm font-extrabold text-slate-800">
                        {safeName(report?.userId)}
                      </Typography>
                      {report?.userModel && (
                        <Typography className="text-[11px] font-bold text-slate-500">
                          Model: {report.userModel}
                        </Typography>
                      )}
                    </div>

                    <div className="rounded-xl bg-white border flex flex-col border-slate-200 p-3">
                      <Typography className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Resolved By
                      </Typography>
                      <Typography className="text-sm font-extrabold text-slate-800">
                        {safeName(report?.resolvedBy)}
                      </Typography>
                    </div>
                  </div>
                </div>

                {/* AI Section */}
                <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Brain size={16} className="text-emerald-600" />
                      <Typography className="text-[12px] font-black uppercase tracking-widest text-slate-500">
                        AI Analysis
                      </Typography>
                    </div>
                    {typeof report?.aiConfidence === "number" && (
                      <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-black text-emerald-700">
                        {(report.aiConfidence * 100).toFixed(2)}% confidence
                      </span>
                    )}
                  </div>

                  {topAI.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {topAI.map((item, idx) => (
                        <span
                          key={(item?.label || "ai") + idx}
                          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-extrabold text-slate-700"
                        >
                          {item?.label || "unknown"}
                          <span className="text-slate-400 font-black">
                            {(Number(item?.confidence || 0) * 100).toFixed(1)}%
                          </span>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-3 rounded-2xl bg-slate-50 border border-slate-200 p-4">
                      <Typography className="text-sm font-bold text-slate-600">
                        No AI distribution available.
                      </Typography>
                    </div>
                  )}
                </div>

                {/* Footer buttons */}
                <div className="mt-5 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={onClose}
                    className="w-full inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-[11px] font-black uppercase tracking-widest text-slate-700 hover:bg-slate-50 active:scale-[0.98] transition"
                  >
                 <Typography> Close</Typography>  
                  </button>

                  {report?.wasteImage?.[activeImg] && (
                    <a
                      href={report.wasteImage[activeImg]}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-(--main-web-color) text-white px-4 py-3 text-[11px] font-black uppercase tracking-widest hover:bg-slate-800 active:scale-[0.98] transition"
                    >
                     <Typography>Open Image</Typography> 
                      <ArrowRight size={16} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </Backdrop>
      )}
    </AnimatePresence>
  );
};

export default ReportDetailsModal;