import { useEffect } from "react";
import usePusherNotifications from "../../../pusher";

const NotificationSetup = () => {
  const { handleNotification, requestNotificationPermission } =
    usePusherNotifications();

  useEffect(() => {
    const setupNotifications = async () => {
      const granted = await requestNotificationPermission();
      if (granted) {
        handleNotification((data) => {
          console.log("Received notification:", data);
          // You can show a toast notification here
          if (data.title) {
            new Notification(data.title, {
              body: data.message,
              icon: data.icon,
            });
          }
        });
      }
    };

    setupNotifications();
  }, []);

  return null;
};

export default NotificationSetup;
