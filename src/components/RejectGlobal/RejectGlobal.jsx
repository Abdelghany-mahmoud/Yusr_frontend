import { Button, Modal, Spinner } from "../index";
import { PropTypes } from "prop-types";
import { useMutate } from "../../hooks/useMatute";
import { toast } from "react-toastify";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FcCancel } from "react-icons/fc";

export const RejectGlobal = ({
  endpoint,
  text,
  tooltipText,
  rejectTitle,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");
  const { t } = useTranslation("layout");

  const { mutate, isPending } = useMutate({
    method: "POST",
    endpoint: `${endpoint}`,
  });

  const rejectHandler = () => {
    if (!reason.trim()) {
      toast.error(
        t("rejection_reason_required") || "Rejection reason is required."
      );
      return;
    }

    mutate(
      { message: reason, status: "cancelled" },
      {
        onSuccess: (data) => {
          toast.success(data?.message || t("rejected_successfully"));
          setIsOpen(false);
          setReason("");
        },
        onError: (error) => {
          toast.error(
            error?.response?.data?.message || t("something_went_wrong")
          );
        },
      }
    );
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        btnText={
          <div className="tooltip " data-tip={t(tooltipText)}>
            <FcCancel />
          </div>
        }
        btnClassName={
          "btn text-2xl btn-circle hover:scale-[1.07] btn-sm flex items-center justify-center"
        }
        classNameModalStyle={"max-w-[500px] w-full p-3"}
      >
        <p className="text-2xl font-bold mb-2">{rejectTitle}</p>
        <p className="text-lg mb-3">
          {t("Are_you_sure_you_want_to_reject")} {text}
        </p>

        <textarea
          rows={4}
          placeholder={t("rejection_reason")}
          className="textarea textarea-bordered w-full mb-3"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <div className="flex gap-2">
          <Button
            disabled={isPending}
            onClick={rejectHandler}
            text={t("reject")}
            className="px-3 font-semibold border-none bg-yellow-600 text-white hover:bg-yellow-700"
            Spinner={<Spinner />}
            loading={isPending}
          />

          <Button
            onClick={() => {
              setIsOpen(false);
              setReason("");
            }}
            className="px-3 font-semibold border-none bg-[var(--primary-color)] text-[var(--secondary-color)] hover:bg-primary-600"
            text={t("cancel")}
          />
        </div>
      </Modal>
    </>
  );
};

RejectGlobal.propTypes = {
  endpoint: PropTypes.string.isRequired, // e.g. "/clients"
  queryKey: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.any)
  ]).isRequired,
  text: PropTypes.string.isRequired, // e.g. "Transaction #123"
  tooltipText: PropTypes.string.isRequired,
  rejectTitle: PropTypes.string.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onSuccess: PropTypes.func, // since you're passing it sometimes
};

