import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  ChevronRight,
  ChevronLeft,
  X,
  Loader2,
  MapPin,
  Sparkles,
  CheckCircle2,
  Trash2,
  Info,
} from "lucide-react";
import { toast } from "react-hot-toast";
import {
  TextController,
  OptionController,
  Typography,
} from "../../@All/Tags/Tags";
import api from "../../Api/APi";
import { useAuth } from "../Context/UserContext/UserContext";
import ReportNotification from "./ReportNotification/ReportNotification";
import WasteCategory from "./CategoryPart/WasteCategory";
import ReportHeader from "./ReportHeader/ReportHeader";
import LocationDetails from "./Steps/LocationDetails";
import CategorySelect from "./Steps/CategorySelect";

const MAX_IMAGES = 5;

const ReportWaste = () => {
  const [step, setStep] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [selectedCat, setSelectedCat] = useState("");

  const { user, fetchUser } = useAuth();
  const {
    control,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: { location: "", description: "" },
  });

  const currentLocation = watch("location");

  const categories = [
    { id: "PLASTIC", label: "Plastic", icon: "🥤" },
    { id: "ORGANIC", label: "Organic", icon: "🍎" },
    { id: "PAPER", label: "Paper", icon: "📄" },
    { id: "OTHERS", label: "Others", icon: "🗑️" },
  ];

  const locationOptions = [
    { value: "library", label: "Central Library" },
    { value: "canteen", label: "Main Canteen" },
    { value: "hostel_a", label: "Boys Hostel A" },
    { value: "hostel_b", label: "Girls Hostel B" },
    { value: "sports_complex", label: "Sports Complex" },
    { value: "OTHERS", label: "Other Location" },
  ];

  // Navigation Logic
  const nextStep = async () => {
    if (step === 1) {
      const isValid = await trigger(["location"]);
      if (!isValid) return;
    }
    if (step === 2 && !selectedCat) {
      return toast.error("Please select a category to continue");
    }
    setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const remaining = MAX_IMAGES - imageFiles.length;
    if (remaining <= 0) return toast.error("Maximum 5 images allowed");

    const toAdd = files.slice(0, remaining);
    setImageFiles((prev) => [...prev, ...toAdd]);
    setImagePreviews((prev) => [
      ...prev,
      ...toAdd.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const removeImage = (idx) => {
    URL.revokeObjectURL(imagePreviews[idx]);
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
    setImageFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const onReportSubmit = async (data) => {
    if (imageFiles.length === 0) return toast(' upload evidence', {
  icon: '🫠',
});
   

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("wasteLocation", data.location);
      formData.append("wasteQty", data.wasteQty);
      formData.append("description", data.description || "");
      formData.append(
        "landmark",
        data.landmark,
      );
      formData.append("wasteCategory", selectedCat);
      imageFiles.forEach((file) => formData.append("wasteImage", file));

      const res = await api.post("/report/waste", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res?.data?.success) {
        setShowModal(true);
        await fetchUser();
      }
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAll = () => {
    setShowModal(false);
    setStep(1);
    setSelectedCat("");
    setImageFiles([]);
    setImagePreviews([]);
    reset();
  };

  return (
    <div className="h-full  ">
      {/* <ReportHeader user={user} /> */}
      <div className="max-w-5xl  mx-auto">
        {/* Progress Bar */}
        <div className="mb-2 relative">
          <div className="flex justify-between relative z-10">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex flex-col items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold transition-all duration-500 border-2 ${
                    step >= num
                      ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-100"
                      : "bg-white border-slate-100 text-slate-300"
                  }`}
                >
                  {step > num ? <CheckCircle2 size={20} /> : num}
                </div>
                <Typography
                  className={`text-[10px] font-black uppercase tracking-widest ${step >= num ? "text-emerald-600" : "text-slate-300"}`}
                >
                  {num === 1 ? "Site" : num === 2 ? "Type" : "Proof"}
                </Typography>
              </div>
            ))}
          </div>
          <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-100 z-0" />
        </div>

        <form
          onSubmit={handleSubmit(onReportSubmit)}
          className="bg-white rounded-[2.5rem] w-full shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden"
        >
          <div className="p-8 sm:p-10">
            <AnimatePresence mode="wait">
              {/* STEP 1: LOCATION DETAILS */}
              {step === 1 && (
               
                <LocationDetails
                   control={control}
                   errors={errors}
                   locationOptions={locationOptions}
                   currentLocation={currentLocation}

                />
              )}

              {/* STEP 2: CATEGORY SELECT */}
              {step === 2 && (
                <CategorySelect categories={categories} selectedCat={selectedCat} setSelectedCat={setSelectedCat}/>
              )}

              {/* STEP 3: MEDIA UPLOAD */}
            {step === 3 && (
  <motion.div
    key="step3"
    initial={{ opacity: 0, x: 10 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -10 }}
    className="space-y-6"
  >
    <div className="flex justify-between items-end">
      <div className="flex flex-col">
        <Typography className="text-2xl font-black text-slate-900 tracking-tight">
          Evidence Proof
        </Typography>
        <Typography className="text-sm text-slate-400 mt-1">
          Upload clear images of the waste.
        </Typography>
      </div>
      <Typography className="text-xs font-bold text-slate-400 uppercase">
        {imageFiles.length}/{MAX_IMAGES}
      </Typography>
    </div>

    {/* Improved Grid Layout */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
      <AnimatePresence mode="popLayout">
        {imagePreviews.map((src, idx) => (
          <motion.div
            key={src}
            layout
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative aspect-square bg-slate-100 rounded-3xl overflow-hidden border border-slate-100 shadow-sm group"
          >
            <img
              src={src}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              alt="Waste preview"
            />
            
            {/* Overlay Gradient for Delete Button visibility */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <button
              type="button"
              onClick={() => removeImage(idx)}
              className="absolute top-3 right-3 p-2 bg-rose-500 text-white rounded-xl shadow-lg transform -translate-y-2.5 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
              <X size={16} strokeWidth={3} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Upload Placeholder */}
      {imageFiles.length < MAX_IMAGES && (
        <label className="relative aspect-square rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-50 hover:border-emerald-200 hover:border-solid transition-all group">
          <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-emerald-100 transition-colors">
            <Camera
              size={28}
              className="text-slate-400 group-hover:text-emerald-600 transition-colors"
            />
          </div>
          <span className="text-[10px] font-black text-slate-400 group-hover:text-emerald-600 uppercase mt-3 tracking-wider">
            Add Photo
          </span>
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </label>
      )}
    </div>

    {/* Review Strip */}
    <div className="bg-slate-900 rounded-2xl p-4 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-inner">
          <CheckCircle2 size={20} />
        </div>
        <div className="flex flex-col">
          <Typography className="text-[10px] font-black text-emerald-500/80 uppercase tracking-widest leading-none mb-1">
            Ready to Submit
          </Typography>
          <Typography className="text-sm text-white font-bold">
            {currentLocation} • {selectedCat}
          </Typography>
        </div>
      </div>
      <Sparkles size={20} className="text-emerald-400 animate-pulse" />
    </div>
  </motion.div>
)}
            </AnimatePresence>
          </div>

          {/* FOOTER NAV */}
          <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-4">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="h-14 px-8 rounded-2xl border cursor-pointer border-slate-200 font-bold text-slate-600 hover:bg-white transition-all flex items-center gap-2"
              >
                <ChevronLeft size={20} /> Back
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex-1 h-14 bg-(--eco-accent) cursor-pointer text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all"
              >
                Next Stage <ChevronRight size={18} />
              </button>
            ) : (
              <button
                disabled={isSubmitting}
                type="submit"
                className="flex-1 h-14 bg-emerald-500 cursor-pointer text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  "Finalize Report"
                )}
              </button>
            )}
          </div>
        </form>

       
      </div>

      <ReportNotification showModal={showModal} closeModal={resetAll} />
    </div>
  );
};

export default ReportWaste;
