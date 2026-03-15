import React, { useState } from "react";
import axios from "axios";
import { Leaf, Lock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../Api/APi";

const AdminLoginPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.userName.trim() || !formData.password.trim()) {
      setError("Username and password are required");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/admin/login", 
        {
          userName: formData.userName,
          password: formData.password,
        }
      );

      const data = response.data;

      setSuccess(data?.msg || "Login successful");

      // save token if backend sends token
      if (data?.token) {
        localStorage.setItem("AdminToken", data.token);
      }
      if(data?.userName){
        localStorage.setItem("AdminUserName", data.userName);
      }
      if(data?.role){
        localStorage.setItem("adminRole", data.role);
      }

      // save admin info if needed
      if (data?.admin) {
        localStorage.setItem("adminData", JSON.stringify(data.admin));
      }

      // navigate to admin dashboard
      setTimeout(() => {
        navigate("/admin");
      }, 1000);
    } catch (err) {
      console.log(err);

      setError(
        err?.response?.data?.msg || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f7ee] p-4 relative">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-green-100 rounded-full mix-blend-multiply blur-3xl opacity-70"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-100 rounded-full mix-blend-multiply blur-3xl opacity-70"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-green-50">
        <div className="bg-[#2d5a27] p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
            <Leaf className="text-white w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-wider">
            Green Campus
          </h2>
          <p className="text-green-100 text-sm mt-1">Administrator Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 border border-red-200 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-700 border border-green-200 rounded-lg px-4 py-3 text-sm">
              {success}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <User size={18} />
              </span>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                placeholder="admin_username"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <Lock size={18} />
              </span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-200 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#2d5a27] hover:bg-[#23461f] hover:shadow-lg"
            }`}
          >
            {loading ? "Signing In..." : "Sign In to Dashboard"}
          </button>

          <div className="text-center">
            <a href="#" className="text-sm text-green-700 hover:underline">
              Forgot password?
            </a>
          </div>
        </form>

        <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500">
            &copy; 2026 The Green Campus Project. Secure Admin Access.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;