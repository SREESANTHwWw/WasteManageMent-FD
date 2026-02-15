import { motion } from 'framer-motion';
import { Typography } from '../../../@All/Tags/Tags';

const Statcard = ({ title, value, icon: Icon, color, bg, variants }) => (
  <motion.div 
    variants={variants}
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4"
  >
    <div className={`p-3 rounded-xl ${bg} ${color}`}>
      <Icon size={24} />
    </div>
    <div className='flex flex-col'>
      <Typography className="text-sm text-slate-500 font-medium">{title}</Typography>
      <Typography className="text-xl font-bold text-slate-800">{value}</Typography>
    </div>
  </motion.div>
);

export default Statcard;