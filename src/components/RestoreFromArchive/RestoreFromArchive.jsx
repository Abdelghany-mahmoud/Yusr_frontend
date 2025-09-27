import { Button, Modal, Spinner } from "../index";
import { PropTypes } from "prop-types";
import { useMutate } from "../../hooks/useMutate";
import { toast } from "react-toastify";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { IoArrowUndoOutline } from "react-icons/io5";

export const RestoreFromArchive = ({
  endpoint,
  queryKey,
  text,
  tooltipText,
  restoreTitle,
  id,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation("layout");

  const { mutate, isPending } = useMutate({
    method: "POST",
    endpoint: `${endpoint}`,
    queryKeysToInvalidate: queryKey,
  });

  const restoreHandler = () => {
    const formData = new FormData();
    formData.append("ids[0]", id);
    mutate(formData, {
      onSuccess: (data) => {
        toast.success(data?.message);
        setIsOpen(false);
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message);
      },
    });
  };
  return (
    <>
      <Modal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        btnText={
          <div
            className={"tooltip tooltip-primary top"}
            data-tip={t(tooltipText)}
          >
            <IoArrowUndoOutline />
          </div>
        }
        btnClassName={
          "btn text-2xl btn-circle text-[var(--secondary-color)] bg-[var(--primary-color)] hover:bg-[var(--primary-color)] hover:scale-[1.07] btn-sm flex items-center justify-center"
        }
        classNameModalStyle={"max-w-[500px] w-full p-3"}
      >
        <p className="text-2xl font-bold mb-2">{t(restoreTitle)}</p>
        <p className="text-lg mb-3">
          {" "}
          {t("restore_message")} {text} ?
        </p>

        <div className="flex gap-2">
          <Button
            disabled={isPending}
            onClick={restoreHandler}
            text={t("restore")}
            className="px-3 font-semibold border-none bg-[var(--danger-color)] text-white hover:bg-red-600"
            Spinner={<Spinner />}
            loading={isPending}
          />

          <Button
            onClick={() => setIsOpen(false)}
            className="px-3 font-semibold border-none bg-[var(--primary-color)] text-[var(--secondary-color)] hover:bg-primary-600"
            text={t("cancel")}
          />
        </div>
      </Modal>
    </>
  );
};

RestoreFromArchive.propTypes = {
  endpoint: PropTypes.string,
  queryKey: PropTypes.string,
  text: PropTypes.string,
  tooltipText: PropTypes.string,
  restoreTitle: PropTypes.string,
  id: PropTypes.number,
};
