// src/pusher/usePusherNotifications.js
import { useEffect } from "react";
import Pusher from "pusher-js";
import logo from "./../public/assets/images/logo/logo.png";

// Enable debug logging (optional)
Pusher.logToConsole = false;

export const usePusherNotifications = (userId) => {
  useEffect(() => {
    if (!userId) return;

    // Initialize Pusher (no auth needed for public channels)
    const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
      cluster: import.meta.env.VITE_PUSHER_CLUSTER,
      forceTLS: true, // Modern browsers require this
    });

    const channelName = `notifications.${userId}`;
    // console.log("🔔 Subscribing to public channel:", channelName);

    const channel = pusher.subscribe(channelName);

    // Debug subscription events
    channel.bind("pusher:subscription_succeeded", () => {
      // console.log("✅ Successfully subscribed to", channelName);
    });

    // Handle notifications
    channel.bind(".new-notification", (data) => {
      // console.log("📩 Notification received:", data);

      // Show browser notification if permission granted
      if (Notification.permission === "granted") {
        new Notification(data.title || "New Notification", {
          body: data,
          icon: logo ?? "/default-icon.png",
        });
      }
    });

    // Cleanup
    return () => {
      // console.log("🔕 Unsubscribing from", channelName);
      channel.unbind_all();
      pusher.unsubscribe(channelName);
    };
  }, [userId]); // Re-run when userId changes

  // Optional: Request notification permission
  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    } catch (error) {
      console.error("Notification permission error:", error);
      return false;
    }
  };

  return { requestNotificationPermission };
};
