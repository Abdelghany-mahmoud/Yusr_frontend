import { useEffect, useState } from "react";
import {
  DeleteGlobal,
  DropDownMenu,
  Error,
  IsEmpty,
  Loading,
  PageTitle,
  Pagination,
  Table,
} from "../../../components";
import { useGetData } from "../../../hooks/useGetData";
import { useGetURLParam } from "../../../hooks/useGetURLParam";
import { useTranslation } from "react-i18next";
import { processRoleFields } from "../../../Helpers/Helpers";
import { roleFields } from "../../../constant/customerType";
import { FaFilter } from "react-icons/fa";
import { AssignRole } from "./AssignRole";
import RegisterCustomer from "../Customer/Components/RegisterCustomer";
import UpdateEmployee from "./UpdateEmployee";
import { useHasPermission } from "../../../hooks/useHasPermission";
import { useRecoilValue } from "recoil";
import { tokenAtom } from "../../../store/tokenAtom/tokenAtom";
import SendNoteForEmployee from "./SendNoteForEmployee";
import CustomerNotes from "../Customer/Components/CustomerNotes/CustomerNotes";

function Employees() {
  const { currentPage } = useGetURLParam();
  const { t } = useTranslation("layout");
  const token = useRecoilValue(tokenAtom);
  const [searchKey, setSearchKey] = useState("phone");
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");
  const [selectedRole, setSelectedRole] = useState("Main Case Handler");
  const [selectedRoleDisplay, setSelectedRoleDisplay] =
    useState("Main Case Handler");
  const canUpdateEmployee = useHasPermission("update-users");
  const canDeleteEmployee = useHasPermission("delete-users");
  const canCreateEmployee = useHasPermission("create-users");
  const isSuperAdmin = token?.user?.roles[0]?.name == "SuperAdmin";
  const userId = token?.user?.id;
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, 1000);

    return () => clearTimeout(handler);
  }, [searchValue]);

  const tableHead = [
    "#",
    t("name"),
    t("country_code"),
    t("phone"),
    t("email"),
    t("role"),
    t("actions"),
  ];

  const { data, isLoading, isError, error } = useGetData({
    endpoint: `users?role=${selectedRoleDisplay}&${searchKey}=${debouncedSearchValue}&page=${currentPage}`,
    queryKey: [
      "employees",
      searchKey,
      debouncedSearchValue,
      selectedRoleDisplay,
    ],
  });

  if (isError) {
    return <Error errorMassage={error?.response?.data?.message} />;
  }

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row items-center justify-between  ">
        <PageTitle title={t("employees")} />
        {canCreateEmployee && <RegisterCustomer employee={true} />}
      </div>
      <div className="mt-4 flex flex-col md:flex-row items-center justify-start gap-4">
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
            }}
            className={`cursor-pointer p-2 hover:bg-[var(--bg-hover)] ${
              selectedRole === "" ? "bg-[var(--bg-hover)]" : ""
            }`}
          >
            {t("choose_role")}
          </li>
          {processRoleFields(roleFields)
            .filter((role) => role.displayLabel !== "Client")
            .map((role) => (
              <li
                key={role.id}
                onClick={() => {
                  setSelectedRole(role.id);
                  setSelectedRoleDisplay(role.displayLabel);
                }}
                className={`cursor-pointer p-2 hover:bg-[var(--bg-hover)] ${
                  selectedRole === role.id ? "bg-[var(--bg-hover)]" : ""
                }`}
              >
                {t(role.displayLabel)}
              </li>
            ))}
        </DropDownMenu>
        <div className="flex gap-2 w-full max-w-2xl">
          <select
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            className="select select-bordered w-40 text-center bg-[var(--secondary-bg-color)] text-[var(--main-text-color)]"
          >
            <option value="phone">{t("phone")}</option>
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
      </div>
      <div className="mt-3 flex">
        {selectedRoleDisplay && (
          <div className="mt-2">
            <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
              {t(selectedRoleDisplay)}
            </span>
          </div>
        )}
      </div>

      {isLoading ? (
        <Loading />
      ) : data?.data?.length === 0 ? (
        <IsEmpty text={t("employees")} />
      ) : (
        <div className="section-padding">
          <Table
            tableHead={tableHead}
            body={data?.data?.data.map((employee, index) => (
              <tr
                key={employee.id}
                className="text-center transition-all hover:bg-[var(--secondary-bg-color)] duration-300 border-b last:border-0 font-semibold select-none"
              >
                <td className="p-3 max-w-2">{index + 1}</td>
                <td className="p-3 ">{employee.name}</td>
                <td className="p-3 ">{employee.country_code}</td>
                <td className="p-3 ">{employee.phone}</td>
                <td className="p-3 ">{employee.email}</td>
                <td className="p-3 ">{t(employee.roles[0]?.name)}</td>
                <td className="flex gap-2 items-center p-3 mt-2">
                  {/* Add your action buttons here */}
                  <SendNoteForEmployee userId={employee?.id} />
                  <CustomerNotes receiverId={userId} senderId={employee?.id} />
                  {canUpdateEmployee && <UpdateEmployee userAdmin={employee} />}
                  {isSuperAdmin && <AssignRole userAdmin={employee} />}
                  {canDeleteEmployee && (
                    <DeleteGlobal
                      endpoint={`users/${employee.id}`}
                      queryKey="employees"
                      text={employee.name}
                      tooltipText="delete_employee"
                      deleteTitle={t("delete_employee_title")}
                    />
                  )}
                </td>
              </tr>
            ))}
          />
          <Pagination totalPages={data?.data?.last_page} />
        </div>
      )}
    </div>
  );
}

export default Employees;
