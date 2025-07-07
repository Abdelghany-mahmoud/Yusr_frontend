import { PropTypes } from "prop-types";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { languageState } from "../../store/langAtom/languageAtom";
import { useRecoilValue } from "recoil";
export const ModelPagination = ({ currentPage, totalPages, onPageChange }) => {
  const lang = useRecoilValue(languageState);
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxPages = 3;
    const half = Math.floor(maxPages / 2);

    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, currentPage + half);

    if (currentPage <= half) {
      end = Math.min(totalPages, maxPages);
    } else if (currentPage + half > totalPages) {
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
        totalPages == 1 ? "hidden" : "flex"
      } items-center justify-center gap-2 mt-4`}
    >
      <button
        type="button"
        style={{ width: "35px", height: "35px", fontSize: "25px" }}
        onClick={() => handlePageChange(currentPage - 1)}
        className={`shadow-lg w-[35px] h-[35px] text-[25px] flex justify-center items-center rounded-md transition-all ${
          currentPage === 1
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "hover:scale-105 bg-[var(--primary-color)] text-[var(--secondary-color)] hover:bg-[var(--primary-color)]"
        }`}
        disabled={currentPage === 1}
      >
        {lang === "en" ? <IoIosArrowBack /> : <IoIosArrowForward />}
      </button>

      {currentPage > 3 && totalPages > 5 && (
        <button
          type="button"
          onClick={() => handlePageChange(1)}
          className="shadow-lg px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          1
        </button>
      )}

      {getPageNumbers().map((page) => (
        <button
          type="button"
          style={{ width: "35px", height: "35px", fontSize: "20px" }}
          key={page}
          onClick={() => handlePageChange(page)}
          className={`shadow-lg duration-300 w-[35px] h-[35px] text-[20px] flex justify-center items-center rounded-md transition-all ${
            page === currentPage
              ? "bg-[var(--secondary-dark-color)] text-white scale-105 transition-all"
              : "bg-gray-300 text-gray-700 hover:bg-gray-400"
          }`}
        >
          {page}
        </button>
      ))}

      {currentPage < totalPages - 2 && totalPages > 5 && (
        <button
          type="button"
          onClick={() => handlePageChange(totalPages)}
          className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          {totalPages}
        </button>
      )}

      <button
        type="button"
        style={{ width: "35px", height: "35px", fontSize: "25px" }}
        onClick={() => handlePageChange(currentPage + 1)}
        className={`shadow-lg w-[35px] h-[35px] text-[25px] flex justify-center items-center rounded-md transition-all ${
          currentPage === totalPages
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "hover:scale-105 bg-[var(--primary-color)] text-[var(--secondary-color)] hover:bg-[var(--primary-color)]"
        }`}
        disabled={currentPage === totalPages}
      >
        {lang === "en" ? <IoIosArrowForward /> : <IoIosArrowBack />}
      </button>
    </div>
  );
};

ModelPagination.propTypes = {
  currentPage: PropTypes.number,
  totalPages: PropTypes.number,
  onPageChange: PropTypes.func,
};
