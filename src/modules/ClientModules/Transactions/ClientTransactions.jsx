import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PageTitle, Table, Pagination } from "../../../components";
import { useGetData } from "../../../hooks/useGetData";

function ClientTransactions() {
  const { t } = useTranslation("layout");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useGetData({
    endpoint: `client/transactions?page=${page}`,
    queryKey: ["client-transactions", page],
  });

  const columns = [
    {
      header: t("transaction_id"),
      accessorKey: "id",
    },
    {
      header: t("date"),
      accessorKey: "created_at",
    },
    {
      header: t("type"),
      accessorKey: "type",
    },
    {
      header: t("status"),
      accessorKey: "status",
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded-full text-sm ${
            row.original.status === "completed"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {t(row.original.status)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageTitle title={t("transactions")} />
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table
          data={data?.data?.data || []}
          columns={columns}
          isLoading={isLoading}
        />
        {data?.data?.last_page > 1 && (
          <div className="p-4 border-t">
            <Pagination
              currentPage={page}
              totalPages={data?.data?.last_page}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ClientTransactions;
