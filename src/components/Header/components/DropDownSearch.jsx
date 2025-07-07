import { IoIosArrowForward } from "react-icons/io";
import styles from "../Header.module.css";
import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useSearchHandler } from "../../../hooks/useSearchHandler";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { languageState } from "../../../store/langAtom/languageAtom";

export const DropDownSearch = ({ searchValue, setSearchValue }) => {
  const { searchKeys, isSearchInCurrentPage } = useSearchHandler();
  const { t } = useTranslation("layout");
  const [open, setOpen] = useState(false);
  const lang = useRecoilValue(languageState);
  const menuRef = useRef(null);
  const toggleMenu = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {isSearchInCurrentPage && (
        <button
          type="button"
          ref={menuRef}
          onClick={toggleMenu}
          className={`flex z-50 gap-1 text-sm md:text-base items-center justify-between absolute ${
            lang === "ar" ? "left-0" : "right-0"
          } min-w-28 md:w-52 bg-[var(--primary-color)] rounded-xl h-full -translate-y-1/2 top-1/2 p-2`}
        >
          <div className="font-semibold text-[var(--secondary-color)] flex items-center flex-1 justify-center">
            <p className="">
              {searchValue?.value || t("choose_the_search_method")}
            </p>
          </div>
          <span
            className={`transition-all text-[var(--secondary-color)] ${
              open ? "text-[var(--secondary-color)]" : ""
            } ${open ? "rotate-90" : ""}`}
          >
            <IoIosArrowForward />
          </span>
          <div
            className={`${styles.drop_downed_profile_menu} ${
              open ? "block" : "hidden"
            }   overflow-hidden rounded-lg m-0 p-0 absolute right-0 w-full`}
          >
            <ul>
              {searchKeys?.map((ele, index) => {
                return (
                  <li key={index} className="w-full mb-[3px]">
                    <button
                      type="button"
                      onClick={() =>
                        setSearchValue({
                          key: ele?.key,
                          value: ele?.value,
                          searchValue: "",
                        })
                      }
                      key={ele}
                      className="w-full shadow-lg p-2 bg-[var(--secondary-color)] rounded-lg transition-all hover:text-[var(--primary-color)] text-[var(--secondary-color)]  hover:bg-[var(--secondary-color)]"
                    >
                      <span className="text-sm md:text-base">{ele?.value}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </button>
      )}
    </>
  );
};

DropDownSearch.propTypes = {
  searchKeysList: PropTypes.array,
  searchValue: PropTypes.object,
  setSearchValue: PropTypes.func,
};
