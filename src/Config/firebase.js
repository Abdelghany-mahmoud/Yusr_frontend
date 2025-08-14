import { useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB5hrDAHRAWgYe2K9VGnPwJDm6oYqilm0Q",
  authDomain: "yusr-4dc0f.firebaseapp.com",
  projectId: "yusr-4dc0f",
  storageBucket: "yusr-4dc0f.firebasestorage.app",
  messagingSenderId: "680581106832",
  appId: "1:680581106832:web:3c2a760e152230390d1c15",
  measurementId: "G-CD89GZE0T6",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
const analytics = getAnalytics(app);

export { messaging };

function useFirebaseMessaging() {
  useEffect(() => {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        getToken(messaging, {
          vapidKey:
            "BGpdOh-8kG6_JGp_KP_KxwW1h4dkxQVqM1jzWQN_YVpPIwN_YVpPIwN_YVpPIwN_YVpPIwN_YVpPIwN_YVpPIwN_YVpPIw",
        })
          .then((currentToken) => {
            if (currentToken) {
              // console.log("FCM token:", currentToken);
              // Send this token to your server to send push notifications later
            } else {
              // console.log("No registration token available.");
            }
          })
          .catch((err) => {
            // console.log("An error occurred while retrieving token.", err);
          });
      }
    });

    // Foreground message handler
    onMessage(messaging, (payload) => {
      // console.log("Message received. ", payload);
      // You can show a notification or update UI here
    });
  }, []);
}

export default useFirebaseMessaging;
