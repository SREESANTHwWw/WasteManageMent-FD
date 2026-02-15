import { createContext, useContext, useEffect, useState } from "react";
import api from "../../../Api/APi";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");        // ✅ triggers effect
    setUser(null);
    setLoading(false);
  };

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await api.get("/get/me");
      setUser(res.data.user);
    } catch (err) {
      if (err.response?.status === 401) logout();
    } finally {
      setLoading(false);
    }
  };

  // ✅ whenever token changes -> fetch user
  useEffect(() => {
    if (token) fetchUser();
    else setLoading(false);
  }, [token]);

  return (
    <UserContext.Provider value={{ user, loading, fetchUser, logout, setToken }}>
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => useContext(UserContext);
