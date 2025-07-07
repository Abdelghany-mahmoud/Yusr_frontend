import React, { useState } from "react";
import { Modal } from "../../../../components";
import { IoStatsChart } from "react-icons/io5";
import { useTranslation } from "react-i18next";

function CustomerStats({ customer }) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation("layout");
  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      btnText={
        <div
          className={"tooltip tooltip-accent top"}
          data-tip={t("customer_stats")}
        >
          <IoStatsChart />
        </div>
      }
      btnClassName={
        "btn text-2xl border-none btn-circle text-[var(--secondary-color)] bg-[var(--primary-color)] hover:bg-[var(--primary-color)] hover:scale-[1.07] btn-sm flex items-center justify-center"
      }
      classNameModalStyle={"max-w-[700px] w-full p-3 overflow-hidden"}
    ></Modal>
  );
}

export default CustomerStats;
