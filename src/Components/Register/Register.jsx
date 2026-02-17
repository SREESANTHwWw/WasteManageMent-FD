import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { X, Leaf, GraduationCap, ShieldCheck } from "lucide-react";
import { TextController, Typography } from "../../@All/Tags/Tags";
import api from "../../Api/APi";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const Register = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate()

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      admissionNumber: "",
      staffID: "",
      dob: "",
      password: "",
    },
  });

const onSubmit = async (data) => {
  try {
    let payload;
    let res;

    if (!isAdmin) {
      // Student
      payload = {
        fullName: data.fullName,
        email: data.email,
        admissionNumber: data.admissionNumber,
        dateOfBirth: data.dateOfBirth,
      };

      res = await api.post("/create/student", payload);

      if (res.data?.success) {
        toast.success("Student Account Created 🎉");
      }
    } else {
      // Staff
      payload = {
        fullName: data.fullName,
        email: data.email,
        staffID: data.staffID,
        dateOfBirth: data.dateOfBirth,
      };

      res = await api.post("/create/staff", payload);

      if (res.data?.success) {
        toast.success("Staff Account Created 🎉");
      }
    }

    reset();
    navigate("/")
  } catch (error) {
    toast.error(
      error.response?.data?.msg || "Something went wrong"
    );
    console.error(error);
  }
};


  const toggleRole = (val) => {
    setIsAdmin(val);
    reset();
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-5xl w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-full border border-(--eco-border)"
      >
        {/* Left Side: Branding */}
        <div
          className="md:w-5/12 p-12 text-white relative flex flex-col justify-between overflow-hidden"
          style={{
            background:
              "var(--eco-gradient, linear-gradient(135deg, #059669 0%, #065f46 100%))",
          }}
        >
          <div className="z-10 flex flex-col">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/10"
            >
              <Leaf size={32} className="text-white" />
            </motion.div>
            < Typography  className="text-4xl font-bold mb-4 tracking-tight leading-tight">
              {isAdmin ? "Staff \nOnboarding" : "Student \nRegistration"}
            </Typography>
            <Typography className="opacity-90 text-lg leading-relaxed max-w-xs">
              {isAdmin
                ? "Join our faculty to mentor the next generation of eco-innovators."
                : "Start your journey in the Emerald ecosystem and track your academic growth."}
            </Typography>
          </div>

          <div className="z-10 text-xs font-medium opacity-60 tracking-widest uppercase">
         <Typography> © 2026 Emerald Eco • Secure Portal</Typography>  
          </div>

          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-20 blur-3xl bg-(--eco-accent,#fbbf24)"
          />
        </div>

        {/* Right Side: Form */}
        <div className="md:w-7/12 p-8 md:p-8 flex flex-col justify-center bg-white relative">
          <div className="mb-8 flex flex-col">
            <Typography className="text-3xl font-bold text-gray-800">Create Account</Typography>
            <Typography className="text-gray-400 mt-2 font-medium">
              Join the sustainable learning movement.
            </Typography>
          </div>

          {/* Role Toggle Switch - Matching Login Design */}
          <div className="relative flex bg-gray-100 p-1.5 rounded-2xl mb-8 w-full max-w-xs">
            <motion.div
              className="absolute top-1.5 bottom-1.5 left-1.5 bg-white rounded-xl shadow-sm z-0"
              animate={{ x: isAdmin ? "100%" : "0%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{ width: "calc(50% - 6px)" }}
            />
            <button
              type="button"
              onClick={() => toggleRole(false)}
              className={`flex-1 py-2.5 z-10 text-xs font-bold cursor-pointer uppercase tracking-wider transition-colors duration-300 flex items-center justify-center gap-2 ${!isAdmin ? "text-emerald-600" : "text-gray-400"}`}
            >
              <GraduationCap size={14} /><Typography>Student</Typography> 
            </button>
            <button
              type="button"
              onClick={() => toggleRole(true)}
              className={`flex-1 py-2.5 z-10 text-xs font-bold uppercase cursor-pointer tracking-wider transition-colors duration-300 flex items-center justify-center gap-2 ${isAdmin ? "text-emerald-600" : "text-gray-400"}`}
            >
              <ShieldCheck size={14} /> <Typography>Staff</Typography>
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={isAdmin ? "staff-reg" : "student-reg"}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, x: -10 }}
              variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2"
            >
              <motion.div variants={fadeUp} className="md:col-span-2">
                <TextController
                  name="fullName"
                  label="Full Name"
                  placeholder="Enter your full name"
                  control={control}
                  errors={errors}
                />
              </motion.div>

              <motion.div variants={fadeUp}>
                <TextController
                  name="email"
                  label="Email Address"
                  placeholder="name@example.com"
                  type="email"
                  control={control}
                  errors={errors}
                />
              </motion.div>

              {/* Dynamic Fields based on Role */}
              {!isAdmin ? (
                <>
                  <motion.div variants={fadeUp}>
                    <TextController
                      name="dateOfBirth"
                      label="Date of Birth"
                      placeholder="DD/MM/YYYY"
                      control={control}
                      errors={errors}
                    />
                  </motion.div>
                  <motion.div variants={fadeUp} className="md:col-span-2">
                    <TextController
                      name="admissionNumber"
                      label="Admission Number"
                      placeholder="ADM-2026-XXXX"
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
                      placeholder="EMP-XXXX"
                      control={control}
                      errors={errors}
                    />
                  </motion.div>
                  <motion.div variants={fadeUp} className="md:col-span-2">
                    <TextController
                      name="dateOfBirth"
                      label="Date of Birth"
                      placeholder="DD/MM/YYYY"
                      control={control}
                      errors={errors}
                    />
                  </motion.div>
                </>
              )}

              <motion.div variants={fadeUp} className="md:col-span-2 mt-6">
                <motion.button
                  whileHover={{
                    y: -2,
                    boxShadow: "0 15px 30px -10px rgba(5, 150, 105, 0.4)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full text-white font-bold py-4 cursor-pointer rounded-2xl shadow-xl transition-all uppercase tracking-[0.2em] text-xs"
                  style={{ backgroundColor: "var(--main-web-color, #059669)" }}
                >
                <Typography>Create Account</Typography>  
                </motion.button>
              </motion.div>
            </motion.form>
          </AnimatePresence>

          <div className="mt-8 text-center text-xs font-bold uppercase tracking-widest">
            <Typography Account className="text-gray-400">Already a member? </Typography>
            <Link
              to="/login"
              className="hover:underline transition-all"
              style={{ color: "var(--main-web-color, #059669)" }}
            >
            <Typography>Log In</Typography>  
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
