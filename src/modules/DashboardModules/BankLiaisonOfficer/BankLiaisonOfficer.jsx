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
import NoteForSpecificClient from "../Customer/Components/NoteForSpecificClient";
import TransactionDetails from "../transactions/TransactionDetails";
import { useHasPermission } from "../../../hooks/useHasPermission";
import CustomerNotes from "../Customer/Components/CustomerNotes/CustomerNotes";

function BankLiaisonOfficer() {
  const { t } = useTranslation("layout");
  const { currentPage } = useGetURLParam();
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [activeModal, setActiveModal] = useState(null); // 'upload', 'notes', 'confirm', 'notify', 'view-receipts'
  const [token, setToken] = useRecoilState(tokenAtom);
  const userId = token?.user?.id;
  const [selected, setSelected] = useState(null);
  const canViewPaymentReceipts = useHasPermission("read-payment-receipts");
  const canCreatePaymentReceipts = useHasPermission("create-payment-receipts");
  const canCreateNote = useHasPermission("create-notes");
  const canViewNote = useHasPermission("read-notes");
  // Fetch in-progress bank transactions
  const { data, isLoading, isError, error, refetch } = useGetData({
    endpoint: `transactions?${
      token?.user?.roles[0]?.name == "Bank Liaison Officer"
        ? `bank_liaison_officer_id=${token?.user?.id}`
        : ""
    }&page=${currentPage}`,
    queryKey: ["bank-transactions", currentPage],
  });

  const tableHead = [
    "#",
    t("transaction_id"),
    t("customer_name"),
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
      <td className="p-3">#{transaction.id}</td>
      <td className="p-3">{transaction?.client?.user?.name || "-"}</td>
      <td className="p-3">{transaction?.amount || "-"}</td>
      <td className="p-3">
        {new Date(transaction.created_at).toLocaleDateString()}
      </td>
      <td className="p-3">
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          {transaction.current_status}
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
        {canCreateNote && (
          <NoteForSpecificClient
            transaction={transaction}
            customer={transaction?.client}
          />
        )}
        {canViewNote && (
          <CustomerNotes
            receiverId={userId}
            senderId={transaction?.client?.id}
            transaction={transaction}
          />
        )}
        {/* <NotifyTeamModal transaction={transaction} /> */}
      </td>
    </tr>
  );

  return (
    <div className="p-4">
      <PageTitle title={t("Bank_transactions")} />
      {isLoading ? (
        <Loading />
      ) : data?.data?.data?.length === 0 ? (
        <IsEmpty text={t("in_progress_transactions")} />
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
