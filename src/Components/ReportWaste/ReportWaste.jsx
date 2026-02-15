import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  CheckCircle2,
  ChevronRight,
  X,
  Loader2,
  MapPin,
  Leaf,
  Sparkles,
  Info,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { TextController, Typography } from "../../@All/Tags/Tags";
import api from "../../Api/APi";
import { useAuth } from "../Context/UserContext/UserContext";
import ReportNotification from "./ReportNotification/ReportNotification";
import WasteCategory from "./CategoryPart/WasteCategory";

const ReportWaste = () => {
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [imagePreview, setImagePreview] = useState(null); // string (objectURL)
  const [imageFile, setImageFile] = useState(null); // File
  const [selectedCat, setSelectedCat] = useState("");
  const {user ,fetchUser}  = useAuth()
  console.log(user);
  
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: { location: "", description: "" },
  });

  // ✅ Backend enum values (note: "PAPPER" is from your backend typo)
  const categories = [
    { id: "PLASTIC", label: "Plastic", icon: "🥤" },
    { id: "ORGANIC", label: "Organic", icon: "🍎" },
    { id: "PAPER", label: "Paper", icon: "📄" },
    { id: "OTHERS", label: "Others", icon: "🗑️" },
  ];

  const clearImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
  };

  useEffect(() => {
    
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
   
  }, [imagePreview]);

  const onReportSubmit = async (data) => {
    if (!selectedCat) return toast.error("Please select a category");
    if (!imageFile) return toast.error("Please upload an image");

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("wasteLocation", data.location);
      formData.append("description", data.description || "");
      formData.append("wasteCategory", selectedCat);
      formData.append("wasteImage", imageFile);

     
      const res = await api.post("/report/waste", formData);

      if (res?.data?.success) {
        setShowModal(true);
        toast.success("Report submitted successfully");
        await fetchUser()
      } else {
        toast.error(res?.data?.msg || "Report failed");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.msg || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCat("");
    clearImage();
    reset();
  };

  // Animation variants
  const staggerContainer = {
    animate: { transition: { staggerChildren: 0.1 } },
  };

      const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <div className="relative min-h-[calc(100vh-100px)] flex items-center justify-center p-4">
    
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-[10%] -right-[10%] w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], x: [0, 50, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute bottom-0 -left-[5%] w-80 h-80 bg-blue-100/30 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="relative w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-6"
      >
        {/* Header Section */}
        <motion.div
          variants={fadeInUp}
          className="lg:col-span-12 flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                Eco-System v2.4
              </span>
            </div>
            <Typography className="text-4xl font-black tracking-tight text-slate-800">
              New Impact <span className="text-emerald-500">Report</span>
            </Typography>
          </div>

          <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md p-2 pr-6 rounded-2xl border border-white shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
              <Sparkles size={18} />
            </div>
            <div className="flex flex-col">
              <Typography className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">
                Potential Reward
              </Typography>
              <Typography className="text-sm font-black text-slate-800 leading-none">
                {user?.rewardPoint} Eco-Points
              </Typography>
            </div>
          </div>
        </motion.div>

        {/* Left Side: Category Selection */}
      
        <WasteCategory categories={categories} selectedCat={selectedCat} setSelectedCat={setSelectedCat}/>

        {/* Right Side: Form */}
        <motion.div variants={fadeInUp} className="lg:col-span-8">
          <form onSubmit={handleSubmit(onReportSubmit)} className="space-y-4">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Image Upload Area */}
                <div className="space-y-4">
                  <Typography className="text-xs font-black uppercase tracking-widest text-slate-400">
                    Media Proof
                  </Typography>

                  <div className="relative aspect-video md:aspect-square w-full">
                    {imagePreview ? (
                      <div className="relative w-full h-full rounded-4xl overflow-hidden border-4 border-white shadow-lg">
                        <img
                          src={imagePreview}
                          className="w-full h-full object-cover"
                          alt="Waste"
                        />

                        <button
                          type="button"
                          onClick={clearImage}
                          className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-md rounded-full text-rose-500 hover:scale-110 transition-transform shadow-md"
                          aria-label="Remove image"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-slate-200 rounded-4xl bg-slate-50/50 cursor-pointer hover:bg-emerald-50 hover:border-emerald-300 transition-all group">
                        <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors">
                          <Camera size={24} />
                        </div>
                        <Typography className="text-[10px] font-black uppercase text-slate-400 mt-4 tracking-tighter">
                          Click to capture
                        </Typography>

                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                          
                            if (imagePreview) URL.revokeObjectURL(imagePreview);

                            const previewUrl = URL.createObjectURL(file);
                            setImageFile(file);
                            setImagePreview(previewUrl);

                           
                            e.target.value = "";
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Text Inputs Area */}
                <div className="flex flex-col justify-between py-2">
                  <div className="space-y-6">
                    <div className="relative">
                      <MapPin className="absolute right-4 top-10 text-emerald-500" size={18} />
                      <TextController
                        name="location"
                        label="Discovery Point"
                        placeholder="e.g. Science Block Floor 2"
                        control={control}
                        errors={errors}
                      />
                    </div>

                    <TextController
                      name="description"
                      label="Brief Context"
                      placeholder="What kind of waste is it?"
                      control={control}
                      errors={errors}
                    />
                  </div>

                  <motion.button
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full mt-8 py-5 cursor-pointer bg-slate-900 text-white rounded-3xl font-black flex items-center justify-center gap-3 shadow-2xl shadow-slate-300 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        <Typography className="uppercase tracking-[0.2em] text-xs">
                          Authorize Submission
                        </Typography>
                        <ChevronRight size={18} />
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </form>
        </motion.div>
      </motion.div>

   
      <ReportNotification showModal={showModal} closeModal={closeModal} />
    </div>
  );
};

export default ReportWaste;
