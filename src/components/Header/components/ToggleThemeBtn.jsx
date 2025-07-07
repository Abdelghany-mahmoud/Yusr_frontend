import { useTheme } from "../../../hooks/useTheme";
import { FaSun } from "react-icons/fa";
import { BsFillMoonStarsFill } from "react-icons/bs";

export const ToggleThemeBtn = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="hover:bg-[var(--bg-hover)] animate animate text-xl shadow-md flex items-center px-2 transition-all h-full bg-[var(--secondary-bg-color)] w-20 main-border-radius justify-center"
      onClick={toggleTheme}
    >
      {theme == "dark" ? (
        <span style={{ color: "#fff000" }}>
          <FaSun />
        </span>
      ) : (
        <span className="text-[var(--primary-color)]">
          <BsFillMoonStarsFill />
        </span>
      )}
    </button>
  );
};
