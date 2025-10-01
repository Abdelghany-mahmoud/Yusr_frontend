import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetURLParam } from "../../../hooks/useGetURLParam";
import { useGetData } from "../../../hooks/useGetData";
import TransactionDetails from "./TransactionDetails";
import { Loading, Table, IsEmpty, Pagination } from "../../../components";
import { RejectGlobal } from "../../../components/RejectGlobal/RejectGlobal";
import SendFinancingPlan from "../Client/Components/MainCaseHandler/SendFinancingPlan";
import { Link, useLocation } from "react-router-dom";
import AddDocs from "../Client/Components/ClientDocs/AddDocs";
import { useRecoilValue } from "recoil";
import { tokenAtom } from "../../../store/tokenAtom/tokenAtom";
import { useHasPermission } from "../../../hooks/useHasPermission";
import AddEstimation from "./AddEstimation";
import ClientTransaction from "../Client/Components/ClientTransaction";
import ShowClient from "../Client/Components/ShowClient";
import AcceptTransaction from "../Client/Components/AcceptTransaction";
import { useSearchHandler } from "../../../hooks/useSearchHandler";
import { roleNameToFieldId } from "../../../Helpers/Helpers";
import UpdateClient from "../Client/Components/UpdateClient";
import TransactionStatus from "./TransactionStatus";
import PropTypes from "prop-types";
import { FaMessage } from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa";

export default function TransactionList({ status = "", userFilter = "", searchKey = "", debouncedSearchValue = "" }) {
  const canUpdateClients = useHasPermission("update-clients");
  const [selected, setSelected] = useState(null);
  const { t } = useTranslation("layout");
  const { currentPage } = useGetURLParam();
  const location = useLocation();
  const token = useRecoilValue(tokenAtom);
  const roleNames = token?.user?.roles?.map(role => role.name) || [];
  const isSuperAdmin = roleNames.includes("superAdmin") || roleNames.includes("executive_director");
  const isQualityOfficer = roleNames.includes("quality_assurance_officer");
  const isLegalSupervisor = roleNames.includes("legal_supervisor");

  const userId = token?.user?.id;
  const roleFilters = roleNames.map(roleName => {
    const key = roleNameToFieldId(roleName);
    return `${key}=${userId}`;
  }).join("&");

  const createViewFinancialEvaluation = useHasPermission("create-financial-evaluations");
  const updateViewFinancialEvaluation = useHasPermission("update-financial-evaluations");
  const canCreateDocuments = useHasPermission("create-documents");
  const canCreateEstimation = useHasPermission("create-estimation-transactions");
  const canUpdateEstimation = useHasPermission("update-estimation-transactions");
  const { filterQuery } = useSearchHandler();
  const { data: transactionsData, isLoading, refetch, } = useGetData({
    endpoint: `transactions?${searchKey}=${debouncedSearchValue}${filterQuery}
    ${!isSuperAdmin ? `&${roleFilters}` : ""}&status=${status || ""}
    ${userFilter.roleKey && `&${userFilter.roleKey}=${userFilter.userId}` || ""}&per_page=10&page=${currentPage}`,

    queryKey: [
      "transactions", currentPage, status, userFilter?.userId, userFilter.roleKey,
      debouncedSearchValue, filterQuery, roleFilters
    ],
  });

  const transactions = transactionsData?.data?.data || [];
  const pagination = transactionsData?.data?.meta;

  const tableHead = [
    "#",
    t("name"),
    t("transaction_code"),
    t("status"),
    t("created_at"),
    !isLegalSupervisor ? t("financing_type") : null,
    !isLegalSupervisor ? t("phone") : null,
    t("payment_amount"),
    t("actions"),
  ].filter(Boolean);

  if (isLoading) {
    return <Loading />;
  }

  const renderTransactionRow = (transaction, index) => {
    let rowBgColor = "";

    if (transaction.status === "cancelled") {
      rowBgColor = "bg-red-200";
    } else if (transaction.status === "completed") {
      rowBgColor = "bg-green-200 text-[var(--secondary-text-color)]";
    }
    return (
      <tr
        key={transaction.id}
        className={`text-center transition-all hover:text-[var(--primary-bg-color)]  hover:bg-[var(--secondary-bg-color)] duration-300 border-b last:border-0 font-semibold select-none ${rowBgColor}`}
      >
        <td className="p-3 max-w-2">{index + 1}</td>
        <td className="p-3">{transaction.client.user.name}</td>
        <td className="p-3">#{transaction.transaction_code}</td>
        <td className="p-3"><TransactionStatus transactionId={transaction.id} status={t(transaction.status)} /></td>
        <td className="p-3">
          {new Date(transaction.created_at).toLocaleString()}
        </td>
        {!isLegalSupervisor && (
          <>
            <td className="p-3">
              {t(transaction?.client?.financing_type) || "-"}
            </td>
            <td className="p-3 flex items-center gap-2">
              {transaction?.client?.user?.phone ? (
                <>
                  <span>{transaction.client.user.phone}</span>
                  <a
                    href={`https://wa.me/${transaction.client.user.country_code}${transaction.client.user.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-500 hover:text-green-600"
                  >
                    <FaWhatsapp size={20} />
                  </a>
                </>
              ) : (
                "-"
              )}
            </td>
          </>
        )}
        <td className="p-3">
          {transaction?.financial_evaluation?.paymentAmount || "-"}
        </td>

        <td className="flex gap-2 items-center p-3 mt-2 justify-center">
          {transaction.status !== "rejected" && (
            <>
              <RejectGlobal
                endpoint={`transactions/update/${transaction.id}`}
                queryKey={[
                  "transactions",
                  currentPage,
                  status,
                  userFilter?.userId,
                ]}
                text={`Transaction #${transaction.transaction_code}`}
                tooltipText="reject_transaction"
                rejectTitle={t("reject_transaction")}
                id={transaction.id}
                onSuccess={refetch}
              />
            </>
          )}
          <ShowClient client={transaction?.client} />
          {canUpdateClients && <UpdateClient client={transaction?.client} />}
          {canCreateDocuments && <AddDocs client={transaction?.client} />}
          {!isLegalSupervisor && !isQualityOfficer && (
            <ClientTransaction
              client={transaction?.client}
            />
          )}

          {(createViewFinancialEvaluation || updateViewFinancialEvaluation) && (
            <SendFinancingPlan transaction={transaction} />
          )}
          <Link to={`/dashboard/chats/${transaction?.client?.id}`}>
            <button
              type="button"
              className={"btn text-xl btn-circle bg-[var(--primary-color)] hover:bg-[var(--primary-color)] text-gray-300 hover:scale-[1.07] btn-sm flex items-center justify-center"}
            >
              <div
                className={"tooltip tooltip-info top"}
                data-tip={t("chats")}
              >
                <FaMessage />
              </div>
            </button>
          </Link>
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
          <Pagination
            totalPages={pagination?.last_page || 1}
            currentPage={pagination?.current_page || 1}
          />
        </div>
      )}

      {selected && (
        <TransactionDetails transaction={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

TransactionList.propTypes = {
  status: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object, // because you pass full status object sometimes
  ]),
  userFilter: PropTypes.shape({
    roleKey: PropTypes.string,
    userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  searchKey: PropTypes.string,
  debouncedSearchValue: PropTypes.string,
};
