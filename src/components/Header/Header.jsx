import styles from "./Header.module.css";
import { HeaderSearch } from "./components/HeaderSearch";
// import { HeaderNotificationsLink } from "./components/HeaderNotificationsLink";
import { HeaderDropDown } from "./components/HeaderDropDown";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { ToggleThemeBtn } from "./components/ToggleThemeBtn";

export const Header = () => {
  return (
    <div
      className={`${styles.header} grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-x-3 gap-y-2`}
    >
      <div>
        <HeaderSearch />
      </div>
      <div className="flex align-center gap-1 md:gap-3">
        <ToggleThemeBtn />
        {/* <HeaderNotificationsLink /> */}
        <LanguageSwitcher />
        <HeaderDropDown />
      </div>
    </div>
  );
};
