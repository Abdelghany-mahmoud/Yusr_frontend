import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetURLParam } from "../../../hooks/useGetURLParam";
import { useGetData } from "../../../hooks/useGetData";
import TransactionDetails from "./TransactionDetails";
import { Loading, Table, IsEmpty, Pagination } from "../../../components";
import { RejectGlobal } from "../../../components/RejectGlobal/RejectGlobal";
import SendFinancingPlan from "../Customer/Components/MainCaseHandler/SendFinancingPlan";
import { useLocation } from "react-router-dom";
import NoteForSpecificClient from "../Customer/Components/NoteForSpecificClient";
import AddDocs from "../Customer/Components/ClientDocs/AddDocs";
// import AutoTransaction from "../Customer/Components/AutoTransaction";
import CustomerNotes from "../Customer/Components/CustomerNotes/CustomerNotes";
import { useRecoilValue } from "recoil";
import { tokenAtom } from "../../../store/tokenAtom/tokenAtom";
import { useHasPermission } from "../../../hooks/useHasPermission";
import AddEstimation from "./AddEstimation";
import CustomerTransaction from "../Customer/Components/CustomerTransaction";
import ShowCustomer from "../Customer/Components/ShowCustomer";
import AcceptTransaction from "../Customer/Components/AcceptTransaction";
import { useSearchHandler } from "../../../hooks/useSearchHandler";
import { roleNameToFieldId } from "../../../Helpers/Helpers";
import UpdateCustomer from "../Customer/Components/UpdateCustomer";
import PropTypes from "prop-types";

