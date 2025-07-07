import { useTranslation } from "react-i18next";
import {
  Error,
  IsEmpty,
  Loading,
  PageTitle,
  Pagination,
  Table,
  DropDownMenu,
} from "../../../components";
import { useGetURLParam } from "../../../hooks/useGetURLParam";
import { useGetData } from "../../../hooks/useGetData";
import { CustomerList } from "./Components/CustomerList";
import RegisterCustomer from "./Components/RegisterCustomer";
import { useState } from "react";

export function CustomerRequests() {
  const { currentPage } = useGetURLParam();
  const { t } = useTranslation("layout");
  let tableHead = [
    t("id"),
    t("name"),
    t("created_at"),
    t("phone"),
    t("status"),
    t("actions"),
  ];

  const [page, setPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const { data: statuses } = useGetData({
    endpoint: `statuses?page=${page}`,
    queryKey: ["statuses", page],
  });

  const { data, isLoading, isError, error } = useGetData({
    endpoint: `users/without-client?page=${currentPage}&status_id=${
      selectedStatus?.id || ""
    }`,
    queryKey: ["customers", currentPage, selectedStatus],
  });

  if (isError) {
    return <Error errorMassage={error?.response?.data?.message} />;
  }
  return (
    <div>
      <div className="flex justify-between items-center flex-col gap-6 md:flex-row">
        <PageTitle title={t("customers_requests")} />
        <div className="flex gap-2 items-center flex-col sm:flex-row">
          {/* <SendNotificationForCustomer /> */}
          {/* <CreateCustomer /> */}
          <RegisterCustomer />
        </div>
      </div>
      {/* Status Dropdown with Pagination */}
      <div className="my-4">
        <DropDownMenu
          menuTitle={t("choose_status")}
          selectedValue={selectedStatus?.name}
        >
          {statuses?.data?.data?.map((status) => (
            <li
              key={status.id}
              className="cursor-pointer hover:bg-gray-100 p-2 hover:text-[var(--secondary-text-color)]"
              onClick={() => setSelectedStatus(status)}
            >
              {status.name}
            </li>
          ))}
          <div className="flex justify-between items-center p-2 border-t mt-2">
            <button
              disabled={!statuses?.data?.prev_page_url}
              className="text-xs px-2 py-1 rounded bg-gray-200 disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              {t("previous")}
            </button>
            <span className="text-xs">
              {t("page")} {statuses?.data?.current_page}
            </span>
            <button
              disabled={!statuses?.data?.next_page_url}
              className="text-xs px-2 py-1 rounded bg-gray-200 disabled:opacity-50"
              onClick={() => setPage((p) => p + 1)}
            >
              {t("next")}
            </button>
          </div>
        </DropDownMenu>
        {/* You can use selectedStatus?.id wherever you need */}
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {data?.data?.data?.length == 0 ? (
            <IsEmpty text={t("customers")} />
          ) : (
            <div className="section-padding" disabled={true}>
              <Table
                tableHead={tableHead}
                body={<CustomerList customers={data?.data?.data} />}
              />
              <Pagination totalPages={data?.data?.last_page} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
