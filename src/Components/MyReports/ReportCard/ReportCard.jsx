import { motion } from "framer-motion";
import { Typography } from "../../../@All/Tags/Tags";
import { capitalizeFirst } from "../../../functions/capitalizeFirst";

const getStatusMeta = (status) => {
  switch (status) {
    case "RESOLVED":
      return {
        label: "Resolved",
        pill: "bg-emerald-500/15 text-emerald-200 border-emerald-400/30",
        dot: "bg-emerald-400",
      };
    case "IN_PROGRESS":
      return {
        label: "In Progress",
        pill: "bg-sky-500/15 text-sky-200 border-sky-400/30",
        dot: "bg-sky-400",
      };
    default:
      return {
        label: "Pending",
        pill: "bg-amber-500/15 text-amber-200 border-amber-400/30",
        dot: "bg-amber-400",
      };
  }
};

const getCategoryPill = (cat) => {
  const c = (cat || "").toUpperCase();
  if (c === "PLASTIC")
    return "bg-indigo-500/15 text-indigo-200 border-indigo-400/30";
  if (c === "ORGANIC")
    return "bg-emerald-500/15 text-emerald-200 border-emerald-400/30";
  if (c === "PAPPER" || c === "PAPER")
    return "bg-slate-500/15 text-slate-200 border-slate-400/30";
  return "bg-violet-500/15 text-violet-200 border-violet-400/30";
};

const fmtDate = (date) =>
  new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const ReportCard = ({ report, index }) => {
  const status = getStatusMeta(report?.status);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: "easeOut" }}
      whileHover={{ y: -6 }}
      className="group relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white shadow-sm transition-all hover:shadow-2xl"
    >
      {/* subtle gradient border glow */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute -inset-20 bg-linear-to-br from-emerald-200/40 via-sky-200/20 to-violet-200/30 blur-3xl" />
      </div>

      {/* IMAGE */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={report?.wasteImage}
          alt="Waste"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* top gradient overlay for readability */}
        <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-black/0" />

        {/* Status pill */}
        <div className="absolute left-4 top-4">
          <div
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-extrabold backdrop-blur-md ${status.pill}`}
          >
            <span className={`h-2 w-2 rounded-full ${status.dot}`} />
            {status.label}
          </div>
        </div>

        {/* Category pill */}
        <div className="absolute right-4 top-4">
          <div
            className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-extrabold backdrop-blur-md ${getCategoryPill(
              report?.wasteCategory,
            )}`}
          >
            {(report?.wasteCategory || "OTHERS").toUpperCase()}
          </div>
        </div>

        {/* bottom overlay info */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex flex-col">
              <Typography className="truncate text-[13px] font-bold text-white/90">
                📍 {report?.wasteLocation || "Unknown location"}
              </Typography>
              <Typography className="text-[11px] font-semibold text-white/70">
                Reported • {fmtDate(report?.createdAt)}
              </Typography>
            </div>

            {/* points badge */}
            <div className="shrink-0 rounded-2xl flex flex-col  bg-white/15 px-3 py-2 backdrop-blur-md border border-white/20">
              <Typography className="text-[10px] font-black text-white/70 uppercase tracking-widest">
                Reward
              </Typography>
              <Typography className="text-[13px] font-black text-white leading-none">
                100 <span className="text-white/70 text-[11px]">pts</span>
              </Typography>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="relative p-5">
        <Typography className="text-[15px] font-extrabold text-slate-900 leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors">
          {report?.description || "No description provided."}
        </Typography>

        {/* meta row */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100">
              🌱
            </span>
            <div className="flex flex-col leading-none">
              <Typography className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">
                Eco Impact
              </Typography>
              <Typography className="text-[10px] font-bold text-slate-700">
                Thanks for reporting!
              </Typography>
            </div>
          </div>

          {/* CTA */}

        </div>
               {report?.resolvedBy && (
  <div className="mt-2">
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full">
      <div className="h-2 w-2 bg-emerald-500 rounded-full" />
      <Typography className="text-[11px] font-bold text-emerald-700 tracking-wide">
        Resolved by {capitalizeFirst(report?.resolvedBy?.fullName)}
      </Typography>
    </div>
  </div>
)}
      </div>
    </motion.article>
  );
};

export default ReportCard;
