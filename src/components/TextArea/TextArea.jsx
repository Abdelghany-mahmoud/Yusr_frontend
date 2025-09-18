import { Field, ErrorMessage } from "formik";
import PropTypes from "prop-types";

export const TextArea = ({ label, name, placeholder, icon}) => {
  return (
    <>
      {label && (
        <label htmlFor={name} className="block text-lg font-medium mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <Field
          as={"textarea"}
          className="h-20 textarea w-full p-2 border border-slate-300  text-black"
          name={name}
          placeholder={placeholder}
        />
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

TextArea.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  icon: PropTypes.element,
  className: PropTypes.string,
};
