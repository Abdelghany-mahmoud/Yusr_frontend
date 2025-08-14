import { useTranslation } from "react-i18next";
import { Modal, IsEmpty } from "../../../../components";
import { useState } from "react";
import { FaEye } from "react-icons/fa";
import { handleImageURL } from "../../../../Helpers/Helpers";

const ViewReceiptsModal = ({ transaction }) => {
  const { t } = useTranslation("layout");
  const [isOpen, setIsOpen] = useState(false);

  const receipts = transaction?.payment_receipts?.[0] || {};

  // console.log(receipts, "receipts");

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      btnText={
        <div className="tooltip tooltip-info top" data-tip={t("view_receipts")}>
          <FaEye />
        </div>
      }
      btnClassName="btn text-2xl btn-circle bg-[var(--primary-color)] text-[var(--secondary-text-color)] hover:bg-[var(--primary-color)] hover:scale-[1.07] btn-sm flex items-center justify-center"
      classNameModalStyle="max-w-[650px] w-full p-3"
    >
      <div>
        <h2 className="text-center text-2xl mb-4">{t("view_receipts")}</h2>
        <p className="text-center text-[var(--secondary-text-color)] mb-6">
          {t("transaction")} #{transaction?.id} -{" "}
          {transaction?.client?.user?.name}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto p-2">
          {(receipts?.files || []).map((filePath, index) => {
            const detail = receipts?.details?.[index];
            return (
              <div key={index} className="border rounded-lg p-2">
                <a
                  href={handleImageURL(filePath)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {filePath.endsWith(".pdf") ? (
                    <div className="flex items-center justify-center h-40 bg-gray-100 text-gray-600 rounded-md mb-2">
                      {t("pdf_file")}
                    </div>
                  ) : (
                    <img
                      src={handleImageURL(filePath)}
                      alt={`Receipt File ${index + 1}`}
                      className="w-full h-40 object-cover rounded-md mb-2"
                    />
                  )}
                </a>
                <div className="text-sm text-[var(--secondary-text-color)] px-1">
                  <div>
                    <span className="font-medium">{t("note")}: </span>
                    {detail?.note || t("no_details")}
                  </div>
                  <div>
                    <span className="font-medium">{t("created_at")}: </span>
                    {detail?.added_at || "-"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};

export default ViewReceiptsModal;
