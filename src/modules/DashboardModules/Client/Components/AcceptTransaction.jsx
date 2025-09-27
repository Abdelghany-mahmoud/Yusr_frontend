import { useState } from "react";
import PropTypes from "prop-types";
import { FaCheckCircle } from "react-icons/fa";
import { useMutate } from "../../../../hooks/useMatute";
import { Button, Modal } from "../../../../components";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { roleNameToFieldId } from "../../../../Helpers/Helpers";
import { useRecoilState } from "recoil";
import { tokenAtom } from "../../../../store/tokenAtom/tokenAtom";

function AcceptTransaction({ transaction }) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation("layout");
  const [token] = useRecoilState(tokenAtom);
  const roleNameToId = roleNameToFieldId(token?.user?.roles?.[0]?.name);

  const { mutate, isPending } = useMutate({
    endpoint: `transactions/${transaction?.id}/update-status`,
    method: "post",
    queryKeysToInvalidate: ["transactions"],
    onSuccess: () => setIsOpen(false),
  });

  const handleAccept = () => {
    mutate(
      {
        status: "completed",
        [roleNameToId]: token?.user?.id, // Use the roleNameToId to set the correct field
      },
      {
        onSuccess: (data) => {
          setIsOpen(false);
          toast.success(data?.message);
        },
        onError: (error) => {
          toast.error(error?.response?.data?.message);
        },
      }
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      btnText={
        <div
          className="tooltip tooltip-info top text-[var(--secondary-text-color)]"
          data-tip={t("accept_transaction")}
        >
          <FaCheckCircle className="text-xl" />
        </div>
      }
      btnClassName="btn text-2xl btn-circle bg-[var(--primary-color)] hover:bg-[var(--primary-color)] text-[var(--secondary-color)] hover:scale-[1.07] btn-sm flex items-center justify-center"
      title={t("accept_transaction")}
      classNameModalStyle="max-w-[650px] w-full p-3"
    >
      <div className="space-y-4">
        <p className="text-lg text-[var(--text-color)]">
          {t("are_you_sure_accept_transaction")}
        </p>
        <div className="flex justify-end gap-4 mt-6">
          <Button
            text={t("cancel")}
            onClick={() => setIsOpen(false)}
            className="bg-gray-200 text-gray-800 px-6"
          />
          <Button
            text={t("accept")}
            onClick={handleAccept}
            loading={isPending}
            className="bg-[var(--primary-color)] text-white px-6"
          />
        </div>
      </div>
    </Modal>
  );
}

AcceptTransaction.propTypes = {
  transaction: PropTypes.object,
}
export default AcceptTransaction;
