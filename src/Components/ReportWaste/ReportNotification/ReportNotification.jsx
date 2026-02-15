import { AnimatePresence ,motion} from 'framer-motion'

import { Typography } from '../../../@All/Tags/Tags'
import {

  CheckCircle2,
  

} from "lucide-react";
const ReportNotification = ({showModal,closeModal}) => {
  return (
    <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-[3rem] p-10 max-w-sm w-full text-center shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)]"
            >
              <div className="relative w-24 h-24 mx-auto mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute inset-0 bg-emerald-100 rounded-full"
                />
                <motion.div
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  className="absolute inset-0 flex items-center justify-center text-emerald-600"
                >
                  <CheckCircle2 size={56} strokeWidth={1.5} />
                </motion.div>
              </div>
               <div className="flex flex-col">
                 <Typography className="text-3xl font-black text-slate-800 mb-2">
                Report Filed!
              </Typography>
              <Typography className="text-slate-400 text-sm mb-8 leading-relaxed px-2">
                Verification in progress. We&apos;ve added 50 tokens to your{" "}
                <span className="text-emerald-600 font-bold">Eco-Wallet</span>.
              </Typography>

               </div>
             

              <button
                type="button"
                onClick={closeModal}
                className="group w-full py-5 cursor-pointer bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2"
              >
                <Typography className="uppercase tracking-widest text-xs">
                  Return to Terminal
                </Typography>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
  )
}

export default ReportNotification