export default function TransactionList({ status = "", userFilter = "", searchKey = "", debouncedSearchValue = "" }) {
  const canUpdateClients = useHasPermission("update-clients");
  const [selected, setSelected] = useState(null);
  const { t } = useTranslation("layout");
  const { currentPage } = useGetURLParam();
  const location = useLocation();
  const token = useRecoilValue(tokenAtom);
  const roleNames = token?.user?.roles?.map(role => role.name) || [];
  const isSuperAdmin = roleNames.includes("SuperAdmin") || roleNames.includes("Executive Director");
  const isQualityOfficer = roleNames.includes("Quality Assurance Officer");
  const isFrontlineLiaisonOfficer = roleNames.includes("Frontline Liaison Officer");
  const isMainCaseHandler = roleNames.includes("Main Case Handler");
  const isExecutiveDirector = roleNames.includes("Executive Director");
  const isLegalSupervisor = roleNames.includes("Legal Supervisor");

  const userId = token?.user?.id;
  const roleFilters = roleNames
    .map(roleName => {
      const key = roleNameToFieldId(roleName);
      return `${key}=${userId}`;
    })
    .join("&");

  const createViewFinancialEvaluation = useHasPermission("create-financial-evaluation");
  const updateViewFinancialEvaluation = useHasPermission("update-financial-evaluation");
  const canCreateDocuments = useHasPermission("create-documents");
  const canCreateNote = useHasPermission("create-notes");
  const canViewNote = useHasPermission("read-notes");
  const canCreateTransactions = useHasPermission("create-transactions");
  const canUdateTransactions = useHasPermission("update-transactions");
  const canCreateEstimation = useHasPermission("create-estimation-transactions");
  const canUpdateEstimation = useHasPermission("update-estimation-transactions");

  const { filterQuery } = useSearchHandler();
  const {
    data: transactionsData,
    isLoading,
    refetch,
  } = useGetData({
    endpoint: `transactions?page=${currentPage
      }&${searchKey}=${debouncedSearchValue
      }${filterQuery
      }${!isSuperAdmin ? `&${roleFilters}` : ""
      }&current_status=${status?.id || ""
      }${userFilter.roleKey && `&${userFilter.roleKey}=${userFilter.userId}` || ""
      }`,

    queryKey: [
      "transactions",
      currentPage,
      status,
      userFilter?.userId,
      userFilter.roleKey,
      debouncedSearchValue,
      filterQuery,
      roleFilters // include for cache busting if roles change
    ],
  });

  const transactions = transactionsData?.data?.data || [];
  const totalPages = transactionsData?.data?.last_page || 1;

  const tableHead = [
    "#",
    t("transaction_id"),
    t("status"),
    t("created_at"),
    !isLegalSupervisor ? t("financing_type") : null,
    !isLegalSupervisor ? t("name") : null,
    !isLegalSupervisor ? t("national_id") : null,
    !isLegalSupervisor ? t("phone") : null,
    t("payment_amount"),
    t("actions"),
  ].filter(Boolean); // removes null/false/undefined

  if (isLoading) {
    return <Loading />;
  }

  const renderTransactionRow = (transaction, index) => {
    let rowBgColor = "";

    if (transaction.current_status === "Cancelled") {
      rowBgColor = "bg-red-200";
    } else if (transaction.current_status === "Completed") {
      rowBgColor = "bg-green-200 text-[var(--secondary-text-color)]";
    }
    return (
      <tr
        key={transaction.id}
        className={`text-center transition-all hover:text-[var(--primary-bg-color)]  hover:bg-[var(--secondary-bg-color)] duration-300 border-b last:border-0 font-semibold select-none ${rowBgColor}`}
      >
        <td className="p-3 max-w-2">{index + 1}</td>
        <td className="p-3">#{transaction.id}</td>
        <td className="p-3">{t(transaction.current_status)}</td>
        <td className="p-3">
          {new Date(transaction.created_at).toLocaleString()}
        </td>
        {!isLegalSupervisor && (
          <>
            <td className="p-3">
              {t(transaction?.client?.financing_type) || "-"}
            </td>
            <td className="p-3">{transaction?.client?.user?.name || "-"}</td>
            <td className="p-3">{transaction?.client?.national_id || "-"}</td>
            <td className="p-3">{transaction?.client?.user?.phone || "-"}</td>
          </>
        )}
        <td className="p-3">
          {transaction?.financial_evaluation?.paymentAmount || "-"}
        </td>

        <td className="flex gap-2 items-center p-3 mt-2 justify-center">
          {transaction.current_status !== "rejected" && (
            <>
              <RejectGlobal
                endpoint={`transactions/update/${transaction.id}`}
                // queryKey={[
                //   "transactions",
                //   currentPage,
                //   status,
                //   userFilter?.userId,
                // ]}
                text={`Transaction #${transaction.id}`}
                tooltipText="reject_transaction"
                rejectTitle={t("reject_transaction")}
                id={transaction.id}
                onSuccess={refetch}
              />
            </>
          )}
          <ShowCustomer customer={transaction?.client} />
          {canUpdateClients && <UpdateCustomer customer={transaction?.client} />}
          {canCreateDocuments && <AddDocs customer={transaction?.client} />}
          {/* {(((canCreateTransactions || canUdateTransactions) &&
            !isFrontlineLiaisonOfficer) ||
            !isMainCaseHandler ||
            !isSuperAdmin ||
            !isExecutiveDirector ||
            !isLegalSupervisor) && (
              <AutoTransaction
                customer={transaction?.client}
                transaction={transaction}
              />
            )} */}

          {!isLegalSupervisor && !isQualityOfficer && (
            <CustomerTransaction
              customer={transaction?.client}
            />
          )}

          {(createViewFinancialEvaluation || updateViewFinancialEvaluation) && (
            <SendFinancingPlan transaction={transaction} />
          )}
          {canCreateNote && (
            <NoteForSpecificClient
              client={transaction?.client.user}
            />
          )}
          {canViewNote && (
            <CustomerNotes
              // receiverId={userId}
              // senderId={transaction?.client?.user?.id}
              // transaction={transaction}
              userId={userId}
              customer={transaction?.client?.user}
            />
          )}
          {(canUpdateEstimation || canCreateEstimation) && (
            <>
              <AddEstimation
                transactionId={transaction.id}
                queryKeyToInvalidate={[
                  "transactions",
                  transaction?.id,
                  currentPage,
                ]}
              />
              <AcceptTransaction transaction={transaction} />
            </>
          )}
          {!isLegalSupervisor && (
            <button
              onClick={() => setSelected(transaction)}
              className="btn btn-info btn-sm"
            >
              {t("details")}
            </button>
          )}

          {location?.pathname.includes("Legal-tasks") && (
            <>
              <AcceptTransaction transaction={transaction} />
            </>
          )}
        </td>
      </tr>
    );
  };

  return (
    <div className="space-y-4">
      {transactions.length === 0 ? (
        <IsEmpty text={t("no_transactions_found")} />
      ) : (
        <div className="max-h-[60vh] overflow-y-auto">
          <Table
            tableHead={tableHead}
            body={transactions.map((tx, index) =>
              renderTransactionRow(tx, index)
            )}
          />
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      )}

      {selected && (
        <TransactionDetails
          transaction={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

TransactionList.propTypes = {
  status: PropTypes,
  userFilter: PropTypes,
  searchKey: PropTypes,
  debouncedSearchValue: PropTypes,
};