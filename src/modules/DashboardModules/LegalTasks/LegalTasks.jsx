import { useState } from "react";
import { DropDownMenu, PageTitle } from "../../../components";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { tokenAtom } from "../../../store/tokenAtom/tokenAtom";
import { FaFilter } from "react-icons/fa";
import { statusOptions } from "../../../constant/status";
import TransactionList from "../transactions/TransactionList";

function LegalTasks() {
  const { t } = useTranslation("layout");
  const token = useRecoilValue(tokenAtom);
  const userId = token?.user?.id;
  const [selectedStatus, setSelectedStatus] = useState("");

  return (
    <div>
      <PageTitle title={t("customers")} />
      <div className="flex justify-between items-center my-6 flex-wrap gap-4">
        <div className="flex items-center gap-4 w-full">
          <div className="flex justify-between items-center my-6 flex-wrap gap-4">
            <div className="mb-4 flex items-center gap-2 flex-wrap">
              <DropDownMenu
                menuTitle={t("filter_by_status")}
                MenuIcon={<FaFilter />}
                className="px-4 py-2 rounded-md"
                selectedValue={selectedStatus ? t(selectedStatus.name) : null} // Pass the selected value
              >
                {statusOptions.map((status) => (
                  <li
                    key={status.id}
                    onClick={() => {
                      setSelectedStatus(status);
                    }}
                    className={`cursor-pointer p-2 hover:bg-[var(--bg-hover)] ${
                      selectedStatus?.id === status.id
                        ? "bg-[var(--bg-hover)]"
                        : ""
                    }`}
                  >
                    {t(status.name)}
                  </li>
                ))}
              </DropDownMenu>
            </div>
          </div>
        </div>
      </div>
      <div className="section-padding">
        <TransactionList
          status={selectedStatus}
          userFilter={{
            roleKey: "legal_supervisor_id",
            userId: userId,
          }}
        />
      </div>
    </div>
  );
}

export default LegalTasks;
