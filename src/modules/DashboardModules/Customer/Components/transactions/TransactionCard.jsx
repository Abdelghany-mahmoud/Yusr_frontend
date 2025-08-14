import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { RejectGlobal } from "../../../../../components/RejectGlobal/RejectGlobal";
import SendFinancingPlan from "../MainCaseHandler/SendFinancingPlan";
import { useHasPermission } from "../../../../../hooks/useHasPermission";

export const TransactionCard = ({ transaction, index, id, page, refetch }) => {
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
      <td className="p-3">{t(transaction?.client?.financing_type) || "-"}</td>
      <td className="p-3">{transaction?.client?.user?.name || "-"}</td>
      <td className="p-3">{transaction?.client?.national_id || "-"}</td>
      <td className="p-3">{transaction?.client?.user?.phone || "-"}</td>

      <td className="flex gap-2 items-center p-3 mt-2">
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
            {(createViewFinancialEvaluation ||
              updateViewFinancialEvaluation) && (
              <SendFinancingPlan transaction={transaction} />
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
