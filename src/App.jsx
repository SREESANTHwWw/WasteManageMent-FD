import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Toaster } from "react-hot-toast";

import ProtectedRoute from "./Components/ProtectRoute/ProtectRoue";
import LoadingState from "./@All/LoadingScreens/MainLoading";
import Error404 from "./@All/404/Page404";
import CampusRank from "./Components/CampusRank/CampusRank";
import RewardGate from "./Components/Reward/Reward";
import WasteReports from "./Components/WasteReports/WasteReports";
import StaffOverview from "./Components/StaffOverView/StaffOverView";
import { useAuth } from "./Components/Context/UserContext/UserContext";
import RoleBaseDashboard from "./Components/ProtectRoute/RoleBaseDashboard";
import AdminLayout from "./Pages/Layout/AdminLayout";
import AdminLoginPage from "./Components/loginPages/AdminLoginPage";
import ProtectedAdminRoute from "./Components/ProtectRoute/ProtectedAdminRoute";
import EcoAnalytics from "./Components/AdminComp/EcoAnalytics/EcoAnalytics";
import CampaignForm from "./Components/AdminComp/CampaignForm/CampaignForm";
import AllCampaigns from "./Components/AdminComp/CampaignForm/AllCampaigns";
import AllStaffs from "./Components/AdminComp/Allstaffs/AllStaffs";
import AllStudents from "./Components/AdminComp/AllStudent/AllStudents";
import CleaningStaffAdmin from "./Components/AdminComp/CleaningStaffs/CleaningStaffAdmin";
import CampaignsPage from "./Components/Usercampaign/CampaignsPage";
import AdminWasteReports from "./Components/AdminComp/AllWasterReportsAdmin/AdminWasteReports";

// Lazy imports
const HomeLayout = lazy(() => import("./Pages/Layout/HomeLayout"));
const Overview = lazy(() => import("./Components/OverView/Overview"));
const ReportWaste = lazy(() => import("./Components/ReportWaste/ReportWaste"));
const StudentStaffLogin = lazy(
  () => import("./Components/loginPages/StudentAndStaff/StudentStafflogin")
);
const Register = lazy(() => import("./Components/Register/Register"));
const MyReports = lazy(() => import("./Components/MyReports/MyReports"));

const App = () => {
  const { user } = useAuth();

  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<LoadingState />}>
          <Routes>
            {/* PUBLIC / GUEST ROUTES */}
             <Route path="/login" element={<StudentStaffLogin />} />
              <Route path="/register" element={<Register />} />
            <Route path="/" element={<HomeLayout />}>
              <Route index element={<Overview/>} />
             

              {/* guest also can report waste */}
              <Route path="reportwaste" element={<ReportWaste />} />
            </Route>

            {/* USER DASHBOARD ROUTES */}
            <Route path="/dashboard" element={<HomeLayout />}>
              {/* student + staff only */}
              <Route
                index
                element={
                  <ProtectedRoute allowedRoles={["student", "staff"]}>
                     <Overview />
                  </ProtectedRoute>
                }
              />

              {/* guest can also access report waste */}
              <Route path="reportwaste" element={<ReportWaste />} />

              {/* student + staff only */}
              <Route
                path="myreports"
                element={
                  <ProtectedRoute allowedRoles={["student", "staff"]}>
                    <MyReports />
                  </ProtectedRoute>
                }
              />
               <Route
                path="campaigns"
                element={
                  <ProtectedRoute allowedRoles={["student", "staff"]}>
                    <CampaignsPage/>
                  </ProtectedRoute>
                }
              />

              <Route
                path="myrank"
                element={
                  <ProtectedRoute allowedRoles={["student", "staff"]}>
                    <CampusRank />
                  </ProtectedRoute>
                }
              />

              <Route
                path="rewards"
                element={
                  <ProtectedRoute allowedRoles={["student", "staff"]}>
                    <RewardGate />
                  </ProtectedRoute>
                }
              />

              {/* staff only */}
              <Route
                path="wastereports"
                element={
                  <ProtectedRoute allowedRoles={["staff"]}>
                    <WasteReports />
                  </ProtectedRoute>
                }
              />

              <Route
                path="staffoverview"
                element={
                  <ProtectedRoute allowedRoles={["staff"]}>
                    <StaffOverview />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* ADMIN */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout />
                </ProtectedAdminRoute>
              }
            >
              <Route index element={<EcoAnalytics />} />
              <Route path="allwaste" element={<AdminWasteReports />} />
              <Route path="campaignform" element={<CampaignForm />} />
              <Route path="allcampaign" element={<AllCampaigns />} />
              <Route path="allstaffs" element={<AllStaffs />} />
              <Route path="allstudents" element={<AllStudents />} />
              <Route path="cleaingstaff" element={<CleaningStaffAdmin />} />
              
            </Route>

            {/* 404 */}
            <Route path="*" element={<Error404 />} />
          </Routes>
        </Suspense>
      </BrowserRouter>

      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};

export default App;