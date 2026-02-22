import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Pagination from "../../@All/Pagination/Pagination";
import ReportCard from "./ReportCard/ReportCard";
import LoadingState from "../../@All/LoadingScreens/MainLoading";
import { Typography } from "../../@All/Tags/Tags";
import api from "../../Api/APi";
import { useAuth } from "../Context/UserContext/UserContext";
import ReportDetailsModal from "../WasteReports/ReportDetailsModal/ReportDetailsModal";

// ✅ import modal

// change path based on your folder

const ITEMS_PER_PAGE = 8;

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  const [currentPage, setCurrentPage] = useState(1);

  // ✅ View Modal
  const [viewModal, setViewModal] = useState(false);
  const [viewReport, setViewReport] = useState(null);

  const openView = (report) => {
    setViewReport(report);
    setViewModal(true);
  };

  // pagination
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchReports = async (page = 1) => {
    try {
      setLoading(true);

      const res = await api.get(`/get/reports?page=${page}&limit=${ITEMS_PER_PAGE}`);

      if (res?.data?.success) {
        // ⚠️ check your API key name: you used orders earlier
        const list = res.data.reports || res.data.orders || [];
        setReports(list);

        setTotalItems(res.data.total || 0);
        setTotalPages(res.data.totalPages || 1);
      } else {
        setReports([]);
        setTotalItems(0);
        setTotalPages(1);
      }
    } catch (error) {
      console.error(error);
      setReports([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(currentPage);
  }, [currentPage]);

  if (loading) return <LoadingState />;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-slate-50 min-h-screen">
      {/* ✅ Modal */}
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

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4"
      >
        <div className="flex flex-col">
          <Typography className="text-3xl font-extrabold text-slate-800 tracking-tight">
            My Reports
          </Typography>
          <Typography>Your contribution to a cleaner campus</Typography>
        </div>

        <motion.div
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
          className="relative overflow-hidden bg-emerald-600 px-3 py-3 rounded-[2.5rem] shadow-xl text-white flex items-center gap-5 border-b-4 border-emerald-700"
        >
          <span className="absolute -right-2 -bottom-2 text-xl opacity-10 rotate-12 pointer-events-none">
            🍃
          </span>

          <div className="relative">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md border border-white/40 shadow-lg">
              <span className="text-xl block drop-shadow-sm">🌱</span>
            </div>
            <motion.span
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-1 -right-1 text-[10px]"
            >
              ✨
            </motion.span>
          </div>

          <div className="flex flex-col">
            <Typography className="text-[10px] uppercase font-black text-emerald-100 tracking-widest leading-none mb-1.5">
              Eco Earnings
            </Typography>
            <div className="flex items-center gap-2">
              <Typography className="text-xl font-black leading-none tracking-tight">
                {user?.rewardPoint || 0}
              </Typography>
              <Typography className="text-xs font-bold text-emerald-100 bg-emerald-500/50 px-2 py-0.5 rounded-full">
                Points
              </Typography>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Cards */}
      {reports.length === 0 ? (
        <Typography className="text-center py-20">No reports found.</Typography>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {reports.map((report, index) => (
                <motion.button
                  key={report._id}  // ✅ key on outer element
                  type="button"
                  onClick={() => openView(report)}
                  whileTap={{ scale: 0.98 }}
                  className="text-left w-full cursor-pointer"
                >
                  <ReportCard report={report} index={index} />
                </motion.button>
              ))}
            </AnimatePresence>
          </div>

          <Pagination
            totalItems={totalItems}
            itemsPerPage={ITEMS_PER_PAGE}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />

          <div className="text-center text-sm text-slate-500 mt-4">
            Page {currentPage} of {totalPages}
          </div>
        </>
      )}
    </div>
  );
};

export default MyReports;