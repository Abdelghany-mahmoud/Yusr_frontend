import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import TransactionList from "./TransactionList";
import { statusOptions } from "../../../constant/status";
import { DropDownMenu, PageTitle } from "../../../components";
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
  const [searchKey, setSearchKey] = useState("phone");
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, 1000);

    return () => clearTimeout(handler);
  }, [searchValue]);
  const [page, setPage] = useState(1);

  const { data: usersData, isLoading: usersLoading } = useGetData({
    endpoint: `users?role=${selectedRoleDisplay}&page=${page}`,
    queryKey: ["officers", page, selectedRoleDisplay],
    enabledKey: !!selectedRoleDisplay,
  });

  const [token, setToken] = useRecoilState(tokenAtom);

  const userRoles = token?.user?.roles.map((role) => role.name);
  const isSuperAdmin = userRoles.includes("SuperAdmin");
  const isExecutiveDirector = userRoles.includes("Executive Director");
  const canViewRoles = isSuperAdmin || isExecutiveDirector;

  return (
    <div>
      <div className="flex justify-between items-center my-6 flex-wrap gap-4">
        <PageTitle title={t("manage_transactions")} />

        <div className="flex items-center gap-4 w-full">
          <div className="flex justify-between items-center my-6 flex-wrap gap-4">
            <div className="flex items-center gap-4 w-full flex-wrap">
              <div className="flex gap-2 w-full max-w-4xl">
                <select
                  value={searchKey}
                  onChange={(e) => setSearchKey(e.target.value)}
                  className="select select-bordered w-40 text-center bg-[var(--secondary-bg-color)] text-[var(--main-text-color)]"
                >
                  <option value="phone">{t("phone")}</option>
                  <option value="transaction_id">{t("transaction_id")}</option>
                  <option value="name">{t("name")}</option>
                </select>
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder={t("search")}
                  className="input input-bordered w-full max-w-xs bg-[var(--secondary-bg-color)] text-[var(--main-text-color)]"
                />
              </div>

              <DropDownMenu
                menuTitle={t("filter_by_status")}
                MenuIcon={<FaFilter />}
                className="px-4 py-2 rounded-md"
                selectedValue={selectedStatus ? t(selectedStatus.name) : null} // Pass the selected value
              >
                <li
                  onClick={() => {
                    setSelectedStatus("");
                  }}
                  className={`cursor-pointer p-2 hover:bg-[var(--bg-hover)] ${selectedRole === "" ? "bg-[var(--bg-hover)]" : ""}`}
                >
                  {t("all")}
                </li>
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
                      className={`cursor-pointer p-2 hover:bg-[var(--bg-hover)] ${selectedRole === "" ? "bg-[var(--bg-hover)]" : ""}`}
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
                        className={`cursor-pointer p-2 hover:bg-[var(--bg-hover)] ${selectedRole === role.id ? "bg-[var(--bg-hover)]" : ""}`}
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
          </div>
        </div>
      </div>

      <TransactionList
        status={selectedStatus}
        userFilter={{ roleKey: selectedRole, userId: selectedUserId }}
        searchKey={searchKey}
        searchValue={searchValue}
        debouncedSearchValue={debouncedSearchValue}
      />
    </div>
  );
}
