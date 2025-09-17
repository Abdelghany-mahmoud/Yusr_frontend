import { useRecoilValue } from "recoil";
import { useMemo } from "react";
import Pusher from "pusher-js";
import { tokenAtom } from "../store/tokenAtom/tokenAtom";

export function usePusher() {
  const token = useRecoilValue(tokenAtom);
  Pusher.logToConsole = true;

  const pusher = useMemo(() => {
    if (!token?.token) return null;

    return new Pusher(import.meta.env.VITE_PUSHER_KEY, {
      cluster: import.meta.env.VITE_PUSHER_CLUSTER,
      forceTLS: true,
      authEndpoint: import.meta.env.VITE_PUSHER_AUTH_URL,
      auth: {
        headers: {
          Authorization: `Bearer ${token ? token.token : ""}`,
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      },
    });
  }, [token]);

  return pusher;
}
