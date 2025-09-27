import { useState } from "react";
import { DropDownMenu, PageTitle } from "../../../components";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { tokenAtom } from "../../../store/tokenAtom/tokenAtom";
import { FaFilter } from "react-icons/fa";
import TransactionList from "../transactions/TransactionList";
import { useGetData } from "../../../hooks/useGetData";

function LegalTasks() {
  const { t } = useTranslation("layout");
  const token = useRecoilValue(tokenAtom);
  const userId = token?.user?.id;
  const [selectedStatus, setSelectedStatus] = useState("");
  const { data: statusData } = useGetData({
    endpoint: `transactions/statuses`,
    queryKey: ["transactionStatuses"],
  });

const transactionStatuses = statusData?.data || [];

  return (
    <div>
      <PageTitle title={t("clients")} />
      <div className="flex justify-between items-center my-6 flex-wrap gap-4">
        <div className="flex items-center gap-4 w-full">
          <div className="flex justify-between items-center my-6 flex-wrap gap-4">
            <div className="mb-4 flex items-center gap-2 flex-wrap">
              <DropDownMenu
                menuTitle={t("filter_by_status")}
                MenuIcon={<FaFilter />}
                className="px-4 py-2 rounded-md"
                selectedValue={selectedStatus ? t(selectedStatus) : null} // Pass the selected value
              >
                {transactionStatuses.map((status, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      setSelectedStatus(status);
                    }}
                    className={`cursor-pointer p-2 hover:bg-[var(--bg-hover)] ${selectedStatus === status
                        ? "bg-[var(--bg-hover)]"
                        : ""
                      }`}
                  >
                    {t(status)}
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
