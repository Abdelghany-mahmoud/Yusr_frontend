import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  Loading,
  IsEmpty,
  ModelPagination,
} from "../../../../components";
import { MdHistory } from "react-icons/md";
import { useGetData } from "../../../../hooks/useGetData";
import PropTypes from "prop-types";

function ClientTransactions({ clientId }) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation("layout");
  const [page, setPage] = useState(1);
  const { data: transactions, isLoading } = useGetData({
    endpoint: `transactions?client_id=${clientId}&page=${page}`,
    queryKey: ["transactions", clientId, page],
    enabledKey: isOpen,
  });

  const TransactionItem = ({ transaction }) => (
    <div className="border-b border-[var(--border-color)] p-4">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold text-[var(--main-text-color)]">
            {t("transaction")} #{transaction.transaction_code}
          </h4>
          <p className="text-sm text-[var(--secondary-text-color)]">
            {t("current_status")}: {transaction.current_status}
          </p>

          {/* Status History */}
          {transaction.status_history &&
            transaction.status_history.length > 0 && (
              <div className="mt-2">
                <h5 className="font-medium text-[var(--main-text-color)]">
                  {t("status_history")}:
                </h5>
                <div className="mt-1 space-y-1">
                  {transaction.status_history.map((history, index) => (
                    <div
                      key={index}
                      className="text-sm text-[var(--secondary-text-color)]"
                    >
                      {history.status} -{" "}
                      {new Date(history.changed_at).toLocaleString()}
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Officers */}
          <div className="mt-2 space-y-1 text-sm text-[var(--secondary-text-color)]">
            {transaction.frontline_liaison_officer_id && (
              <p>
                {t("frontline_liaison_officer")}: #
                {transaction.frontline_liaison_officer_id}
              </p>
            )}
            {transaction.main_case_handler_id && (
              <p>
                {t("main_case_handler")}: #{transaction.main_case_handler_id}
              </p>
            )}
            {transaction.financial_officer_id && (
              <p>
                {t("financial_officer")}: #{transaction.financial_officer_id}
              </p>
            )}
            {transaction.executive_director_id && (
              <p>
                {t("executive_director")}: #{transaction.executive_director_id}
              </p>
            )}
            {transaction.legal_supervisor_id && (
              <p>
                {t("legal_supervisor")}: #{transaction.legal_supervisor_id}
              </p>
            )}
            {transaction.quality_assurance_officer_id && (
              <p>
                {t("quality_assurance_officer")}: #
                {transaction.quality_assurance_officer_id}
              </p>
            )}
            {transaction.bank_liaison_officer_id && (
              <p>
                {t("bank_liaison_officer")}: #
                {transaction.bank_liaison_officer_id}
              </p>
            )}
          </div>
        </div>
        <span className="text-sm text-[var(--secondary-text-color)]">
          {new Date(transaction.created_at).toLocaleString()}
        </span>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      btnText={
        <div
          className="tooltip tooltip-info top text-[var(--secondary-text-color)]"
          data-tip={t("client_transactions")}
        >
          <MdHistory />
        </div>
      }
      btnClassName="btn text-2xl btn-circle bg-[var(--secondary-color)] hover:bg-[var(--primary-color)] hover:scale-[1.07] btn-sm flex items-center justify-center border-none"
      title={t("client_transactions")}
      classNameModalStyle={"max-w-[650px] w-full p-3"}
    >
      <div className="mt-4">
        {isLoading ? (
          <Loading />
        ) : transactions?.data?.data?.length === 0 ? (
          <IsEmpty text={t("no_transactions_found")} />
        ) : (
          <div className="max-h-[60vh] overflow-y-auto">
            {transactions?.data?.data?.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center">
        <ModelPagination
          totalPages={transactions?.data?.last_page}
          currentPage={page}
          onPageChange={(page) => setPage(page)}
        />
      </div>
    </Modal>
  );
}

ClientTransactions.propTypes = {
  clientId: PropTypes.string.isRequired,
  transactions: PropTypes.array.isRequired,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  setPage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
};

export default ClientTransactions;
