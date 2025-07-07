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
  const createViewFinancialEvaluation = useHasPermission(
    "create-financial-evaluation"
  );
  const updateViewFinancialEvaluation = useHasPermission(
    "update-financial-evaluation"
  );

  return (
    <tr
      key={transaction.id}
      className="text-center transition-all hover:bg-[var(--secondary-bg-color)] duration-300 border-b last:border-0 font-semibold select-none"
    >
      <td className="p-3 max-w-2">{index + 1}</td>
      <td className="p-3">#{transaction.id}</td>
      <td className="p-3">{t(transaction.current_status)}</td>
      <td className="p-3">
        {new Date(transaction.created_at).toLocaleString()}
      </td>
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
            text={transaction?.id}
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
            {transaction.current_status !== "rejected" && (
              <>
                <RejectGlobal
                  endpoint={`transactions/update/${transaction.id}`}
                  queryKey={["transactions", id, page]}
                  text={`Transaction #${transaction.id}`}
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
  id: PropTypes.string,
  page: PropTypes.number,
  refetch: PropTypes.func,
};
