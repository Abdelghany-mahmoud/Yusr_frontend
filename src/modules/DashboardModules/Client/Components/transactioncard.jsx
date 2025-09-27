import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { RejectGlobal } from "../../../../components/RejectGlobal/RejectGlobal";
import SendFinancingPlan from "./MainCaseHandler/SendFinancingPlan";
import { useHasPermission } from "../../../../hooks/useHasPermission";
import { useLocation } from "react-router-dom";
import { RestoreFromArchive } from "../../../../components/RestoreFromArchive/RestoreFromArchive";

export const TransactionCard = ({ transaction, index, id, page, refetch }) => {
  const { pathname } = useLocation();
  const { t } = useTranslation("layout");
  const createViewFinancialEvaluation = useHasPermission("create-financial-evaluations");
  const updateViewFinancialEvaluation = useHasPermission("update-financial-evaluations");

  return (
    <tr
      key={transaction.id}
      className="text-center transition-all hover:bg-[var(--secondary-bg-color)] duration-300 border-b last:border-0 font-semibold select-none"
    >
      <td className="p-3 max-w-2">{index + 1}</td>
      <td className="p-3">#{transaction.transaction_code}</td>
      <td className="p-3">{t(transaction.status)}</td>
      <td className="p-3">{new Date(transaction.created_at).toLocaleString()}</td>
      <td className="p-3">{transaction.frontline_liaison_officer_id || "-"}</td>
      <td className="p-3">{transaction.main_case_handler_id || "-"}</td>
      <td className="p-3">{transaction.financial_officer_id || "-"}</td>
      <td className="p-3">{transaction.executive_director_id || "-"}</td>
      <td className="p-3">{transaction.legal_supervisor_id || "-"}</td>
      <td className="p-3">{transaction.quality_assurance_officer_id || "-"}</td>
      <td className="p-3">{transaction.bank_liaison_officer_id || "-"}</td>

      <td className="flex gap-2 items-center p-3 mt-2">
        {pathname == "/archive/transactions" ? (
          <RestoreFromArchive
            endpoint={"transactions/restoreArchive"}
            queryKey={["archive-transactions", "transactions"]}
            text={transaction?.transaction_code}
            tooltipText={"restore_transaction"}
            restoreTitle={"restore_transaction"}
            id={transaction?.id}
          />
        ) : (
          <>
            {(createViewFinancialEvaluation ||
              updateViewFinancialEvaluation) && (
                <SendFinancingPlan transaction={transaction} />
              )}
            {transaction.status !== "rejected" && (
              <>
                <RejectGlobal
                  endpoint={`transactions/${transaction.id}/update-status`}
                  queryKey={["transactions", id, page]}
                  text={`Transaction #${transaction.transaction_code}`}
                  tooltipText="reject_transaction"
                  rejectTitle={t("reject_transaction")}
                  id={transaction.id}
                  onSuccess={refetch}
                />
              </>
            )}
          </>
        )}
      </td>
    </tr>
  );
};

TransactionCard.propTypes = {
  transaction: PropTypes.object,
  index: PropTypes.number,
  id: PropTypes.number,
  page: PropTypes.number,
  refetch: PropTypes.func,
};
