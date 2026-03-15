import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Recycle, CheckCircle2, Clock, Loader2, RefreshCw,
  MapPin, Megaphone, UserCheck, Ban, Leaf, Calendar, AlertCircle,
} from "lucide-react";
import api from "../../../Api/APi";


/* ─── Helpers ────────────────────────────────────────────────────── */
const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—";

const CAMPAIGN_STATUS = {
  UPCOMING:  { chip: "bg-blue-50 text-blue-600 border-blue-100",     dot: "bg-blue-500"                   },
  ONGOING:   { chip: "bg-emerald-50 text-emerald-600 border-emerald-100", dot: "bg-emerald-500 animate-pulse" },
  COMPLETED: { chip: "bg-slate-100 text-slate-500 border-slate-200", dot: "bg-slate-400"                  },
};

const REPORT_STATUS = {
  PENDING:     { chip: "bg-rose-50 text-rose-600 border-rose-100",    dot: "bg-rose-500 animate-pulse",  label: "Pending"     },
  IN_PROGRESS: { chip: "bg-amber-50 text-amber-600 border-amber-100", dot: "bg-amber-500 animate-pulse", label: "Active"      },
  RESOLVED:    { chip: "bg-emerald-50 text-emerald-600 border-emerald-100", dot: "bg-emerald-500",        label: "Resolved"    },
  REJECTED:    { chip: "bg-slate-100 text-slate-500 border-slate-200", dot: "bg-slate-400",              label: "Rejected"    },
};

const CAT_COLORS = { PLASTIC: "bg-blue-500", ORGANIC: "bg-emerald-500", PAPER: "bg-amber-400", OTHERS: "bg-slate-400" };

