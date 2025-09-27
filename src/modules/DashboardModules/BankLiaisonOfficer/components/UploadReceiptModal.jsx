import { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Modal, Button, FileUploadField, TextArea } from "../../../../components";
import { FaUpload } from "react-icons/fa";
import { useMutate } from "../../../../hooks/useMutate";
import { toast } from "react-toastify";

const UploadReceiptModal = ({ transaction }) => {
  const { t } = useTranslation("layout");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Upload receipt mutation
  const { mutate: uploadReceipt, isPending: isUploading } = useMutate({
    method: "POST",
    endpoint: "transactions/receipts",
    queryKeysToInvalidate: ["bank-transactions", "transaction-receipts"],
  });

  const handleUploadReceipt = (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    formData.append("transaction_id", transaction.id);

    // Append multiple files
    values.files.forEach((file) => {
      formData.append("files[]", file);
    });

    // Append details for each file
    values.details.forEach((detail) => {
      formData.append("details[]", detail || "");
    });

    uploadReceipt(formData, {
      onSuccess: (response) => {
        toast.success(response?.message || t("receipt_uploaded_successfully"));
        resetForm();
        setSelectedFiles([]);
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || t("upload_failed"));
        setSubmitting(false);
      },
    });
  };


  const uploadReceiptValidation = Yup.object({
    files: Yup.array()
      .of(Yup.mixed().required())
      .min(1, t("at_least_one_file_required"))
      .required(t("files_required")),
    details: Yup.array()
      .of(Yup.string())
      .test("match-length", t("details_must_match_files"), function (value) {
        return (
          value &&
          this.parent.files &&
          value.length === this.parent.files.length
        );
      }),
  });

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      btnText={
        <div
          className={"tooltip tooltip-info top "}
          data-tip={t("upload_receipt")}
        >
          <FaUpload />
        </div>
      }
      btnClassName={
        "btn text-2xl btn-circle bg-[var(--primary-color)] text-[var(--secondary-color)] hover:bg-[var(--primary-color)] hover:scale-[1.07] btn-sm flex items-center justify-center"
      }
      classNameModalStyle={"max-w-[650px] w-full p-3"}
    >
      <div>
        <h2 className="text-center text-2xl mb-4">{t("upload_receipt")}</h2>
        <p className="text-center text-gray-600 mb-4">
          {t("transaction")} #{transaction?.transaction_code} - {transaction?.client?.user?.name}
        </p>

        <Formik
          initialValues={{ files: [], details: [] }}
          validationSchema={uploadReceiptValidation}
          onSubmit={handleUploadReceipt}
        >
          {({ setFieldValue, isSubmitting }) => (
            <Form className="space-y-4">
              <FileUploadField
                name="files"
                label={t("payment_receipts")}
                accept=".pdf,.jpg,.jpeg,.png"
                selectedFiles={selectedFiles}
                setSelectedFiles={(files) => {
                  setSelectedFiles(files);
                  setFieldValue("files", files);
                  // Initialize details array with empty strings
                  setFieldValue(
                    "details",
                    files.map(() => "")
                  );
                }}
                setFieldValue={setFieldValue}
                multiple={true}
              />

              {/* Details for each file */}
              {selectedFiles.map((file, index) => (
                <TextArea
                  key={`detail-${index}`}
                  name={`details.${index}`}
                  label={`${t("description")} ${index + 1} (${file.name})`}
                  placeholder={t("optional_description")}
                />
              ))}

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setSelectedFiles([]);
                  }}
                  className="btn btn-secondary"
                  text={t("cancel")}
                />
                <Button
                  type="submit"
                  disabled={isUploading || isSubmitting}
                  loading={isUploading || isSubmitting}
                  className="btn btn-primary"
                  text={t("upload")}
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};

export default UploadReceiptModal;

UploadReceiptModal.propTypes = {
  transaction: PropTypes.object.isRequired,
}