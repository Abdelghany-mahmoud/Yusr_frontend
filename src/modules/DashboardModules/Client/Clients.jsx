import { useState, useEffect } from "react";
import { useGetData } from "../../../hooks/useGetData";
import { useTranslation } from "react-i18next";
import { useGetURLParam } from "../../../hooks/useGetURLParam";
import {
  DropDownMenu,
  Error,
  IsEmpty,
  Loading,
  PageTitle,
  Pagination,
  Table,
} from "../../../components";
import { ClientList } from "./Components/ClientList";
import { clientTypeOptions, roleFields } from "../../../constant/clientType";
import RegisterClient from "./Components/RegisterClient";
import { FaFilter } from "react-icons/fa";
import { useRecoilState } from "recoil";
import { tokenAtom } from "../../../store/tokenAtom/tokenAtom";

function Clients() {
  const { currentPage } = useGetURLParam();
  const { t } = useTranslation("layout");
  const [token] = useRecoilState(tokenAtom);
  const roleNames = token?.user?.roles?.map(role => role.name) || [];
  const canViewRoles = roleNames.includes("superAdmin") || roleNames.includes("executive_director");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedRoleDisplay, setSelectedRoleDisplay] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");

  const { data: employeesData, isLoading: employeesLoading } = useGetData({
    endpoint: `employees?role=${selectedRoleDisplay}&page=${currentPage}`,
    queryKey: ["officers", currentPage, selectedRoleDisplay],
    enabledKey: !!selectedRoleDisplay,
  });

  const { data: statusData } = useGetData({
    endpoint: `statuses`,
    queryKey: ["statusOptions"],
  });

  const statusOptions = statusData?.data.map(status => ({
    label: status.name,
    value: status.id,
  })) || [];

  const [searchKey, setSearchKey] = useState("phone");
  const [searchValue, setSearchValue] = useState("");
  const [financingType, setFinancingType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState({});
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, 1000);

    return () => clearTimeout(handler);
  }, [searchValue]);

  const tableHead = [
    t("id"),
    t("رقم المعاملة"),
    t("name"),
    t("created_at"),
    // t("country_code"),
    t("phone"),
    // t("email"),
    // t("address"),
    // t("gender"),
    t("type"),
    t("status"),
    // t("job"),
    // t("national_id"),
    t("actions"),
  ];

  const { data, isLoading, isError, error } = useGetData({
    endpoint: `clients?${searchKey}=${debouncedSearchValue}${financingType ? `&financing_type=${financingType}` : ""}
    ${selectedUserId ? `&user_id=${selectedUserId}` : ""}${selectedRole ? `&role=${selectedRole}` : ""}${selectedStatus.value ? `&status=${selectedStatus.value}` : ""}`,
    queryKey: ["clients", searchKey, debouncedSearchValue, financingType, selectedUserId, selectedRole, selectedStatus.value],
  });

  const clients = data?.data?.data || [];
  const pagination = data?.data?.meta;

  if (isError) {
    return <Error errorMassage={error?.response?.data?.message} />;
  }

  return (
    <div>
      <div className="flex justify-between items-center my-6 flex-wrap gap-4">
        <PageTitle title={t("clients")} />
        <RegisterClient />
        <div className="flex items-center gap-4 w-full">
          <div className="flex justify-between items-center my-6 flex-wrap gap-4">
            <div className="flex items-center gap-4 w-full flex-wrap">
              <div className="flex gap-2 w-full max-w-4xl">
                <select
                  value={searchKey}
                  onChange={(e) => setSearchKey(e.target.value)}
                  className="select select-bordered w-40 text-center bg-[var(--secondary-bg-color)] text-[var(--main-text-color)]"
                >
                  {/* <option value="national_id">{t("national_id")}</option>
                  <option value="nationality">{t("nationality")}</option>
                  <option value="religion">{t("religion")}</option> */}
                  {/* <option value="job">{t("job")}</option> */}
                  <option value="phone">{t("phone")}</option>
                  <option value="name">{t("name")}</option>
                  <option value="transaction_code">{t("transaction_code")}</option>
                </select>
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder={t("search")}
                  className="input input-bordered w-full max-w-xs bg-[var(--secondary-bg-color)] text-[var(--main-text-color)]"
                />
              </div>

              {/* Financing Type Dropdown */}
              <DropDownMenu
                menuTitle={t("select_financing_type")}
                MenuIcon={<FaFilter />}
                className="px-4 py-2 rounded-md"
                selectedValue={
                  financingType
                    ? t(clientTypeOptions.find((opt) => opt.id === financingType)?.name)
                    : null
                }
              >
                <li
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer hover:text-[var(--secondary-text-color)]"
                  onClick={() => setFinancingType("")}
                >
                  {t("all")}
                </li>
                {clientTypeOptions.map((option) => (
                  <li
                    key={option.id}
                    className="px-4 py-2 hover:bg-gray-200 cursor-pointer hover:text-[var(--secondary-text-color)]"
                    onClick={() => setFinancingType(option.id)}
                  >
                    {t(option.name)}
                  </li>
                ))}
              </DropDownMenu>

              {canViewRoles && (
                <>
                  <DropDownMenu
                    menuTitle={t("filter_by_role")}
                    MenuIcon={<FaFilter />}
                    className="px-4 py-2 rounded-md"
                    selectedValue={
                      selectedRole
                        ? t(roleFields.find((role) => role.id === selectedRole)?.label)
                        : null
                    }
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
                    {roleFields.map((role) => (
                      <li
                        key={role.id}
                        onClick={() => {
                          setSelectedRole(role.id); // ✅ خزن فقط الـ id
                          setSelectedUserId("");
                          setSelectedRoleDisplay(role.label);
                        }}
                        className={`cursor-pointer p-2 hover:bg-[var(--bg-hover)] ${selectedRole === role.id ? "bg-[var(--bg-hover)]" : ""}`}
                      >
                        {t(role.label)}
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
                          ? employeesData?.data?.data?.find(
                            (user) => user.id === selectedUserId
                          )?.name
                          : null
                      }
                    >
                      {employeesLoading ? (
                        <li className="p-2">{t("loading")}...</li>
                      ) : (
                        employeesData?.data?.data?.map((user) => (
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

              {/* Status Dropdown */}
              <DropDownMenu
                menuTitle={t("select_status")}
                MenuIcon={<FaFilter />}
                className="px-4 py-2 rounded-md"
                selectedValue={
                  selectedStatus.name
                    ? t(statusOptions.find((status) => status.value === selectedStatus.value)?.label)
                    : null
                }
              >
                <li
                  className={`cursor-pointer p-2 hover:bg-[var(--bg-hover)] ${selectedStatus === "" ? "bg-[var(--bg-hover)]" : ""}`}
                  onClick={() => setSelectedStatus("")}
                >
                  {t("all")}
                </li>
                {statusOptions.map((status) => (
                  <li
                    key={status.value}
                    className={`cursor-pointer p-2 hover:bg-[var(--bg-hover)] ${selectedStatus.value === status.value ? "bg-[var(--bg-hover)]" : ""}`}
                    onClick={() => setSelectedStatus(status)}
                  >
                    {t(status.label)}
                  </li>
                ))}
              </DropDownMenu>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <Loading />
      ) : clients.length === 0 ? (
        <IsEmpty text={t("clients")} />
      ) : (
        <div className="section-padding">
          <Table
            tableHead={tableHead}
            body={<ClientList clients={clients} pagination={pagination} />}
          />
          {/* <Pagination totalPages={data?.data?.last_page} /> */}
          <Pagination
            totalPages={pagination?.last_page || 1}
            currentPage={pagination?.current_page || 1}
          />
        </div>
      )}
    </div>
  );
}

export default Clients;
