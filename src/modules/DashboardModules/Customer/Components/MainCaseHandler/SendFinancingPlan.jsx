import { useState } from "react";
import { Modal } from "../../../../../components";
import { useTranslation } from "react-i18next";
import { FaHandHoldingUsd } from "react-icons/fa";
import { toast } from "react-toastify";
import { useMutate } from "../../../../../hooks/useMatute";
// import { useSendToWhatsapp } from "../../../../../hooks/useSendToWhatsapp";
import FinancingPlanForm from "./FinancingPlanForm";
// import { tokenAtom } from "../../../../../store/tokenAtom/tokenAtom";
// import { useRecoilValue } from "recoil";
import PropTypes from "prop-types";

function SendFinancingPlan({ transaction }) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation("layout");
  // const token = useRecoilValue(tokenAtom);
  // const userRole = token?.user?.roles || [];
  // console.log(transaction, "transaction");

  // Check if user has role "Main Case Handler"
  // const isMainCaseHandler = userRole.some(
  //   (role) => role.name === "Main Case Handler"
  // );
  // console.log(isMainCaseHandler, "isMainCaseHandler");
  // console.log(transaction?.is_evaluation_assign, "is_evaluation_assign");

  const { mutate, isPending } = useMutate({
    endpoint:
      transaction?.is_evaluation_assign === false
        ? `transactions/update/${transaction?.id}`
        : `transactions/${transaction?.id}/update-financial-evaluation`,
    method: "post",
    queryKeysToInvalidate: ["transactions"],
    onSuccess: () => setIsOpen(false),
  });

  // const { mutate: sendWhatsapp } = useSendToWhatsapp();

  const handleSubmit = async (values, { resetForm }) => {
    const statusKey = values?.status ? "status" : "current_status";

    // Remove `message` if statusKey is "current_status"
    const { ...restValues } = values;

    const updatedValues = {
      ...(statusKey === "current_status" ? restValues : values),
      financial_officer_id: values?.financialOfficer?.value,
      [statusKey]: values?.[statusKey]?.value,
    };

    // console.log(updatedValues, "updatedValues");

    mutate(updatedValues, {
      onSuccess: (data) => {
        setIsOpen(false);
        resetForm();
        toast.success(data?.message);
        // sendWhatsapp(
        //   {
        //     user_id: transaction?.client?.user?.id,
        //     message:
        //       isMainCaseHandler && !transaction?.is_evaluation_assign
        //         ? `تمت تحديد خطة التمويل الاولية لك `
        //         : `تم تعديل خطة التمويل الاولية`,
        //     client_id: transaction?.client?.id
        //   },
        //   {
        //     onSuccess: (data) => {
        //       toast.success(data?.message);
        //     },
        //     onError: (error) => {
        //       toast.error(error?.response?.data?.message);
        //     },
        //   }
        // );
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
      <FinancingPlanForm
        onSubmit={handleSubmit}
        isPending={isPending}
        transaction={transaction}
      />
    </Modal>
  );
}

SendFinancingPlan.propTypes = {
  transaction: PropTypes.shape({
    id: PropTypes.number.isRequired,
    is_evaluation_assign: PropTypes.bool,
    client: PropTypes.shape({
      id: PropTypes.number,
      user: PropTypes.shape({
        id: PropTypes.number,
      }),
    }),
    financial_evaluation: PropTypes.object, // can refine if needed
  }).isRequired,
};

export default SendFinancingPlan;
