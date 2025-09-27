import { ErrorMessage, Field } from "formik";
import PropTypes from "prop-types";

export const InputField = ({name, label, type = "text", placeholder, icon, readOnly = false }) => {
  return (
    <>
      {label && (
        <label htmlFor={name} className="block text-lg font-medium mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <Field name={name}>
          {({ field }) => (
            <input
              {...field}
              id={name}
              type={type}
              placeholder={placeholder}
              readOnly={readOnly}
              className="w-full input input-bordered focus:outline-none text-black"
              value={field.value ?? ""}
            />
          )}
        </Field>

        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black">
            {icon}
          </div>
        )}
        <ErrorMessage
          name={name}
          component="div"
          className="text-[var(--danger-color)] text-base mt-1"
        />
      </div>
    </>
  );
};

InputField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  icon: PropTypes.element,
  readOnly: PropTypes.bool,
};
