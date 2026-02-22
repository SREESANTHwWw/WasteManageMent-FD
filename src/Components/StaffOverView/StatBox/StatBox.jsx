import React from 'react'
import { Typography } from '../../../@All/Tags/Tags';

const StatBox = ({ label, value, icon, color }) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-lg transition-shadow">
    <div className="space-y-1 flex flex-col">
      <Typography className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</Typography>
      <Typography className="text-4xl font-black text-slate-900">{value}</Typography>
    </div>
    <div className={`w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
      {React.cloneElement(icon, { size: 28 })}
    </div>
  </div>
);

export default StatBox