import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, Leaf, LogOut, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import menu from './Menu'; 

const sidebarVariants = {
  expanded: { width: 280 },
  collapsed: { width: 88 },
};

const menuItemVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
};

const AdminSidebar = ({ isExpanded, setIsExpanded, userRole }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Filter menu items based on the user's role
  const filteredMenu = menu.filter((item) => item.roles.includes(userRole));

 const handleLogout = () => {
  // Clear everything to be safe
  localStorage.removeItem("token");      // Student/Staff token
  localStorage.removeItem("adminToken"); // Admin token
  localStorage.removeItem("adminRole");
  localStorage.removeItem("user");
  
  toast.success("Logged out successfully");
  navigate("/login");
};
  return (
    <>
      <motion.aside
        initial={false}
        animate={isExpanded ? "expanded" : "collapsed"}
        variants={sidebarVariants}
        className="relative h-full bg-emerald-950 text-emerald-100 flex flex-col z-50 shadow-2xl transition-all duration-300 ease-in-out"
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute -right-3 top-10 bg-emerald-500 text-white rounded-full p-1 shadow-lg z-60 hover:bg-emerald-400 transition-colors"
        >
          <motion.div animate={{ rotate: isExpanded ? 0 : 180 }}>
            <ChevronLeft size={16} />
          </motion.div>
        </button>

        {/* Branding Section */}
        <div className="h-20 flex items-center px-6 gap-4 border-b border-emerald-900/50 overflow-hidden text-white">
          <div className="bg-emerald-500 p-2 rounded-xl shadow-inner shrink-0">
            <Leaf size={24} />
          </div>
          <AnimatePresence mode="wait">
            {isExpanded && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-bold text-lg tracking-tight whitespace-nowrap"
              >
                ECO<span className="text-emerald-400">CAMPUS</span>
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto overflow-x-hidden">
          {filteredMenu.map((item, index) => {
            const isActive = location.pathname === item.url;
            const Icon = item.icon;

            return (
              <motion.div
                key={`${item.title}-${index}`}
                onClick={() => navigate(item.url)}
                variants={menuItemVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: index * 0.05 }}
                whileHover={{ x: 5 }}
                className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                  isActive 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'hover:bg-emerald-900 hover:text-white'
                }`}
              >
                <div className="shrink-0">
                  <Icon size={22} />
                </div>
                {isExpanded && (
                  <motion.span 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="font-medium whitespace-nowrap text-sm"
                  >
                    {item.title}
                  </motion.span>
                )}
              </motion.div>
            );
          })}
        </nav>

        {/* Footer Actions (Logout) */}
        <div className="px-4 py-4 border-t border-emerald-900/50">
          <motion.div
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-4 p-3 rounded-xl cursor-pointer hover:bg-rose-500/10 hover:text-rose-400 transition-all group"
            onClick={() => setShowLogoutConfirm(true)}
          >
            <div className="shrink-0 group-hover:rotate-12 transition-transform">
              <LogOut size={22} />
            </div>
            {isExpanded && (
              <span className="font-bold text-sm tracking-tight">Logout</span>
            )}
          </motion.div>
        </div>

        {/* Role Indicator Badge */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-4 m-4 mt-0 bg-emerald-900/40 rounded-2xl border border-emerald-800"
            >
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse" />
                <div>
                  <p className="text-[10px] text-emerald-500 uppercase font-bold tracking-widest leading-none mb-1">Active Role</p>
                  <p className="text-xs font-semibold capitalize text-emerald-100">{userRole}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>

      {/* Logout Confirmation Modal Overlay */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} />
              </div>
              
              <h3 className="text-xl font-black text-slate-800 mb-2">Sign Out?</h3>
              <p className="text-slate-500 text-sm font-medium mb-8">
                Are you sure you want to end your session at EcoCampus?
              </p>

              <div className="flex gap-3">
                <button 
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-4 font-bold text-slate-500 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleLogout}
                  className="flex-1 py-4 font-bold text-white bg-rose-500 rounded-2xl shadow-lg shadow-rose-200 hover:bg-rose-600 transition-all"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminSidebar;