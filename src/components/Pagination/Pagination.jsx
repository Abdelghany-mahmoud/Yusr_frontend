import { useState } from "react";
import PropTypes from "prop-types";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { languageState } from "../../store/langAtom/languageAtom";
import { IoSearch } from "react-icons/io5";
import { IoClose } from "react-icons/io5";

export const Pagination = ({ totalPages }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const lang = useRecoilValue(languageState);

  const [searchPage, setSearchPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const getPageLink = (page) => {
    const newParams = new URLSearchParams(location.search);
    newParams.set("page", page);
    return `${location.pathname}?${newParams.toString()}`;
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      const pageNumber = parseInt(searchPage, 10);
      if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
        navigate(getPageLink(pageNumber));
      }
      setSearchPage("");
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxPages = 3;
    const half = Math.floor(maxPages / 2);

    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, currentPage + half);

    if (start === 1) {
      end = Math.min(totalPages, maxPages);
    } else if (end === totalPages) {
      start = Math.max(1, totalPages - maxPages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div
      className={`${
        totalPages === 1 ? "hidden" : "flex"
      } items-center justify-center gap-2 mt-4`}
    >
      <Link
        aria-label="Previous Page"
        to={
          currentPage > 1
            ? getPageLink(currentPage - 1)
            : `${location.pathname}?page=${currentPage.toString()}`
        }
        className={`shadow-lg w-[35px] h-[35px] text-[25px] flex justify-center items-center rounded-md transition-all ${
          currentPage === 1
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "hover:scale-105 bg-[var(--primary-color)] text-[var(--secondary-color)] hover:bg-[var(--primary-color)]"
        }`}
      >
        {lang === "en" ? <IoIosArrowBack /> : <IoIosArrowForward />}
      </Link>

      {currentPage > 3 && (
        <>
          <Link
            to={getPageLink(1)}
            className="shadow-lg px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            1
          </Link>
          {currentPage > 4 && <span className="text-gray-500">...</span>}
        </>
      )}

      {getPageNumbers().map((page) => (
        <Link
          key={page}
          to={getPageLink(page)}
          aria-current={page === currentPage ? "page" : undefined}
          className={`shadow-lg duration-300 w-[35px] h-[35px] text-[20px] flex justify-center items-center rounded-md transition-all ${
            page === currentPage
              ? "bg-[var(--secondary-dark-color)] text-white scale-105 transition-all"
              : "bg-gray-300 text-gray-700 hover:bg-gray-400"
          }`}
        >
          {page}
        </Link>
      ))}

      {currentPage < totalPages - 2 && (
        <>
          {currentPage < totalPages - 3 && (
            <span className="text-gray-500">...</span>
          )}
          <Link
            to={getPageLink(totalPages)}
            className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            {totalPages}
          </Link>
        </>
      )}

      <Link
        aria-label="Next Page"
        to={
          currentPage < totalPages
            ? getPageLink(currentPage + 1)
            : `${location.pathname}?page=${currentPage.toString()}`
        }
        className={`shadow-lg w-[35px] h-[35px] text-[25px] flex justify-center items-center rounded-md transition-all ${
          currentPage === totalPages
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "hover:scale-105 bg-[var(--primary-color)] text-[var(--secondary-color)] hover:bg-[var(--primary-color)]"
        }`}
      >
        {lang === "en" ? <IoIosArrowForward /> : <IoIosArrowBack />}
      </Link>
      {totalPages >= 5 && (
        <div className={`relative flex items-center `}>
          <div
            className={`relative flex items-center ${
              isOpen
                ? "scale-100 opacity-100 w-[100px]"
                : "scale-0 opacity-0 w-0"
            } transition-all duration-300`}
          >
            <input
              type="number"
              min="1"
              max={totalPages}
              value={searchPage}
              onChange={(e) => setSearchPage(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Go to"
              className={`appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none w-[60px] h-[35px] px-1 text-center ${
                lang == "en"
                  ? "rounded-l-md border-l border-t border-b"
                  : "rounded-r-md border-r border-t border-b"
              }  ${
                searchPage != "" && searchPage >= 1 && searchPage <= totalPages
                  ? "border-[var(--primary-color)]"
                  : "border-red-500"
              } focus:outline-none bg-[var(--secondary-bg-color)] text-[var(--main-text-color)]`}
            />
            <button
              onClick={() => handleSearch({ key: "Enter" })}
              className={`min-w-[35px] h-[35px] text-[20px] flex justify-center items-center bg-[var(--primary-color)] text-[var(--secondary-color)] ${
                lang == "en" ? "rounded-r-md" : "rounded-l-md"
              }`}
            >
              <IoSearch />
            </button>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-[35px] h-[35px] text-[20px] flex justify-center items-center bg-[var(--primary-color)] text-[var(--secondary-color)] rounded-md transition-transform duration-300 hover:scale-105"
          >
            {isOpen ? <IoClose /> : <IoSearch />}
          </button>
        </div>
      )}
    </div>
  );
};

Pagination.propTypes = {
  totalPages: PropTypes.number.isRequired,
};
