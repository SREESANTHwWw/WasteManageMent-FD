import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import api from "../../Api/APi";
import { Typography } from "../../@All/Tags/Tags";
import FilterTab from "./FilterTab/FilterTab";
import StaffReportCard from "./StaffReportCard/StaffReportCard";
import StaffCleanupModal from "./UploadImageProof/UploadImageProof";
import ReportDetailsModal from "./ReportDetailsModal/ReportDetailsModal";

const WasteReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);


  const [viewModal, setViewModal] = useState(false);
const [viewReport, setViewReport] = useState(null);
const openView = (report) => {
  setViewReport(report);
  setViewModal(true);
};

  // Modal States
  const [resolveTab, setResolveTab] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Image Upload States
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Filter States
  const [filter, setFilter] = useState("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchReports = async () => {
    setLoading(true);
    try {
      let query = `/getAll/reports?page=${page}&limit=6`;
      if (filter !== "ALL") query += `&status=${filter}`;
      if (startDate) query += `&start=${startDate}`;
      if (endDate) query += `&end=${endDate}`;

      const response = await api.get(query);
      setReports(response.data.reports);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [page, filter, startDate, endDate]);

  // Logic to Open Modal
  const handleOpenResolveModal = (report) => {
    setSelectedReport(report);
    setResolveTab(true);
  };

  // Image Handling
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (imageFiles.length + files.length > 4) {
      alert("Maximum 4 images allowed for proof.");
      return;
    }

    const newFiles = [...imageFiles, ...files];
    setImageFiles(newFiles);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => {
      // Clean up the URL object to prevent memory leaks
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  // Final Submit Logic
  const handleFinalSubmit = async () => {
    if (imageFiles.length === 0) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      imageFiles.forEach((file) => formData.append("verificationImages", file));
      formData.append("status", "RESOLVED");

      // Replace with your actual endpoint
      await api.patch(`/update/status/${selectedReport._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setReports((prev) =>
        prev.map((r) =>
          r._id === selectedReport._id ? { ...r, status: "RESOLVED" } : r,
        ),
      );

      // Reset Modal
      setResolveTab(false);
      setSelectedReport(null);
      setImageFiles([]);
      setImagePreviews([]);
    } catch (error) {
      console.error("Update Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans overflow-x-hidden">
      {/* Cleanup Modal Component */}
      <AnimatePresence>
        {resolveTab && (
          <StaffCleanupModal
            isOpen={resolveTab}
            onClose={() => {
              setResolveTab(false);
              setImageFiles([]);
              setImagePreviews([]);
            }}
            imageFiles={imageFiles}
            imagePreviews={imagePreviews}
            handleImageUpload={handleImageUpload}
            removeImage={removeImage}
            areaName={selectedReport?.wasteLocation  || "Unknown Sector"}
            taskType={selectedReport?.userId.fullName || "General Cleanup"}
            onSubmit={handleFinalSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
  {viewModal && (
    <ReportDetailsModal
      isOpen={viewModal}
      onClose={() => {
        setViewModal(false);
        setViewReport(null);
      }}
      report={viewReport}
    />
  )}
</AnimatePresence>

      {/* Header Area */}
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-6 border-b border-slate-100">
        <div className="flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Leaf
                className="text-emerald-500 fill-emerald-500/10"
                size={32}
              />
              <Typography className="text-2xl font-black text-slate-900 tracking-tighter uppercase">
                Eco-Track
              </Typography>
            </div>
            <Typography className="text-slate-400 text-sm font-medium">
              Real-time Environmental Monitoring Dashboard
            </Typography>
          </div>

          <button
            onClick={() => setIsFilterOpen(true)}
            className="group flex items-center gap-3 px-6 cursor-pointer py-3 bg-white border border-slate-200 rounded-2xl font-bold text-sm shadow-sm hover:border-emerald-500 transition-all active:scale-95"
          >
            <Filter
              size={18}
              className="text-slate-400 group-hover:text-emerald-500 transition-colors"
            />
            <Typography> Advanced Filters</Typography>
            {(filter !== "ALL" || startDate) && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-96 bg-slate-50 animate-pulse rounded-[2.5rem] border border-slate-100"
              />
            ))}
          </div>
        ) : (
          <motion.div layout className="flex flex-col gap-4 mt-6">
            <AnimatePresence mode="popLayout">
              {reports.map((report) => (
                <StaffReportCard
                  key={report._id}
                  report={report}
                  onUpdate={() => handleOpenResolveModal(report)}
                  openView={()=> openView(report)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Pagination */}
        <div className="mt-16 mb-20 flex justify-center items-center gap-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="p-3 bg-white border border-slate-200 rounded-2xl disabled:opacity-20 hover:border-emerald-500 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <Typography className="font-black text-xs uppercase tracking-widest text-slate-400">
            Page {page} / {totalPages}
          </Typography>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="p-3 bg-white border border-slate-200 rounded-2xl disabled:opacity-20 hover:border-emerald-500 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </main>

      <FilterTab
        filter={filter}
        startDate={startDate}
        endDate={endDate}
        setEndDate={setEndDate}
        isFilterOpen={isFilterOpen}
        setFilter={setFilter}
        setIsFilterOpen={setIsFilterOpen}
        setPage={setPage}
        setStartDate={setStartDate}
      />
    </div>
  );
};

export default WasteReports;
