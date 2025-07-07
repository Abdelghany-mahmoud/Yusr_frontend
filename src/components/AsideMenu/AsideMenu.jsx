import styles from "./Aside.module.css";
import logo from "/assets/images/logo/logo.png";
import darkLogo from "/assets/images/logo/dark_logo.png";
import { IoIosArrowBack } from "react-icons/io";
import { PropTypes } from "prop-types";
import { NavLinkAside } from "../NavLinkAside/NavLinkAside";
import { Link } from "react-router-dom";
import { VscGitPullRequestNewChanges } from "react-icons/vsc";
import { useRecoilValue } from "recoil";
import { languageState } from "../../store/langAtom/languageAtom";
import { useTranslation } from "react-i18next";
import { IoNotifications } from "react-icons/io5";
import { MdAdminPanelSettings, MdOutlineSwapHoriz } from "react-icons/md";
import { Users } from "lucide-react";
import { FaTasks, FaUser, FaUsers, FaUniversity } from "react-icons/fa";
import { GrStatusDisabled } from "react-icons/gr";
import { tokenAtom } from "../../store/tokenAtom/tokenAtom";
import { FaBarsProgress } from "react-icons/fa6";
import { useHasPermission } from "../../hooks/useHasPermission";
import { useTheme } from "../../hooks/useTheme";

export const AsideMenu = ({ open, handleCloseAside }) => {
  const lang = useRecoilValue(languageState);
  const { t } = useTranslation("layout");
  const { theme } = useTheme();
  const token = useRecoilValue(tokenAtom);
  const userRole = token?.user?.roles[0]?.name;
  const canViewTransactions = useHasPermission("read-transactions");
  const canViewClients = useHasPermission("read-clients");
  const canViewNotifications = useHasPermission("read-notification");
  const canReadBankTransactions = useHasPermission("read-payment-receipts");
  const canViewTransferred = useHasPermission("read-transferred-transaction");
  const canViewStatuses = useHasPermission("read-status");
  const canCreateStatuses = useHasPermission("create-status");
  const canViewEmployees = useHasPermission("read-users");
  const isSuperAdmin = token?.user?.roles[0]?.name == "SuperAdmin";
  const canViewRoles =
    token?.user?.roles[0]?.name == "SuperAdmin" ||
    token?.user?.roles[0]?.name == "Executive Director";
  const legalRole = token?.user?.roles[0]?.name == "Legal Supervisor";
  const links = [
    isSuperAdmin && {
      name: t("home"),
      to: "/dashboard",
      icon: FaBarsProgress,
    },
    canViewTransactions && {
      name: t("transactions"),
      to: "/dashboard/transactions?page=1",
      icon: MdOutlineSwapHoriz,
    },
    canViewClients && {
      name: t("New_customer_requests"),
      to: "new-customer-requests?page=1",
      icon: VscGitPullRequestNewChanges,
    },
    canViewClients && {
      name: t("customers"),
      to: "customers?page=1",
      icon: Users,
    },
    // canViewNotifications && {
    //   name: t("notifications"),
    //   to: "/dashboard/notifications?page=1",
    //   icon: IoNotifications,
    // },
    canViewRoles && {
      name: t("roles"),
      to: "/dashboard/roles",
      icon: MdAdminPanelSettings,
    },
    canViewTransferred && {
      name: t("Transactions_transferred_to_you"),
      to: "/dashboard/Transactions-transferred?page=1",
      icon: MdOutlineSwapHoriz,
    },
    canViewEmployees && {
      name: t("employees"),
      to: "/dashboard/employees?page=1",
      icon: FaUsers,
    },
    canViewStatuses &&
      canCreateStatuses && {
        name: t("statuses"),
        to: "/dashboard/statuses?page=1",
        icon: GrStatusDisabled,
      },
    legalRole && {
      name: t("LegalTasks"),
      to: "/dashboard/Legal-tasks?page=1",
      icon: FaTasks,
    },
    canReadBankTransactions && {
      name: t("Bank_transactions"),
      to: "/dashboard/bank-liaison-officer?page=1",
      icon: FaUniversity,
    },
    canViewRoles && {
      name: t("closed_transactions"),
      to: "/dashboard/closed_transactions?page=1",
      icon: FaUniversity,
    },
  ].filter(Boolean); // remove falsy entries

  const clientLinks = [
    {
      name: t("home"),
      to: "/client/",
      icon: FaBarsProgress,
    },
    // {
    //   name: t("transactions"),
    //   to: "/client/transactions?page=1",
    //   icon: MdOutlineSwapHoriz,
    // },
    {
      name: t("profile"),
      to: "/client/profile",
      icon: FaUser,
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
          to={""}
          className={` ${
            open ? styles.aside_nav_logo_large : styles.aside_nav_logo_small
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
        {userRole == "Client"
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
