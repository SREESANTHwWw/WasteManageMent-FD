import {
  MdOutlineDashboard,
  MdOutlinePeople,
  MdOutlineLocationOn,
  MdOutlineAnalytics,
  MdOutlineAssignment,
  MdHistory,
  MdOutlineEmojiEvents,
  MdOutlineBarChart,
  MdOutlineFlag,
  MdOutlineLeaderboard,
} from "react-icons/md";
import {
  Leaf,
  Recycle,
  Zap,
  Droplets,
  TreePine,
  LayoutDashboard,
  ClipboardList,
  FileText,
  Trophy,
  Users,
  MapPin,
  BarChart2,
  PlusCircle,
  ListChecks,
  Megaphone,
} from "lucide-react";
import { RiRecycleLine, RiLeafLine, RiMedalLine, RiMapPin2Line } from "react-icons/ri";

const size = 24;

// Role hierarchy:
// guest    → public access only
// student  → guest + student-specific
// staff    → student + staff-specific (staff has ALL student permissions)
// admin    → everything

const menu = [
  // ── Overview (everyone) ───────────────────────────────────────
  {
    title: "Overview",
    url: "/",
    icon: LayoutDashboard,
    roles: ["guest", "student", "staff", ],
  },

  // ── Waste Reporting (guest + student + staff) ─────────────────
  {
    title: "Report Waste",
    url: "/dashboard/reportwaste",
    icon: PlusCircle,
    roles: ["guest", "student", "staff", ],
  },

  // ── My Activity (student + staff share same access) ───────────
  {
    title: "My Reports",
    url: "/dashboard/myreports",
    icon: ClipboardList,
    roles: ["student", "staff", ],
  },
  {
    title: "All Waste Reports",
    url: "/dashboard/wastereports",
    icon: FileText,
    roles: ["staff", ],
  },
    {
    title: "Campaigns",
    url: "/dashboard/campaigns",
    icon: ClipboardList,
    roles: ["student", "staff","guest" ],
  },
  {
    title: "My Rank",
    url: "/dashboard/myrank",
    icon: MdOutlineLeaderboard,
    roles: ["student", "staff", ],
  },
  {
    title: "Rewards",
    url: "/dashboard/rewards",
    icon: RiMedalLine,
    roles: ["student", "staff", ],
  },

  // ── Staff-level (staff + admin) ───────────────────────────────

  // {
  //   title: "Eco Collected",
  //   url: "/dashboard/bins",
  //   icon: RiMapPin2Line,
  //   roles: ["staff", "admin"],
  // },

  // ── Admin only ────────────────────────────────────────────────
  {
    title: "Analytics",
    url: "/admin",
    icon: BarChart2,
    roles: ["admin"],
  },
    {
    title: "All Waste Reports",
    url: "/admin/allwaste",
    icon: FileText,
    roles: [ "admin"],
  },
  {
    title: "All Staffs",
    url: "/admin/allstaffs",
    icon: Users,
    roles: ["admin"],
  },
   {
    title: "All Students",
    url: "/admin/allstudents",
    icon: Users,
    roles: ["admin"],
  },
  {
    title: "Create Campaign",
    url: "/admin/campaignform",
    icon: Megaphone,
    roles: ["admin"],
  },
  {
    title: "All Campaigns",
    url: "/admin/allcampaign",
    icon: ListChecks,
    roles: ["admin"],
  },
    {
    title: "Cleaning Staff",
    url: "/admin/cleaingstaff",
    icon: ListChecks,
    roles: ["admin"],
  },
];

export { size };
export default menu;