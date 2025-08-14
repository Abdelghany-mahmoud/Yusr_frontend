import { Button, Modal } from "../../index";
import { toast } from "react-toastify";
import { useState } from "react";
import { TbLogout } from "react-icons/tb";
import { useSetRecoilState } from "recoil";
import { tokenAtom } from "../../../store/tokenAtom/tokenAtom";
import { useTranslation } from "react-i18next";

export const ConfirmLogout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const setToken = useSetRecoilState(tokenAtom);
  const { t } = useTranslation("layout");

  const handleLogout = async () => {
    setToken("");
    toast.success("Logout successfully!");
  };

  // console.log("Modal:", Modal); // يجب أن تكون function
  // console.log("Button:", Button); // يجب أن تكون function
  // console.log("t(sure):", t("sure")); // لا يجب أن تكون undefined

  return (
    <Modal
      modalId={"oma_i"}
      btnText={
        <div className="flex items-center justify-between w-full text-red-600">
          <span>{t("logout") || "Logout"}</span>
          <TbLogout />
        </div>
      }
      btnClassName={`hover:bg-[var(--bg-hover)]  px-4 py-2 transition-colors flex items-center justify-between w-full`}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      classNameModalStyle={"max-w-[450px] w-full p-3"}
    >
      <p className="text-2xl font-bold mb-2">{t("logout")}</p>
      <p className="text-lg mb-3">{t("logoutMessage")}</p>

      <div className="flex gap-2">
        <Button
          onClick={handleLogout}
          text={t("sure")}
          className="px-3 font-semibold border-none bg-[var(--danger-color)] text-white hover:bg-red-600"
        />

        <Button
          onClick={() => setIsOpen(false)}
          className="px-3 font-semibold border-none bg-[var(--primary-color)] text-white hover:bg-[var(--primary-color-hover)]"
          text={t("cancel")}
        />
      </div>
    </Modal>
  );
};
