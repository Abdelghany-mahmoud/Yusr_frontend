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
import { customerTypeOptions } from "../../../constant/customerType";

function Customers() {
  const { currentPage } = useGetURLParam();
  const { t } = useTranslation("layout");

  const [searchKey, setSearchKey] = useState("national_id");
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");
  const [financingType, setFinancingType] = useState("");

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
    endpoint: `clients?${searchKey}=${debouncedSearchValue}${
      financingType ? `&financing_type=${financingType}` : ""
    }`,
    queryKey: ["customers", searchKey, debouncedSearchValue, financingType],
  });

  if (isError) {
    return <Error errorMassage={error?.response?.data?.message} />;
  }

  return (
    <div>
      <PageTitle title={t("customers")} />
      <div className="flex justify-between items-center my-6 flex-wrap gap-4">
        <div className="flex items-center gap-4 w-full">
          <div className="flex justify-between items-center my-6 flex-wrap gap-4">
            <div className="flex items-center gap-4 w-full flex-wrap">
              <div className="flex gap-2 w-full max-w-2xl">
                <select
                  value={searchKey}
                  onChange={(e) => setSearchKey(e.target.value)}
                  className="select select-bordered w-40 text-center bg-[var(--secondary-bg-color)] text-[var(--main-text-color)]"
                >
                  <option value="national_id">{t("national_id")}</option>
                  <option value="nationality">{t("nationality")}</option>
                  <option value="religion">{t("religion")}</option>
                  <option value="job">{t("job")}</option>
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
                menuTitle={t("select_type")}
                selectedValue={
                  financingType
                    ? customerTypeOptions.find(
                        (opt) => opt.id === financingType
                      )?.name
                    : t("financing_type")
                }
              >
                <li
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer hover:text-[var(--secondary-text-color)]"
                  onClick={() => setFinancingType("")}
                >
                  {t("financing_type")}
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
