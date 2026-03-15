import LoadingState from "../../@All/LoadingScreens/MainLoading";
import { useAuth } from "../Context/UserContext/UserContext";
import Overview from "../OverView/Overview";
import StaffOverView from "../StaffOverView/StaffOverView";


const RoleBaseDashboard = () => {
  const { user } = useAuth();

  if (!user) return <LoadingState />;

  return user.role === "staff" ? <StaffOverView /> : <Overview />;
};

export default RoleBaseDashboard