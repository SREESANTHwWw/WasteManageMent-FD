import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { FaChevronRight, FaBars, FaTimes } from "react-icons/fa";
import { useState, useEffect } from "react";
import WasteLogo from "../../assets/WasteLogo.png";
import menu, { size } from "./Menu";
import { Typography } from "../../@All/Tags/Tags";
import { capitalizeFirst } from "../../functions/capitalizeFirst";

const SideBar = ({ isOpen, setIsOpen, user }) => {
  const [expanded, setExpanded] = useState(null);
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Update mobile state on resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleExpand = (title) => {
    setExpanded(expanded === title ? null : title);
  };

  const filteredMenu = menu.filter((item) => item.roles?.includes(user.role));

  return (
    <>
      {/* MOBILE OVERLAY */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={{
          x: isMobile ? (isOpen ? 0 : -280) : 0,
          width: isMobile ? 280 : isOpen ? 260 : 80,
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed top-0 left-0 h-screen z-50 flex flex-col bg-white border-r border-slate-100 shadow-2xl"
      >
        {/* Header */}
        <div className="h-20 flex items-center justify-between px-6 mb-4">
          <AnimatePresence mode="wait">
            {(isOpen || isMobile) && (
              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={WasteLogo}
                alt="logo"
                className="w-32 h-auto object-contain"
              />
            )}
          </AnimatePresence>
        

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-xl text-emerald-600 cursor-pointer bg-emerald-50 hover:bg-emerald-100 transition-colors"
          >
            {isOpen ? <FaTimes size={16} /> : <FaBars size={16} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto no-scrollbar">
          {filteredMenu.map((item) => {
            const Icon = item.icon;
            const hasChildren = item.children?.length > 0;
            const isActive = location.pathname === item.url;

            return (
              <div key={item.title} className="group">
                <Link
                  to={hasChildren ? "#" : item.url}
                  onClick={() => {
                    if (hasChildren) toggleExpand(item.title);
                    else if (isMobile) setIsOpen(false); // Auto-close on mobile
                  }}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-lg "
                      : "text-slate-500 hover:bg-slate-50 hover:text-emerald-600"
                  }`}
                >
                  <Icon size={size} />
                  {(isOpen || isMobile) && (
                    <Typography className="font-medium flex-1 truncate">{item.title}</Typography>
                  )}
                  {(isOpen || isMobile) && hasChildren && (
                    <FaChevronRight className={`text-[10px] transition-transform ${expanded === item.title ? "rotate-90" : ""}`} />
                  )}
                </Link>

                {/* Submenu */}
                <AnimatePresence>
                  {(isOpen || isMobile) && expanded === item.title && hasChildren && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="ml-9 mt-1 space-y-1 border-l-2 border-slate-100"
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.url}
                          to={child.url}
                          onClick={() => isMobile && setIsOpen(false)}
                          className="block px-4 py-2 text-sm text-slate-500 hover:text-emerald-600"
                        >
                          {child.title}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-50 flex items-center gap-3">
          <Typography className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">{user.fullName.charAt(0)}</Typography>
          {(isOpen || isMobile) && (
            <div className="overflow-hidden flex flex-col">
              <Typography className="text-sm font-bold text-slate-700 truncate">{capitalizeFirst(user.fullName)}</Typography>
              <Typography className="text-xs text-slate-400 capitalize">{user.role}</Typography>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default SideBar;