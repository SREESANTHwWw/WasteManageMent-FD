import React from "react";
import { Typography } from "../../../@All/Tags/Tags";
import { motion } from "framer-motion";
import { Info, Leaf } from "lucide-react";

const WasteCategory = ({ categories, setSelectedCat, selectedCat }) => {
  return (
    <div className="space-y-2">
      <div className="bg-white border border-slate-200 p-3 rounded-3xl">
        <Typography className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
          <Info size={14} className="text-emerald-500" /> Step 1: Classification
        </Typography>

        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat) => (
            <button
              type="button"
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`relative flex flex-col items-center justify-center p-6 rounded-2xl transition-all duration-300 border-2 overflow-hidden ${
                selectedCat === cat.id
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-slate-100 bg-slate-50 hover:border-slate-200"
              }`}
            >
              {selectedCat === cat.id && (
                <motion.div 
                    layoutId="activeGlow"
                    className="absolute inset-0 bg-emerald-400/10 blur-xl" 
                />
              )}
              <span className={`text-3xl mb-3 transition-transform duration-500 ${selectedCat === cat.id ? "scale-125 rotate-12" : ""}`}>
                {cat.icon}
              </span>
              <Typography
                className={`text-[10px] font-black uppercase tracking-tighter transition-colors ${
                  selectedCat === cat.id ? "text-emerald-700" : "text-slate-500"
                }`}
              >
                {cat.label}
              </Typography>
            </button>
          ))}
        </div>
      </div>
     
    </div>
  );
};

export default WasteCategory;