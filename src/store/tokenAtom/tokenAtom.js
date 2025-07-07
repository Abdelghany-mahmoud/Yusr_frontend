import { atom } from "recoil";

export const tokenAtom = atom({
  key: "tokenAtom",
  default: sessionStorage.getItem("yusr")
    ? JSON.parse(sessionStorage.getItem("yusr"))
    : "",
  effects: [
    ({ onSet }) => {
      onSet((newToken) => {
        if (newToken) {
          sessionStorage.setItem("yusr", JSON.stringify(newToken));
        } else {
          sessionStorage.removeItem("yusr");
        }
      });
    },
  ],
});
