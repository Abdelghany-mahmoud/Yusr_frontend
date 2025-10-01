import styles from "./Aside.module.css";
import logo from "/assets/images/logo/logo.png";
import darkLogo from "/assets/images/logo/dark_logo.png";
import { IoIosArrowBack } from "react-icons/io";
import { PropTypes } from "prop-types";
import { NavLinkAside } from "../NavLinkAside/NavLinkAside";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { languageState } from "../../store/langAtom/languageAtom";
import { useTranslation } from "react-i18next";
import { MdAdminPanelSettings, MdOutlineSwapHoriz } from "react-icons/md";
import { Users } from "lucide-react";
import { FaTasks, FaUser, FaUsers, FaUniversity } from "react-icons/fa";
import { GrStatusDisabled } from "react-icons/gr";
import { tokenAtom } from "../../store/tokenAtom/tokenAtom";
import { FaBarsProgress, FaMessage } from "react-icons/fa6";
import { useHasPermission } from "../../hooks/useHasPermission";
import { useTheme } from "../../hooks/useTheme";

export const AsideMenu = ({ open, handleCloseAside }) => {
  const lang = useRecoilValue(languageState);
  const { t } = useTranslation("layout");
  const { theme } = useTheme();
  const token = useRecoilValue(tokenAtom);
  const userRoles = token?.user?.roles;
  const canReadBankTransactions = useHasPermission("read-payment-receipts");
  const canViewStatuses = useHasPermission("read-status");
  const canCreateStatuses = useHasPermission("create-status");
  const canViewEmployees = useHasPermission("read-employees");
  const canViewStatistics = useHasPermission("read-statistics");
  const canViewRoles = useHasPermission("read-roles");
  const legalRole = userRoles.includes("legal_supervisor");
  const links = [
    canViewStatistics && {
      name: t("home"),
      to: "/dashboard",
      icon: FaBarsProgress,
    },
    {
      name: t("transactions"),
      to: "/dashboard/transactions",
      icon: MdOutlineSwapHoriz,
    },
    {
      name: t("clients"),
      to: "clients",
      icon: Users,
    },
    canViewRoles && {
      name: t("roles"),
      to: "/dashboard/roles",
      icon: MdAdminPanelSettings,
    },
    canViewEmployees && {
      name: t("employees"),
      to: "/dashboard/employees",
      icon: FaUsers,
    },
    canViewStatuses &&
    canCreateStatuses && {
      name: t("statuses"),
      to: "/dashboard/statuses",
      icon: GrStatusDisabled,
    },
    legalRole && {
      name: t("LegalTasks"),
      to: "/dashboard/Legal-tasks",
      icon: FaTasks,
    },
    canReadBankTransactions && {
      name: t("bank_transactions"),
      to: "/dashboard/bank-liaison-officer",
      icon: FaUniversity,
    },
    canViewRoles && {
      name: t("closed_transactions"),
      to: "/dashboard/closed_transactions",
      icon: FaUniversity,
    },
    {
      name: t("chats"),
      to: "/dashboard/chats",
      icon: FaMessage,
    }
  ].filter(Boolean); // remove falsy entries

  const clientLinks = [
    {
      name: t("home"),
      to: "/client",
      icon: FaBarsProgress,
    },
    {
      name: t("profile"),
      to: "/client/profile",
      icon: FaUser,
    },
    {
      name: t("chats"),
      to: "/client/chats",
      icon: FaMessage,
    }
  ];

  return (
    <aside
      className={`${lang == "ar" ? "right-0" : "left-0"} ${styles.aside_nav} ${open ? styles.open : styles.close
        } shadow-xl bg-[var(--secondary-color)] overflow-hidden`}
      style={{
        borderRadius:
          lang == "en"
            ? "0 var(--main-border-radius) var(--main-border-radius) 0"
            : "var(--main-border-radius) 0 0 var(--main-border-radius)",
      }}
    >
      <div
        className={` ${lang == "ar" ? "left-0" : "right-0"} ${styles.aside_nav_back
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
          className={`${styles.aside_nav_back_icon} ${open
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
          to={""}
          className={` ${open ? styles.aside_nav_logo_large : styles.aside_nav_logo_small
            } pb-5 mt-8 flex items-center justify-center border-b-[1px] border-[var(--secondary-text-color)]`}
        >
          <img
            style={{ width: open ? "130px" : "30px" }}
            src={
              open
                ? theme == "dark"
                  ? darkLogo
                  : logo
                : theme == "light"
                  ? darkLogo
                  : logo
            }
            alt="Logo"
          />
        </Link>
      </div>
      <ul className="list-none p-0 mt-5">
        {userRoles.includes("client")
          ? clientLinks.map((item, index) => (
            <li key={index}>
              <NavLinkAside
                Icon={item.icon}
                open={open}
                linkName={item.name}
                linkTo={item.to}
              />
            </li>
          ))
          : links.map((item, index) => (
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

AsideMenu.propTypes = {
  open: PropTypes.bool,
  handleCloseAside: PropTypes.func,
};
