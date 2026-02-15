import { MapPin, Clock } from "lucide-react";
import { Typography } from "../../../@All/Tags/Tags";

const statusUi = {
  PENDING: { label: "Pending", cls: "bg-amber-50 text-amber-600" },
  IN_PROGRESS: { label: "In Progress", cls: "bg-sky-50 text-sky-600" },
  RESOLVED: { label: "Resolved", cls: "bg-emerald-50 text-emerald-600" },
};

const ActivityItem = ({ location, time, status }) => {
  const ui = statusUi[status] || { label: status, cls: "bg-slate-50 text-slate-600" };

  return (
    <div className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
          <MapPin size={18} />
        </div>

        <div>
          <Typography className="font-semibold text-slate-700">{location}</Typography>
          <Typography className="text-xs text-slate-400 flex items-center gap-1">
            <Clock size={12} /> {time}
          </Typography>
        </div>
      </div>

      <Typography className={`px-3 py-1 rounded-full text-xs font-medium ${ui.cls}`}>
        {ui.label}
      </Typography>
    </div>
  );
};

export default ActivityItem;
