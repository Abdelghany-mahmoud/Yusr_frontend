import Select from "react-select";
import { ModelPagination, Spinner } from "../index";
import PropTypes from "prop-types";
import { useTheme } from "../../hooks/useTheme";
import { ErrorMessage } from "formik";

export const MultipleSelectionField = ({
  isLoading,
  options,
  values,
  name,
  setFieldValue,
  totalPages,
  label,
  currentPage,
  onPageChange,
}) => {
  const { theme } = useTheme();

  const isDarkMode = theme == "dark";

  const colorStyles = {
    control: (styles) => ({
      ...styles,
      backgroundColor: isDarkMode ? "#1F2937" : "white",
      borderColor: isDarkMode ? "#374151" : "#D1D5DB",
      color: isDarkMode ? "white" : "black",
      padding: "4px",
    }),
    option: (styles, { isDisabled, isFocused, isSelected }) => ({
      ...styles,
      backgroundColor: isDisabled
        ? undefined
        : isSelected
          ? isDarkMode
            ? "#374151"
            : "#E5E7EB"
          : isFocused
            ? isDarkMode
              ? "#4B5563"
              : "rgba(0, 0, 0, 0.05)"
            : undefined,
      color: isDisabled
        ? "#9CA3AF"
        : isSelected
          ? isDarkMode
            ? "white"
            : "black"
          : isDarkMode
            ? "white"
            : "black",
      cursor: isDisabled ? "not-allowed" : "default",
    }),
    multiValue: (styles) => ({
      ...styles,
      backgroundColor: isDarkMode ? "#4B5563" : "#E5E7EB",
    }),
    multiValueLabel: (styles) => ({
      ...styles,
      color: isDarkMode ? "white" : "black",
    }),
  };

  return (
    <>
      <label
        className={`block text-lg font-medium mb-1 ${isDarkMode ? "text-white" : "text-black"
          }`}
      >
        {label}
      </label>
      {isLoading ? (
        <div className="flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <Select
          name={name}
          styles={colorStyles}
          isMulti
          options={options}
          value={values}
          onChange={(selected) => setFieldValue(name, selected)}
          placeholder={`${label}...`}
          theme={(selectTheme) => ({
            ...selectTheme,
            colors: {
              ...selectTheme.colors,
              primary: isDarkMode ? "#6B7280" : "#3B82F6",
              primary25: isDarkMode ? "#4B5563" : "#E5E7EB",
              neutral0: isDarkMode ? "#1F2937" : "white",
              neutral80: isDarkMode ? "white" : "black",
            },
          })}
        />
      )}
      <ErrorMessage
        name={name}
        component="div"
        className="text-red-500 text-sm mt-1"
      />
      <ModelPagination
        currentPage={currentPage}
        onPageChange={onPageChange}
        totalPages={totalPages}
      />
    </>
  );
};

MultipleSelectionField.propTypes = {
  isLoading: PropTypes.bool,
  options: PropTypes.array,
  values: PropTypes.array,
  name: PropTypes.string,
  setFieldValue: PropTypes.func,
  totalPages: PropTypes.number,
  currentPage: PropTypes.number,
  onPageChange: PropTypes.func,
  label: PropTypes.string,
};
