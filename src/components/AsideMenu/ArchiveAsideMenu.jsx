import styles from "./Aside.module.css";
import { IoIosArrowBack } from "react-icons/io";
import { PropTypes } from "prop-types";
import { NavLinkAside } from "../NavLinkAside/NavLinkAside";
import { Link } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa6";
import { useRecoilValue } from "recoil";
import { languageState } from "../../store/langAtom/languageAtom";
import { useTranslation } from "react-i18next";
import logo from "/assets/images/logo/logo.png";
export const ArchiveAsideMenu = ({ open, handleCloseAside }) => {
  const lang = useRecoilValue(languageState);

  const { t } = useTranslation("layout");
  const links = [
    {
      name: t("transactions"),
      to: "/archive/transactions",
      icon: FaGraduationCap,
    },
  ];

  return (
    <aside
      className={`${lang == "ar" ? "right-0" : "left-0"} ${styles.aside_nav} ${
        open ? styles.open : styles.close
      } shadow-xl bg-[var(--secondary-color)] overflow-hidden`}
      style={{
        borderRadius:
          lang == "en"
            ? "0 var(--main-border-radius) var(--main-border-radius) 0"
            : "var(--main-border-radius) 0 0 var(--main-border-radius)",
      }}
    >
      <div
        className={` ${lang == "ar" ? "left-0" : "right-0"} ${
          styles.aside_nav_back
        }`}
        style={{
          borderRadius:
            lang == "en"
              ? "var(--main-border-radius) 0 0 var(--main-border-radius)"
              : "0 var(--main-border-radius) var(--main-border-radius) 0",
        }}
        onClick={handleCloseAside}
      >
        <IoIosArrowBack
          size={"24px"}
          className={`${styles.aside_nav_back_icon} ${
            open
              ? lang == "ar"
                ? styles.aside_nav_icon_open && "rotate-180"
                : "rotate-0"
              : lang == "en"
              ? "rotate-180"
              : "rotate-0"
          }`}
        />
      </div>
      <div className="flex items-center justify-center">
        <Link
          to={"/"}
          className={` ${
            open ? styles.aside_nav_logo_large : styles.aside_nav_logo_small
          } pb-5 mt-8 flex items-center justify-center border-b-[1px] border-[var(--secondary-text-color)]`}
        >
          <img
            style={{ width: open ? "130px" : "30px" }}
            src={logo}
            alt="Logo"
          />
        </Link>
      </div>
      <ul className="list-none p-0 mt-5">
        {links.map((item, index) => (
          <li key={index}>
            <NavLinkAside
              Icon={item.icon}
              open={open}
              linkName={item.name}
              linkTo={item.to}
            />
          </li>
        ))}
      </ul>
    </aside>
  );
};

ArchiveAsideMenu.propTypes = {
  open: PropTypes.bool,
  handleCloseAside: PropTypes.func,
};
