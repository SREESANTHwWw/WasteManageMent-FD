import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, MapPin, ShieldCheck, AlertCircle, Layers, Brain,
  Image as ImageIcon, User, Clock, ExternalLink,
  Leaf, Upload, CheckCircle2, Loader2, Star,
} from "lucide-react";
import { Typography } from "../../../@All/Tags/Tags";
import { useAuth } from "../../Context/UserContext/UserContext";
import toast from "react-hot-toast";
import api from "../../../Api/APi";

/* ─── Status styles ──────────────────────────────────────────────── */
const statusMeta = (status) => {
  const styles = {
    RESOLVED:    { label: "Resolved",    chip: "bg-emerald-50 text-emerald-700 border-emerald-100", icon: <ShieldCheck size={14} />, dot: "bg-emerald-500" },
    IN_PROGRESS: { label: "In Progress", chip: "bg-indigo-50 text-indigo-700 border-indigo-100",    icon: <Clock size={14} />,       dot: "bg-indigo-500 animate-pulse" },
    REJECTED:    { label: "Rejected",    chip: "bg-red-50 text-red-700 border-red-100",             icon: <X size={14} />,           dot: "bg-red-500"   },
    default:     { label: "Pending",     chip: "bg-amber-50 text-amber-700 border-amber-100",       icon: <AlertCircle size={14} />, dot: "bg-amber-500 animate-pulse" },
  };
  return styles[status] || styles.default;
};

