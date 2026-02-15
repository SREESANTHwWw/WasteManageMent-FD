import { Typography } from "../../../@All/Tags/Tags"
import {  motion} from 'framer-motion'
import {

  Leaf,

  Info,
} from "lucide-react";
const WasteCategory = ({categories,setSelectedCat,selectedCat }) => {
     const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };
  return (
    <motion.div variants={fadeInUp} className="lg:col-span-4 space-y-4">
          <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
            <Typography className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
              <Info size={14} className="text-emerald-500" /> Category
            </Typography>

            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setSelectedCat(cat.id)}
                  className={`flex flex-col items-center cursor-pointer justify-center p-5 rounded-3xl transition-all duration-300 border-2 ${
                    selectedCat === cat.id
                      ? "border-emerald-500 bg-emerald-50/50 shadow-inner"
                      : "border-transparent bg-slate-50 hover:bg-white hover:border-slate-200"
                  }`}
                >
                  <span className="text-3xl mb-2">{cat.icon}</span>
                  <Typography
                    className={`text-[10px] font-black uppercase ${
                      selectedCat === cat.id ? "text-emerald-700" : "text-slate-400"
                    }`}
                  >
                    {cat.label}
                  </Typography>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-emerald-600 p-6 flex flex-col rounded-[2.5rem] text-white shadow-lg shadow-emerald-200 overflow-hidden relative group">
            <Leaf className="absolute -right-4 -bottom-4 w-24 h-24 text-emerald-500/50 rotate-12 group-hover:rotate-45 transition-transform duration-700" />
            <Typography className="text-lg font-bold leading-tight relative z-10">
              Your contribution matters.
            </Typography>
            <Typography className="text-xs opacity-80 mt-2 relative z-10">
              Clean environments reduce campus carbon footprint by up to 12%.
            </Typography>
          </div>
        </motion.div>
  )
}

export default WasteCategory