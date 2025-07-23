import { useTranslation } from "react-i18next";
import { Button, InputField, Modal } from "../..";
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useMutate } from "../../../hooks/useMatute";
import { IoMdDocument } from "react-icons/io";

function CreateStatus({ isOpen, setIsOpen, selectedStatus }) {
  const { t } = useTranslation("layout");
  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t("required")),
  });

  const initialValues = {
    name: selectedStatus?.name || "",
  };

  const { mutate, isPending } = useMutate({
    method: selectedStatus ? "post" : "post",
    endpoint: selectedStatus
      ? `statuses/${selectedStatus.id}update`
      : "statuses",
    queryKeysToInvalidate: ["statuses"],
  });

  const onSubmit = (values, { resetForm }) => {
    mutate(values, {
      onSuccess: () => {
        toast.success(t("success"));
        setIsOpen(false);
        resetForm();
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || t("error"));
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title={selectedStatus ? t("update_status") : t("add_status")}
      btnText={
        <Button
          className="w-full btn bg-[var(--primary-color)] hover:scale-[1.03] hover:text-[var(--secondary-text-color)] text-[var(--main-bg-color)] border-none"
          text={t("add_status")}
        />
      }
      classNameModalStyle={"max-w-[650px] w-full p-3"}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched }) => (
          <Form className="space-y-4 w-full">
            <InputField
              label={t("name")}
              name="name"
              error={touched.name && errors.name}
            />
            <Button
              type="submit"
              loading={isPending}
              text={selectedStatus ? t("update") : t("create")}
              className="btn btn-primary"
            />
          </Form>
        )}
      </Formik>
    </Modal>
  );
}

export default CreateStatus;
