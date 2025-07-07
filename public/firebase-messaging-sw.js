importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyB5hrDAHRAWgYe2K9VGnPwJDm6oYqilm0Q",
  authDomain: "yusr-4dc0f.firebaseapp.com",
  projectId: "yusr-4dc0f",
  storageBucket: "yusr-4dc0f.firebasestorage.app",
  messagingSenderId: "680581106832",
  appId: "1:680581106832:web:3c2a760e152230390d1c15",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification?.title || "New Notification";
  const notificationOptions = {
    body: payload.notification?.body || "You have a new message",
    icon: "/assets/images/logo/logo.png",
    badge: "/assets/images/logo/logo.png",
    vibrate: [200, 100, 200],
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
