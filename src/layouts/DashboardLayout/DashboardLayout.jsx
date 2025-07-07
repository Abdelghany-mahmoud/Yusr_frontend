import { Outlet, useLocation } from "react-router-dom";
import styles from "./DashboardLayout.module.css";
import { AsideMenu, Header, ChatWidget, Loading } from "../../components";
import { useEffect, useState } from "react";
import { useTheme } from "../../hooks/useTheme";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { languageState } from "../../store/langAtom/languageAtom";
import { useGetURLParam } from "../../hooks/useGetURLParam";
import NotificationListener from "../../modules/DashboardModules/notification/NotificationListener";
import { useGetData } from "../../hooks/useGetData";
import { tokenAtom } from "../../store/tokenAtom/tokenAtom";
import { currentRole } from "../../store/currentRoleAtom/currentRoleAtom";

export function DashboardLayout() {
  const [open, setOpen] = useState(true);
  const { currentPage } = useGetURLParam();
  const { theme } = useTheme();
  const lang = useRecoilValue(languageState);
  const token = useRecoilValue(tokenAtom);
  const setCurrentRole = useSetRecoilState(currentRole);
  const isSuperAdmin = token?.user?.roles[0]?.name == "SuperAdmin";
  const location = useLocation();
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const { data: userPermissions, isLoading } = useGetData({
    endpoint: `permissions/get-user-permissions/${token?.user?.id}`,
    queryKey: ["user-permissions", token?.user?.id],
    enabledKey: !isSuperAdmin,
  });

  useEffect(() => {
    if (userPermissions?.data && !isLoading) {
      setCurrentRole({
        userPermissions: userPermissions?.data,
        role: token?.user?.roles[0]?.name,
      });
    }
  }, [userPermissions, setCurrentRole, token?.role, isLoading]);
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
      {isLoading ? (
        <Loading height={"100vh"} />
      ) : (
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
                <NotificationListener />
                <Outlet />
              </main>
            </div>
          </div>
          {/* <ChatWidget receiverId="1" /> */}
        </>
      )}
    </>
  );
}
