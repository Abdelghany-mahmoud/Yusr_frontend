import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "../../../components/Modal/Modal";
import { DropDownMenu } from "../../../components/DropDownMenu/DropDownMenu";
import { useMutate } from "../../../hooks/useMutate";
import { toast } from "react-toastify";
import { Button } from "../../../components/Button/Button";
import PropTypes from "prop-types";
import { useGetData } from "../../../hooks/useGetData";

function TransactionStatus({ transactionId, status }) {
  const { t } = useTranslation("layout");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const { data: statusData } = useGetData({
    endpoint: `transactions/statuses`,
    queryKey: ["transactionStatuses"],
  });

  const transactionStatuses = statusData?.data || [];

  const { mutate, isPending } = useMutate({
    method: "post",
    endpoint: `transactions/${transactionId}/update-status`,
    queryKeysToInvalidate: ["transactions"],
  });

  const handleStatusUpdate = () => {
    if (!selectedStatus) {
      toast.error(t("please_select_status"));
      return;
    }

    mutate(
      { status : selectedStatus },
      {
        onSuccess: () => {
          toast.success(t("success"));
          setIsOpen(false);
          setSelectedStatus(null);
        },
        onError: (error) => {
          toast.error(error?.response?.data?.message || t("error"));
        },
      }
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      btnText={status}
      btnClassName="btn text-[var(--secondary-color)] bg-[var(--primary-color)] mx-auto"
      title={t("change_status")}
      classNameModalStyle="max-w-[650px] h-[400px] w-full p-3"
    >
      <div className="flex flex-col h-full justify-around gap-20 items-center">
        <DropDownMenu
          menuTitle={t("select_status")}
          selectedValue={t(selectedStatus)}
          className="w-full p-2 rounded-md"
        >
          {transactionStatuses.map((status , index) => (
            <li
              key={index}
              className="p-2 hover:bg-[var(--bg-hover)] cursor-pointer"
              onClick={() => setSelectedStatus(status)}
            >
              {t(status)}
            </li>
          ))}
        </DropDownMenu>

        <div className="flex justify-end gap-2">
          <Button
            onClick={() => setIsOpen(false)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4"
            text={t("cancel")}
          />
          <Button
            onClick={handleStatusUpdate}
            loading={isPending}
            className="bg-[var(--primary-color)] text-[var(--main-bg-color)] px-4"
            text={t("save")}
          />
        </div>
      </div>
    </Modal>
  );
}

TransactionStatus.propTypes = {
  transactionId: PropTypes.number,
  status: PropTypes.string,
};

export default TransactionStatus;
