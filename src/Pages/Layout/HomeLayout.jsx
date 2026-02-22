import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  LogOut,
  User,
  Menu,
  Trophy,
  Leaf,
} from "lucide-react";
import SideBar from "../SideBar/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import StudentStaffLogin from "../../Components/loginPages/StudentAndStaff/StudentStafflogin";
import { Typography } from "../../@All/Tags/Tags";
import { capitalizeFirst } from "../../functions/capitalizeFirst";
import { useAuth } from "../../Components/Context/UserContext/UserContext";
import Register from "../../Components/Register/Register";

const HomeLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen ,setRegisterOpen] =useState(false)


  // Auth & User Data
  const token = localStorage.getItem("token");
  const userData =JSON.parse(localStorage.getItem("user") || "{}") || defaultUSer;
  const { user } = useAuth();
  // Reward Points Logic (assuming 'points' exists in your user object)
  const rewardPoints = user?.rewardPoint || 0;

  // Sidebar responsiveness
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Layout calculations
  const dynamicMargin = isMobile ? 0 : sidebarOpen ? 260 : 80;

  return (
    <div className="w-full min-h-screen bg-slate-50/50">
      <SideBar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        user={userData}
      />

      {loginOpen && <StudentStaffLogin onclose={() => setLoginOpen(false)} setRegisterOpen={setRegisterOpen} />}
        {registerOpen && <Register onclose={() => setRegisterOpen(false)}  setLoginOpen={setLoginOpen}  />  }

      {/* TOP NAVBAR */}
      <motion.header
        initial={false}
        animate={{ left: dynamicMargin }}
        className="fixed top-0 right-0 h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex justify-between items-center px-4 md:px-8 z-30"
      >
        <div className="flex items-center gap-4">
          {/* Mobile Hamburger */}
          {isMobile && !sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-slate-600 cursor-pointer hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
          )}

          <h1 className="text-sm font-medium text-slate-400 hidden lg:block">
            <Typography> Pages / </Typography>
            <Typography className="text-slate-900 font-semibold">
              {capitalizeFirst(
                location.pathname.split("/").pop() || "Dashboard",
              )}
            </Typography>
          </h1>
        </div>

        {/* LOGO SECTION */}
        <div className="flex items-center gap-3 select-none">
          <motion.div
            initial={{ rotate: -20, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="bg-emerald-100 p-2 rounded-xl"
          >
            <span className="text-xl">🌿</span>
          </motion.div>

          <div className="flex flex-col">
            <Typography className="text-xl md:text-2xl font-black tracking-tighter leading-none bg-linear-to-r from-emerald-600 via-emerald-500 to-teal-600 bg-clip-text text-transparent italic">
              Green Campus
            </Typography>
            <div className="flex items-center gap-1">
              <div className="h-px w-4 bg-emerald-200" />
              <Typography className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">
                Eco-System
              </Typography>
            </div>
          </div>
        </div>

        {/* ACTIONS SECTION */}
        <div className="flex items-center gap-3 md:gap-6">
          {/* REWARD POINTS BADGE */}
          {token && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-2 md:px-3 py-1.5 rounded-2xl"
            >
              <div className="bg-emerald-500 p-1 rounded-lg shadow-sm">
                <Trophy size={14} className="text-white" />
              </div>
              <div className="flex flex-col justify-center leading-none">
                <span className="hidden md:block text-[9px] font-bold text-emerald-600 uppercase tracking-wider">
                  Points
                </span>
                <Typography className="text-sm font-black text-slate-800">
                  {rewardPoints}
                </Typography>
              </div>
            </motion.div>
          )}

          <button className="relative p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          {/* PROFILE DROPDOWN */}
          <div className="relative">
            {!token ? (
              <button
                onClick={() => setLoginOpen(true)}
                className="px-6 h-9 bg-emerald-600 hover:bg-emerald-700 shadow-lg font-semibold cursor-pointer rounded-lg text-white transition-all"
              >
                <Typography> Login </Typography>
              </button>
            ) : (
              <>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 cursor-pointer p-1 rounded-full hover:bg-slate-50 transition-all"
                >
                  <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-bold shadow-md border-2 border-white">
                    <Typography className="text-lg uppercase">
                      {userData?.fullName?.charAt(0) || "U"}
                    </Typography>
                  </div>
                  <ChevronDown
                    size={14}
                    className={`text-slate-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-56 bg-white border border-slate-100 shadow-2xl rounded-2xl py-2 z-50 origin-top-right"
                    >
                      <div className="px-4 py-2 border-b border-slate-50 mb-1">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Account
                        </p>
                        <p className="text-sm font-bold text-slate-700 truncate">
                          {user?.fullName}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          logout();
                          
                        }}
                        className="flex cursor-pointer items-center gap-3 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={16} />
                        <Typography className="font-medium">Logout</Typography>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>
        </div>
      </motion.header>

      {/* MAIN CONTENT AREA */}
      <motion.main
        initial={false}
        animate={{ marginLeft: dynamicMargin }}
        className="p-4 md:p-8 min-h-screen"
        style={{ paddingTop: "104px" }}
      >
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </motion.main>
    </div>
  );
};

export default HomeLayout;
