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
import { CustomerList } from "./Components/CustomerList";
import { customerTypeOptions, roleFields } from "../../../constant/customerType";
import RegisterCustomer from "./Components/RegisterCustomer";
import { FaFilter } from "react-icons/fa";
import { processRoleFields } from "../../../Helpers/Helpers";
import { useRecoilState } from "recoil";
import { tokenAtom } from "../../../store/tokenAtom/tokenAtom";

function Customers() {
  const { currentPage } = useGetURLParam();
  const { t } = useTranslation("layout");
  const [token, setToken] = useRecoilState(tokenAtom);
  const roleNames = token?.user?.roles?.map(role => role.name) || [];
  const canViewRoles = roleNames.includes("SuperAdmin") || roleNames.includes("Executive Director");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedRoleDisplay, setSelectedRoleDisplay] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [page, setPage] = useState(1);

  const { data: usersData, isLoading: usersLoading } = useGetData({
    endpoint: `users?role=${selectedRoleDisplay}&page=${page}`,
    queryKey: ["officers", page, selectedRoleDisplay],
    enabledKey: !!selectedRoleDisplay,
  });

  const { data: statusData , isLoading: statusLoading } = useGetData({
    endpoint: `statuses?page=${page}`,
    queryKey: ["statuses", page],
  });

  const statusOptions = statusData?.data.data.map(status => ({
    label: status.name,
    value: status.id,
  })) || [];

  const [searchKey, setSearchKey] = useState("national_id");
  const [searchValue, setSearchValue] = useState("");
  const [financingType, setFinancingType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, 1000);

    return () => clearTimeout(handler);
  }, [searchValue]);

  const tableHead = [
    t("id"),
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
    ${selectedUserId ? `&user_id=${selectedUserId}` : ""}${selectedRole ? `&role=${selectedRole}` : ""}${selectedStatus ? `&status=${selectedStatus}` : ""}`,
    queryKey: ["customers", searchKey, debouncedSearchValue, financingType, selectedUserId, selectedRole , selectedStatus],
  });

  if (isError) {
    return <Error errorMassage={error?.response?.data?.message} />;
  }

  return (
    <div>
      <div className="flex justify-between items-center my-6 flex-wrap gap-4">
        <PageTitle title={t("customers")} />
        <RegisterCustomer />
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
                  <option value="transaction_id">{t("transaction_id")}</option>
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
                    ? t(customerTypeOptions.find((opt) => opt.id === financingType)?.name)
                    : null
                }
              >
                <li
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer hover:text-[var(--secondary-text-color)]"
                  onClick={() => setFinancingType("")}
                >
                  {t("all")}
                </li>
                {customerTypeOptions.map((option) => (
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
                        ? t(processRoleFields(roleFields).find((role) => role.id === selectedRole)?.displayLabel)
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

              {/* Status Dropdown */}
              <DropDownMenu
                menuTitle={t("select_status")}
                MenuIcon={<FaFilter />}
                className="px-4 py-2 rounded-md"
                selectedValue={
                  selectedStatus
                    ? t(statusOptions.find((opt) => opt.value === selectedStatus)?.label)
                    : null
                }
              >
                <li
                  className={`cursor-pointer p-2 hover:bg-[var(--bg-hover)] ${selectedStatus === "" ? "bg-[var(--bg-hover)]" : ""}`}
                  onClick={() => setSelectedStatus("")}
                >
                  {t("all")}
                </li>
                {statusOptions.map((option) => (
                  <li
                    key={option.value}
                    className={`cursor-pointer p-2 hover:bg-[var(--bg-hover)] ${selectedStatus === option.value ? "bg-[var(--bg-hover)]" : ""}`}
                    onClick={() => setSelectedStatus(option.value)}
                  >
                    {t(option.label)}
                  </li>
                ))}
              </DropDownMenu>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <Loading />
      ) : data?.data?.data?.length === 0 ? (
        <IsEmpty text={t("customers")} />
      ) : (
        <div className="section-padding">
          <Table
            tableHead={tableHead}
            body={<CustomerList customers={data?.data?.data} />}
          />
          <Pagination totalPages={data?.data?.last_page} />
        </div>
      )}
    </div>
  );
}

export default Customers;
