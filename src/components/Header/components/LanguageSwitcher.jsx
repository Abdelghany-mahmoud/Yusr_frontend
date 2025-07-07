import { useTranslation } from "react-i18next";
import Flag from "react-flagkit";
import { useEffect, useRef, useState } from "react";
import { languageState } from "../../../store/langAtom/languageAtom";
import { useSetRecoilState } from "recoil";
import PropTypes from "prop-types";

export const LanguageSwitcher = ({ height }) => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const { t } = useTranslation("layout");
  const setLanguage = useSetRecoilState(languageState);

  const toggleMenu = () => setOpen((prevOpen) => !prevOpen);

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setOpen(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") setOpen(false);
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [i18n]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
    setOpen(false);
    setLanguage(lng);
  };

  const languages = [
    // { code: "en", label: t("english"), flag: "US" },
    { code: "ar", label: t("arabic"), flag: "SA" },
  ];

  return (
    <div>
      <button
        className={`hover:bg-[var(--bg-hover)] shadow-md flex items-center px-2 transition-all justify-center ${
          height || "h-full"
        } bg-[var(--secondary-bg-color)] w-12 col-span-1 main-border-radius`}
        onClick={toggleMenu}
        aria-expanded={open}
      >
        <Flag
          style={{ width: "20px" }}
          country={i18n.language === "en" ? "US" : "SA"}
        />
      </button>
      <div className="relative transition-all flex justify-center items-center shadow-sm main-border-radius">
        <div
          style={{ zIndex: "1" }}
          ref={menuRef}
          className={`overflow-hidden absolute right-1/2 translate-y-1/2 translate-x-1/2 mt-3 w-40 bg-[var(--secondary-bg-color)] main-border-radius shadow-lg transition-all duration-200 ${
            open ? "scale-100 visible" : "scale-95 invisible"
          }`}
        >
          {languages.map(({ code, label, flag }) => (
            <button
              key={code}
              onClick={() => changeLanguage(`${code}`)}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm text-[var(--primary-color)] hover:bg-[var(--bg-hover)]"
            >
              <Flag country={flag} /> {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

LanguageSwitcher.propTypes = {
  height: PropTypes.string,
};
