import { CiSearch } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import PropTypes from "prop-types";
import { useRecoilState, useRecoilValue } from "recoil";
import { searchAtom } from "../../../store/searchAtom/searchAtom";
import { DropDownSearch } from "./DropDownSearch";
import { useEffect, useRef } from "react";
import { useSearchHandler } from "../../../hooks/useSearchHandler";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { languageState } from "../../../store/langAtom/languageAtom";
import { useNavigate } from "react-router-dom";

export const HeaderSearch = () => {
  const [searchValue, setSearchValue] = useRecoilState(searchAtom);
  const lang = useRecoilValue(languageState);
  const { t } = useTranslation("layout");
  const { isSearchInCurrentPage } = useSearchHandler();
  const searchInputRef = useRef();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const timeoutRef = useRef(null);
  const handleSearch = (e) => {
    const { value } = e.target;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setSearchValue((prev) => ({ ...prev, searchValue: value }));

      // always redirect to transactions if not already there
      if (value && pathname !== "/dashboard/transactions") {
        navigate("/dashboard/transactions");
      }
    }, 500); // faster debounce, 500ms
  };

  const clearSearch = () => {
    if (searchInputRef?.current) {
      searchInputRef.current.value = "";
    }
    setSearchValue({});
  };

  useEffect(() => {
    if (pathname !== "/dashboard/transactions") {
      clearSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div className="form relative w-full z-50">
      <DropDownSearch
        searchValue={searchValue}
        setSearchValue={setSearchValue}
      />

      <span
        className={`absolute w-fit z-40 ${lang == "ar" ? "right-1" : "left-1"
          } left-1 -translate-y-1/2 top-1/2 p-1`}
      >
        <span className="text-[var(--main-text-color)] text-xl">
          <CiSearch />
        </span>
      </span>

      <input
        ref={searchInputRef}
        disabled={searchValue?.value == null ? true : false}
        onChange={handleSearch}
        name={searchValue?.key}
        type="text"
        placeholder={
          isSearchInCurrentPage
            ? searchValue?.value == null
              ? t("please_choose_the_search_method")
              : `${t("search")}...`
            : t("no_search_in_current_page")
        }
        className="w-full relative z-30 main-border-radius bg-[var(--secondary-bg-color)] px-8 py-3 border-transparent focus:outline-none focus:border-none transition-all duration-300 shadow-md"
      />

      <button
        type="button"
        onClick={clearSearch}
        className={`text-xl z-50 bg-[var(--primary-color)] text-[var(--secondary-color)] absolute rounded-full shadow-md ${lang == "ar" ? "left-[140px] md:left-56" : "right-[140px] md:right-56"
          } -translate-y-1/2 top-1/2 p-1 ${searchValue?.value == null ? "hidden" : "flex"
          }`}
      >
        <IoMdClose />
      </button>
    </div>
  );
};

HeaderSearch.propTypes = {
  searchName: PropTypes.string,
};
