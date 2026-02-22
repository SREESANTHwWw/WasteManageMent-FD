import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Toaster } from "react-hot-toast";

import ProtectedRoute from "./Components/ProtectRoute/ProtectRoue";
import PublicRoute from "./Components/ProtectRoute/PublicRoute";
import LoadingState from "./@All/LoadingScreens/MainLoading";
import Error404 from "./@All/404/Page404";
import CampusRank from "./Components/CampusRank/CampusRank";
import RewardGate from "./Components/Reward/Reward";
import WasteReports from "./Components/WasteReports/WasteReports";
import StaffOverview from "./Components/StaffOverView/StaffOverView";

// Lazy imports
const HomeLayout = lazy(() => import("./Pages/Layout/HomeLayout"));
const Overview = lazy(() => import("./Components/OverView/Overview"));
const ReportWaste = lazy(() => import("./Components/ReportWaste/ReportWaste"));
const StudentStaffLogin = lazy(() =>
  import("./Components/loginPages/StudentAndStaff/StudentStafflogin")
);
const Register = lazy(() => import("./Components/Register/Register"));
const MyReports = lazy(() => import("./Components/MyReports/MyReports"));

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<LoadingState />}>
          <Routes>

            {/* 🔓 Public Home */}
            <Route path="/" element={<HomeLayout />}>
              <Route index element={<Overview />} />
            </Route>

            {/* 🔓 Public Login */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <StudentStaffLogin />
                </PublicRoute>
              }
            />

            <Route path="/register" element={<Register />} />

            {/* 🔐 Protected Dashboard */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <HomeLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Overview />} />
              <Route path="reportwaste" element={<ReportWaste />} />
              <Route path="myreports" element={<MyReports />} />
              <Route path="myrank" element={<CampusRank />} />
              <Route path="rewards" element={<RewardGate/>}/>
              <Route path="wastereports" element ={<WasteReports/>}/>
              <Route path="staffoverview" element = {<StaffOverview/>}/>
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
