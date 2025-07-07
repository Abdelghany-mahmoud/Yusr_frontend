import PropTypes from "prop-types";
import { useTheme } from "../../hooks/useTheme";
import { Field } from "formik";

export const SwitchField = ({ label, name, checked, onChange }) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  return (
    <div className="flex items-center justify-between gap-3">
      <label
        htmlFor={name}
        className={`select-none ${
          isDarkMode ? "text-white" : "text-black"
        } text-base font-medium`}
      >
        {label}
      </label>
      <Field name={name}>
        {({ field, form }) => {
          const isChecked = checked !== undefined ? checked : field.value === 1;

          return (
            <input
              id={name}
              type="checkbox"
              className="toggle toggle-warning"
              checked={isChecked}
              onChange={(e) => {
                const value = e.target.checked ? 1 : 0;

                if (onChange) {
                  onChange(value);
                } else {
                  form.setFieldValue(name, value);
                }
              }}
              onBlur={field.onBlur}
            />
          );
        }}
      </Field>
    </div>
  );
};

SwitchField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  checked: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  onChange: PropTypes.func,
};
