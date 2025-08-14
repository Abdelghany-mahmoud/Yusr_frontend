import Select from "react-select";
import { ModelPagination, Spinner } from "../index";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../hooks/useTheme";

export const SingleSelectionField = ({
  isLoading,
  options,
  value,
  name,
  setFieldValue,
  totalPages,
  label,
  currentPage,
  onPageChange,
  error,
}) => {
  const { t } = useTranslation("layout");
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
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
  };

  const handleChange = (selected) => {
    if (typeof setFieldValue === "function") {
      setFieldValue(name, selected);
    }
  };
  return (
    <>
      <label
        className={`block text-lg font-medium mb-1 ${isDarkMode ? "text-white" : "text-black"
          }`}
      >
        {t("select")} {label}
      </label>

      {isLoading ? (
        <div className="flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <Select
          name={name}
          styles={colorStyles}
          options={options}
          value={value}
          onChange={handleChange}
          placeholder={`${t("select")} ${label}...`}
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

      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}

      <ModelPagination
        currentPage={currentPage}
        onPageChange={onPageChange}
        totalPages={totalPages}
      />
    </>
  );
};

SingleSelectionField.propTypes = {
  isLoading: PropTypes.bool,
  options: PropTypes.array,
  value: PropTypes.object,
  name: PropTypes.string.isRequired,
  setFieldValue: PropTypes.func,
  setFieldTouched: PropTypes.func,
  totalPages: PropTypes.number,
  currentPage: PropTypes.number,
  onPageChange: PropTypes.func,
  label: PropTypes.string,
  error: PropTypes.string,
};
