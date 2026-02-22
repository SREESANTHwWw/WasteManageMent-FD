import {
  MdOutlineDashboard,
  MdOutlinePeople,
  MdOutlineSettings,
  MdOutlineLocationOn,
  MdOutlineAnalytics,
  MdOutlineAssignment,
  MdHistory,
  MdLogin,
} from "react-icons/md";
import { RiRecycleLine } from "react-icons/ri";

const size = 24;

const menu = [
  // Public (Guest)
  {
    title: "Overview",
    url: "/",
    icon: MdOutlineDashboard,
    roles: ["guest", "student", "admin"],
  },
  {
    title: "Overview",
   url: "/dashboard/staffoverview",
    icon: MdOutlineDashboard,
    roles: [ "staff", "admin"],
  },


    {
    title: "Waste",
    url: "/dashboard/wastereports",
    icon: MdOutlineAnalytics,
    roles: ["staff", "admin"],
  },

  // Student
  {
    title: "Report New Waste",
    url: "/dashboard/reportwaste",
    icon: MdOutlineAssignment,
    roles: ["student","staff"],
  },
  {
    title: "My Reports",
    url: "/dashboard/myreports",
    icon: MdHistory,
    roles: ["student","guest","staff"],
  },
  {
    title: "My Rank",
    url: "/dashboard/myrank",
    icon: MdHistory,
    roles: ["student","guest"],
  },
  {
    title: "Rewards",
    url: "/dashboard/rewards",
    icon: RiRecycleLine,
    roles: ["student"],
  },

  // Staff/Admin
  {
    title: "Collected Waste",
    url: "/dashboard/bins",
    icon: MdOutlineLocationOn,
    roles: ["staff", "admin"],
  },


  // Admin
  {
    title: "Campus Users",
    url: "/dashboard/users",
    icon: MdOutlinePeople,
    roles: ["admin"],
  },

  // Common (logged-in)
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: MdOutlineSettings,
    roles: ["student", "staff", "admin"],
  },
];

export { size };
export default menu;
