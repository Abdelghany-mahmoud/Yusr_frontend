import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetData } from "../../../hooks/useGetData";
import { useGetURLParam } from "../../../hooks/useGetURLParam";
import {
  PageTitle,
  Table,
  Pagination,
  Loading,
  IsEmpty,
  Error,
} from "../../../components";
import { useRecoilState } from "recoil";
import { tokenAtom } from "../../../store/tokenAtom/tokenAtom";
import ViewReceiptsModal from "./components/ViewReceiptsModal";
import UploadReceiptModal from "./components/UploadReceiptModal";
import TransactionDetails from "../transactions/TransactionDetails";
import { useHasPermission } from "../../../hooks/useHasPermission";

function BankLiaisonOfficer() {
  const { t } = useTranslation("layout");
  const { currentPage } = useGetURLParam();
  const [token] = useRecoilState(tokenAtom);
  const [selected, setSelected] = useState(null);
  const canViewPaymentReceipts = useHasPermission("read-payment-receipts");
  const canCreatePaymentReceipts = useHasPermission("create-payment-receipts");
  const { data, isLoading, isError, error } = useGetData({
    endpoint: `transactions?${token?.user?.roles.map((role) => role.name).includes("bank_liaison_officer")
        ? `bank_liaison_officer_id=${token?.user?.id}`
        : ""
      }&page=${currentPage}`,
    queryKey: ["bank-transactions", currentPage],
  });

  const tableHead = [
    "#",
    t("transaction_id"),
    t("client_name"),
    t("amount"),
    t("date"),
    t("status"),
    t("actions"),
  ];

  if (isError) {
    return <Error errorMassage={error?.response?.data?.message} />;
  }

  const renderTransactionRow = (transaction, index) => (
    <tr
      key={transaction.id}
      className="text-center transition-all hover:bg-[var(--secondary-bg-color)] duration-300 border-b last:border-0 font-semibold select-none"
    >
      <td className="p-3 max-w-2">{index + 1}</td>
      <td className="p-3">#{transaction.transaction_code}</td>
      <td className="p-3">{transaction?.client?.user?.name || "-"}</td>
      <td className="p-3">{transaction?.amount || "-"}</td>
      <td className="p-3">
        {new Date(transaction.created_at).toLocaleDateString()}
      </td>
      <td className="p-3">
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          {transaction.status}
        </span>
      </td>
      <td className="flex gap-2 items-center justify-center p-3">
        <button
          onClick={() => setSelected(transaction)}
          className="btn btn-info btn-sm"
        >
          {t("details")}
        </button>
        {canCreatePaymentReceipts && (
          <UploadReceiptModal transaction={transaction} />
        )}
        {canViewPaymentReceipts && (
          <ViewReceiptsModal transaction={transaction} />
        )}
      </td>
    </tr>
  );

  return (
    <div className="p-4">
      <PageTitle title={t("bank_transactions")} />
      {isLoading ? (
        <Loading />
      ) : data?.data?.data?.length === 0 ? (
        <IsEmpty text={t("no_transactions_found")} />
      ) : (
        <div className="section-padding">
          <Table
            tableHead={tableHead}
            body={data?.data?.data?.map((transaction, index) =>
              renderTransactionRow(transaction, index)
            )}
          />
          <Pagination totalPages={data?.data?.last_page} />
        </div>
      )}
      {selected && (
        <TransactionDetails
          transaction={selected}
          onClose={() => setSelected(null)}
        />
      )}
      s
    </div>
  );
}

export default BankLiaisonOfficer;
