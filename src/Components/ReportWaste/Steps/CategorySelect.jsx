import WasteCategory from "../CategoryPart/WasteCategory";
import { Typography } from "../../../@All/Tags/Tags";
import { motion } from "framer-motion";
const CategorySelect = ({categories,selectedCat,setSelectedCat}) => {
  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className="space-y-3"
    >
      <div className="flex flex-col">
        <Typography className="text-2xl font-black text-slate-900 tracking-tight">
          Waste Category
        </Typography>
        <Typography className="text-sm text-slate-400 mt-1">
          Classification helps in specialized recycling.
        </Typography>
      </div>
      <WasteCategory
        categories={categories}
        selectedCat={selectedCat}
        setSelectedCat={setSelectedCat}
      />
    </motion.div>
  );
};

export default CategorySelect;
