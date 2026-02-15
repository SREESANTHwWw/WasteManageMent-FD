import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Bell, ChevronDown, LogOut, User, Menu } from "lucide-react";
import SideBar from "../SideBar/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import StudentStaffLogin from "../../Components/loginPages/StudentAndStaff/StudentStafflogin";
import { Typography } from "../../@All/Tags/Tags";
import { capitalizeFirst } from "../../functions/capitalizeFirst";
import { useAuth } from "../../Components/Context/UserContext/UserContext";

const HomeLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const token = localStorage.getItem("token");
  const {logout} = useAuth()
  // Initialize sidebar closed on mobile, open on desktop
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

  const user = JSON.parse(localStorage.getItem("user"));

  // Calculate margins: On mobile, main content is always full width (0 margin)
  const dynamicMargin = isMobile ? 0 : sidebarOpen ? 260 : 80;

  return (
    <div className="w-full min-h-screen bg-slate-50/50">
      <SideBar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} user={user} />

      {loginOpen && <StudentStaffLogin onclose={() => setLoginOpen(false)} />}

      {/* TOP NAVBAR */}
      <motion.header
        initial={false}
        animate={{ left: dynamicMargin }}
        className="fixed top-0 right-0 h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex justify-between items-center px-4 md:px-8 z-30"
      >
        <div className="flex items-center gap-4">
          {/* Mobile Hamburger - Only visible when sidebar is closed on mobile */}
          {isMobile && !sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-slate-600 cursor-pointer hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
          )}

          <h1 className="text-sm font-medium text-slate-400 hidden sm:block">
            <Typography> Pages / </Typography>
            <Typography className="text-slate-900 font-semibold">
              {capitalizeFirst(location.pathname.split("/").pop())}
            </Typography>
          </h1>
        </div>
        <div className="flex items-center gap-3 select-none">
          {/* The Icon Accent */}
          <motion.div
            initial={{ rotate: -20, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="bg-emerald-100 p-2 rounded-xl"
          >
            <span className="text-xl">🌿</span>
          </motion.div>

          {/* The Text */}
          <div className="flex flex-col">
            <Typography className="text-2xl font-black tracking-tighter leading-none bg-linear-to-r from-emerald-600 via-emerald-500 to-teal-600 bg-clip-text text-transparent italic">
              CleanCore
            </Typography>

            {/* Subtle Subtitle/Tagline */}
            <div className="flex items-center gap-1">
              <div className="h-px w-4 bg-emerald-200" />
              <Typography className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400">
                Eco-System
              </Typography>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <button className="relative p-2 text-slate-400 hover:bg-slate-50 rounded-full">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            {!token ? (
              <button
                onClick={() => navigate("/")}
                className="w-24 h-9  bg-(--main-web-color) shadow-2xl font-semibold cursor-pointer rounded-lg text-white"
              >
                <Typography> login</Typography>
              </button>
            ) : (
              <>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 cursor-pointer md:gap-3 p-1 rounded-full hover:bg-slate-50 transition-all"
                >
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-bold shadow-lg ">
                    <Typography className="text-xl">
                      {capitalizeFirst(user.fullName.charAt(0))}
                    </Typography>
                  </div>
                  <ChevronDown size={14} className="text-slate-400" />
                </button>
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0  mt-3 w-48 bg-white border border-slate-100 shadow-2xl rounded-2xl py-2 z-50"
                    >
                      {/* <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
                      <User size={16} /> Profile
                    </button> */}
                      <button
                        onClick={() => {
                          logout(); 
                          navigate("/", { replace: true });
                        }}
                        className="flex cursor-pointer items-center gap-3 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 mt-1"
                      >
                        <LogOut size={16} /> <Typography>Logout</Typography>
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
