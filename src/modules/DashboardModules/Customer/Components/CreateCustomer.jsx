// components/CreateCustomerModal.jsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";
import { Formik } from "formik";
import * as Yup from "yup";
import { customerFormDataAtom } from "../store/customerAtom";
import { useMutate } from "../../../../hooks/useMatute";
import { Modal } from "../../../../components";
import { CustomerForm } from "./CustomerForm";

export const CreateCustomer = () => {
  const { t } = useTranslation("layout");
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useRecoilState(customerFormDataAtom);

  const { mutate, isPending } = useMutate({
    method: "POST",
    endpoint: "clients",
    queryKeysToInvalidate: ["customers"],
  });

  const handleClose = () => {
    setIsOpen(false);
    setFormData({});
  };

  const handleSubmit = (values, { setSubmitting }) => {
    mutate(values, {
      onSuccess: (response) => {
        toast.success(response?.message);
        handleClose();
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || "Error occurred");
        setSubmitting(false);
      },
    });
  };

  const initialValues = {
    user_id: "",
    address: "",
    financing_type: "",
    job: "",
    salary: "",
    work_nature: "",
    other_income_sources: "",
    nationality: "",
    religion: "",
    gender: "",
    national_id: "",
    previous_loan_name: "",
    previous_loan_value: "",
    has_previous_loan: 0,
  };

  const validationSchema = Yup.object().shape({
    // user_id: Yup.string().required(t("required")),
    address: Yup.string().required(t("required")),
    financing_type: Yup.string().required(t("required")),
    job: Yup.string().required(t("required")),
    salary: Yup.number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .required(t("required")),
    work_nature: Yup.string(),
    other_income_sources: Yup.string(),
    nationality: Yup.string().required(t("required")),
    religion: Yup.string().required(t("required")),
    gender: Yup.string().required(t("required")),
    national_id: Yup.string().required(t("required")),
    has_previous_loan: Yup.boolean(),
    previous_loan_name: Yup.string().when("has_previous_loan", {
      is: 1,
      then: (schema) => schema.required(t("required")),
    }),
    previous_loan_value: Yup.number()
      .transform((value) => (isNaN(value) ? undefined : value))
      .when("has_previous_loan", {
        is: 1,
        then: (schema) => schema.required(t("required")),
      }),
  });

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      btnText={t("create_customer")}
      btnClassName="text-base btn bg-[var(--primary-color)] hover:scale-[1.03] text-[var(--main-bg-color)] border-none"
      classNameModalStyle="max-w-[650px] w-full p-3"
    >
      <div>
        <h2 className="text-center text-2xl mb-3">{t("customer")}</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          validateOnBlur
          validateOnChange
        >
          {({ isSubmitting }) => (
            <CustomerForm
              isSubmitting={isPending || isSubmitting}
              isUpdate={false}
              submitButtonText="save"
            />
          )}
        </Formik>
      </div>
    </Modal>
  );
};
