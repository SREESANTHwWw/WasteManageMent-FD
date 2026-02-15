import { motion } from 'framer-motion';
import { Typography } from '../Tags/Tags';

const LoadingState = () => (
  <div className="flex flex-col justify-center items-center min-h-100">
    <motion.div 
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full mb-4"
    />
    <Typography className="text-emerald-700 font-medium animate-pulse">Syncing with Campus Network...</Typography>
  </div>
);

export default LoadingState;