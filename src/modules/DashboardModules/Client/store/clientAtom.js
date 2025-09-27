// atoms/clientFormAtom.ts
import { atom } from "recoil";

export const clientFormStepAtom = atom({
  key: "clientFormStep",
  default: 1,
});

export const clientFormDataAtom = atom({
  key: "clientFormData",
  default: {
    name: "",
    email: "",
    phone: "",
    country_code: "+2",
    city: "",
    gender: "",
    client_type: "",
    notes: "",
  },
});
