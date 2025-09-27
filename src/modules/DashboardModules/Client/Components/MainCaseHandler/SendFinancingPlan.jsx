import { useState } from "react";
import { Modal } from "../../../../../components";
import { useTranslation } from "react-i18next";
import { FaHandHoldingUsd } from "react-icons/fa";
import { toast } from "react-toastify";
import { useMutate } from "../../../../../hooks/useMatute";
import FinancingPlanForm from "./FinancingPlanForm";
import PropTypes from "prop-types";
import Solutions from "./Solutions";
import { Link } from "react-router-dom";
import { FaMessage } from "react-icons/fa6";

function SendFinancingPlan({ transaction }) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation("layout");
  const endpoint = transaction?.is_evaluation_assign
    ? `financial-evaluation/update/${transaction?.id}`
    : "financial-evaluation";

  const { mutate, isPending } = useMutate({
    endpoint: endpoint,
    method: "post",
    queryKeysToInvalidate: ["transactions"],
  });

  const handleSubmit = async (values, { resetForm }) => {
    const statusKey = values?.status ? "status" : "status";
    console.log(values, 'values');
    // Remove `message` if statusKey is "status"
    const { ...restValues } = values;

    const updatedValues = {
      ...(statusKey === "status" ? restValues : values),
      financial_officer_id: values?.financialOfficer?.value,
      [statusKey]: values?.[statusKey]?.value,
    };
    console.log(updatedValues, 'updatedValues');

    mutate(updatedValues, {
      onSuccess: (data) => {
        setIsOpen(false);
        resetForm();
        toast.success(data?.message);
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message);
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      btnText={
        <div
          className="tooltip tooltip-info top text-[var(--secondary-text-color)]"
          data-tip={t("send_financing_plan")}
        >
          <FaHandHoldingUsd />
        </div>
      }
      btnClassName="btn text-2xl btn-circle bg-[var(--primary-color)] hover:bg-[var(--primary-color)] text-[var(--secondary-color)] hover:scale-[1.07] btn-sm flex items-center justify-center"
      classNameModalStyle="max-w-[1200px] w-full p-6"
      title={t("send_financing_plan")}
    >
      <div className="text-lg font-semibold mb-6 text-blue-400 flex justify-between">
        <div className="flex items-center">
          <span>
            {t("client_name")}: {transaction?.client?.user?.name}
          </span>
          <span className="mr-6">
            {t("transaction_id")}: #{transaction?.transaction_code}
          </span>
        </div>
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
      </div>

      <FinancingPlanForm
        onSubmit={handleSubmit}
        isPending={isPending}
        transaction={transaction}
      />

      <Solutions
        transactionId = {transaction.id}
      />
    </Modal>
  );
}

SendFinancingPlan.propTypes = {
  transaction: PropTypes.shape({
    id: PropTypes.number.isRequired,
    transaction_code: PropTypes.string.isRequired,
    is_evaluation_assign: PropTypes.bool,
    client: PropTypes.shape({
      id: PropTypes.number,
      user: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
      }),
    }),
    financial_evaluation: PropTypes.object, // can refine if needed
  }).isRequired,
};

export default SendFinancingPlan;
