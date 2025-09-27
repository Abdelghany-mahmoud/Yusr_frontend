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
import { roleFields } from "../../../constant/clientType";
import { FaFilter } from "react-icons/fa";
import { AssignRole } from "./AssignRole";
import RegisterEmployee from "./RegisterEmployee";
import UpdateEmployee from "./UpdateEmployee";
import { useHasPermission } from "../../../hooks/useHasPermission";
import { toast } from "react-toastify";
import { useAxios } from "../../../Config/axiosConfig/axiosConfig";
import { useQueryClient } from "@tanstack/react-query";

function Employees() {
  const { currentPage } = useGetURLParam();
  const { t } = useTranslation("layout");
  const [searchKey, setSearchKey] = useState("phone");
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedRoleDisplay, setSelectedRoleDisplay] = useState("");
  const canUpdateEmployee = useHasPermission("update-employees");
  const canDeleteEmployee = useHasPermission("delete-employees");
  const canCreateEmployee = useHasPermission("create-employees");
  const axiosInstance = useAxios();
  const queryClient = useQueryClient();
  const [togglingId, setTogglingId] = useState(null);

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
    t('receive_requests'),
    t("role"),
    t("actions"),
  ];

  const handleToggleStatus = async (id) => {
    setTogglingId(id);
    try {
      await axiosInstance.post(`/employees/${id}/receive-requests`);
      toast.success(t("status_updated_successfully"));
      await queryClient.invalidateQueries({
        queryKey: ["employees"],
        refetchType: "active",
      });
    } catch (err) {
      toast.error(err?.response?.data?.message || t("error"));
    } finally {
      setTogglingId(null);
    }
  };

  const { data, isLoading, isError, error } = useGetData({
    endpoint: `employees?role=${selectedRoleDisplay}&${searchKey}=${debouncedSearchValue}&page=${currentPage}`,
    queryKey: [
      "employees",
      searchKey,
      debouncedSearchValue,
      selectedRoleDisplay,
      currentPage
    ],
  });

  const employees = data?.data?.data || [];
  const pagination = data?.data?.meta;

  if (isError) {
    return <Error errorMassage={error?.response?.data?.message} />;
  }

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row items-center justify-between  ">
        <PageTitle title={t("employees")} />
        {canCreateEmployee && <RegisterEmployee />}
      </div>
      <div className="mt-4 flex flex-col md:flex-row items-center justify-start gap-4">
        <DropDownMenu
          menuTitle={t("filter_by_role")}
          MenuIcon={<FaFilter />}
          className="px-4 py-2 rounded-md"
          selectedValue={t(
            selectedRole
              ? roleFields.find((role) => role.id === selectedRole)?.label
              : null
          )}
        >
          <li
            onClick={() => {
              setSelectedRole("");
              setSelectedRoleDisplay("");
            }}
            className={`cursor-pointer p-2 hover:bg-[var(--bg-hover)] ${selectedRole === "" ? "bg-[var(--bg-hover)]" : ""}`}
          >
            {t("all")}
          </li>
          {roleFields.filter((role) => role.label !== "client")
            .map((role) => (
              <li
                key={role.id}
                onClick={() => {
                  setSelectedRole(role.id);
                  setSelectedRoleDisplay(role.label);
                }}
                className={`cursor-pointer p-2 hover:bg-[var(--bg-hover)] ${selectedRole === role.id ? "bg-[var(--bg-hover)]" : ""}`}
              >
                {t(role.label)}
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
      ) : employees.length === 0 ? (
        <IsEmpty text={t("employees")} />
      ) : (
        <div className="section-padding">
          <Table
            tableHead={tableHead}
            body={employees.map((employee, index) => (
              <tr
                key={employee.id}
                className="text-center transition-all hover:bg-[var(--secondary-bg-color)] duration-300 border-b last:border-0 font-semibold select-none"
              >
                <td className="p-3 max-w-2">{(pagination?.from || 0) + index}</td>
                <td className="p-3 ">{employee.name}</td>
                <td className="p-3 ">{employee.country_code}</td>
                <td className="p-3 ">{employee.phone}</td>
                <td className="p-3 ">{employee.email}</td>
                <td
                  onClick={() => handleToggleStatus(employee.id)}
                  className="cursor-pointer"
                  title={t("click_to_toggle_status")}
                >
                  {togglingId === employee.id ? (
                    <Loading size="w-11 h-11" height="100%" />
                  ) : employee.active ? (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                      {t("yes")}
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full">
                      {t("no")}
                    </span>
                  )}
                </td>
                <td className="p-3">
                  {employee.roles.map((role) => t(role)).join(' | ')}
                </td>
                <td className="flex gap-2 items-center p-3 mt-2">
                  {canUpdateEmployee && <UpdateEmployee employee={employee} />}
                  {canUpdateEmployee && <AssignRole userAdmin={employee} />}
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
          <Pagination
            totalPages={pagination?.last_page || 1}
            currentPage={pagination?.current_page || 1}
          />
        </div>
      )}
    </div>
  );
}

export default Employees;
