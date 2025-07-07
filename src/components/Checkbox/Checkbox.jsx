import PropTypes from "prop-types";
import { useTheme } from "../../hooks/useTheme";

export const Checkbox = ({ label, checked = false, onChange }) => {
  const { theme } = useTheme();
  return (
    <label
      className={`select-none ${
        theme == "dark" ? "text-white" : "text-black"
      } fieldset-label flex items-center gap-1 cursor-pointer`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className={`checkbox border-[var(--secondary-text-color)] checkbox-warning`}
      />
      {label}
    </label>
  );
};

Checkbox.propTypes = {
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};
