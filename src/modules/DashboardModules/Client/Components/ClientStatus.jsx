import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetData } from "../../../../hooks/useGetData";
import { Modal } from "../../../../components/Modal/Modal";
import { DropDownMenu } from "../../../../components/DropDownMenu/DropDownMenu";
import { useMutate } from "../../../../hooks/useMutate";
import { toast } from "react-toastify";
import { Button } from "../../../../components/Button/Button";
import PropTypes from "prop-types";

function ClientStatus({ clientId, clientStatus }) {
  const { t } = useTranslation("layout");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const { data: statusData } = useGetData({
    endpoint: `statuses`,
    queryKey: ["statusOptions"],
  });

  const statusOptions = statusData?.data.map(status => ({
    label: status.name,
    value: status.id,
  })) || [];

  const { mutate, isPending } = useMutate({
    method: "post",
    endpoint: `clients/${clientId}/update-status`,
    queryKeysToInvalidate: ["clients"],
  });

  const handleStatusUpdate = () => {
    if (!selectedStatus) {
      toast.error(t("please_select_status"));
      return;
    }

    mutate(
      { status_id: selectedStatus.value },
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
      btnText={clientStatus}
      btnClassName="btn text-[var(--secondary-color)] bg-[var(--primary-color)] flex items-center justify-center mx-auto"
      title={t("change_status")}
      classNameModalStyle="max-w-[650px] h-[400px] w-full p-3"
    >
      <div className="flex flex-col  h-full justify-around gap-20 items-center">
        <DropDownMenu
          menuTitle={t("select_status")}
          selectedValue={selectedStatus?.label}
          className="w-full p-2 rounded-md"
        >
          {statusOptions.map((status) => (
            <li
              key={status.value}
              className="p-2 hover:bg-[var(--bg-hover)] cursor-pointer"
              onClick={() => setSelectedStatus(status)}
            >
              {t(status.label)}
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

export default ClientStatus;

ClientStatus.propTypes = {
  clientId: PropTypes.number,
  clientStatus: PropTypes.string,
};
