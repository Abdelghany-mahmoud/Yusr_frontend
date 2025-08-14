// src/components/NotificationListener.tsx
import { useEffect } from "react";
import { tokenAtom } from "../../../store/tokenAtom/tokenAtom";
import { useRecoilValue } from "recoil";
import { usePusherNotifications } from "../../../pusher";

const NotificationListener = () => {
  const token = useRecoilValue(tokenAtom);
  const userId = token?.user?.id;

  const { requestNotificationPermission } = usePusherNotifications(
    userId,
    token
  );

  useEffect(() => {
    requestNotificationPermission();
  }, []);
  const push = usePusherNotifications(userId, token);
  // console.log(push, "handler");

  return null;
};

export default NotificationListener;
