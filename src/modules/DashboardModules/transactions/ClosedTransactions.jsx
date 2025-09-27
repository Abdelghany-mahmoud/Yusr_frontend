import { useGetURLParam } from "../../../hooks/useGetURLParam";
import { useTranslation } from "react-i18next";
import {
  DeleteGlobal,
  Error,
  IsEmpty,
  Loading,
  PageTitle,
  Pagination,
  Table,
} from "../../../components";
import { useGetData } from "../../../hooks/useGetData";
import { useState } from "react";
import TransactionDetails from "./TransactionDetails";

function ClosedTransactions() {
  const { currentPage } = useGetURLParam();
  const { t } = useTranslation("layout");
  const [selected, setSelected] = useState(null);
  const tableHead = [
    "#",
    t("transaction_id"),
    t("status"),
    t("created_at"),
    t("financing_type"),
    t("name"),
    t("national_id"),
    t("phone"),
    t("payment_amount"),
    t("actions"),
  ];

  const { data, isLoading, isError, error } = useGetData({
    endpoint: `transactions/cancelled-by-roles?page=${currentPage}`,
    queryKey: ["closedTransactions", currentPage],
  });

  if (isError) {
    return <Error errorMassage={error?.response?.data?.message} />;
  }
  return (
    <>
      <PageTitle title={t("closed_transactions")} />

      {isLoading ? (
        <Loading />
      ) : data?.data?.length === 0 ? (
        <IsEmpty text={t("transactions")} />
      ) : (
        <div className="section-padding">
          <Table
            tableHead={tableHead}
            body={
              <>
                {data?.data?.map((transaction, index) => (
                  <tr
                    key={transaction.id}
                    className="text-center transition-all hover:bg-[var(--secondary-bg-color)] duration-300 border-b last:border-0 font-semibold select-none"
                  >
                    <td className="p-3 max-w-2">{index + 1}</td>
                    <td className="p-3">#{transaction.transaction_code}</td>
                    <td className="p-3">{t(transaction.status)}</td>
                    <td className="p-3">
                      {new Date(transaction.created_at).toLocaleString()}
                    </td>
                    <td className="p-3">
                      {t(transaction?.client?.financing_type) || "-"}
                    </td>
                    <td className="p-3">
                      {transaction?.client?.user?.name || "-"}
                    </td>
                    <td className="p-3">
                      {transaction?.client?.national_id || "-"}
                    </td>
                    <td className="p-3">
                      {transaction?.client?.user?.phone || "-"}
                    </td>
                    <td className="p-3">
                      {transaction?.financial_evaluation?.paymentAmount || "-"}
                    </td>

                    <td className="flex gap-2 items-center p-3 mt-2">
                      <>
                        <button
                          onClick={() => setSelected(transaction)}
                          className="btn btn-info btn-sm"
                        >
                          {t("details")}
                        </button>
                        <DeleteGlobal
                          endpoint={`transactions/${transaction?.id}`}
                          queryKey="closedTransactions"
                          text={transaction?.transaction_code}
                          tooltipText={t("delete_transaction")}
                          deleteTitle={t("delete_transaction")}
                        />
                      </>
                    </td>
                  </tr>
                ))}
              </>
            }
          />
          <Pagination totalPages={data?.last_page} />
        </div>
      )}
      {selected && (
        <TransactionDetails
          transaction={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}

export default ClosedTransactions;