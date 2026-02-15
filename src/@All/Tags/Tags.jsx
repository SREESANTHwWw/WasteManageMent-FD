import { Controller } from "react-hook-form";

export const TextController = ({ name, control, label, placeholder, type = "text", errors }) => {
  return (
    <div className="mb-4">
      {/* Label using project text color */}
      <Typography
        className="block text-sm font-semibold ml-1 mb-2"
        style={{ color: 'var(--text)' }}
      >
        {label}
      </Typography>

      <Controller
        name={name}
        control={control}
        rules={{ required: `${label} is required` }}
        render={({ field }) => (
          <input
            {...field}
            type={type}
             placeholder={placeholder}
          
            style={{ 
              "--focus-color": "var(--main-web-color)",
              borderColor: errors[name] ? "#f87171" : "transparent" 
            }}
            className={`w-full p-4 bg-gray-50 border-2 rounded-xl outline-none transition-all shadow-sm
              focus:bg-white focus:shadow-md
            `}
            // Applying the focus color via inline style or custom class
            onFocus={(e) => e.target.style.borderColor = "var(--main-web-color)"}
            onBlur={(e) => {
                if(!errors[name]) e.target.style.borderColor = "transparent";
            }}
          />
        )}
      />

      {/* Error Message */}
      {errors[name] && (
        <span className="text-red-500 text-xs mt-1 ml-1 font-medium flex items-center gap-1">
          <span className="w-1 h-1 bg-red-500 rounded-full" />
          {errors[name].message}
        </span>
      )}
    </div>
  );
};




export const Typography = ({
  children,
  style,
  color,
  className = "",
}) => {
  return (
    <span
      style={style}
      className={`font-[Share_Tech]  ${color} ${className}`}
    >
      {children}
    </span>
  );
};