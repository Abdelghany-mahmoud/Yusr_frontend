import { useMutate } from "./useMatute";

export const useSendToWhatsapp = () => {
  return useMutate({
    method: "post",
    endpoint: "users/send-whatsapp-message",
    queryKeysToInvalidate: [], // add keys here if needed
  });
};
