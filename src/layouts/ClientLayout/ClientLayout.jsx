import { Outlet, useLocation } from "react-router-dom";
import styles from "../DashboardLayout/DashboardLayout.module.css";
import { AsideMenu, Header } from "../../components";
import { useEffect, useState } from "react";
import { useTheme } from "../../hooks/useTheme";
import { useRecoilValue } from "recoil";
import { languageState } from "../../store/langAtom/languageAtom";
import { useGetURLParam } from "../../hooks/useGetURLParam";

export function ClientLayout() {
  const [open, setOpen] = useState(true);
  const { currentPage } = useGetURLParam();
  const { theme } = useTheme();
  const lang = useRecoilValue(languageState);

  const location = useLocation();
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToTop();
  }, [location.pathname, currentPage]);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 992) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("lang", lang);
  }, [lang]);

  const handleCloseAside = () => {
    setOpen((open) => !open);
  };
  return (
    <>
      <div
        data-theme={theme}
        className={` ${lang == "ar" ? styles.ar : styles.en} ${
          open ? styles.dashboardContainerOpen : styles.dashboardContainer
        }`}
      >
        <div>
          <AsideMenu open={open} handleCloseAside={handleCloseAside} />
        </div>
        <div className={`${styles.content} overflow-hidden`}>
          <header className={`${styles.header} min-w-[250px]`}>
            <Header />
          </header>
          <main className={`${styles.main} min-w-[250px]`}>
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}
