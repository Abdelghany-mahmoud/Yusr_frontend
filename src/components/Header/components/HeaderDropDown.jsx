import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { useRef, useState, useMemo } from "react";
import styles from "../Header.module.css";
import profileImage from "/assets/images/user.jpg";
import { ConfirmLogout } from "./ConfirmLogout";
import { useTranslation } from "react-i18next";
import { tokenAtom } from "../../../store/tokenAtom/tokenAtom";
import { useRecoilValue } from "recoil";
import { RiInboxArchiveLine } from "react-icons/ri";
export const HeaderDropDown = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const { t } = useTranslation("layout");
  const token = useRecoilValue(tokenAtom);
  const userRole = token?.user?.roles[0]?.name;
  const canViewRoles =
    token?.user?.roles[0]?.name == "SuperAdmin" ||
    token?.user?.roles[0]?.name == "Executive Director";
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
      ref={menuRef}
      onClick={toggleMenu}
      className={`${styles.drop_downed_profile} ${
        open ? "bg-[var(--bg-hover)]" : ""
      }  text-[var(--primary-color)] hover:bg-[var(--bg-hover)] transition-all relative w-full shadow-md bg-[var(--secondary-bg-color)] secondary-text-color flex justify-between items-center`}
    >
      <img
        className="w-6 h-6 rounded-full"
        src={profileImage}
        alt="profile image"
      />
      <span>
        {t(userRole)}|| ${token?.user?.name}
      </span>
      <span
        className={`transition-all ${
          open ? "text-[var(--primary-color)]" : ""
        } ${open ? "rotate-90" : ""}`}
      >
        <IoIosArrowForward />
      </span>
      <ul
        className={`${styles.drop_downed_profile_menu} ${
          open ? "block" : "hidden"
        } overflow-hidden shadow-lg bg-[var(--secondary-bg-color)] m-0 p-0 absolute right-0 w-full`}
      >
        <li>
          <Link
            to={userRole == "Client" ? "/client/" : "/"}
            className="hover:bg-[var(--bg-hover)] flex px-4 py-2 transition-colors"
          >
            {t("home")}
          </Link>
        </li>
        {canViewRoles && (
          <li>
            <Link
              to={"/archive/transactions?page=1"}
              className="hover:bg-[var(--bg-hover)] flex justify-between items-center px-4 py-2 transition-colors"
            >
              {t("archive")}
              <RiInboxArchiveLine />
            </Link>
          </li>
        )}
        {/* <li>
          <Link
            to={"/dashboard/settings?page=1"}
            className="hover:bg-[var(--bg-hover)] flex justify-between items-center px-4 py-2 transition-colors"
          >
            {t("settings")}
            <IoMdSettings />
          </Link>
        </li> */}
        <li>
          <ConfirmLogout />
        </li>
      </ul>
    </button>
  );
};