/* ─── Stat Card ──────────────────────────────────────────────────── */
const StatCard = ({ label, value, icon: Icon, iconColor, bg, delay, loading }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${bg}`}>
        <Icon size={20} className={iconColor} />
      </div>
    </div>
    <p className="text-slate-400 text-sm font-semibold">{label}</p>
    {loading
      ? <div className="h-8 w-20 bg-slate-100 rounded-full mt-1 animate-pulse" />
      : <p className="text-3xl font-black text-slate-900 mt-0.5">{value ?? 0}</p>
    }
  </motion.div>
);

/* ─── Main ───────────────────────────────────────────────────────── */
const EcoAnalytics = () => {
  const [reports,   setReports]   = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError(null);
      const [rRes, cRes] = await Promise.all([
        api.get("/getAll/reports?page=1&limit=100"),
        api.get("/all?page=1&limit=100"),
      ]);
      setReports(rRes.data?.reports || []);
      setCampaigns(cRes.data?.campaigns || []);
    } catch {
      setError("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  /* ── Derived ── */
  const pending     = reports.filter((r) => r.status === "PENDING").length;
  const inProgress  = reports.filter((r) => r.status === "IN_PROGRESS").length;
  const resolved    = reports.filter((r) => r.status === "RESOLVED").length;
  const rejected    = reports.filter((r) => r.status === "REJECTED").length;
  const ongoing     = campaigns.filter((c) => c.status === "ONGOING").length;
  const upcoming    = campaigns.filter((c) => c.status === "UPCOMING").length;
  const volunteers  = campaigns.reduce((a, c) => a + (c.volunteers?.length || 0), 0);
  const resolveRate = reports.length > 0 ? Math.round((resolved / reports.length) * 100) : 0;

  const recentReports   = [...reports].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  const recentCampaigns = [...campaigns].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4);

  const catCounts = ["PLASTIC", "ORGANIC", "PAPER", "OTHERS"].map((cat) => ({
    label: cat, count: reports.filter((r) => r.wasteCategory === cat).length,
  }));
  const maxCat = Math.max(...catCounts.map((c) => c.count), 1);

  if (error) return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <AlertCircle size={32} className="text-rose-400" />
      <p className="text-slate-500 font-bold">{error}</p>
      <button onClick={fetchAll} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-2xl text-sm font-bold hover:bg-emerald-500 transition-all">
        <RefreshCw size={14} /> Retry
      </button>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Environmental Analytics</h1>
          <p className="text-slate-400 text-sm font-medium mt-0.5">Real-time sustainability tracking for the campus.</p>
        </div>
        <button onClick={fetchAll} disabled={loading}
          className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-2xl font-bold text-sm hover:bg-emerald-500 transition-all shadow-sm shadow-emerald-200 w-fit disabled:opacity-60">
          {loading ? <Loader2 size={15} className="animate-spin" /> : <RefreshCw size={15} />}
          Refresh
        </button>
      </div>

      {/* Report stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Reports"  value={reports.length}    icon={Recycle}    iconColor="text-rose-600"    bg="bg-rose-50"    delay={0}    loading={loading} />
        <StatCard label="Pending"        value={pending}           icon={Clock}      iconColor="text-amber-600"   bg="bg-amber-50"   delay={0.05} loading={loading} />
        <StatCard label="Resolved"       value={resolved}          icon={CheckCircle2} iconColor="text-emerald-600" bg="bg-emerald-50" delay={0.1} loading={loading} />
        <StatCard label="Volunteers"     value={volunteers}        icon={UserCheck}  iconColor="text-blue-600"    bg="bg-blue-50"    delay={0.15} loading={loading} />
      </div>

      {/* Campaign stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Campaigns"  value={campaigns.length} icon={Megaphone}  iconColor="text-violet-600"  bg="bg-violet-50"  delay={0.2}  loading={loading} />
        <StatCard label="Ongoing"    value={ongoing}          icon={Leaf}       iconColor="text-emerald-600" bg="bg-emerald-50" delay={0.25} loading={loading} />
        <StatCard label="Upcoming"   value={upcoming}         icon={Calendar}   iconColor="text-blue-600"    bg="bg-blue-50"    delay={0.3}  loading={loading} />
        <StatCard label="Rejected"   value={rejected}         icon={Ban}        iconColor="text-slate-500"   bg="bg-slate-100"  delay={0.35} loading={loading} />
      </div>

      {/* Main section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Waste Reports list */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center">
            <div>
              <h2 className="font-black text-slate-800">Recent Waste Reports</h2>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">{reports.length} total</p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider">Live</span>
            </div>
          </div>

          <div className="p-5 space-y-2">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 animate-pulse p-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-slate-100 rounded-full w-2/3" />
                    <div className="h-3 bg-slate-100 rounded-full w-1/3" />
                  </div>
                  <div className="h-6 w-20 bg-slate-100 rounded-full" />
                </div>
              ))
            ) : recentReports.length === 0 ? (
              <p className="text-slate-300 text-sm font-medium text-center py-10">No reports yet</p>
            ) : recentReports.map((report, i) => {
              const st = REPORT_STATUS[report.status] || REPORT_STATUS.PENDING;
              return (
                <motion.div key={report._id}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                    {report.wasteImage?.[0]
                      ? <img src={report.wasteImage[0]} alt="waste" className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center"><Recycle size={16} className="text-slate-400" /></div>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-700 truncate">
                      {report.description || "Waste Report"}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <MapPin size={10} className="text-slate-400 shrink-0" />
                      <span className="text-[10px] text-slate-400 font-medium truncate">
                        {report.wasteLocation === "OTHERS" ? report.landmark || "Custom" : report.wasteLocation}
                      </span>
                      <span className="text-[10px] text-slate-300">·</span>
                      <span className="text-[10px] text-slate-400">{formatDate(report.createdAt)}</span>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider shrink-0 ${st.chip}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                    {st.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          {/* Resolution rate */}
          <div className="bg-emerald-900 text-white rounded-2xl p-6 shadow-xl shadow-emerald-900/10">
            <h2 className="text-base font-black mb-1">Resolution Rate</h2>
            <p className="text-emerald-300 text-xs font-medium mb-5">Resolved vs total reports</p>
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-xs font-black uppercase tracking-widest text-emerald-400">
                <span>Progress</span>
                <span>{resolveRate}%</span>
              </div>
              <div className="w-full bg-emerald-800 h-3 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${resolveRate}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="bg-emerald-400 h-full rounded-full"
                />
              </div>
            </div>
            <div className="space-y-2.5">
              {[
                { label: "Pending",     count: pending,    color: "bg-rose-400"    },
                { label: "In Progress", count: inProgress, color: "bg-amber-400"   },
                { label: "Resolved",    count: resolved,   color: "bg-emerald-400" },
                { label: "Rejected",    count: rejected,   color: "bg-slate-400"   },
              ].map(({ label, count, color }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${color}`} />
                    <span className="text-[11px] font-bold text-emerald-200">{label}</span>
                  </div>
                  <span className="text-[11px] font-black text-white">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Category breakdown */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h2 className="font-black text-slate-800 mb-4">Waste Categories</h2>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="animate-pulse space-y-1.5">
                    <div className="h-3 bg-slate-100 rounded-full w-1/3" />
                    <div className="h-2 bg-slate-100 rounded-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {catCounts.map(({ label, count }) => (
                  <div key={label}>
                    <div className="flex justify-between mb-1">
                      <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">{label}</span>
                      <span className="text-[11px] font-black text-slate-700">{count}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(count / maxCat) * 100}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className={`h-full rounded-full ${CAT_COLORS[label]}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Campaigns */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center">
          <div>
            <h2 className="font-black text-slate-800">Recent Campaigns</h2>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">{volunteers} total volunteers</p>
          </div>
          {ongoing > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-emerald-600">{ongoing} Live</span>
            </div>
          )}
        </div>

        <div className="p-5">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-slate-50 rounded-2xl p-4 animate-pulse space-y-3">
                  <div className="h-24 bg-slate-200 rounded-xl" />
                  <div className="h-4 bg-slate-200 rounded-full w-3/4" />
                  <div className="h-3 bg-slate-200 rounded-full w-1/2" />
                </div>
              ))}
            </div>
          ) : recentCampaigns.length === 0 ? (
            <p className="text-slate-300 text-sm font-medium text-center py-10">No campaigns yet</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentCampaigns.map((campaign, i) => {
                const st  = CAMPAIGN_STATUS[campaign.status] || CAMPAIGN_STATUS.UPCOMING;
                const pct = Math.min(Math.round(((campaign.volunteers?.length || 0) / (campaign.maxVolunteers || 1)) * 100), 100);
                return (
                  <motion.div key={campaign._id}
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                    className="bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden hover:border-emerald-200 transition-all"
                  >
                    <div className="relative h-24 bg-gradient-to-br from-emerald-50 to-teal-100 overflow-hidden">
                      {campaign.images?.[0]
                        ? <img src={campaign.images[0]} alt={campaign.title} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center"><Leaf size={24} className="text-emerald-300" /></div>
                      }
                      <div className={`absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full border text-[9px] font-black uppercase tracking-wider backdrop-blur-sm bg-white/80 ${st.chip}`}>
                        <span className={`w-1 h-1 rounded-full ${st.dot}`} />
                        {campaign.status}
                      </div>
                    </div>
                    <div className="p-3 space-y-2">
                      <p className="text-sm font-black text-slate-800 line-clamp-1">{campaign.title}</p>
                      <div className="flex items-center gap-1.5">
                        <Calendar size={10} className="text-slate-400 shrink-0" />
                        <span className="text-[10px] text-slate-400 font-medium">{formatDate(campaign.campaignDate)}</span>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Volunteers</span>
                          <span className="text-[9px] font-black text-slate-600">{campaign.volunteers?.length || 0}/{campaign.maxVolunteers}</span>
                        </div>
                        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EcoAnalytics;