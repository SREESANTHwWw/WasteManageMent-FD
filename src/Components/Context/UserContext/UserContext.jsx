import { createContext, useContext, useEffect, useState } from "react";
import api from "../../../Api/APi";

const UserContext = createContext();

const guestUser = {
  role: "GUEST",
  isGuest: true,
  isAuthenticated: false,
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(guestUser);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);
  const [loginOpen, setLoginOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setUser(guestUser);
    setLoading(false);
  };

  const fetchUser = async () => {
    try {
      setLoading(true);

      const res = await api.get("/get/me");

      setUser({
        ...res.data.user,
        isGuest: false,
        isAuthenticated: true,
      });
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
      } else {
        setUser(guestUser);
        setLoading(false);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setUser(guestUser);
      setLoading(false);
    }
  }, [token]);

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        loading,
        fetchUser,
        logout,
        setToken,
        loginOpen, setLoginOpen
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useAuth = () => useContext(UserContext);