import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  Leaf, 
  Recycle, 
  Zap, 
  Thermometer, 
  ChevronLeft, 
  Search, 
  BellRing,
  Droplets,
  TreePine
} from 'lucide-react';
import AdminSidebar from '../SideBar/AdminSidebar';

const AdminLayout = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const role = localStorage.getItem("adminRole") || "admin"; 
  const username = localStorage.getItem("AdminUserName") || "Admin"; 

  return (
    <div className="flex h-screen w-full bg-[#f8faf9] overflow-hidden text-emerald-950">
      <AdminSidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded}  userRole={role}/>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 bg-white border-b border-emerald-100 flex items-center justify-between px-8">
          <div className="flex items-center gap-4 flex-1">
             <div className="relative w-full max-w-md hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-300" size={18} />
              <input 
                type="text" 
                placeholder="Search metrics..." 
                className="w-full pl-10 pr-4 py-2 bg-emerald-50/50 border border-emerald-50 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative p-2 text-emerald-400 hover:bg-emerald-50 rounded-full cursor-pointer transition-colors">
              <BellRing size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            </div>

            <div className="flex items-center gap-3 pl-6 border-l border-emerald-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold leading-tight">{username}</p>
                <p className="text-[11px] text-emerald-500 font-medium uppercase tracking-tighter">Sustainability Lead</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-emerald-100 border-2 border-emerald-200 overflow-hidden shadow-sm">
                <img
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${username}`}
                  className="w-full h-full object-cover bg-emerald-800 text-white"
                  alt=""
                />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

