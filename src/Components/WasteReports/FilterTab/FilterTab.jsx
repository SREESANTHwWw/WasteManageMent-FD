import React from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { Typography } from '../../../@All/Tags/Tags';
import { 
 
  Calendar, X,  RotateCcw
} from 'lucide-react';
const FilterTab = ({setIsFilterOpen,setFilter,setPage,setStartDate,setEndDate,isFilterOpen,filter,endDate,startDate}) => {
  return (
     <AnimatePresence>
        {isFilterOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
            />
            
            {/* Panel */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl p-8 flex flex-col"
            >
              <div className="flex justify-between items-center mb-12">
                <div className='flex flex-col'>
                  <Typography className="text-2xl font-black text-slate-900 tracking-tight leading-none">Filter Reports</Typography>
                  <Typography className="text-slate-400 text-xs mt-1 font-bold uppercase tracking-widest">Refine your view</Typography>
                </div>
                <button onClick={() => setIsFilterOpen(false)} className="p-2 cursor-pointer hover:bg-slate-100 rounded-xl transition-colors">
                  <X size={24} />
                </button>
              </div>

              {/* Status Section */}
              <div className="space-y-6 flex-1">
                <div>
                  <Typography className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4">Report Status</Typography>
                  <div className="grid grid-cols-2 gap-3">
                    {['ALL', 'PENDING', 'IN_PROGRESS', 'RESOLVED'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => { setFilter(tab); setPage(1); }}
                        className={`px-4 py-4 rounded-2xl text-xs cursor-pointer font-bold transition-all border ${
                          filter === tab 
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-200' 
                            : 'bg-white text-slate-500 border-slate-100 hover:border-emerald-500'
                        }`}
                      >
                        {tab.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date Section */}
                <div className="pt-8">
                  <Typography className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4">Date Range</Typography>
                  <div className="space-y-4">
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="date" 
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all"
                      />
                    </div>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="date" 
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Reset Footer */}
              <div className="pt-8 border-t border-slate-100 flex gap-4">
                <button 
                  onClick={() => { setFilter('ALL'); setStartDate(''); setEndDate(''); }}
                  className="flex-1 py-4 bg-slate-50 text-slate-500 cursor-pointer rounded-2xl font-bold text-sm hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw size={16} />
                  Reset
                </button>
                <button 
                  onClick={() => setIsFilterOpen(false)}
                  className="flex-1 py-4 bg-(--main-web-color) cursor-pointer text-white rounded-2xl font-bold text-sm hover:bg-emerald-600 transition-all"
                >
                  Apply
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
  )
}

export default FilterTab