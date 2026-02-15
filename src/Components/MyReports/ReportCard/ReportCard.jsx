import { motion } from 'framer-motion';
import { Typography } from '../../../@All/Tags/Tags';

const getStatusStyles = (status) => {
  switch (status) {
    case 'RESOLVED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700 border-blue-200';
    default: return 'bg-amber-100 text-amber-700 border-amber-200';
  }
};

const ReportCard = ({ report, index }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.9, y: 30 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
    whileHover={{ y: -10 }}
    className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100 flex flex-col h-full"
  >
    {/* Image Section */}
    <div className="relative h-64 overflow-hidden">
      <img 
        src={report.wasteImage} 
        alt="Waste" 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
      />
      <div className="absolute top-5 left-5">
        <Typography className={`px-4 py-1.5 rounded-2xl text-[10px] font-black border shadow-lg backdrop-blur-md ${getStatusStyles(report.status)} uppercase tracking-wider`}>
          {report.status}
        </Typography>
      </div>
    </div>

    {/* Content Section */}
    <div className="p-6 flex flex-col grow">
      {/* Category and Location Row */}
      <div className="flex justify-between items-center mb-4 gap-2">
        <Typography className="text-[10px] font-black tracking-widest text-emerald-700 uppercase bg-emerald-50 px-3 py-1.5 rounded-lg shrink-0">
          {report.wasteCategory}
        </Typography>
        <Typography className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg truncate">
          <span className="text-sm">📍</span> {report.wasteLocation}
        </Typography>
      </div>

      {/* Description - Grow to push footer down */}
      <div className="grow">
        <Typography className="text-slate-800 font-bold text-lg leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2">
          {report.description}
        </Typography>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-slate-100 my-6" />

      {/* Footer / Reward Section */}
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
            <span className="font-black text-sm">🌱</span>
          </div>
          <div className="flex flex-col justify-center">
            <Typography className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">
              Reward
            </Typography>
            <Typography className="text-emerald-600 font-black text-sm leading-none">
              100 Points
            </Typography>
          </div>
        </div>

        <div className="text-right flex flex-col justify-center">
          <Typography className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">
            Reported
          </Typography>
          <Typography className="text-slate-500 text-[11px] font-bold leading-none">
            {new Date(report.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </Typography>
        </div>
      </div>
    </div>
  </motion.div>
);

export default ReportCard;