/* ─── Proof Upload Modal ─────────────────────────────────────────── */
const ProofUploadModal = ({ report, onClose, onCompleted }) => {
  const [files, setFiles]         = useState([]);
  const [previews, setPreviews]   = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef();

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files);
    if (files.length + selected.length > 4) {
      toast.error("Maximum 4 proof images");
      return;
    }
    setFiles((p) => [...p, ...selected]);
    setPreviews((p) => [...p, ...selected.map((f) => URL.createObjectURL(f))]);
  };

  const removeFile = (i) => {
    URL.revokeObjectURL(previews[i]);
    setFiles((p) => p.filter((_, idx) => idx !== i));
    setPreviews((p) => p.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      toast.error("Upload at least one proof image");
      return;
    }
    try {
      setSubmitting(true);
      const fd = new FormData();
      files.forEach((f) => fd.append("verificationImages", f));
      const res = await api.patch(`/self-clean/complete/${report._id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(res.data.msg || "Cleaning verified! +100 points 🌿");
      onCompleted(res.data.report);
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.msg || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <motion.div initial={{ scale: 0.92, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl border border-slate-100 space-y-5"
      >
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center">
            <Upload size={20} className="text-emerald-600" />
          </div>
          <div>
            <h3 className="font-black text-slate-800">Upload Proof</h3>
            <p className="text-[11px] text-slate-400 font-medium">Max 4 images of the cleaned area</p>
          </div>
        </div>

        {/* Drop zone */}
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-2xl p-6 text-center cursor-pointer transition-all group"
        >
          <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
          <Upload size={24} className="text-slate-300 group-hover:text-emerald-500 mx-auto mb-2 transition-colors" />
          <p className="text-sm font-bold text-slate-400 group-hover:text-emerald-600 transition-colors">
            Click to select images
          </p>
          <p className="text-[10px] text-slate-300 mt-1">{files.length}/4 selected</p>
        </div>

        {/* Previews */}
        {previews.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {previews.map((src, i) => (
              <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-100 group">
                <img src={src} alt={`proof-${i}`} className="w-full h-full object-cover" />
                <button onClick={() => removeFile(i)}
                  className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Reward notice */}
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3">
          <Star size={14} className="text-amber-500 shrink-0" />
          <p className="text-[11px] font-black text-amber-700">You'll earn +100 reward points on submission</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={onClose} disabled={submitting}
            className="flex-1 py-3 rounded-2xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 disabled:opacity-50 transition-all">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={submitting || files.length === 0}
            className="flex-1 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
            {submitting ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
            {submitting ? "Submitting..." : "Submit Proof"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ─── Main Modal ─────────────────────────────────────────────────── */
const ReportDetailsModal = ({ isOpen, onClose, report: initialReport, onCancelReport, onReportUpdated }) => {
  const [activeImg, setActiveImg]       = useState(0);
  const [report, setReport]             = useState(initialReport);
  const [starting, setStarting]         = useState(false);
  const [showProofModal, setShowProofModal] = useState(false);

  const { user } = useAuth();

  // Sync when prop changes
  useEffect(() => { setReport(initialReport); }, [initialReport]);
  useEffect(() => { if (isOpen) setActiveImg(0); }, [isOpen]);

  const images      = useMemo(() => Array.isArray(report?.wasteImage) ? report.wasteImage : [], [report]);
  const proofImages = useMemo(() => Array.isArray(report?.verificationImages) ? report.verificationImages : [], [report]);
  const topAI       = useMemo(() => {
    if (!report?.aiDistribution) return [];
    return [...report.aiDistribution].sort((a, b) => (b?.confidence ?? 0) - (a?.confidence ?? 0)).slice(0, 4);
  }, [report]);

  const meta = statusMeta(report?.status);

  // Is the current user the one who started self-cleaning?
  const isMyClean = report?.selfCleanedBy?.toString() === user?.id?.toString() ||
                    report?.selfCleanedBy?._id?.toString() === user?.id?.toString();

  const isSelfCleanActive = report?.status === "IN_PROGRESS" && report?.selfCleanedBy;
  const canStartClean     = !["RESOLVED", "REJECTED"].includes(report?.status) && !isSelfCleanActive;
  const canUploadProof    = isSelfCleanActive && isMyClean;

  /* ── Step 1: Start self-cleaning ── */
  const handleStartClean = async () => {
    try {
      setStarting(true);
      const res = await api.patch(`/self-clean/start/${report._id}`);
      toast.success("Self-cleaning started! Upload proof when done.");
      setReport(res.data.report);
      onReportUpdated?.(res.data.report);
    } catch (err) {
      toast.error(err?.response?.data?.msg || "Could not start cleaning");
    } finally {
      setStarting(false);
    }
  };

  /* ── Step 2: Proof uploaded and completed ── */
  const handleCompleted = (updatedReport) => {
    setReport(updatedReport);
    onReportUpdated?.(updatedReport);
  };

  return (
    <>
      <AnimatePresence>
        {showProofModal && (
          <ProofUploadModal
            report={report}
            onClose={() => setShowProofModal(false)}
            onCompleted={handleCompleted}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-4">
                  <div className={`h-3 w-3 rounded-full ${meta.dot}`} />
                  <div>
                    <Typography className="text-xl font-bold text-slate-900 leading-tight">Report Review</Typography>
                    <Typography className="text-xs font-medium text-slate-400 uppercase tracking-tighter">
                      ID: {report?._id?.slice(-8) || "N/A"}
                    </Typography>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                  <X size={24} />
                </button>
              </div>

              <div className="overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12">
                  {/* Left: Images */}
                  <div className="lg:col-span-5 p-6 bg-slate-50/50">
                    <div className="relative group aspect-square rounded-3xl overflow-hidden shadow-sm border border-slate-200 bg-white">
                      {images[activeImg] ? (
                        <img src={images[activeImg]} alt="Waste" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                          <ImageIcon size={48} strokeWidth={1} />
                          <Typography className="text-sm font-medium mt-2">No Visual Data</Typography>
                        </div>
                      )}
                      <div className={`absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-bold shadow-sm ${meta.chip}`}>
                        {meta.icon} {meta.label}
                      </div>
                      {images[activeImg] && (
                        <a href={images[activeImg]} target="_blank" rel="noreferrer"
                          className="absolute bottom-4 right-4 p-2 bg-white/90 backdrop-blur hover:bg-white rounded-xl shadow-lg transition-transform active:scale-95 text-slate-600">
                          <ExternalLink size={18} />
                        </a>
                      )}
                    </div>

                    {images.length > 1 && (
                      <div className="flex gap-3 mt-4 overflow-x-auto pb-2 px-1">
                        {images.map((img, i) => (
                          <button key={i} onClick={() => setActiveImg(i)}
                            className={`relative min-w-[70px] h-[70px] rounded-2xl overflow-hidden border-2 transition-all ${activeImg === i ? "border-indigo-500 scale-105 shadow-md" : "border-transparent opacity-60"}`}>
                            <img src={img} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Proof images */}
                    <div className="mt-6">
                      <Typography className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <ShieldCheck size={14} /> Verification Evidence
                      </Typography>
                      <div className="flex flex-wrap gap-2">
                        {proofImages.length ? (
                          proofImages.map((img, i) => (
                            <a key={i} href={img} target="_blank" rel="noreferrer"
                              className="w-16 h-16 rounded-xl border border-slate-200 overflow-hidden hover:ring-2 ring-indigo-500 ring-offset-2 transition-all">
                              <img src={img} className="w-full h-full object-cover" />
                            </a>
                          ))
                        ) : (
                          <div className="w-full p-4 rounded-2xl border-2 border-dashed border-slate-200 text-center">
                            <Typography className="text-xs font-medium text-slate-400 italic">
                              {isSelfCleanActive && isMyClean
                                ? "Upload your proof below"
                                : "Pending disposal proof"}
                            </Typography>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Self-clean in-progress indicator (someone else is cleaning) */}
                    {isSelfCleanActive && !isMyClean && (
                      <div className="mt-4 flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-2xl px-4 py-3">
                        <Leaf size={13} className="text-indigo-500 shrink-0" />
                        <p className="text-[11px] font-bold text-indigo-600">
                          Someone is already cleaning this report
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right: Details */}
                  <div className="lg:col-span-7 p-8">
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="px-3 py-1 bg-emerald-600 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider flex items-center gap-2">
                        <Layers size={12} /> {report?.wasteCategory || "General"}
                      </span>
                      {report?.wasteQty && (
                        <span className="px-3 py-1 bg-indigo-50 text-black border border-indigo-100 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                          Qty: {report.wasteQty}
                        </span>
                      )}
                    </div>

                    <div className="space-y-8">
                      <section>
                        <Typography className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Detailed Context</Typography>
                        <Typography className="text-slate-700 leading-relaxed font-medium">
                          {report?.description || "The reporter did not provide a text description for this item."}
                        </Typography>
                      </section>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-slate-400">
                            <MapPin size={14} />
                            <Typography className="text-[11px] font-bold uppercase tracking-widest">Location</Typography>
                          </div>
                          <Typography className="text-sm font-bold text-slate-900">{report?.wasteLocation || "N/A"}</Typography>
                          {report?.landmark && (
                            <Typography className="text-xs text-slate-500 font-medium italic">{report.landmark}</Typography>
                          )}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-slate-400">
                            <User size={14} />
                            <Typography className="text-[11px] font-bold uppercase tracking-widest">Reporter</Typography>
                          </div>
                          <Typography className="text-sm font-bold text-slate-900 truncate">
                            {report?.userId?.fullName || "Anonymous User"}
                          </Typography>
                          <Typography className="text-[10px] text-slate-400 font-medium">
                            Platform: {report?.userModel || "Web"}
                          </Typography>
                        </div>
                      </div>

                      {/* AI Card */}
                      <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
                              <Brain size={18} />
                            </div>
                            <Typography className="text-sm font-bold text-slate-800">AI Analysis</Typography>
                          </div>
                          <Typography className="text-[11px] font-black text-emerald-600">
                            {((report?.aiConfidence || 0) * 100).toFixed(0)}% Certainty
                          </Typography>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {topAI.map((item, idx) => (
                            <div key={idx} className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-2 shadow-sm">
                              <span className="text-xs font-bold text-slate-700 capitalize">{item.label}</span>
                              <span className="text-[10px] font-black text-slate-400">{(item.confidence * 100).toFixed(0)}%</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Resolved badge */}
                      {report?.status === "RESOLVED" && (
                        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-2xl px-5 py-4">
                          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                          <div>
                            <p className="text-sm font-black text-emerald-700">Resolved</p>
                            {report.selfCleanedBy && (
                              <p className="text-[10px] text-emerald-500 font-medium mt-0.5">
                                Self-cleaned · +100 reward points awarded
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-slate-100 bg-slate-50/80 backdrop-blur-md flex flex-col sm:flex-row gap-3">
                <button onClick={onClose}
                  className="flex-1 px-6 py-3 rounded-2xl bg-white border border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">
                  Close
                </button>

                {/* Step 1: Start self-cleaning */}
                {canStartClean && (
                  <button onClick={handleStartClean} disabled={starting}
                    className="flex-1 px-6 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 disabled:opacity-60 shadow-sm shadow-emerald-200">
                    {starting ? <Loader2 size={14} className="animate-spin" /> : <Leaf size={14} />}
                    {starting ? "Starting..." : "Self Cleaning"}
                  </button>
                )}

                {/* Step 2: Upload proof */}
                {canUploadProof && (
                  <button onClick={() => setShowProofModal(true)}
                    className="flex-1 px-6 py-3 rounded-2xl bg-indigo-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 shadow-sm shadow-indigo-200">
                    <Upload size={14} /> Upload Proof
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ReportDetailsModal;