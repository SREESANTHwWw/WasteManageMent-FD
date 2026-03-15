import { Controller } from "react-hook-form";

export const TextController = ({
  name,
  control,
  label,
  placeholder,
  type = "text",
  errors,
  rules,
  className,
  rows,
  ...rest
}) => {
  const resolvedRules =
    rules ?? (label ? { required: `${label} is required` } : {});

  const baseClass = `w-full p-4 bg-gray-50 border-2 rounded-xl outline-none transition-all shadow-sm
    focus:bg-white focus:shadow-md`;

  return (
    <div className="mb-4">
      {label && (
        <Typography
          className="block text-sm font-semibold ml-1 mb-2"
          style={{ color: "var(--text)" }}
        >
          {label}
        </Typography>
      )}

      <Controller
        name={name}
        control={control}
        rules={resolvedRules}
        render={({ field }) =>
          type === "textarea" ? (
            <textarea
              {...field}
              rows={rows || 3}
              placeholder={placeholder}
              style={{
                borderColor: errors?.[name] ? "#f87171" : "transparent",
              }}
              className={className || baseClass}
              onFocus={(e) =>
                (e.target.style.borderColor = "var(--main-web-color)")
              }
              onBlur={(e) => {
                field.onBlur();
                if (!errors?.[name]) {
                  e.target.style.borderColor = "transparent";
                }
              }}
              {...rest}
            />
          ) : (
            <input
              {...field}
              type={type}
              placeholder={placeholder}
              style={{
                borderColor: errors?.[name] ? "#f87171" : "transparent",
              }}
              className={className || baseClass}
              onFocus={(e) =>
                (e.target.style.borderColor = "var(--main-web-color)")
              }
              onBlur={(e) => {
                field.onBlur();
                if (!errors?.[name]) {
                  e.target.style.borderColor = "transparent";
                }
              }}
              {...rest}
            />
          )
        }
      />

      {errors?.[name] && (
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
      className={`font-[--font-Domine] ${color} ${className}`}
    >
      {children}
    </span>
  );
};

export const OptionController = ({
  name,
  control,
  label,
  options = [],
  errors,
  placeholder = "Select an option",
}) => {
  return (
    <div className="mb-4">
      <Typography
        className="block text-sm font-semibold ml-1 mb-2"
        style={{ color: "var(--text)" }}
      >
        {label}
      </Typography>

      <Controller
        name={name}
        control={control}
        rules={{ required: `${label} is required` }}
        render={({ field }) => (
          <select
            {...field}
            style={{
              borderColor: errors?.[name] ? "#f87171" : "transparent",
            }}
            className={`w-full p-4 bg-gray-50 border-2 rounded-xl outline-none transition-all shadow-sm
              focus:bg-white focus:shadow-md cursor-pointer`}
            onFocus={(e) =>
              (e.target.style.borderColor = "var(--main-web-color)")
            }
            onBlur={(e) => {
              field.onBlur();
              if (!errors?.[name]) {
                e.target.style.borderColor = "transparent";
              }
            }}
          >
            <option value="">{placeholder}</option>

            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}
      />

      {errors?.[name] && (
        <span className="text-red-500 text-xs mt-1 ml-1 font-medium flex items-center gap-1">
          <span className="w-1 h-1 bg-red-500 rounded-full" />
          {errors[name].message}
        </span>
      )}
    </div>
  );
};