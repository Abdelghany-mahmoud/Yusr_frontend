import { Link, useLocation } from "react-router-dom";
import { IoMdNotificationsOutline } from "react-icons/io";
import styles from "../Header.module.css";
import { useState } from "react";
import { usePusherNotifications } from "../../../pusher";
import { useRecoilValue } from "recoil";
import { tokenAtom } from "../../../store/tokenAtom/tokenAtom";

export const HeaderNotificationsLink = () => {
  const { pathname } = useLocation();
  const [loading, setLoading] = useState(false);
  const token = useRecoilValue(tokenAtom);
  const userId = token?.user?.id;

  const { requestNotificationPermission } = usePusherNotifications(
    userId,
    token
  );

  const requestNotification = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        alert("Notifications enabled!");
      } else {
        alert("Notification permission denied.");
      }
    } catch (error) {
      console.error("Notification permission error:", error);
    }
  };

  const handleTestNotification = async () => {
    setLoading(true);
    try {
      const granted = await requestNotificationPermission();
      if (granted) {
        new Notification("Test Notification", {
          body: "This is a test notification from Pusher!",
        });
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <div
        className={`hover:bg-[var(--bg-hover)] main-border-radius flex justify-center items-center shadow-md ${
          pathname == "/dashboard/notifications"
            ? "bg-[var(--bg-hover)] scale-105 transition-all duration-300"
            : "bg-[var(--secondary-bg-color)]"
        }`}
      >
        <Link
          to={"/dashboard/notifications?page=1"}
          className={`w-full h-full relative block text-[var(--main-text-color)] ${styles.notifications_link}`}
        >
          <IoMdNotificationsOutline />
        </Link>
      </div>
      <button
        onClick={requestNotification}
        disabled={loading}
        className="px-3 py-1 bg-[var(--primary-color)] text-white rounded-md hover:opacity-90 transition-all"
      >
        {loading ? "Sending..." : "Test"}
      </button>
    </div>
  );
};
