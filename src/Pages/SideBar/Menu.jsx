
import {
  MdOutlineDashboard,
  MdOutlinePeople,
  MdOutlineSettings,
  MdOutlineLogout,
  MdOutlineLocationOn,
  MdOutlineAnalytics,
  MdOutlineAssignment,
MdHistory 
} from "react-icons/md";
import { RiRecycleLine } from "react-icons/ri";

const size = 24;

const menu = [
  { 
    title: "Overview", 
    url: "/home", 
    icon: MdOutlineDashboard, 
    roles: ["student", "staff", "admin"] 
  },
  { 
    title: "Report Waste", 
    url: "/home/reportwaste", 
    icon: MdOutlineAssignment, 
    roles: ["student", ] 
  },
  {
     title:"My Reports",
     url:"/home/myreports",
     icon:MdHistory,
     roles:["student"]

  },
    {
     title:"My Rank",
     url:"/home/myrank",
     icon:MdHistory,
     roles:["student"]

  },
  { 
    title: "Collected Waste", 
    url: "/bins", 
    icon: MdOutlineLocationOn, 
    roles: ["staff", "admin"] 
  },
  {
    title: "Rewards",
    url: "/rewards",
    icon: RiRecycleLine,
    roles: ["student"]
  },
  { 
    title: "Campus Users", 
    url: "/users", 
    icon: MdOutlinePeople, 
    roles: ["admin"] 
  },
  { 
    title: "Impact Analytics", 
    url: "/analytics", 
    icon: MdOutlineAnalytics, 
    roles: ["staff", "admin"] 
  },
  { 
    title: "Settings", 
    url: "/settings", 
    icon: MdOutlineSettings, 
    roles: ["student", "staff", "admin"] 
  },

];

export { size };
export default menu;