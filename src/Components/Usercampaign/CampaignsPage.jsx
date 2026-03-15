import React, { useEffect, useState, useCallback, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Calendar,
  Users,
  MapPin,
  Clock,
  Filter,
  Loader2,
  CheckCircle2,
  Leaf,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  UserPlus,
  Sparkles,
  Building2,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../Api/APi";
import { useAuth } from "../Context/UserContext/UserContext";


/* ─── Helpers ────────────────────────────────────────────────────── */
const STATUS_CONFIG = {
  UPCOMING: {
    label: "Upcoming",
    pill: "bg-blue-50 text-blue-600 border-blue-100",
    dot: "bg-blue-500",
    bar: "bg-blue-400",
    accent: "blue",
  },
  ONGOING: {
    label: "Ongoing",
    pill: "bg-emerald-50 text-emerald-600 border-emerald-100",
    dot: "bg-emerald-500 animate-pulse",
    bar: "bg-emerald-500",
    accent: "emerald",
  },
  COMPLETED: {
    label: "Completed",
    pill: "bg-slate-100 text-slate-500 border-slate-200",
    dot: "bg-slate-400",
    bar: "bg-slate-300",
    accent: "slate",
  },
  CANCELLED:{
      label: "Cancelled",
    pill: "bg-red-100 text-red-500 border-red-200",
    dot: "bg-red-400",
    bar: "bg-red-300",
    accent: "red",

  }
};

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

 const formatTime = (t) => {
    if (!t) return "—";
    const [h, m] = t.split(":");
    const hour = parseInt(h);
    return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
  };
const capacityPct = (volunteers = [], max = 1) =>
  Math.min(100, Math.round((volunteers.length / max) * 100));

/* ─── Join Confirm Modal ─────────────────────────────────────────── */
const JoinModal = ({ campaign, onConfirm, onCancel, joining }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
  >
    <motion.div
      initial={{ scale: 0.9, y: 16 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl border border-slate-100"
    >
      <div className="w-14 h-14 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <Leaf size={24} className="text-emerald-600" />
      </div>
      <h3 className="text-lg font-black text-slate-800 text-center">
        Join Campaign?
      </h3>
      <p className="text-sm text-slate-500 text-center mt-2 leading-relaxed">
        You're about to join{" "}
        <span className="font-bold text-slate-700">"{campaign?.title}"</span>.
        You'll be counted as a volunteer.
      </p>

      {/* Capacity bar */}
      <div className="mt-5 bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2">
        <div className="flex justify-between text-[11px] font-black text-slate-400 uppercase tracking-wider">
          <span>Volunteers</span>
          <span>
            {campaign?.volunteers?.length ?? 0} / {campaign?.maxVolunteers}
          </span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all"
            style={{
              width: `${capacityPct(campaign?.volunteers, campaign?.maxVolunteers)}%`,
            }}
          />
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={onCancel}
          disabled={joining}
          className="flex-1 py-3 rounded-2xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={joining}
          className="flex-1 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {joining ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <UserPlus size={15} />
          )}
          {joining ? "Joining..." : "Confirm"}
        </button>
      </div>
    </motion.div>
  </motion.div>
);

/* ─── Campaign Card ──────────────────────────────────────────────── */
const CampaignCard = ({ campaign, userId, index, onJoinClick }) => {
  const cfg = STATUS_CONFIG[campaign.status] || STATUS_CONFIG.COMPLETED;
  const pct = capacityPct(campaign.volunteers, campaign.maxVolunteers);
  const isFull = campaign.volunteers?.length >= campaign.maxVolunteers;
  const isCompleted = campaign.status === "COMPLETED";
  const isCancelled = campaign.status === "CANCELLED";

 const hasJoined = campaign.volunteers?.some(
  (v) => (v?.userId?._id || v?.userId)?.toString() === userId?.toString()
);

  const canJoin = !hasJoined && !isFull && !isCompleted;

  const coverImage = campaign.images?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
    >
      {/* Cover image / placeholder */}
      <div className="relative h-44 bg-gradient-to-br from-emerald-50 to-teal-100 overflow-hidden">
        {coverImage ? (
          <img
            src={coverImage}
            alt={campaign.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Leaf size={40} className="text-emerald-300 opacity-60" />
          </div>
        )}
        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-wider backdrop-blur-sm bg-white/80 ${cfg.pill}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </div>
        </div>
        {/* Joined badge */}
        {hasJoined && (
          <div className="absolute top-3 right-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider">
              <CheckCircle2 size={11} /> Joined
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-black text-slate-800 text-base leading-snug mb-1 line-clamp-2">
          {campaign.title}
        </h3>
        {campaign.description && (
          <p className="text-[12px] text-slate-400 font-medium leading-relaxed line-clamp-2 mb-4">
            {campaign.description}
          </p>
        )}

        {/* Meta */}
        <div className="space-y-2 mb-4">
          {(campaign.location?.building || campaign.location?.area) && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                <Building2 size={11} className="text-slate-400" />
              </div>
              <span className="text-[12px] text-slate-500 font-semibold">
                {[campaign.location.building, campaign.location.area]
                  .filter(Boolean)
                  .join(", ")}
              </span>
            </div>
          )}
          {campaign.campaignDate && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                <Calendar size={11} className="text-slate-400" />
              </div>
              <span className="text-[12px] text-slate-500 font-semibold">
                {formatDate(campaign.campaignDate)}
              </span>
            </div>
          )}
          {campaign.startTime && campaign.endTime && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                <Clock size={11} className="text-slate-400" />
              </div>
              <span className="text-[12px] text-slate-500 font-semibold">
                {formatTime(campaign.startTime)} – {formatTime(campaign.endTime)}
              </span>
            </div>
          )}
        </div>

        {/* Volunteer capacity */}
        <div className="mb-5 space-y-1.5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <Users size={11} className="text-slate-400" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                Volunteers
              </span>
            </div>
            <span className="text-[11px] font-black text-slate-600">
              {campaign.volunteers?.length ?? 0}
              <span className="text-slate-300"> / {campaign.maxVolunteers}</span>
            </span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ delay: index * 0.06 + 0.3, duration: 0.6 }}
              className={`h-full rounded-full ${
                pct >= 100
                  ? "bg-red-400"
                  : pct >= 75
                  ? "bg-amber-400"
                  : "bg-emerald-500"
              }`}
            />
          </div>
          {isFull && (
            <p className="text-[10px] font-black text-red-400 uppercase tracking-wider">
              Full
            </p>
          )}
        </div>

        {/* Join button */}
        <div className="mt-auto">
          {hasJoined ? (
            <div className="w-full py-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 font-black text-sm flex items-center justify-center gap-2">
              <CheckCircle2 size={15} /> You're In!
            </div>
          ) : isCompleted  ? (
            <div className="w-full py-3 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 font-black text-sm text-center">
              Campaign Ended
            </div>
          ) : isCancelled  ? (
            <div className="w-full py-3 rounded-2xl bg-red-50 border border-red-100 text-red-400 font-black text-sm text-center">
              Campaign Cancelled
            </div>

          )
          
          : isFull ? (
            <div className="w-full py-3 rounded-2xl bg-red-50 border border-red-100 text-red-400 font-black text-sm text-center">
              No Spots Left
            </div>
          ) : (
            <button
              onClick={() => onJoinClick(campaign)}
              className="w-full py-3 rounded-2xl bg-emerald-600 text-white font-black text-sm hover:bg-emerald-500 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm shadow-emerald-200"
            >
              <UserPlus size={15} /> Join Campaign
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Skeleton Card ──────────────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden animate-pulse">
    <div className="h-44 bg-slate-100" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-slate-100 rounded-full w-3/4" />
      <div className="h-3 bg-slate-100 rounded-full w-full" />
      <div className="h-3 bg-slate-100 rounded-full w-2/3" />
      <div className="h-2 bg-slate-100 rounded-full w-full mt-4" />
      <div className="h-10 bg-slate-100 rounded-2xl mt-2" />
    </div>
  </div>
);

/* ─── Main Component ─────────────────────────────────────────────── */
const CampaignsPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [joinTarget, setJoinTarget] = useState(null);
  const [joining, setJoining] = useState(false);

  // Get current user id from localStorage
  const {user } = useAuth()
  const userId = user?._id;
    

  const LIMIT = 9;

  const fetchCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page, limit: LIMIT });
      if (statusFilter) params.append("status", statusFilter);
      const res = await api.get(`/all?${params}`);
      setCampaigns(res.data?.campaigns || []);
      setTotalPages(res.data?.totalPages || 1);
      setTotal(res.data?.total || 0);
    } catch {
      toast.error("Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  // Client-side search filter (title/location)
  const filtered = campaigns.filter((c) => {
    const q = search.toLowerCase().trim();
    return (
      !q ||
      c.title?.toLowerCase().includes(q) ||
      c.location?.building?.toLowerCase().includes(q) ||
      c.location?.area?.toLowerCase().includes(q) ||
      c.description?.toLowerCase().includes(q)
    );
  });

  const handleJoin = async () => {
    if (!joinTarget) return;
    try {
      setJoining(true);
      await api.patch(`/${joinTarget._id}/join`);
      toast.success("You've joined the campaign! 🌿");
      setJoinTarget(null);
      fetchCampaigns();
    } catch (err) {
      toast.error(err?.response?.data?.msg || "Failed to join");
    } finally {
      setJoining(false);
    }
  };

  const STATUS_FILTERS = [
    { value: "", label: "All" },
    { value: "UPCOMING", label: "Upcoming" },
    { value: "ONGOING", label: "Ongoing" },
    { value: "COMPLETED", label: "Completed" },
  ];

  return (
    <>
      <AnimatePresence>
        {joinTarget && (
          <JoinModal
            campaign={joinTarget}
            onConfirm={handleJoin}
            onCancel={() => setJoinTarget(null)}
            joining={joining}
          />
        )}
      </AnimatePresence>

      <div className="w-full min-h-screen bg-[#f8fafc] p-6 lg:p-10 space-y-8">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full">
                <Leaf size={12} className="text-emerald-600" />
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">
                  Eco Campaigns
                </span>
              </div>
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              Active Campaigns
            </h1>
            <p className="text-slate-400 font-medium mt-1 text-sm">
              Join a campus eco drive and make an impact
            </p>
          </div>

          <button
            onClick={() => { setPage(1); fetchCampaigns(); }}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-[11px] font-black text-slate-500 uppercase tracking-wider hover:bg-slate-50 transition-all shadow-sm disabled:opacity-60 self-start sm:self-auto"
          >
            {loading ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <RefreshCw size={13} />
            )}
            Refresh
          </button>
        </motion.div>

        {/* ── Search + Filters ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="flex flex-col sm:flex-row sm:justify-between gap-3"
        >
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search
              size={15}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search campaigns..."
              className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-5 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/10 transition-all shadow-sm placeholder:text-slate-300"
            />
          </div>

          {/* Status filter pills */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-2xl px-2 py-2 shadow-sm overflow-x-auto">
            <Filter size={13} className="text-slate-400 shrink-0 ml-1" />
            {STATUS_FILTERS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => { setStatusFilter(value); setPage(1); }}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap
                  ${statusFilter === value
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-400 hover:bg-slate-100"
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Results count ── */}
        {!loading && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[11px] font-black text-slate-400 uppercase tracking-widest"
          >
            {search ? `${filtered.length} result${filtered.length !== 1 ? "s" : ""} for "${search}"` : `${total} campaign${total !== 1 ? "s" : ""}`}
          </motion.p>
        )}

        {/* ── Grid ── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 gap-4"
          >
            <div className="w-16 h-16 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center">
              <Sparkles size={26} className="text-slate-300" />
            </div>
            <p className="text-slate-400 font-black text-base">
              No campaigns found
            </p>
            <p className="text-slate-300 font-medium text-sm text-center max-w-xs">
              Try adjusting your search or filter to find what you're looking for.
            </p>
            {(search || statusFilter) && (
              <button
                onClick={() => { setSearch(""); setStatusFilter(""); setPage(1); }}
                className="px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
              >
                Clear Filters
              </button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((campaign, i) => (
                <CampaignCard
                  key={campaign._id}
                  campaign={campaign}
                  userId={userId}
                  index={i}
                  onJoinClick={setJoinTarget}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* ── Pagination ── */}
        {!loading && totalPages > 1 && !search && (
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <ChevronLeft size={15} /> Prev
            </button>

            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-9 h-9 rounded-xl text-xs font-black transition-all ${
                    page === i + 1
                      ? "bg-emerald-600 text-white shadow-md"
                      : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              Next <ChevronRight size={15} />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CampaignsPage;
