import { IoIosArrowForward } from "react-icons/io";
import { useRef, useState, useMemo } from "react";
import styles from "./DropDownMenu.module.css";
import PropTypes from "prop-types";

export const DropDownMenu = ({
  menuTitle,
  menuClassName,
  MenuIcon,
  children,
  className,
  selectedValue, // Add this prop to display the selected value
}) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setOpen(false);
    }
  };

  useMemo(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <button
      type="button"
      ref={menuRef}
      onClick={toggleMenu}
      className={`${styles.drop_downed} ${
        open ? "bg-[var(--bg-hover)]" : ""
      } text-[var(--primary-color)] hover:bg-[var(--bg-hover)] transition-all relative w-fit shadow-md bg-[var(--secondary-bg-color)] secondary-text-color flex items-center ${className}`}
    >
      {MenuIcon && <span>{MenuIcon}</span>}
      <span className="text-[var(--primary-color)]">
        {selectedValue || menuTitle} {/* Show selected value if exists */}
      </span>
      <span
        className={`transition-all ${
          open ? "text-[var(--primary-color)]" : ""
        } ${open ? "rotate-90" : ""}`}
      >
        <IoIosArrowForward />
      </span>
      <ul
        className={`${styles.drop_downed_menu} ${
          open ? "block" : "hidden"
        } max-h-64 overflow-y-auto shadow-lg bg-[var(--secondary-bg-color)] m-0 p-0 absolute right-0 w-full z-[999] ${menuClassName}`}
      >
        {children}
      </ul>
    </button>
  );
};

DropDownMenu.propTypes = {
  menuTitle: PropTypes.string,
  MenuIcon: PropTypes.oneOfType([PropTypes.element, PropTypes.node]),
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.node]),
  className: PropTypes.string,
  menuClassName: PropTypes.string,
  selectedValue: PropTypes.string, // Add prop type for selectedValue
};
