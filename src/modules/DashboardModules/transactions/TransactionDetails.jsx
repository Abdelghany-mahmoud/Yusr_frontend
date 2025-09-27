import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { Modal, Loading } from "../../../components";
import { useGetData } from "../../../hooks/useGetData";
import { useHasPermission } from "../../../hooks/useHasPermission";

export default function TransactionDetails({ transaction, onClose }) {
  const { t } = useTranslation("layout");
  const canViewFinancialEvaluation = useHasPermission(
    "read-financial-evaluation"
  );

  const { data: showTransactions, isLoading } = useGetData({
    endpoint: `transactions/${transaction?.id}`,
    queryKey: ["transaction", transaction?.id],
  });

  // Extract the transaction data from the response
  const transactionData = showTransactions?.data || transaction;

  // Officer fields configuration
  const officerFields = [
    "frontline_liaison_officer",
    "main_case_handler",
    "financial_officer",
    "executive_director",
    "legal_supervisor",
    "quality_assurance_officer",
    "bank_liaison_officer",
  ].map((key) => ({
    key,
    label: t(key),
    value: transactionData.client?.[key]?.name ?? t("not_assigned"),
  }));

  // Client fields configuration
  const clientFields = [
    {
      key: "name",
      label: t("name"),
      value: transactionData.client?.user?.name,
    },
    {
      key: "email",
      label: t("email"),
      value: transactionData.client?.user?.email,
    },
    {
      key: "phone",
      label: t("phone"),
      value: `${transactionData.client?.user?.phone} ${transactionData.client?.user?.country_code}`,
    },
    {
      key: "financing_type",
      label: t("financing_type"),
      value: t(transactionData.client?.financing_type),
    },
    { key: "job", label: t("job"), value: transactionData.client?.job },
    {
      key: "salary",
      label: t("salary"),
      value: transactionData.client?.salary,
    },
    {
      key: "nationality",
      label: t("nationality"),
      value: transactionData.client?.nationality,
    },
    {
      key: "national_id",
      label: t("national_id"),
      value: transactionData.client?.national_id,
    },
  ];

  // Status badge color based on current status
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "cancelled":
      case "rejected":
        return "bg-red-100 text-red-800";
      case "completed":
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-[var(--secondary-text-color)]";
    }
  };

  if (isLoading) {
    return (
      <Modal
        isOpen={true}
        setIsOpen={() => onClose()}
        title={t("transaction_details")}
        classNameModalStyle="max-w-[800px] w-full p-6"
      >
        <Loading />
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={true}
      setIsOpen={() => onClose()}
      title={t("transaction_details")}
      classNameModalStyle="max-w-[800px] w-full p-6"
    >
      <div className="space-y-6">
        {/* Transaction Header */}
        <div className="flex justify-between items-start border-b pb-4">
          <div>
            <h2 className="text-xl font-bold">
              {t("transaction")} #{transactionData.transaction_code}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(transactionData.status)}`}>
                {t(transactionData.status)}
              </span>
              <span className="text-sm text-[var(--secondary-text-color)]">
                {new Date(transactionData.created_at).toLocaleString()}
              </span>
            </div>
          </div>
          <div>
            <span className="text-sm font-medium">
              {t("client_name")}: {transactionData.client?.user?.name}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Client Information */}
            <div className="bg-[var(--secondary-color)] text-[var(--secondary-text-color)] rounded-lg shadow-sm p-4 border">
              <h3 className="text-lg font-semibold mb-3 pb-2 border-b">
                {t("client_information")}
              </h3>
              <div className="space-y-3">
                {clientFields.map(({ key, label, value }) => (
                  <div key={key} className="grid grid-cols-3">
                    <span className="col-span-1 text-sm font-medium text-gray-500">
                      {label}:
                    </span>
                    <span className="col-span-2 text-sm">
                      {value || t("not_provided")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Assigned Officers */}
            <div className="bg-[var(--secondary-color)] text-[var(--secondary-text-color)] rounded-lg shadow-sm p-4 border">
              <h3 className="text-lg font-semibold mb-3 pb-2 border-b">
                {t("assigned_officers")}
              </h3>
              <div className="space-y-3">
                {officerFields.map(({ key, label, value }) => (
                  <div
                    key={key}
                    className="grid grid-cols-3 gap-2 justify-between"
                  >
                    <p className="col-span-2 text-sm font-medium text-gray-500 ">
                      {t(label)}:
                    </p>
                    <p className="col-span-2 text-sm">{t(value)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}

          <div className="space-y-6">
            {/* Status History */}
            <div className="bg-[var(--secondary-color)] text-[var(--secondary-text-color)] rounded-lg shadow-sm p-4 border">
              <h3 className="text-lg font-semibold mb-3 pb-2 border-b">
                {t("status_history")}
              </h3>
              <div className="space-y-3">
                {transactionData.status_history?.map((status, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex flex-col items-center mr-3">
                      <div
                        className={`w-3 h-3 rounded-full ${index === 0 ? "bg-blue-500" : "bg-gray-300"
                          }`}
                      ></div>
                      {index < transactionData.status_history.length - 1 && (
                        <div className="w-px h-6 bg-gray-300"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{status.status}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(status.changed_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-[var(--secondary-color)] text-[var(--secondary-text-color)] rounded-lg shadow-sm p-4 border">
              <h3 className="text-lg font-semibold mb-3 pb-2 border-b">
                {t("additional_information")}
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-3">
                  <span className="col-span-1 text-sm font-medium text-gray-500">
                    {t("created_at")}:
                  </span>
                  <span className="col-span-2 text-sm">
                    {new Date(transactionData.created_at).toLocaleString()}
                  </span>
                </div>
                <div className="grid grid-cols-3">
                  <span className="col-span-1 text-sm font-medium text-gray-500">
                    {t("last_updated")}:
                  </span>
                  <span className="col-span-2 text-sm">
                    {new Date(transactionData.updated_at).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            {/* Financial Evaluation */}
            {canViewFinancialEvaluation &&
              transactionData.financial_evaluation && (
                <div className="bg-[var(--secondary-color)] text-[var(--secondary-text-color)] rounded-lg shadow-sm p-4 border">
                  <h3 className="text-lg font-semibold mb-3 pb-2 border-b">
                    {t("financial_evaluation")}
                  </h3>
                  <div className="space-y-3">
                    {[
                      {
                        label: t("city"),
                        value: transactionData.financial_evaluation.city,
                      },
                      {
                        label: t("net_salary"),
                        value: transactionData.financial_evaluation.netSalary,
                      },
                      {
                        label: t("current_bank"),
                        value: transactionData.financial_evaluation.currentBank,
                      },
                      {
                        label: t("employer"),
                        value: transactionData.financial_evaluation.employer,
                      },
                      {
                        label: t("rank"),
                        value: transactionData.financial_evaluation.rank,
                      },
                      {
                        label: t("date_of_birth"),
                        value: transactionData.financial_evaluation.dateOfBirth,
                      },
                      {
                        label: t("payment_amount"),
                        value:
                          transactionData.financial_evaluation.paymentAmount,
                      },
                      {
                        label: t("interest_rate"),
                        value:
                          transactionData.financial_evaluation.interestRate,
                      },
                      {
                        label: t("interest_amount"),
                        value:
                          transactionData.financial_evaluation.interestAmount,
                      },
                      {
                        label: t("procedure_amount"),
                        value:
                          transactionData.financial_evaluation.procedureAmount,
                      },
                      {
                        label: t("trading_amount"),
                        value:
                          transactionData.financial_evaluation.tradingAmount,
                      },
                      {
                        label: t("tax"),
                        value: transactionData.financial_evaluation.tax,
                      },
                      {
                        label: t("total_profit"),
                        value: transactionData.financial_evaluation.totalProfit,
                      },
                      {
                        label: t("total_due"),
                        value: transactionData.financial_evaluation.totalDue,
                      },
                      {
                        label: t("real_estate_fund_loan"),
                        value:
                          transactionData.financial_evaluation
                            .realEstateFundLoan,
                      },
                      {
                        label: t("real_estate_loan"),
                        value:
                          transactionData.financial_evaluation.realEstateLoan,
                      },
                      {
                        label: t("personal_loan"),
                        value:
                          transactionData.financial_evaluation.personalLoan,
                      },
                      {
                        label: t("total_debt"),
                        value: transactionData.financial_evaluation.totalDebt,
                      },
                      {
                        label: t("evaluation_notes"),
                        value:
                          transactionData.financial_evaluation.evaluationNotes,
                      },
                      {
                        label: t("has_violations"),
                        value: transactionData.financial_evaluation
                          .hasViolations
                          ? t("yes")
                          : t("no"),
                      },
                      {
                        label: t("evaluation_status"),
                        value: transactionData.financial_evaluation.status,
                      },
                    ].map(({ label, value }, index) => (
                      <div key={index} className="grid grid-cols-3">
                        <span className="col-span-1 text-sm font-medium text-gray-500">
                          {label}:
                        </span>
                        <span className="col-span-2 text-sm">
                          {value || t("not_provided")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

TransactionDetails.propTypes = {
  transaction: PropTypes.shape({
    id: PropTypes.number.isRequired,
    client_id: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    status_history: PropTypes.arrayOf(
      PropTypes.shape({
        status: PropTypes.string.isRequired,
        changed_at: PropTypes.string.isRequired,
      })
    ).isRequired,
    created_at: PropTypes.string.isRequired,
    updated_at: PropTypes.string.isRequired,
    client: PropTypes.shape({
      user: PropTypes.shape({
        name: PropTypes.string,
        email: PropTypes.string,
        country_code: PropTypes.string,
        phone: PropTypes.string,
      }),
      financing_type: PropTypes.string,
      job: PropTypes.string,
      salary: PropTypes.string,
      nationality: PropTypes.string,
      national_id: PropTypes.string,
    }),
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};
