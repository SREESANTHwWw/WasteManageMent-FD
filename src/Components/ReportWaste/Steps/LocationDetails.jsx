import React from 'react'
import { OptionController, TextController, Typography } from '../../../@All/Tags/Tags'
import {
  Info,
  Scale, // Added a relevant icon
} from "lucide-react";
import { motion } from "framer-motion";

const LocationDetails = ({ control, errors, locationOptions, currentLocation }) => {

  // Define the Quantity options based on your Enum
  const quantityOptions = [
    { label: "Small (Handful)", value: "SMALL" },
    { label: "Medium (Bag full)", value: "MEDIUM" },
    { label: "Large (Multiple bags/Bulk)", value: "LARGE" },
  ];

  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className="space-y-4"
    >
      <div className="flex flex-col">
        <Typography className="text-2xl font-black text-slate-900 tracking-tight">
          Identify the Spot
        </Typography>
        <Typography className="text-sm text-slate-400 mt-1">
          Select the campus zone and estimate the waste volume.
        </Typography>
      </div>
      <div className='grid grid-cols-2 gap-2'>

   
      {/* Campus Zone */}
      <OptionController
        name="location"
        label="Campus Zone"
        control={control}
        errors={errors}
        options={locationOptions}
        className="bg-slate-50 border-none h-14 rounded-2xl"
      />

      {/* Landmark (Only if Others) */}
      {currentLocation === "OTHERS" && (
        <TextController
          name="landmark"
          label="Specific Landmark"
          placeholder="e.g. Near the main entrance"
          control={control}
          errors={errors}
          className="bg-slate-50 border-none h-14 rounded-2xl"
        />
      )}

      {/* Waste Quantity (The New Section) */}
      <OptionController
        name="wasteQty"
        label="Waste Quantity"
        control={control}
        errors={errors}
        options={quantityOptions}
        className="bg-slate-50 border-none h-14 rounded-2xl"
      />

      {/* Waste Description */}
      <TextController
        name="description"
        label="Waste Description"
        placeholder="Describe the type or condition of the waste"
        control={control}
        errors={errors}
        className="bg-slate-50 border-none h-14 rounded-2xl"
      />
   </div>
      <div className="p-2 bg-emerald-50 rounded-2xl border border-emerald-100 flex gap-3">
        <Info className="text-emerald-500 shrink-0" size={18} />
        <Typography className="text-xs text-emerald-700 leading-relaxed">
          Accurate locations and size estimates help our cleanup teams earn points
          faster and keep the campus green.
        </Typography>
      </div>
    </motion.div>
  )
}

export default LocationDetails