// lib/PusherProvider.jsx
import { createContext, useContext, useMemo } from "react";
import Pusher from "pusher-js";
import { useRecoilValue } from "recoil";
import { tokenAtom } from "../store/tokenAtom/tokenAtom";

const PusherContext = createContext(null);

export function PusherProvider({ children }) {
    const token = useRecoilValue(tokenAtom);

    const pusher = useMemo(() => {
        if (!token?.token) return null;

        return new Pusher(import.meta.env.VITE_PUSHER_KEY, {
            cluster: import.meta.env.VITE_PUSHER_CLUSTER,
            forceTLS: true,
            authEndpoint: import.meta.env.VITE_PUSHER_AUTH_URL,
            auth: {
                headers: {
                    Authorization: `Bearer ${token.token}`,
                    Accept: "application/json",
                },
            },
        });
    }, [token]);

    return (
        <PusherContext.Provider value={pusher}>
            {children}
        </PusherContext.Provider>
    );
}

export function usePusher() {
    return useContext(PusherContext);
}
