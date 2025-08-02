import { useState } from "react";
import { useTranslation } from "react-i18next";
import TransactionList from "./TransactionList";
import { statusOptions } from "../../../constant/status";
import { DropDownMenu } from "../../../components";
import { FaFilter } from "react-icons/fa";
import { useGetData } from "../../../hooks/useGetData";
import { roleFields } from "../../../constant/customerType";
import { processRoleFields } from "../../../Helpers/Helpers";
import { useRecoilState } from "recoil";
import { tokenAtom } from "../../../store/tokenAtom/tokenAtom";

export default function TransactionsPage() {
  const { t } = useTranslation("layout");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedRoleDisplay, setSelectedRoleDisplay] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [page, setPage] = useState(1);
  const { data: usersData, isLoading: usersLoading } = useGetData({
    endpoint: `users?role=${selectedRoleDisplay}&page=${page}`,
    queryKey: ["officers", page, selectedRoleDisplay],
    enabledKey: !!selectedRoleDisplay,
  });
  const [token, setToken] = useRecoilState(tokenAtom);

  const canViewRoles =
    token?.user?.roles[0]?.name == "SuperAdmin" ||
    token?.user?.roles[0]?.name == "Executive Director";

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">{t("manage_transactions")}</h1>

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
              className={`cursor-pointer p-2 hover:bg-[var(--bg-hover)] ${selectedStatus?.id === status.id ? "bg-[var(--bg-hover)]" : ""
                }`}
            >
              {t(status.name)}
            </li>
          ))}
        </DropDownMenu>
        {canViewRoles && (
          <>
            <DropDownMenu
              menuTitle={t("filter_by_role")}
              MenuIcon={<FaFilter />}
              className="px-4 py-2 rounded-md"
              selectedValue={t(
                selectedRole
                  ? processRoleFields(roleFields).find(
                    (role) => role.id === selectedRole
                  )?.displayLabel
                  : null
              )}
            >
              <li
                onClick={() => {
                  setSelectedRole("");
                  setSelectedUserId("");
                }}
                className={`cursor-pointer p-2 hover:bg-[var(--bg-hover)] ${selectedRole === "" ? "bg-[var(--bg-hover)]" : ""
                  }`}
              >
                {t("all")}
              </li>
              {processRoleFields(roleFields).map((role) => (
                <li
                  key={role.id}
                  onClick={() => {
                    setSelectedRole(role.id); // ✅ خزن فقط الـ id
                    setSelectedUserId("");
                    setSelectedRoleDisplay(role.displayLabel);
                  }}
                  className={`cursor-pointer p-2 hover:bg-[var(--bg-hover)] ${selectedRole === role.id ? "bg-[var(--bg-hover)]" : ""
                    }`}
                >
                  {t(role.displayLabel)}
                </li>
              ))}
            </DropDownMenu>

            {selectedRole && (
              <DropDownMenu
                menuTitle={t("select_user")}
                MenuIcon={<FaFilter />}
                className="px-4 py-2 rounded-md"
                selectedValue={
                  selectedUserId
                    ? usersData?.data?.data?.find(
                      (user) => user.id === selectedUserId
                    )?.name
                    : null
                }
              >
                {usersLoading ? (
                  <li className="p-2">{t("loading")}...</li>
                ) : (
                  usersData?.data?.data?.map((user) => (
                    <li
                      key={user.id}
                      onClick={() => setSelectedUserId(user.id)}
                      className={`cursor-pointer p-2 hover:bg-[var(--bg-hover)] ${selectedUserId === user.id ? "bg-[var(--bg-hover)]" : ""
                        }`}
                    >
                      {user.name}
                    </li>
                  ))
                )}
              </DropDownMenu>
            )}
          </>
        )}
      </div>

      <TransactionList
        status={selectedStatus}
        userFilter={{ roleKey: selectedRole, userId: selectedUserId }}
      />
    </div>
  );
}
