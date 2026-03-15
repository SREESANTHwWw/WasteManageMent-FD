import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Users,
  Info,
  ChevronRight,
  AlignLeft,
  ShieldCheck,
  Activity,
  ImagePlus,
  X,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../../Api/APi";
import { TextController } from "../../../@All/Tags/Tags";
import { useForm } from "react-hook-form";

/* ─── Full-page Loading Overlay ─────────────────────────────────── */
const AnimatedDots = () => (
  <span className="inline-flex gap-0.5 ml-1">
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
        className="inline-block"
      >
        .
      </motion.span>
    ))}
  </span>
);

const LoadingOverlay = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm"
  >
    {/* Spinning ring */}
    <div className="relative w-20 h-20">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-3 h-3 bg-emerald-500 rounded-full" />
      </div>
    </div>

    <motion.p
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="mt-6 text-[11px] font-black uppercase tracking-[0.25em] text-emerald-700"
    >
      Creating Campaign
      <AnimatedDots />
    </motion.p>

    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="mt-2 text-xs text-slate-400 font-medium"
    >
      Broadcasting to campus sector…
    </motion.p>
  </motion.div>
);

/* ─── Main Component ─────────────────────────────────────────────── */
const CreateCampaignOutlet = () => {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState("UPCOMING");
  const [maxVolunteers, setMaxVolunteers] = useState(10);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      building: "",
      area: "",
      campaignDate: "",
      startTime: "",
      endTime: "",
    },
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const remaining = 5 - images.length;
    const toAdd = files.slice(0, remaining).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...toAdd]);
    e.target.value = "";
  };

  const removeImage = (index) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("campaignDate", data.campaignDate);
      formData.append("startTime", data.startTime);
      formData.append("endTime", data.endTime);
      formData.append("maxVolunteers", maxVolunteers);
      formData.append("status", status);
      formData.append("location[building]", data.building);
      formData.append("location[area]", data.area);
      images.forEach(({ file }) => formData.append("images", file));

      const res = await api.post("/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(res?.data?.msg || "Campaign created successfully");
      reset();
      setImages([]);
      setStatus("UPCOMING");
      setMaxVolunteers(10);
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.msg || "Failed to create campaign");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── Loading Overlay ── */}
      <AnimatePresence>{loading && <LoadingOverlay />}</AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full min-h-screen p-6 lg:p-10 space-y-8 bg-[#fbfcfd]"
      >
        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              Create Campaign
            </h1>
            <p className="text-slate-500 font-medium mt-1 text-sm">
              Designate new environmental cleaning missions and parameters.
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <Activity size={16} className="text-emerald-500" />
            <span className="text-[11px] font-black text-slate-600 uppercase tracking-wider">
              Node: Active Dispatch
            </span>
          </div>
        </div>

        {/* ── Form ── */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start"
        >
          {/* ── Left column ── */}
          <div className="xl:col-span-8 space-y-6">

            {/* Mission Intel */}
            <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 mb-2">
                <Info size={14} /> Mission Intel
              </div>

              <div className="group space-y-2">
                <label className="text-[10px] font-black text-slate-400 ml-2 uppercase block">
                  Campaign Name
                </label>
                <TextController
                  errors={errors}
                  control={control}
                  rules={{ required: "Campaign name is required" }}
                  type="text"
                  name="title"
                  placeholder="e.g. Operation Ocean Clean"
                  className="w-full bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500/20 rounded-2xl px-6 py-4 font-bold text-slate-700 transition-all outline-none"
                />
              </div>

              <div className="group space-y-2">
                <label className="text-[10px] font-black text-slate-400 ml-2 uppercase block">
                  Mission Description
                </label>
                <div className="relative">
                  <AlignLeft
                    className="absolute left-5 top-5 text-slate-300 pointer-events-none"
                    size={18}
                  />
                  <TextController
                    errors={errors}
                    control={control}
                    rules={{ required: "Description is required" }}
                    type="textarea"
                    name="description"
                    rows={3}
                    placeholder="Describe the scope and objectives..."
                    className="w-full bg-slate-50 border-none focus:ring-2 focus:ring-emerald-500/20 rounded-2xl pl-14 pr-6 py-4 font-semibold text-slate-600 transition-all outline-none resize-none"
                  />
                </div>
              </div>
            </section>

            {/* Logistics & Scheduling */}
            <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 mb-6">
                <MapPin size={14} /> Logistics & Scheduling
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 ml-2 uppercase">
                    Building
                  </label>
                  <TextController
                    errors={errors}
                    control={control}
                    rules={{ required: "Building is required" }}
                    type="text"
                    name="building"
                    placeholder="Main Block"
                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-sm text-slate-700 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 ml-2 uppercase">
                    Area
                  </label>
                  <TextController
                    errors={errors}
                    control={control}
                    rules={{ required: "Area is required" }}
                    type="text"
                    name="area"
                    placeholder="North Side"
                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-sm text-slate-700 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 ml-2 uppercase">
                    Mission Date
                  </label>
                  <TextController
                    errors={errors}
                    control={control}
                    rules={{ required: "Date is required" }}
                    type="date"
                    name="campaignDate"
                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-sm text-slate-700 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 ml-2 uppercase">
                    Start Time
                  </label>
                  <TextController
                    errors={errors}
                    control={control}
                    rules={{ required: "Start time is required" }}
                    type="time"
                    name="startTime"
                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-sm text-slate-700 outline-none"
                  />
                    <p className="text-[10px] text-slate-400 ml-2">
    Example: 15:05 = 3:05 PM
  </p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 ml-2 uppercase">
                    Estimated End Time
                  </label>
                  <TextController
                    errors={errors}
                    control={control}
                    rules={{ required: "End time is required" }}
                    type="time"
                    name="endTime"
                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-sm text-slate-700 outline-none"
                  />
                                <p className="text-[10px] text-slate-400 ml-2">
    Example: 15:05 = 3:05 PM
  </p>
                </div>

              </div>
            </section>

            {/* Image Upload */}
            <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-5">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">
                <ImagePlus size={14} /> Campaign Images
              </div>

              <label
                className={`flex flex-col items-center justify-center gap-3 w-full border-2 border-dashed rounded-3xl py-10 cursor-pointer transition-all
                  ${
                    images.length >= 5
                      ? "border-slate-200 bg-slate-50 cursor-not-allowed opacity-50"
                      : "border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50 hover:border-emerald-400"
                  }`}
              >
                <ImagePlus size={32} className="text-emerald-400" />
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-600">
                    {images.length >= 5
                      ? "Maximum 5 images reached"
                      : "Click to upload images"}
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                    PNG, JPG, WEBP — up to 5 images
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={images.length >= 5}
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {images.map(({ preview }, idx) => (
                    <div key={idx} className="relative group aspect-square">
                      <img
                        src={preview}
                        alt={`preview-${idx}`}
                        className="w-full h-full object-cover rounded-2xl border border-slate-100"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1.5 right-1.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                      >
                        <X size={12} />
                      </button>
                      <span className="absolute bottom-1.5 left-1.5 bg-black/50 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                        {idx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* ── Right column ── */}
          <div className="xl:col-span-4 space-y-6 lg:sticky lg:top-10">
            <div className="bg-emerald-900 rounded-[3rem] p-8 text-white shadow-2xl shadow-emerald-900/20">
              <h4 className="text-[10px] font-black tracking-[0.2em] text-emerald-400 uppercase mb-8">
                Deployment Limits
              </h4>

              <div className="space-y-8">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold flex items-center gap-2">
                      <Users size={16} /> Max Participants
                    </span>
                    <span className="text-xl font-black text-emerald-400">
                      {maxVolunteers}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={maxVolunteers}
                    onChange={(e) => setMaxVolunteers(Number(e.target.value))}
                    className="w-full accent-emerald-500 bg-emerald-800 rounded-lg h-1.5 appearance-none cursor-pointer"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-emerald-400 uppercase">
                    Initial Status
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {["UPCOMING", "ONGOING"].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setStatus(s)}
                        className={`py-2 rounded-xl text-[10px] font-black border transition-all
                          ${
                            status === s
                              ? "bg-white text-emerald-900 border-white shadow-lg"
                              : "bg-transparent border-emerald-700 text-emerald-400"
                          }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-emerald-800">
                <div className="flex gap-3">
                  <ShieldCheck size={20} className="text-emerald-400 shrink-0" />
                  <p className="text-[10px] leading-relaxed text-emerald-200/70 font-medium">
                    Initializing will broadcast this campaign to the selected
                    campus sector and register it in the master ledger.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white font-black py-5 rounded-[2.5rem] shadow-xl shadow-emerald-900/5 transition-all flex items-center justify-center gap-3 group active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  CREATING...
                </>
              ) : (
                <>
                  CONFIRM MISSION
                  <ChevronRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </>
  );
};

export default CreateCampaignOutlet;