import { useState } from "react";
import { useTranslation } from "react-i18next";
import { IoMdDocument } from "react-icons/io";
import { Modal, Button, InputField } from "../../../../../components";
import { Formik, Form } from "formik";
import { FileUploadField } from "../../../../../components/FileUploadField/FileUploadField";
import { useMutate } from "../../../../../hooks/useMatute";
import { toast } from "react-toastify";
import * as Yup from "yup";
import PropTypes from "prop-types";

function AddDocs({ customer }) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation("layout");
  const [selectedFiles, setSelectedFiles] = useState([]);

  const { mutate, isPending } = useMutate({
    method: "POST",
    endpoint: "documents",
    queryKeysToInvalidate: ["documents"],
  });

  const validationSchema = Yup.object({
    documents: Yup.array()
      .of(Yup.mixed().required())
      .min(1, "At least one document is required")
      .required("Documents are required"),
    fileNames: Yup.array()
      .of(Yup.string().required("File name is required"))
      .test(
        "match-length",
        "File names must match number of documents",
        function (value) {
          return (
            value &&
            this.parent.documents &&
            value.length === this.parent.documents.length
          );
        }
      ),
  });

  const initialValues = {
    documents: [],
    fileNames: [],
  };

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    let imageIndex = 0;
    let pdfIndex = 0;

    values.documents.forEach((file, index) => {
      if (file.type.startsWith("image/")) {
        formData.append(`images[]`, file);
        formData.append(
          `image_names[${imageIndex}]`,
          values.fileNames[index]
        );
        imageIndex++;
      } else if (file.type === "application/pdf") {
        formData.append(`pdfs[]`, file);
        formData.append(`pdf_names[${pdfIndex}]`, values.fileNames[index]);
        pdfIndex++;
      }
    });

    formData.append("client_id", customer.id);

    mutate(formData, {
      onSuccess: (response) => {
        toast.success(response?.message);
        setSelectedFiles([]);
        resetForm();
        setIsOpen(false);
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || "Error occurred");
        setSubmitting(false);
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
          data-tip={t("add_documents")}
        >
          <IoMdDocument />
        </div>
      }
      btnClassName="btn text-2xl btn-circle bg-[var(--primary-color)] hover:bg-[var(--primary-color)] text-[var(--secondary-color)] hover:scale-[1.07] btn-sm flex items-center justify-center"
      title={t("documents")}
      classNameModalStyle={"max-w-[650px] w-full p-3"}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values, isSubmitting }) => (
          <Form className="space-y-4">
            <FileUploadField
              name="documents"
              label={t("documents")}
              accept=".pdf,.jpg,.jpeg,.png"
              selectedFiles={selectedFiles}
              setSelectedFiles={(files) => {
                setSelectedFiles(files);
                setFieldValue("documents", files);
                setFieldValue(
                  "fileNames",
                  files.map((f) => "")
                );
              }}
              setFieldValue={setFieldValue}
              multiple
            />

            {selectedFiles.map((file, index) => (
              <InputField
                key={`fileName-${index}`}
                name={`fileNames.${index}`}
                label={`${file.type.startsWith("image/") ? "Image" : "PDF"} ${
                  index + 1
                } Name`}
                placeholder={`Enter name for ${file.name}`}
                type="text"
              />
            ))}

            <Button
              type="submit"
              disabled={isPending || isSubmitting}
              loading={isPending || isSubmitting}
              className="w-full btn bg-[var(--primary-color)] hover:scale-[1.03] text-[var(--main-bg-color)] border-none"
              text={t("upload")}
            />
          </Form>
        )}
      </Formik>
    </Modal>
  );
}

AddDocs.propTypes = {
  customer: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
};

export default AddDocs;
