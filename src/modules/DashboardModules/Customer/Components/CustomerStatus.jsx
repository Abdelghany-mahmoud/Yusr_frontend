import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetData } from "../../../../hooks/useGetData";
import { Modal } from "../../../../components/Modal/Modal";
import { DropDownMenu } from "../../../../components/DropDownMenu/DropDownMenu";
import { ModelPagination } from "../../../../components/ModelPagination/ModelPagination";
import { useMutate } from "../../../../hooks/useMatute";
import { toast } from "react-toastify";
import { FaUserCog } from "react-icons/fa";
import { Button } from "../../../../components/Button/Button";

function CustomerStatus({ userId }) {
  const { t } = useTranslation("layout");
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const { data, isLoading } = useGetData({
    endpoint: `statuses?page=${page}`,
    queryKey: ["statuses", page],
  });

  const { mutate, isPending } = useMutate({
    method: "post",
    endpoint: `users/${userId}/update-status`,
    queryKeysToInvalidate: ["users"],
  });

  const handleStatusUpdate = () => {
    if (!selectedStatus) {
      toast.error(t("please_select_status"));
      return;
    }

    mutate(
      { status_id: selectedStatus.id },
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
      btnText={
        <div
          className="tooltip tooltip-info top text-[var(--secondary-text-color)]"
          data-tip={t("change_status")}
        >
          <FaUserCog />
        </div>
      }
      btnClassName="btn text-2xl btn-circle bg-[var(--primary-color)] hover:bg-[var(--primary-color)] text-[var(--secondary-color)] hover:scale-[1.07] btn-sm flex items-center justify-center"
      title={t("change_status")}
      classNameModalStyle="max-w-[650px] h-[50vh]  w-full p-3"
    >
      <div className="flex flex-col  h-full justify-around gap-20 items-center">
        <h2 className="text-xl font-bold">{t("select_status")}</h2>

        <DropDownMenu
          menuTitle={t("select_status")}
          selectedValue={selectedStatus?.name}
          className="w-full p-2 rounded-md"
        >
          {data?.data?.data.map((status) => (
            <li
              key={status.id}
              className="p-2 hover:bg-[var(--bg-hover)] cursor-pointer"
              onClick={() => setSelectedStatus(status)}
            >
              {status.name}
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

        {data?.data?.last_page > 1 && (
          <ModelPagination
            currentPage={page}
            totalPages={data?.data?.last_page}
            onPageChange={setPage}
          />
        )}
      </div>
    </Modal>
  );
}

export default CustomerStatus;
