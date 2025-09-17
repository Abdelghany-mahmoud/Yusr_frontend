import { atom } from "recoil";

export const tokenAtom = atom({
  key: "tokenAtom",
  default: localStorage.getItem("yusr")
    ? JSON.parse(localStorage.getItem("yusr"))
    : "",
  effects: [
    ({ onSet }) => {
      onSet((newToken) => {
        if (newToken) {
          localStorage.setItem("yusr", JSON.stringify(newToken));
        } else {
          localStorage.removeItem("yusr");
        }
      });
    },
  ],
});
