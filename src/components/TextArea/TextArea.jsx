import { Field, ErrorMessage } from "formik";
import PropTypes from "prop-types";

export const TextArea = ({ label, name, placeholder }) => {
  return (
    <div>
      <label className="block text-lg font-medium mb-1">{label}</label>
      <Field
        as={"textarea"}
        className="h-20 textarea w-full p-2 border border-slate-300  text-black"
        name={name}
        placeholder={placeholder}
      />
      <ErrorMessage
        name={name}
        component="div"
        className="text-[var(--danger-color)] text-base mt-1"
      />
    </div>
  );
};

TextArea.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
};
