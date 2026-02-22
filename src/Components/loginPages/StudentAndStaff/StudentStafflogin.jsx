import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { TextController, Typography } from "../../../@All/Tags/Tags";
import { X, GraduationCap, ShieldCheck } from "lucide-react";
import WasteLogo from "../../../assets/WasteLogo.png";
import api from "../../../Api/APi";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/UserContext/UserContext";
const StudentStaffLogin = ({ onclose,setRegisterOpen }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const { setToken } = useAuth();
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      admissionNumber: "",
      dob: "",
      staffID: "",
      dateOfBirth: "",
    },
  });

  const handleRegister = ()=>{
         setRegisterOpen(true)
         onclose()
  }

  const onSubmit = async (data) => {
    try {
      let res;

      if (!isAdmin) {
        // STUDENT LOGIN
        const payload = {
          admissionNumber: data.admissionNumber,
          dateOfBirth: data.dob, // mapping
        };

        res = await api.post("/login/student", payload);
      } else {
        // STAFF LOGIN (example – adjust endpoint if needed)
        const payload = {
          staffID: data.staffID,
          dateOfBirth: data.dateOfBirth,
        };

        res = await api.post("/login/staff", payload);
      }

      // ✅ success handling
      if (res.data?.success) {
        setToken(res.data.token);
        localStorage.setItem("token", res.data.token);
        const user = res.data.student || res.data.staff;
          
        localStorage.setItem(
          "user",
          JSON.stringify({
            role: user.role,
            fullName: user.fullName,
          }),
        );

        // optional toast
        toast.success(res.data.msg);
         onclose()
        // redirect
        navigate("/");
      }
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.msg || "Login failed");
    }
  };

  const toggleRole = (val) => {
    setIsAdmin(val);
    reset();
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className=" fixed inset-0 z-50 backdrop-blur-2xl bg-black/50  flex items-center justify-center p-4    ">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-5xl w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-162.5 border border-white/20"
      >
        {/* Left Side: Branding & Logo */}
        <div
          className="md:w-[45%] p-12 text-white relative flex flex-col justify-between overflow-hidden"
          style={{
            background:
              "var(--eco-gradient, linear-gradient(135deg, #059669 0%, #065f46 100%))",
          }}
        >
          {/* Decorative Background Elements */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10 blur-3xl bg-white"
          />

          {/* Logo Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="z-10 flex flex-col items-start"
          >
            <div className="bg-white backdrop-blur-md p-4 rounded-2xl mb-8 border border-white/20">
              <img
                src={WasteLogo}
                alt="Logo"
                className="h-16 w-16 object-fill"
              />
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            key={isAdmin ? "staff-bg" : "student-bg"}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="z-10 mt-auto"
          >
            <div className="mb-4 inline-flex items-center gap-2 bg-white/20 px-4 py-1 rounded-full text-xs font-medium uppercase tracking-widest">
              {isAdmin ? (
                <ShieldCheck size={14} />
              ) : (
                <GraduationCap size={14} />
              )}
              {isAdmin ? "Faculty Access" : "Learner Portal"}
            </div>
            <h1 className="text-5xl font-extrabold mb-6 tracking-tight leading-tight">
              {isAdmin ? "Staff \nPortal" : "Student \nHub"}
            </h1>
            <Typography className="opacity-80 text-lg leading-relaxed max-w-sm">
              {isAdmin
                ? "Manage your classes and access faculty resources in our sustainable ecosystem."
                : "Check your grades and grow your knowledge within the Emerald community."}
            </Typography>
          </motion.div>

          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-(--eco-accent,#fbbf24) rounded-full opacity-20 blur-2xl" />
        </div>

        {/* Right Side: Form */}
        <div className="md:w-[55%] p-8 md:p-16 flex flex-col justify-center bg-white relative">
          {/* Close Button */}
          <button
            onClick={onclose}
            className="absolute top-6 right-6 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all cursor-pointer z-20"
          >
            <X size={24} />
          </button>

          <div className="max-w-md mx-auto w-full">
            <header className="mb-10 text-center md:text-left flex flex-col">
              <Typography className="text-2xl font-bold text-gray-800 mb-2">
                Welcome Back
              </Typography>
              <Typography className="text-gray-500 text-sm">
                Please enter your details to continue
              </Typography>
            </header>

            {/* Toggle Switch */}
            <div className="relative flex bg-gray-100 p-1 rounded-2xl mb-10">
              <motion.div
                className="absolute top-1 bottom-1 left-1 bg-white rounded-xl shadow-md z-0"
                animate={{ x: isAdmin ? "100%" : "0%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{ width: "calc(50% - 4px)" }}
              />
              <button
                type="button"
                onClick={() => toggleRole(false)}
                className={`flex-1 py-3 z-10 text-xs font-bold cursor-pointer uppercase tracking-wider transition-colors duration-300 ${!isAdmin ? "text-emerald-600" : "text-gray-400"}`}
              >
                <Typography> Student</Typography>
              </button>
              <button
                type="button"
                onClick={() => toggleRole(true)}
                className={`flex-1 py-3 z-10 text-xs font-bold uppercase cursor-pointer tracking-wider transition-colors duration-300 ${isAdmin ? "text-emerald-600" : "text-gray-400"}`}
              >
                <Typography> Staff</Typography>
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.form
                key={isAdmin ? "staff" : "student"}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, x: 20 }}
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {!isAdmin ? (
                  <>
                    <motion.div variants={fadeUp}>
                      <TextController
                        name="admissionNumber"
                        label="Admission Number"
                        placeholder="ADM-2026-001"
                        control={control}
                        errors={errors}
                      />
                    </motion.div>
                    <motion.div variants={fadeUp}>
                      <TextController
                        name="dob"
                        label="Date of Birth"
                        placeholder="DDMMYYYY"
                        control={control}
                        errors={errors}
                      />
                    </motion.div>
                  </>
                ) : (
                  <>
                    <motion.div variants={fadeUp}>
                      <TextController
                        name="staffID"
                        label="Staff ID"
                        placeholder="EMP-8822"
                        control={control}
                        errors={errors}
                      />
                    </motion.div>
                    <motion.div variants={fadeUp}>
                      <TextController
                        name="dateOfBirth"
                        label="DOB"
                        type="text"
                        placeholder="25072003"
                        control={control}
                        errors={errors}
                      />
                    </motion.div>
                  </>
                )}

                <motion.button
                  whileHover={{
                    y: -2,
                    boxShadow: "0 20px 25px -5px rgba(5, 150, 105, 0.2)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full text-white  cursor-pointer font-bold py-5 rounded-2xl shadow-lg transition-all mt-4 uppercase tracking-[0.2em] text-xs"
                  style={{ backgroundColor: "var(--main-web-color, #059669)" }}
                >
                  Enter Portal
                </motion.button>
              </motion.form>
            </AnimatePresence>

            <div className="mt-3 flex flex-col items-center gap-4">
              <button
                onClick={handleRegister}
                whileHover={{ scale: 1.05 }}
                className="text-[11px] font-extrabold uppercase cursor-pointer tracking-[0.2em] text-emerald-600 hover:text-emerald-700 transition-colors bg-emerald-50 px-6 py-2 rounded-full"
              >
                <Typography>New here? Create Account</Typography>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentStaffLogin;
