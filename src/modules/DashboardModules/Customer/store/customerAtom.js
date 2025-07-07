// atoms/customerFormAtom.ts
import { atom } from "recoil";

export const customerFormStepAtom = atom({
  key: "customerFormStep",
  default: 1,
});

export const customerFormDataAtom = atom({
  key: "customerFormData",
  default: {
    name: "",
    email: "",
    phone: "",
    country_code: "+2",
    city: "",
    gender: "",
    customer_type: "",
    notes: "",
  },
});
