import { memo, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import { IoClose } from "react-icons/io5";
import styles from "./Modal.module.css";
import { useTheme } from "../../hooks/useTheme";
import { useRecoilValue } from "recoil";
import { languageState } from "../../store/langAtom/languageAtom";

export const Modal = memo(
  ({
    children,
    btnClassName,
    btnText,
    isOpen,
    setIsOpen,
    classNameModalStyle,
    title,
  }) => {
    const { theme } = useTheme();
    const lang = useRecoilValue(languageState);

    const closeModal = useCallback(() => {
      setIsOpen(false);
    }, [setIsOpen]);

    useEffect(() => {
      const handleKeyDown = (event) => {
        if (event.key === "Escape") {
          closeModal();
        }
      };

      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [closeModal]);
    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
      return () => {
        document.body.style.overflow = "";
      };
    }, [isOpen]);

    const modalContent = (
      <>
        {isOpen && (
          <div
            className={`fixed inset-0 z-50 bg-black bg-opacity-50 ${styles.animate_fade_in} ${styles.modal_container}`}
            onClick={closeModal}
          >
            <div
              className={`${theme === "dark" ? "text-white" : "text-black"
                } absolute ${styles.modal_box} ${styles.animate_slide_up} ${classNameModalStyle || "px-4 py-5"
                }`}
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: theme === "dark" ? "#141414" : "#fdfdfd",
                direction: lang === "ar" ? "rtl" : "ltr",
              }}
            >
              <button
                type="button"
                onClick={closeModal}
                className={`btn z-50 text-3xl btn-circle btn-sm btn-ghost absolute ${lang === "ar" ? "left-3" : "right-3"
                  } top-3 hover:text-[${theme === "dark"
                    ? "var(--secondary-color)"
                    : "var(--primary-color)"
                  }]`}
              >
                <IoClose />
              </button>

              {title && (
                <h2 className="text-xl font-bold mb-4 border-b pb-2 text-center">
                  {title}
                </h2>
              )}

              <div className="mt-6">{children}</div>
            </div>
          </div>
        )}
      </>
    );

    return (
      <>
        <button
          type="button"
          className={btnClassName}
          onClick={() => setIsOpen(true)}
        >
          {btnText}
        </button>
        {typeof document !== "undefined" &&
          createPortal(modalContent, document.body)}
      </>
    );
  }
);

Modal.displayName = "Modal";

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  children: PropTypes.node,
  btnClassName: PropTypes.string,
  classNameModalStyle: PropTypes.string,
  btnText: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.node,
  ]),
  title: PropTypes.string,
};
