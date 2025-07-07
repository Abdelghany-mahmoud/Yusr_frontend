import { Button, IsEmpty, Loading, PageTitle, Pagination, Table } from "..";
import CreateStatus from "./Components/CreateStatus";
import { StatusCard } from "./Components/StatusCard";
import { useTranslation } from "react-i18next";
import { Error } from "../Error/Error";
import { useGetURLParam } from "../../hooks/useGetURLParam";
import { useGetData } from "../../hooks/useGetData";
import { useState } from "react";
import { useHasPermission } from "../../hooks/useHasPermission";

function Statuses() {
  const { currentPage } = useGetURLParam();
  const { t } = useTranslation("layout");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const canCreateStatus = useHasPermission("create-status");

  const { data, isLoading, isError, error } = useGetData({
    endpoint: `statuses?page=${currentPage}`,
    queryKey: ["statuses", currentPage],
  });

  if (isError) {
    return <Error errorMassage={error?.response?.data?.message} />;
  }
  const tableHead = [
    "#",
    t("name"),
    t("created_at"),
    t("updated_at"),
    t("actions"),
  ];

  return (
    <div className="p-4">
      <PageTitle title={t("statuses")} />
      <div className="flex justify-end mb-4">
        {canCreateStatus && (
          <CreateStatus
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            selectedStatus={selectedStatus}
          />
        )}
      </div>
      {isLoading ? (
        <Loading />
      ) : data?.data?.data?.length === 0 ? (
        <IsEmpty text={t("statuses")} />
      ) : (
        <div className="section-padding">
          <Table
            tableHead={tableHead}
            body={
              <>
                {data?.data?.data.map((status, index) => (
                  <StatusCard
                    key={status.id}
                    status={status}
                    index={index}
                    onEdit={(status) => {
                      setSelectedStatus(status);
                      setIsOpen(true);
                    }}
                  />
                ))}
              </>
            }
          />
          <Pagination totalPages={data?.data?.last_page} />
        </div>
      )}
    </div>
  );
}

export default Statuses;
