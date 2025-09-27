// hooks/useChannel.js
import { useEffect } from "react";
import { usePusher } from "../lib/PusherProvider";

export function useChannel(channelName, events = {}) {
  const pusher = usePusher();

  useEffect(() => {
    if (!pusher || !channelName) return;

    const channel = pusher.subscribe(channelName);

    channel.bind("pusher:subscription_succeeded", () => {
      // console.log(`✅ Subscribed to ${channelName}`);
    });

    Object.entries(events).forEach(([event, handler]) => {
      channel.bind(event, handler);
    });

    return () => {
      Object.entries(events).forEach(([event, handler]) => {
        channel.unbind(event, handler);
      });
      pusher.unsubscribe(channelName);
      // console.log(`🚪 Unsubscribed from ${channelName}`);
    };
  }, [pusher, channelName]);
}
